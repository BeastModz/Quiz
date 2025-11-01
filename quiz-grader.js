// Quiz Grader — embeddings-first met LLM-fallback (Node.js)
// Vereist: Node 18+, `npm i openai`
// Env: export OPENAI_API_KEY="sk-..."

import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Publieke API ------------------------------------------------------------
// gradeAnswer(studentText, rubric, opts)
// - studentText: string van het antwoord
// - rubric: JSON met referenties, concepten, numbers, weights, thresholds, max_points
// - opts: { modelEmb, modelLLM, useFallback }
// Returnt: { label, score, points, breakdown, missing_concepts, decided_by }

export async function gradeAnswer(studentText, rubric, opts = {}) {
  assertKey();
  const EMB_MODEL = opts.modelEmb || "text-embedding-3-small";
  const LLM_MODEL = opts.modelLLM || "gpt-4o-mini";
  const useFallback = opts.useFallback ?? true;

  const studentNorm = normalize(studentText);

  // 1) Semantiek (cosine max t.o.v. referenties)
  const [stuEmb, refEmbs] = await Promise.all([
    embed(EMB_MODEL, studentNorm),
    Promise.all((rubric.references || []).map(t => embed(EMB_MODEL, t)))
  ]);
  const sims = refEmbs.length ? refEmbs.map(e => cosine(stuEmb, e)) : [0];
  let s_sem = Math.max(...sims);
  if (wordCount(studentNorm) < 5) s_sem = Math.min(s_sem, 0.2); // te vaag

  // 2) Concept-dekking
  const { coverage: s_con, missing, hasForbidden } = conceptCoverage(
    studentNorm,
    rubric.concepts || [],
    rubric.forbidden || []
  );

  // 3) Numbers/units (optioneel)
  const s_num = numberScore(studentNorm, rubric.numbers || []);

  // 4) Structuur (vereenvoudigd)
  const s_str = rubric.structure?.score ?? 0.5;

  // 5) Weging + straf
  const w = rubric.weights || { semantic: 0.45, concepts: 0.4, numbers: 0.1, structure: 0.05 };
  const th = rubric.thresholds || {
    correct_score: 0.85,
    partial_score: 0.70,
    min_concept_hit_required: 0.6,
    gray_zone_low: 0.68,
    gray_zone_high: 0.78,
    contradiction_penalty: 0.25
  };
  const penalty = hasForbidden ? th.contradiction_penalty : 0;

  let raw = w.semantic * s_sem + w.concepts * s_con + w.numbers * s_num + w.structure * s_str - penalty;
  const score = clamp(raw, 0, 1);

  let label = "wrong";
  if (score >= th.correct_score && s_con >= th.min_concept_hit_required) label = "correct";
  else if (score >= th.partial_score) label = "partial";

  let decided_by = "heuristic";

  // 6) Fallback LLM in grijze zone
  if (useFallback && score >= th.gray_zone_low && score <= th.gray_zone_high) {
    try {
      const arbiter = await llmArbiter(LLM_MODEL, studentText, rubric);
      if (arbiter?.grade) {
        label = arbiter.grade; // respecteer arbiter
        decided_by = "llm_fallback";
      }
    } catch (e) {
      // stil falen: heuristiek blijft leidend
    }
  }

  const maxPoints = rubric.max_points ?? 10;
  const points = Math.round(maxPoints * score);

  return {
    label,
    score: round3(score),
    points,
    breakdown: {
      semantic: round3(s_sem),
      concepts: round3(s_con),
      numbers: round3(s_num),
      structure: round3(s_str),
      penalty: round3(penalty)
    },
    missing_concepts: missing,
    decided_by
  };
}

// --- LLM-fallback ------------------------------------------------------------
async function llmArbiter(model, studentText, rubric) {
  const sys =
    "Beoordeel strikt. Gebruik ALLEEN de gegeven referenties, concepten en verboden. "+
    "Geef uitsluitend JSON: {\"grade\": \"correct|partial|wrong\", \"reason\": string}.";

  const user = [
    `Vraag: ${rubric.title || rubric.question_id || "(geen titel)"}`,
    `Referenties:`,
    ...((rubric.references || []).map((r, i) => `${i + 1}. ${r}`)),
    `Vereiste concepten:`,
    ...((rubric.concepts || []).map(c => `- ${c.id}: [${(c.synonyms || []).join(", ")}]${c.required ? " (required)" : ""}`)),
    rubric.forbidden?.length ? `Verboden: ${rubric.forbidden.join(", ")}` : "",
    `Student: ${studentText}`,
    "Taak: Bepaal grade volgens rubric. Output: alleen JSON."
  ].filter(Boolean).join("\n");

  const resp = await client.chat.completions.create({
    model,
    temperature: 0,
    max_tokens: 64,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user }
    ]
  });
  const txt = resp.choices?.[0]?.message?.content || "";
  try { return JSON.parse(safeJson(txt)); } catch { return null; }
}

// --- Embeddings --------------------------------------------------------------
const embCache = new Map();
async function embed(model, text) {
  const key = model + "\u0000" + text;
  if (embCache.has(key)) return embCache.get(key);
  const out = await client.embeddings.create({ model, input: text });
  const emb = out.data[0].embedding;
  embCache.set(key, emb);
  return emb;
}

// --- Scoring helpers ---------------------------------------------------------
function conceptCoverage(text, concepts, forbidden) {
  const tokens = new Set(text.split(" "));
  let got = 0, total = 0; const missing = [];
  for (const c of concepts) {
    const w = c.weight ?? 1;
    total += w;
    const hit = (c.synonyms || [c.id]).some(s => fuzzyHas(text, tokens, s));
    if (hit) got += w; else if (c.required) missing.push(c.id);
  }
  const coverage = total ? got / total : 1;
  const hasForbidden = (forbidden || []).some(f => text.includes(f.toLowerCase()));
  return { coverage, missing, hasForbidden };
}

function numberScore(text, spec) {
  if (!spec.length) return 1;
  const found = extractNumbers(text);
  if (!found.length) return 0;
  let scores = [];
  for (const s of spec) {
    const target = normalizeUnit(s.value, s.unit);
    let best = 0;
    for (const f of found) {
      if (s.unit && f.unit && !unitCompat(s.unit, f.unit)) continue;
      const fv = normalizeUnit(f.value, f.unit || s.unit);
      const tol = s.tolerance ?? 0.02; // 2% default
      const relErr = Math.abs(fv - target) / (Math.abs(target) + 1e-12);
      if (relErr <= tol) best = Math.max(best, 1);
      else if (relErr <= 2 * tol) best = Math.max(best, 0.5);
    }
    scores.push(best);
  }
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
}

function extractNumbers(text) {
  const re = /(-?\d+(?:[.,]\d+)?)\s*(%|k?m|s|kg|g|pa|kpa|mpa|c|°c)?/gi;
  const out = []; let m;
  while ((m = re.exec(text))) {
    out.push({ value: parseFloat(m[1].replace(",", ".")), unit: (m[2]||"").toLowerCase() });
  }
  return out;
}

function unitCompat(a, b) {
  if (!a || !b) return true;
  a = a.toLowerCase(); b = b.toLowerCase();
  if (a === b) return true;
  const temp = new Set(["c", "°c"]);
  if (temp.has(a) && temp.has(b)) return true;
  const pressure = new Set(["pa", "kpa", "mpa"]);
  if (pressure.has(a) && pressure.has(b)) return true;
  const length = new Set(["m", "km"]);
  if (length.has(a) && length.has(b)) return true;
  return false;
}

function normalizeUnit(value, unit) {
  if (!unit) return value;
  unit = unit.toLowerCase();
  if (unit === "kpa") return value * 1_000;
  if (unit === "mpa") return value * 1_000_000;
  if (unit === "km") return value * 1_000;
  if (unit === "%") return value / 100;
  // °C, m, s, kg, g, Pa → geen conversie
  return value;
}

// --- Utils -------------------------------------------------------------------
function normalize(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s.%/°-]/gu, " ")
    .replace(/\s+/g, " ").trim();
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

function wordCount(s) { return s ? s.split(/\s+/).length : 0; }
function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
function round3(x) { return Math.round(x * 1000) / 1000; }

function fuzzyHas(text, tokenSet, phrase) {
  const p = phrase.toLowerCase();
  if (text.includes(p)) return true;
  if (!p.includes(" ")) {
    for (const t of tokenSet) if (lev1(t, p)) return true;
  }
  return false;
}

function lev1(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, ed = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    ed++; if (ed > 1) return false;
    if (a.length > b.length) i++; else if (a.length < b.length) j++; else { i++; j++; }
  }
  ed += (a.length - i) + (b.length - j);
  return ed <= 1;
}

function safeJson(s) {
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start >= 0 && end > start) return s.slice(start, end + 1);
  return s;
}

function assertKey() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY ontbreekt in env");
}

// --- CLI (single rubric or rubric set) ----------------------------------------
// Usage:
// 1) Single rubric file:
//    node quiz-grader.js rubric.json "student answer"
// 2) Rubric set file (contains { questions: [...] }):
//    node quiz-grader.js all_rubrics.en.json --qid 1a "student answer"
if (import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import("fs");
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node quiz-grader.js <rubric_or_set.json> [--qid <id>] \"student answer\"");
    process.exit(1);
  }

  const rubricPath = args[0];
  const qidFlagIdx = args.indexOf("--qid");
  let qid = null;
  let studentText = null;

  if (qidFlagIdx !== -1) {
    if (args.length < qidFlagIdx + 2) {
      console.error("Missing value for --qid");
      process.exit(1);
    }
    qid = args[qidFlagIdx + 1];
    studentText = args.slice(qidFlagIdx + 2).join(" ");
  } else {
    studentText = args.slice(1).join(" ");
  }

  if (!studentText) {
    console.error("Provide a student answer at the end (quoted).");
    process.exit(1);
  }

  let jsonStr;
  try {
    jsonStr = fs.readFileSync(rubricPath, "utf8");
  } catch (e) {
    console.error("Cannot read rubric file:", rubricPath);
    process.exit(1);
  }

  let obj;
  try {
    obj = JSON.parse(jsonStr);
  } catch (e) {
    console.error("Invalid JSON in rubric file.");
    process.exit(1);
  }

  let rubric;
  if (obj && Array.isArray(obj.questions)) {
    if (!qid) {
      console.error("Rubric set detected. Provide --qid <question_id>.");
      process.exit(1);
    }
    rubric = obj.questions.find(q => q.question_id === qid);
    if (!rubric) {
      console.error(`Question id not found in set: ${qid}`);
      process.exit(1);
    }
  } else {
    rubric = obj; // single rubric
  }

  gradeAnswer(studentText, rubric).then(r => {
    console.log(JSON.stringify(r, null, 2));
  }).catch(e => {
    console.error(e?.response?.data || e.message);
    process.exit(2);
  });
}
