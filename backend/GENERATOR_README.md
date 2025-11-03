# AI-Assisted Question Generator

Generates randomized, exam-style STEM problems with strict validation per specification.

## Features

- **4 Topics**: Continuity, Bernoulli (head form), Combined Gas Law, Dalton's Law
- **Strict JSON Output**: Machine-readable format with validation
- **Physics-Based**: All values are realistic and obey conservation laws
- **Auto-Validation**: Checks continuity equations, Bernoulli heads, gas law identity, etc.
- **No Fluff**: Exam-style voice, no stories, clean givens

## API Endpoints

### Generate Single Question

```bash
POST /api/generate/question
Content-Type: application/json

{
  "topic": "continuity",
  "unknown": "v2",      // optional: force which variable to hide
  "seed": 42            // optional: for reproducibility
}
```

**Valid topics**: `continuity`, `bernoulli`, `combined_gas_law`, `dalton`

**Response**:
```json
{
  "success": true,
  "question": {
    "topic": "continuity",
    "question_html": "<h3>Continuity</h3><p>Steady, incompressible flow...</p>",
    "answer_html": "v₂ = 0.536 m/s",
    "explain_html": "<p>v₂ = v₁·(d₁²/d₂²) = ...</p>",
    "label": "v₂",
    "answer_value": 0.536212,
    "answer_unit": "m/s",
    "state": { "d1": 0.032, "d2": 0.051, "v1": 1.37, "v2": 0.536212, ... }
  },
  "timestamp": "2025-11-03T..."
}
```

### Generate Batch

```bash
POST /api/generate/batch
Content-Type: application/json

{
  "topic": "bernoulli",
  "count": 5,           // 1-20, default 5
  "seed": 100           // optional
}
```

**Response**:
```json
{
  "success": true,
  "count": 5,
  "questions": [ /* array of question objects */ ],
  "timestamp": "2025-11-03T..."
}
```

## Testing Locally

```bash
# Test single question
node backend/test-generator.js continuity

# Test batch
node backend/test-generator.js bernoulli 5

# Test all topics
node backend/test-generator.js continuity 2
node backend/test-generator.js bernoulli 2
node backend/test-generator.js combined_gas_law 2
node backend/test-generator.js dalton 2
```

## Question Format

Each question follows this contract:

### Output Fields

| Field | Type | Description |
|-------|------|-------------|
| `topic` | string | One of the 4 supported topics |
| `question_html` | string | Exam-style stem with givens (HTML) |
| `answer_html` | string | Symbol = value + unit (rounded to 3 s.f.) |
| `explain_html` | string | Brief derivation steps (HTML) |
| `label` | string | Math symbol of unknown (e.g., "v₂", "P₁") |
| `answer_value` | number | Raw numeric value (unrounded) for checking |
| `answer_unit` | string | Unit string (e.g., "m/s", "kPa", "K") |
| `state` | object | All givens & intermediate values |

### Topic Specifications

#### 1. Continuity

**Model**: Q = A·v, A = πd²/4

**Ranges**:
- d₁: [0.010, 0.080] m
- d₂/d₁: [0.5, 1.8]
- v₁: [0.30, 3.00] m/s

**Unknowns**: v₂, v₁, d₂, or d₁

**Validation**: A₁v₁ = A₂v₂ within 1e-6

#### 2. Bernoulli (Head Form)

**Model**: p/(ρg) + v²/(2g) + z = const
- ρ = 1000 kg/m³ (water)
- g = 9.81 m/s²

**Ranges**:
- p₁: [180, 320] kPa
- v₁: [0.6, 4.0] m/s
- v₂: [0.5, 6.5] m/s
- z₁ - z₂: [-2, 2] m or 0

**Unknowns**: p₂, v₂, v₁, or z_diff

**Validation**: p₂ ∈ [80, 400] kPa, head terms equal within 1e-6

#### 3. Combined Gas Law

**Model**: P₁V₁/T₁ = P₂V₂/T₂ (T in Kelvin only)

**Ranges**:
- P₁: [95, 200] kPa, P₂: [80, 220] kPa
- V₁: [1, 12] L, V₂: [0.5, 14] L
- T₁: [280, 320] K

**Unknowns**: P₂, V₂, T₂, P₁, V₁, or T₁ (exactly one)

**Validation**: 200 ≤ T ≤ 500 K, identity holds within 1e-5

#### 4. Dalton's Law

**Model**: P_total = ΣPᵢ

**Ranges**:
- n: 3 or 4 components
- Pᵢ: [15, 60] kPa

**Unknowns**: one component Pₖ or P_total

**Validation**: sum equals total within 1e-6

## Validation Rules

The generator self-checks:
1. ✅ Numeric identity holds (continuity, Bernoulli, CGL, Dalton)
2. ✅ All units match specifications
3. ✅ Physical values are positive and in valid ranges
4. ✅ Exactly one unknown withheld from givens
5. ✅ `answer_value` is numeric (no strings)
6. ✅ Display values rounded to 3 s.f., raw value precise

## Error Handling

Returns HTTP 500 with error details if:
- OpenAI API fails
- Returned JSON is invalid
- Validation constraints violated
- Physical impossibilities detected

## Integration with Quiz App

The generated questions can be directly used by the quiz app's checking logic:

```javascript
// Check student answer
const tolerance = Math.max(0.02 * Math.abs(question.answer_value), 1e-3);
const isCorrect = Math.abs(studentAnswer - question.answer_value) <= tolerance;
```

## Example Usage

```javascript
// Generate a continuity question
const response = await fetch('http://153.92.221.225:3000/api/generate/question', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic: 'continuity' })
});

const { question } = await response.json();

// Display question
document.getElementById('question').innerHTML = question.question_html;

// Check student's numeric input
const studentAnswer = parseFloat(document.getElementById('answer').value);
const tolerance = Math.max(0.02 * Math.abs(question.answer_value), 1e-3);
const correct = Math.abs(studentAnswer - question.answer_value) <= tolerance;

// Show feedback
if (correct) {
  document.getElementById('feedback').innerHTML = question.explain_html;
}
```

## Common Pitfalls (Avoided by Generator)

- ❌ Using p/ρ instead of p/(ρg) in Bernoulli → Generator uses correct head form
- ❌ Mixing gauge and absolute pressure → Generator uses consistent absolute kPa
- ❌ Forgetting to convert kPa to Pa → Generator handles conversions internally
- ❌ Using Celsius instead of Kelvin → Generator enforces K for gas laws
- ❌ Violating conservation laws → Generator validates all identities

## Dependencies

- `openai` ^4.0.0 - OpenAI API client
- `dotenv` ^16.0.0 - Environment variables

## Environment Variables

Required:
```bash
OPENAI_API_KEY=sk-proj-...
```

Optional:
```bash
OPENAI_MODEL_LLM=gpt-4o-mini  # default
```

## Deployment

Already integrated into the main server.js. After deployment:

```bash
# Restart PM2
pm2 restart quiz-backend

# Test endpoints
curl -X POST http://153.92.221.225:3000/api/generate/question \
  -H "Content-Type: application/json" \
  -d '{"topic":"continuity"}'
```

## License

Part of the Quiz App project.
