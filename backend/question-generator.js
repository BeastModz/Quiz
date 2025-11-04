/**
 * AI-Assisted Question Generator
 * Generates randomized, exam-style problems per strict specification
 */

import OpenAI from 'openai';

const SYSTEM_PROMPT = `You generate exam-style STEM practice questions with one unknown. Output STRICT JSON only.
Follow the provided topic spec, units, ranges, and output contract exactly.
No stories. No extra keys. No markdown fences.
CRITICAL: You MUST verify all calculations are mathematically correct before responding.
For multi-part problems, Part A must feed correctly into Part B.
If values violate constraints or equations don't balance, resample internally before responding.`;

const TOPIC_SPECS = {
  continuity: {
    ranges: {
      d1: [0.010, 0.080],
      diameter_ratio: [0.5, 1.8],
      v1: [0.30, 3.00]
    },
    unknowns: ['v2', 'v1', 'd2', 'd1']
  },
  bernoulli: {
    ranges: {
      p1: [180, 320],
      v1: [0.6, 4.0],
      v2: [0.5, 6.5],
      z_diff: [-2, 2]
    },
    unknowns: ['p2', 'v2', 'v1', 'z_diff']
  },
  combined_gas_law: {
    ranges: {
      P1: [95, 200],
      V1: [1, 12],
      T1: [280, 320],
      P2: [80, 220],
      V2: [0.5, 14]
    },
    unknowns: ['P2', 'V2', 'T2', 'P1', 'V1', 'T1']
  },
  dalton: {
    ranges: {
      n_components: [3, 4],
      partial: [15, 60]
    },
    unknowns: ['component', 'Ptot']
  },
  continuity_bernoulli: {
    ranges: {
      d1: [0.020, 0.080],
      diameter_ratio: [0.5, 1.5],
      v1: [0.50, 3.00],
      p1: [180, 320],
      z_diff: [-2, 2]
    },
    unknowns: ['p2']
  },
  continuity_bernoulli_K: {
    ranges: {
      d1: [0.020, 0.080],
      diameter_ratio: [0.5, 1.5],
      v1: [0.50, 3.00],
      p1: [180, 320],
      z_diff: [-2, 2],
      K: [0.2, 0.8]
    },
    unknowns: ['p2']
  }
};

const FULL_SPEC = `# AI-Assisted Question Generator — Specification

## 0) Scope
Five topics: Continuity, Bernoulli (head form), Combined Gas Law, Dalton's Law, Continuity+Bernoulli Multi-Part.

## 1) Global Output Contract (JSON)
{
  "topic": "continuity | bernoulli | combined_gas_law | dalton | continuity_bernoulli",
  "question_html": "<p>Stem with givens…</p>",
  "answer_html": "v₂ = 2.31 m/s",
  "explain_html": "<p>Short derivation…</p>",
  "label": "v₂",
  "answer_value": 2.31,
  "answer_unit": "m/s",
  "state": { "...": "machine-readable givens and parameters" }
}

## 2.1 Continuity
Model: Q=Av, A=πd²/4
Variables: d₁,d₂ (m), v₁,v₂ (m/s)
Ranges: d₁∈[0.010,0.080], d₂/d₁∈[0.5,1.8], v₁∈[0.30,3.00]
Unknown: one of {v₂,v₁,d₂,d₁}
Constraint: A₁v₁=A₂v₂ exactly

## 2.2 Bernoulli (Head Form)
Model: p/(ρg) + v²/(2g) + z = const, ρ=1000 kg/m³, g=9.81 m/s²
Variables: p₁,p₂ (kPa), v₁,v₂ (m/s), z₁,z₂ (m)
Ranges: p₁∈[180,320], v₁∈[0.6,4.0], v₂∈[0.5,6.5], (z₁-z₂)∈[-2,2] or 0
Unknown: one of {p₂,v₂,v₁,z_diff}
Constraint: p₂∈[80,400] kPa after computation

## 2.3 Combined Gas Law
Model: P₁V₁/T₁ = P₂V₂/T₂ (T in Kelvin only)
Variables: P (kPa), V (L), T (K)
Ranges: P₁∈[95,200], V₁∈[1,12], T₁∈[280,320], P₂∈[80,220], V₂∈[0.5,14]
Unknown: one of {P₂,V₂,T₂,P₁,V₁,T₁}
Constraint: 200≤T≤500 K

## 2.4 Dalton's Law
Model: P_total = ΣPᵢ
Variables: pressures (kPa)
Ranges: n∈{3,4}, Pᵢ∈[15,60]
Unknown: one component Pₖ or total

## 2.5 Continuity + Bernoulli Multi-Part Problem
**CRITICAL: This is a TWO-STEP sequential problem where Part A feeds into Part B.**

### Problem Structure:
**Part A:** Use continuity equation to find unknown velocity v₂
**Part B:** Use v₂ from Part A in Bernoulli equation to find unknown pressure p₂

### Given Information Template:
- Pipe diameter at point 1: d₁ (m)
- Pipe diameter at point 2: d₂ (m)
- Velocity at point 1: v₁ (m/s)
- Pressure at point 1: p₁ (kPa)
- Elevation at point 1: z₁ (m) [can be set to 0 for reference]
- Elevation at point 2: z₂ (m)
- Fluid: Water (ρ = 1000 kg/m³, incompressible)

### Part A Specifications:
Model: Q₁ = Q₂ → A₁v₁ = A₂v₂ → (πd₁²/4)v₁ = (πd₂²/4)v₂
Solve for: v₂ = v₁(d₁/d₂)²
Ranges:
  - d₁ ∈ [0.020, 0.080] m (20-80 mm)
  - d₂/d₁ ∈ [0.5, 1.5] (contraction or expansion)
  - v₁ ∈ [0.50, 3.00] m/s
Result: v₂ must be calculated to 4 significant figures for use in Part B

### Part B Specifications:
Model: p₁/(ρg) + v₁²/(2g) + z₁ = p₂/(ρg) + v₂²/(2g) + z₂
Constants: ρ = 1000 kg/m³, g = 9.81 m/s²
Rearrange to solve for p₂:
  p₂ = p₁ + ρg[(v₁² - v₂²)/(2g) + (z₁ - z₂)]
  p₂ = p₁ + (ρ/2)(v₁² - v₂²) + ρg(z₁ - z₂)

Ranges:
  - p₁ ∈ [180, 320] kPa (gauge or absolute - specify)
  - z₁ - z₂ ∈ [-2, 2] m (can be 0 for horizontal pipe)
  - v₂ comes from Part A calculation

Constraint: Final p₂ ∈ [80, 400] kPa (must be physically reasonable)

### Output Format Requirements:

**question_html:** Must clearly present a TWO-PART problem structure:
\`\`\`html
<p><strong>A horizontal pipe carries water. The pipe contracts from diameter d₁ = [value] m at point 1 to d₂ = [value] m at point 2.</strong></p>
<p><strong>Given:</strong></p>
<ul>
  <li>d₁ = [value] m</li>
  <li>d₂ = [value] m</li>
  <li>v₁ = [value] m/s</li>
  <li>p₁ = [value] kPa (gauge)</li>
  <li>z₁ = [value] m</li>
  <li>z₂ = [value] m</li>
  <li>ρ = 1000 kg/m³</li>
  <li>g = 9.81 m/s²</li>
</ul>
<p><strong>Part A:</strong> Using the continuity equation, calculate the velocity v₂ at point 2.</p>
<p><strong>Part B:</strong> Using your answer from Part A and the Bernoulli equation, calculate the gauge pressure p₂ at point 2.</p>
<p><strong>Find: p₂ (kPa)</strong></p>
\`\`\`

**answer_html:** The FINAL answer for p₂ (since this is what the problem asks for):
\`\`\`
p₂ = [value] kPa
\`\`\`

**explain_html:** Must show COMPLETE step-by-step solution for BOTH parts:
\`\`\`html
<p><strong>Part A Solution: Find v₂ using Continuity Equation</strong></p>
<ol>
  <li>Calculate cross-sectional areas:
    <ul>
      <li>A₁ = πd₁²/4 = π([d1_value])²/4 = [A1_value] m²</li>
      <li>A₂ = πd₂²/4 = π([d2_value])²/4 = [A2_value] m²</li>
    </ul>
  </li>
  <li>Apply continuity: Q₁ = Q₂ → A₁v₁ = A₂v₂</li>
  <li>Solve for v₂:
    <ul>
      <li>v₂ = (A₁/A₂)v₁ = ([A1_value]/[A2_value]) × [v1_value]</li>
      <li>v₂ = (d₁/d₂)² × v₁ = ([d1_value]/[d2_value])² × [v1_value]</li>
      <li><strong>v₂ = [v2_value] m/s</strong> ✓</li>
    </ul>
  </li>
</ol>

<p><strong>Part B Solution: Find p₂ using Bernoulli Equation</strong></p>
<ol>
  <li>Write Bernoulli equation (head form):
    <ul>
      <li>p₁/(ρg) + v₁²/(2g) + z₁ = p₂/(ρg) + v₂²/(2g) + z₂</li>
    </ul>
  </li>
  <li>Calculate velocity heads:
    <ul>
      <li>v₁²/(2g) = ([v1_value])²/(2×9.81) = [v1_head] m</li>
      <li>v₂²/(2g) = ([v2_value])²/(2×9.81) = [v2_head] m</li>
    </ul>
  </li>
  <li>Calculate pressure head at point 1:
    <ul>
      <li>p₁/(ρg) = ([p1_value]×1000)/(1000×9.81) = [p1_head] m</li>
    </ul>
  </li>
  <li>Calculate total head at point 1:
    <ul>
      <li>H₁ = [p1_head] + [v1_head] + [z1_value] = [H1_total] m</li>
    </ul>
  </li>
  <li>Calculate pressure head at point 2:
    <ul>
      <li>H₁ = H₂ (conservation of energy)</li>
      <li>p₂/(ρg) = H₁ - v₂²/(2g) - z₂</li>
      <li>p₂/(ρg) = [H1_total] - [v2_head] - [z2_value] = [p2_head] m</li>
    </ul>
  </li>
  <li>Convert to pressure:
    <ul>
      <li>p₂ = (ρg) × [p2_head] = (1000 × 9.81) × [p2_head]</li>
      <li>p₂ = [p2_pa] Pa = [p2_kpa] kPa</li>
      <li><strong>p₂ = [p2_final] kPa</strong> ✓</li>
    </ul>
  </li>
</ol>

<p><strong>Verification:</strong></p>
<ul>
  <li>Check: v₂ = v₁(d₁/d₂)² = [v1_value] × ([d1_value]/[d2_value])² = [v2_value] m/s ✓</li>
  <li>Check: p₂ ∈ [80, 400] kPa → [p2_final] kPa ✓</li>
</ul>
\`\`\`

**label:** "p₂"

**answer_value:** [numeric value of p₂ in kPa, to 3-4 significant figures]

**answer_unit:** "kPa"

**state object:** Must contain ALL intermediate values for validation:
\`\`\`json
{
  "d1": [value in m],
  "d2": [value in m],
  "v1": [value in m/s],
  "p1": [value in kPa],
  "z1": [value in m],
  "z2": [value in m],
  "rho": 1000,
  "g": 9.81,
  "A1": [calculated area in m²],
  "A2": [calculated area in m²],
  "v2": [calculated from continuity, in m/s, 4+ sig figs],
  "v1_head": [v₁²/(2g) in m],
  "v2_head": [v₂²/(2g) in m],
  "p1_head": [p₁/(ρg) in m],
  "p2_head": [p₂/(ρg) in m],
  "H1": [total head at point 1 in m],
  "p2_pa": [pressure in Pa],
  "p2_kpa": [pressure in kPa - FINAL ANSWER]
}
\`\`\`

### Critical Validation Rules:
1. **Continuity must be satisfied:** A₁v₁ = A₂v₂ within 1e-6
2. **Bernoulli must be satisfied:** H₁ = H₂ within 1e-4 (accounting for head losses negligible assumption)
3. **Final pressure realistic:** 80 ≤ p₂ ≤ 400 kPa
4. **Use exactly p/(ρg) NOT p/ρ** in Bernoulli equation
5. **Pressure units:** Convert kPa to Pa for calculations: p[Pa] = p[kPa] × 1000
6. **All intermediate calculations:** Keep 4+ significant figures, round only final answer to 3 sig figs

### MANDATORY SELF-CHECK BEFORE RESPONDING:
Before outputting JSON, YOU MUST verify:
✓ Step 1: Calculate A₁ = π(d₁)²/4 correctly
✓ Step 2: Calculate A₂ = π(d₂)²/4 correctly
✓ Step 3: Verify A₁v₁ = A₂v₂ (difference must be < 1e-6)
✓ Step 4: Calculate v₁²/(2g) and v₂²/(2g) correctly
✓ Step 5: Calculate p₁/(ρg) correctly (remember: kPa × 1000 / (1000 × 9.81))
✓ Step 6: Verify H₁ = H₂ where H = p/(ρg) + v²/(2g) + z
✓ Step 7: Verify 80 ≤ p₂ ≤ 400 kPa
If ANY check fails, regenerate values and recompute until all checks pass.

### Common Errors to AVOID:
❌ Using p/ρ instead of p/(ρg) in Bernoulli
❌ Forgetting to convert kPa to Pa before calculation
❌ Using v₂ before calculating it in Part A
❌ Mixing gauge and absolute pressure
❌ Not showing the intermediate v₂ calculation
❌ Rounding v₂ too early (must keep 4+ sig figs for Part B)

### Example Problem Structure:
Given: d₁=0.050 m, d₂=0.030 m, v₁=1.20 m/s, p₁=250 kPa, z₁=0 m, z₂=0 m

Part A: Find v₂
- A₁ = π(0.050)²/4 = 0.001963 m²
- A₂ = π(0.030)²/4 = 0.0007069 m²
- v₂ = v₁(A₁/A₂) = 1.20 × (0.001963/0.0007069) = 3.333 m/s ✓

Part B: Find p₂
- v₁²/(2g) = (1.20)²/(2×9.81) = 0.07339 m
- v₂²/(2g) = (3.333)²/(2×9.81) = 0.5669 m
- p₁/(ρg) = (250×1000)/(1000×9.81) = 25.48 m
- H₁ = 25.48 + 0.07339 + 0 = 25.55 m
- p₂/(ρg) = 25.55 - 0.5669 - 0 = 24.99 m
- p₂ = 24.99 × 1000 × 9.81 = 245,100 Pa = 245.1 kPa ✓

All givens to 3 s.f., answers to 3 s.f. for display.
Use subscript digits (v₂, P₁). No stories, exam voice only.
Validate: recompute from givens, ensure identity holds within 1e-6.`;

class QuestionGenerator {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Generate a question for the specified topic
   * @param {string} topic - One of: continuity, bernoulli, combined_gas_law, dalton, continuity_bernoulli
   * @param {object} options - { unknown: 'v2', seed: 42 } (optional)
   * @returns {Promise<object>} - Question JSON per contract
   */
  async generate(topic, options = {}) {
    if (!TOPIC_SPECS[topic]) {
      throw new Error(`Invalid topic: ${topic}. Must be one of: ${Object.keys(TOPIC_SPECS).join(', ')}`);
    }

    // For multi-part problems, generate programmatically instead of using AI
    if (topic === 'continuity_bernoulli' || topic === 'continuity_bernoulli_K') {
      return this._generateMultiPartProgrammatic({ ...options, topic });
    }

    const userPrompt = this._buildUserPrompt(topic, options);

    try {
      const modelToUse = options.model || 'gpt-4o-mini';
      
      const response = await this.openai.chat.completions.create({
        model: modelToUse,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      const question = JSON.parse(content);

      // Validate output
      this._validate(question, topic);

      return question;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`OpenAI returned invalid JSON: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Generate multiple questions
   * @param {string} topic
   * @param {number} count
   * @param {object} options
   * @returns {Promise<Array>}
   */
  async generateBatch(topic, count = 5, options = {}) {
    const questions = [];
    for (let i = 0; i < count; i++) {
      const question = await this.generate(topic, { ...options, seed: options.seed ? options.seed + i : undefined });
      questions.push(question);
    }
    return questions;
  }

  /**
   * Generate multi-part continuity+bernoulli question programmatically
   * Physics-aware sampling with proper validation
   */
  _generateMultiPartProgrammatic(options = {}) {
    const seed = options.seed || Math.random() * 10000;
    const rng = this._seededRandom(seed);
    const withLoss = options.topic === 'continuity_bernoulli_K';
    
    // Constants
    const rho = 1000; // kg/m³
    const g = 9.81; // m/s²
    const p_atm = 101325; // Pa
    const PI = Math.PI;
    
    // Teaching bands
    const v2_min = 0.5; // m/s
    const v2_max = 6.0; // m/s
    const min_v_delta = 0.2; // m/s - avoid boring cases
    
    let attempt = 0;
    const maxAttempts = 100;
    
    while (attempt++ < maxAttempts) {
      // Sample geometry and inlet velocity
      const d1 = this._randomInRange(0.020, 0.080, rng);
      const ratio = this._randomInRange(0.5, 1.5, rng); // d2/d1
      const d2 = d1 * ratio;
      const v1 = this._randomInRange(0.50, 3.00, rng);
      
      // Part A: Calculate v2 using continuity (full precision)
      const A1 = PI * Math.pow(d1, 2) / 4;
      const A2 = PI * Math.pow(d2, 2) / 4;
      const v2 = (A1 * v1) / A2;
      const Q = A1 * v1;
      
      // Check v2 in teaching band and not boring
      if (v2 < v2_min || v2 > v2_max) continue;
      if (Math.abs(v2 - v1) < min_v_delta) continue;
      
      // Sample inlet pressure (gauge)
      const p1_gauge_kpa = this._randomInRange(180, 320, rng);
      const p1_gauge_pa = p1_gauge_kpa * 1000;
      const p1_abs_pa = p1_gauge_pa + p_atm;
      
      // Sample elevation difference
      const z1 = 0; // Reference level
      let z2 = z1 + this._randomInRange(-2, 2, rng);
      
      // Round z to nearest mm to enable proper "horizontal" detection
      z2 = Math.round(z2 * 1000) / 1000;
      
      // Optional minor loss coefficient
      const K = withLoss ? this._randomInRange(0.2, 0.8, rng) : 0;
      const v_ref = ratio < 1 ? v2 : v1; // contraction uses v2, expansion uses v1
      const h_loss = withLoss ? K * Math.pow(v_ref, 2) / (2 * g) : 0;
      
      // Part B: Calculate p2 using Bernoulli (full precision)
      const v1_head = Math.pow(v1, 2) / (2 * g);
      const v2_head = Math.pow(v2, 2) / (2 * g);
      const p1_head = p1_abs_pa / (rho * g);
      
      const H1 = p1_head + v1_head + z1;
      const H2_without_loss = p1_head + v1_head + z1; // H1 = H2 when no losses
      const p2_head = H1 - v2_head - z2 - h_loss;
      const p2_abs_pa = p2_head * rho * g;
      const p2_gauge_pa = p2_abs_pa - p_atm;
      const p2_gauge_kpa = p2_gauge_pa / 1000;
      
      // Physics-aware validation
      // 1. Require positive gauge pressure (no vacuum for intro problems)
      if (p2_gauge_pa <= 0) continue;
      
      // 2. Compute max expected pressure change with 5% safety factor
      const Dp_max_pa = 1.05 * rho * g * (Math.abs(z2 - z1) + Math.max(v1*v1, v2*v2) / (2*g));
      if (Math.abs(p2_gauge_pa - p1_gauge_pa) > Dp_max_pa) continue;
      
      // Valid draw found - now format output
      const is_horizontal = Math.abs(z2 - z1) < 0.001;
      const is_contraction = ratio < 1.0;
      
      return this._buildMultiPartOutput({
        seed, d1, d2, A1, A2, v1, v2, Q, z1, z2,
        rho, g, p_atm,
        p1_gauge_kpa, p1_gauge_pa, p1_abs_pa,
        v1_head, v2_head, p1_head,
        H1, p2_head, p2_abs_pa, p2_gauge_pa, p2_gauge_kpa,
        is_horizontal, is_contraction,
        withLoss, K, v_ref, h_loss
      });
    }
    
    throw new Error(`Failed to generate valid multi-part question after ${maxAttempts} attempts`);
  }
  
  _buildMultiPartOutput(data) {
    const {
      seed, d1, d2, A1, A2, v1, v2, Q, z1, z2,
      rho, g, p_atm,
      p1_gauge_kpa, p1_gauge_pa, p1_abs_pa,
      v1_head, v2_head, p1_head,
      H1, p2_head, p2_abs_pa, p2_gauge_pa, p2_gauge_kpa,
      is_horizontal, is_contraction,
      withLoss, K, v_ref, h_loss
    } = data;
    
    // Relative tolerance validation on full precision
    const eps_cont = 1e-12;
    const eps_head = 1e-12;
    const Q1 = A1 * v1;
    const Q2 = A2 * v2;
    const continuity_rel_err = Math.abs(Q1 - Q2) / Math.max(Q1, Q2);
    
    // For Bernoulli with losses: H1 = H2 + h_loss, so H2 = p2/(ρg) + v2²/(2g) + z2
    // Without losses: H1 = H2
    const H2 = p2_head + v2_head + z2;
    const H1_expected = H2 + h_loss; // H1 should equal H2 + losses
    const bernoulli_rel_err = Math.abs(H1 - H1_expected) / Math.max(Math.abs(H1), Math.abs(H1_expected));
    
    if (continuity_rel_err > eps_cont) {
      throw new Error(`Continuity validation failed: rel_err = ${continuity_rel_err}`);
    }
    if (bernoulli_rel_err > eps_head) {
      throw new Error(`Bernoulli validation failed: rel_err = ${bernoulli_rel_err}, H1=${H1}, H1_expected=${H1_expected}, h_loss=${h_loss}`);
    }
    
    // Round for display (4 sig figs for intermediates, 3 for final answer)
    const d1_mm = (d1 * 1000).toFixed(1);
    const d2_mm = (d2 * 1000).toFixed(1);
    const d1_m = d1.toPrecision(4);
    const d2_m = d2.toPrecision(4);
    const v1_disp = v1.toPrecision(4);
    const v2_disp = v2.toPrecision(4);
    const p1_disp = p1_gauge_kpa.toPrecision(4);
    const p2_disp = p2_gauge_kpa.toPrecision(3);
    const z_diff = z2 - z1;
    
    // Adaptive prose based on geometry
    let geometry_desc;
    if (is_horizontal) {
      geometry_desc = "The pipe is horizontal";
    } else if (z_diff > 0) {
      geometry_desc = `The pipe rises by ${Math.abs(z_diff).toFixed(2)} m`;
    } else {
      geometry_desc = `The pipe drops by ${Math.abs(z_diff).toFixed(2)} m`;
    }
    
    const change_desc = is_contraction ? "contracts" : "expands";
    const loss_clause = withLoss ? `Include a minor loss with K = ${K.toFixed(2)} (using v_ref = ${is_contraction ? 'v₂' : 'v₁'}).` : "Neglect losses.";
    
    // Build HTML output
    const question_html = `
<p>A water line ${change_desc} from diameter d₁ at point 1 to diameter d₂ at point 2. ${geometry_desc} between these points. ${loss_clause}</p>
<p><strong>Given:</strong></p>
<ul>
  <li>d₁ = ${d1_mm} mm (${d1_m} m)</li>
  <li>d₂ = ${d2_mm} mm (${d2_m} m)</li>
  <li>v₁ = ${v1_disp} m/s</li>
  <li>p₁ = ${p1_disp} kPa (gauge pressure)</li>
  <li>z₁ = ${z1.toFixed(2)} m (reference level)</li>
  <li>z₂ = ${z2.toFixed(2)} m</li>
  <li>ρ = 1000 kg/m³ (water)</li>
  <li>g = 9.81 m/s²</li>
  ${withLoss ? `<li>K = ${K.toFixed(2)} (minor loss coefficient, v_ref = ${is_contraction ? 'v₂' : 'v₁'})</li>` : ''}
</ul>
<p><strong>Part A:</strong> Using the continuity equation, calculate the velocity v₂ at point 2.</p>
<p><strong>Part B:</strong> Using your answer from Part A and the Bernoulli equation, calculate the gauge pressure p₂ at point 2.</p>
<p><strong>Find: p₂ (kPa, gauge)</strong></p>
    `.trim();
    
    const answer_html = `p₂ = ${p2_disp} kPa (gauge)`;
    
    // Build detailed explanation
    const loss_term = withLoss ? ` + h_L` : '';
    const loss_calc = withLoss ? `
  <li>Calculate minor loss head:
    <ul>
      <li>h_L = K × v_ref²/(2g) = ${K.toFixed(2)} × (${v_ref.toPrecision(4)})²/(2×9.81)</li>
      <li>h_L = ${h_loss.toFixed(4)} m</li>
    </ul>
  </li>` : '';
    
    const explain_html = `
<p><strong>Part A Solution: Find v₂ using Continuity Equation</strong></p>
<ol>
  <li>Calculate cross-sectional areas:
    <ul>
      <li>A₁ = πd₁²/4 = π(${d1_m})²/4 = ${A1.toExponential(4)} m²</li>
      <li>A₂ = πd₂²/4 = π(${d2_m})²/4 = ${A2.toExponential(4)} m²</li>
    </ul>
  </li>
  <li>Apply continuity: Q₁ = Q₂ → A₁v₁ = A₂v₂</li>
  <li>Solve for v₂:
    <ul>
      <li>v₂ = (A₁/A₂)v₁ = (${A1.toExponential(4)}/${A2.toExponential(4)}) × ${v1_disp}</li>
      <li>v₂ = (d₁/d₂)² × v₁ = (${d1_m}/${d2_m})² × ${v1_disp}</li>
      <li><strong>v₂ = ${v2_disp} m/s</strong> ✓</li>
    </ul>
  </li>
  <li>Verify: Q₁ = ${(Q).toExponential(4)} m³/s, Q₂ = ${(A2*v2).toExponential(4)} m³/s ✓</li>
</ol>

<p><strong>Part B Solution: Find p₂ using Bernoulli Equation</strong></p>
<ol>
  <li>Write Bernoulli equation (head form):
    <ul>
      <li>p₁/(ρg) + v₁²/(2g) + z₁ = p₂/(ρg) + v₂²/(2g) + z₂${loss_term}</li>
      <li>Note: p₁ and p₂ are absolute pressures in the equation</li>
    </ul>
  </li>
  <li>Convert gauge to absolute pressure:
    <ul>
      <li>p₁(abs) = p₁(gauge) + p_atm = ${p1_gauge_kpa.toFixed(1)} + ${(p_atm/1000).toFixed(1)} = ${(p1_abs_pa/1000).toFixed(1)} kPa</li>
      <li>p₁(abs) = ${p1_abs_pa.toFixed(0)} Pa</li>
    </ul>
  </li>
  <li>Calculate velocity heads:
    <ul>
      <li>v₁²/(2g) = (${v1_disp})²/(2×9.81) = ${v1_head.toFixed(4)} m</li>
      <li>v₂²/(2g) = (${v2_disp})²/(2×9.81) = ${v2_head.toFixed(4)} m</li>
    </ul>
  </li>${loss_calc}
  <li>Calculate pressure head at point 1:
    <ul>
      <li>p₁/(ρg) = ${p1_abs_pa.toFixed(0)}/(1000×9.81) = ${p1_head.toFixed(4)} m</li>
    </ul>
  </li>
  <li>Calculate total head at point 1:
    <ul>
      <li>H₁ = ${p1_head.toFixed(4)} + ${v1_head.toFixed(4)} + ${z1.toFixed(2)} = ${H1.toFixed(4)} m</li>
    </ul>
  </li>
  <li>Calculate pressure head at point 2:
    <ul>
      <li>H₁ = H₂ (energy conservation${withLoss ? ' with losses' : ''})</li>
      <li>p₂/(ρg) = H₁ - v₂²/(2g) - z₂${loss_term}</li>
      <li>p₂/(ρg) = ${H1.toFixed(4)} - ${v2_head.toFixed(4)} - ${z2.toFixed(2)}${withLoss ? ` - ${h_loss.toFixed(4)}` : ''} = ${p2_head.toFixed(4)} m</li>
    </ul>
  </li>
  <li>Convert to gauge pressure:
    <ul>
      <li>p₂(abs) = (ρg) × ${p2_head.toFixed(4)} = (1000 × 9.81) × ${p2_head.toFixed(4)}</li>
      <li>p₂(abs) = ${p2_abs_pa.toFixed(0)} Pa = ${(p2_abs_pa/1000).toFixed(1)} kPa</li>
      <li>p₂(gauge) = p₂(abs) - p_atm = ${(p2_abs_pa/1000).toFixed(1)} - ${(p_atm/1000).toFixed(1)}</li>
      <li><strong>p₂ = ${p2_disp} kPa (gauge)</strong> ✓</li>
    </ul>
  </li>
</ol>

<p><strong>Verification:</strong></p>
<ul>
  <li>✓ Continuity: |Q₁ - Q₂|/Q₁ = ${continuity_rel_err.toExponential(2)} < 10⁻¹²</li>
  <li>✓ Bernoulli: |H₁ - H₂|/H₁ = ${bernoulli_rel_err.toExponential(2)} < 10⁻¹²</li>
  <li>✓ Gauge pressure positive: p₂(gauge) = ${p2_gauge_kpa.toFixed(1)} kPa > 0</li>
</ul>
    `.trim();
    
    return {
      topic: withLoss ? 'continuity_bernoulli_K' : 'continuity_bernoulli',
      seed,
      question_html,
      answer_html,
      explain_html,
      label: 'p₂_gauge_kpa',
      answer_value: parseFloat(p2_disp),
      answer_unit: 'kPa',
      state_raw: {
        units: {
          pressure_in: 'kPa_g',
          pressure_internal: 'Pa_abs',
          length: 'm',
          velocity: 'm/s'
        },
        d1_m: d1,
        d2_m: d2,
        A1_m2: A1,
        A2_m2: A2,
        v1_mps: v1,
        v2_mps: v2,
        Q_m3ps: Q,
        z1_m: z1,
        z2_m: z2,
        rho_kgpm3: rho,
        g_mps2: g,
        p_atm_pa: p_atm,
        p1_gauge_kpa: p1_gauge_kpa,
        p1_abs_pa: p1_abs_pa,
        v1_head_m: v1_head,
        v2_head_m: v2_head,
        p1_head_m: p1_head,
        H1_m: H1,
        H2_m: p2_head + v2_head + z2,
        p2_abs_pa: p2_abs_pa,
        p2_gauge_pa: p2_gauge_pa,
        p2_gauge_kpa: p2_gauge_kpa,
        is_horizontal: is_horizontal,
        is_contraction: is_contraction,
        used_loss: withLoss,
        ...(withLoss && { K, v_ref_mps: v_ref, h_loss_m: h_loss })
      },
      state_shown: {
        d1: `${d1_m} m (${d1_mm} mm)`,
        d2: `${d2_m} m (${d2_mm} mm)`,
        A1: `${A1.toExponential(4)} m²`,
        A2: `${A2.toExponential(4)} m²`,
        v1: `${v1_disp} m/s`,
        v2: `${v2_disp} m/s`,
        Q: `${Q.toExponential(4)} m³/s`,
        z1: `${z1.toFixed(2)} m`,
        z2: `${z2.toFixed(2)} m`,
        p1: `${p1_disp} kPa (gauge)`,
        H1: `${H1.toFixed(4)} m`,
        p2: `${p2_disp} kPa (gauge)`,
        ...(withLoss && { K: K.toFixed(2), h_loss: `${h_loss.toFixed(4)} m` })
      },
      validation: {
        continuity_rel_err,
        bernoulli_rel_err,
        p2_gauge_positive: p2_gauge_pa > 0,
        post_render_recompute_match_kpa: Math.abs(parseFloat(p2_disp) - p2_gauge_kpa) < 0.2
      }
    };
  }
  
  _seededRandom(seed) {
    let state = seed;
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }
  
  _randomInRange(min, max, rng) {
    return min + (max - min) * rng();
  }

  _buildUserPrompt(topic, options) {
    let prompt = `TOPIC: ${topic}\nFORMAT: strict JSON per contract.\n\n`;
    
    if (options.seed !== undefined) {
      prompt += `RANDOMIZATION_SEED: ${options.seed}\n`;
    }
    
    if (options.unknown) {
      prompt += `UNKNOWN: ${options.unknown}\n`;
    }

    prompt += '\nGenerate one question following the full specification:\n\n';
    prompt += FULL_SPEC;

    return prompt;
  }

  _validate(question, topic) {
    // Check required fields
    const required = ['topic', 'question_html', 'answer_html', 'explain_html', 'label', 'answer_value', 'answer_unit', 'state'];
    for (const field of required) {
      if (!(field in question)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Check topic matches
    if (question.topic !== topic) {
      throw new Error(`Topic mismatch: expected ${topic}, got ${question.topic}`);
    }

    // Check answer_value is numeric
    if (typeof question.answer_value !== 'number' || isNaN(question.answer_value)) {
      throw new Error(`answer_value must be a valid number, got: ${question.answer_value}`);
    }

    // Check state is object
    if (typeof question.state !== 'object' || question.state === null) {
      throw new Error('state must be an object');
    }

    // Topic-specific validation
    this._validateTopicConstraints(question, topic);
  }

  _validateTopicConstraints(question, topic) {
    const state = question.state;

    switch (topic) {
      case 'continuity':
        // Check A1*v1 = A2*v2
        if (state.A1 && state.A2 && state.v1 && state.v2) {
          const Q1 = state.A1 * state.v1;
          const Q2 = state.A2 * state.v2;
          const diff = Math.abs(Q1 - Q2);
          if (diff > 1e-6) {
            throw new Error(`Continuity violated: A1*v1=${Q1} != A2*v2=${Q2}`);
          }
        }
        break;

      case 'bernoulli':
        // Check pressure is in valid range
        if (state.p2_kpa && (state.p2_kpa < 80 || state.p2_kpa > 400)) {
          throw new Error(`p2 out of range: ${state.p2_kpa} kPa`);
        }
        break;

      case 'combined_gas_law':
        // Check temperature constraints
        for (const key of ['T1', 'T2']) {
          if (state[key] && (state[key] < 200 || state[key] > 500)) {
            throw new Error(`${key} out of range: ${state[key]} K`);
          }
        }
        // Check PV/T identity
        if (state.P1 && state.V1 && state.T1 && state.P2 && state.V2 && state.T2) {
          const ratio1 = (state.P1 * state.V1) / state.T1;
          const ratio2 = (state.P2 * state.V2) / state.T2;
          const diff = Math.abs(ratio1 - ratio2);
          if (diff / ratio1 > 1e-5) {
            throw new Error(`CGL violated: P1V1/T1=${ratio1} != P2V2/T2=${ratio2}`);
          }
        }
        break;

      case 'dalton':
        // Check sum of partials
        if (state.partials && state.Ptot) {
          const sum = state.partials.reduce((a, b) => a + b, 0);
          const diff = Math.abs(sum - state.Ptot);
          if (diff > 1e-6) {
            throw new Error(`Dalton violated: sum=${sum} != Ptot=${state.Ptot}`);
          }
        }
        break;

      case 'continuity_bernoulli':
        // Validate Part A: Continuity equation
        if (state.A1 && state.A2 && state.v1 && state.v2) {
          const Q1 = state.A1 * state.v1;
          const Q2 = state.A2 * state.v2;
          const diff = Math.abs(Q1 - Q2);
          if (diff > 1e-6) {
            throw new Error(`Part A Continuity violated: A1*v1=${Q1} != A2*v2=${Q2}`);
          }
        }
        
        // Validate Part B: Bernoulli equation (total head conservation)
        if (state.p1_head && state.v1_head && state.z1 !== undefined && 
            state.p2_head && state.v2_head && state.z2 !== undefined) {
          const H1 = state.p1_head + state.v1_head + state.z1;
          const H2 = state.p2_head + state.v2_head + state.z2;
          const diff = Math.abs(H1 - H2);
          if (diff > 1e-4) {
            throw new Error(`Part B Bernoulli violated: H1=${H1} != H2=${H2}, diff=${diff}`);
          }
        }
        
        // Check final pressure is in valid range
        if (state.p2_kpa && (state.p2_kpa < 80 || state.p2_kpa > 400)) {
          throw new Error(`p2 out of range: ${state.p2_kpa} kPa`);
        }
        
        // Check v2 is calculated with sufficient precision (should have 4+ sig figs)
        if (state.v2 && state.v2.toString().replace('.', '').length < 4) {
          console.warn(`Warning: v2 precision may be too low: ${state.v2} m/s`);
        }
        break;
    }
  }
}

export default QuestionGenerator;
