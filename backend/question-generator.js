/**
 * AI-Assisted Question Generator
 * Generates randomized, exam-style problems per strict specification
 */

import OpenAI from 'openai';

const SYSTEM_PROMPT = `You generate exam-style STEM practice questions with one unknown. Output STRICT JSON only.
Follow the provided topic spec, units, ranges, and output contract exactly.
No stories. No extra keys. No markdown fences.
If values violate constraints, resample internally before responding.`;

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
  }
};

const FULL_SPEC = `# AI-Assisted Question Generator — Specification

## 0) Scope
Four topics: Continuity, Bernoulli (head form), Combined Gas Law, Dalton's Law.

## 1) Global Output Contract (JSON)
{
  "topic": "continuity | bernoulli | combined_gas_law | dalton",
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

All givens to 3 s.f., answers to 3 s.f. for display.
Use subscript digits (v₂, P₁). No stories, exam voice only.
Validate: recompute from givens, ensure identity holds within 1e-6.`;

class QuestionGenerator {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Generate a question for the specified topic
   * @param {string} topic - One of: continuity, bernoulli, combined_gas_law, dalton
   * @param {object} options - { unknown: 'v2', seed: 42 } (optional)
   * @returns {Promise<object>} - Question JSON per contract
   */
  async generate(topic, options = {}) {
    if (!TOPIC_SPECS[topic]) {
      throw new Error(`Invalid topic: ${topic}. Must be one of: ${Object.keys(TOPIC_SPECS).join(', ')}`);
    }

    const userPrompt = this._buildUserPrompt(topic, options);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
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
    }
  }
}

export default QuestionGenerator;
