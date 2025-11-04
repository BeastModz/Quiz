# Multi-Part Question Generator: Continuity + Bernoulli

## Overview
AI-generated sequential two-part problems that combine mass conservation (continuity equation) and Bernoulli's equation. Part A feeds into Part B.

## Problem Structure

### Part A: Mass Conservation (Continuity)
- **Equation:** Q₁ = Q₂ → A₁v₁ = A₂v₂
- **Find:** Velocity v₂ at point 2
- **Given:** d₁, d₂, v₁
- **Calculation:** v₂ = v₁(d₁/d₂)² where A = πd²/4

### Part B: Bernoulli's Equation
- **Equation:** p₁/(ρg) + v₁²/(2g) + z₁ = p₂/(ρg) + v₂²/(2g) + z₂
- **Find:** Pressure p₂ at point 2
- **Given:** p₁, z₁, z₂, and **v₂ from Part A**
- **Critical:** Uses p/(ρg) NOT p/ρ

## Parameter Ranges

| Parameter | Range | Unit | Description |
|-----------|-------|------|-------------|
| d₁ | 0.020 - 0.080 | m | Inlet diameter |
| d₂/d₁ | 0.5 - 1.5 | - | Diameter ratio (contraction/expansion) |
| v₁ | 0.50 - 3.00 | m/s | Inlet velocity |
| p₁ | 180 - 320 | kPa | Inlet pressure (gauge) |
| z₁ - z₂ | -2 to +2 | m | Elevation difference |
| ρ | 1000 | kg/m³ | Water density (fixed) |
| g | 9.81 | m/s² | Gravity (fixed) |

## Validation Constraints

1. **Continuity:** |A₁v₁ - A₂v₂| < 1×10⁻⁶
2. **Bernoulli:** |H₁ - H₂| < 1×10⁻⁴ where H = p/(ρg) + v²/(2g) + z
3. **Pressure Range:** 80 ≤ p₂ ≤ 400 kPa
4. **Precision:** v₂ kept to 4+ sig figs, final answer 3 sig figs

## AI Generation Process

1. **Generate random values** within specified ranges
2. **Calculate Part A:** Compute v₂ from continuity
3. **Calculate Part B:** Compute p₂ using v₂ from Part A
4. **Validate:** Check all constraints
5. **Retry:** If validation fails, regenerate (up to 3 attempts)

## Output Format

```json
{
  "topic": "continuity_bernoulli",
  "question_html": "<p>Complete two-part problem statement...</p>",
  "answer_html": "p₂ = XXX.X kPa",
  "explain_html": "<p>Step-by-step solution for both parts...</p>",
  "label": "p₂",
  "answer_value": 245.1,
  "answer_unit": "kPa",
  "state": {
    "d1": 0.050,
    "d2": 0.030,
    "v1": 1.20,
    "v2": 3.333,
    "p1": 250,
    "z1": 0,
    "z2": 0,
    "A1": 0.001963,
    "A2": 0.0007069,
    "v1_head": 0.07339,
    "v2_head": 0.5669,
    "p1_head": 25.48,
    "p2_head": 24.99,
    "H1": 25.55,
    "p2_kpa": 245.1
  }
}
```

## Testing

### Test Interface
- **Main Generator:** http://153.92.221.225/test-generator.html
  - Select "⭐ Multi-Part: Continuity + Bernoulli"
  - Click "Generate Single Question"

- **Dedicated Multi-Part Test:** http://153.92.221.225/test-multipart.html
  - Focused test page for multi-part questions only

### API Endpoint
```bash
POST http://153.92.221.225:3000/api/generate/question
Content-Type: application/json

{
  "topic": "continuity_bernoulli",
  "seed": 42  // optional
}
```

## Common AI Errors (Handled by Retry Logic)

The AI sometimes makes these calculation errors:
1. ❌ Computing A₁v₁ ≠ A₂v₂ (continuity violation)
2. ❌ Using p/ρ instead of p/(ρg) in Bernoulli
3. ❌ Rounding v₂ too early before using in Part B
4. ❌ Forgetting to convert kPa to Pa

**Solution:** System automatically retries up to 3 times with new random values until validation passes.

## Integration with Quiz App

Future integration will:
1. Add "Multi-Part Problems" section to main quiz interface
2. Allow selecting exam topics (e.g., "Fluids - Combined Problems")
3. Store generated questions in database
4. Track student performance on sequential problems
5. Provide partial credit for correct Part A even if Part B is wrong

## File Locations

- **Generator Logic:** `backend/question-generator.js`
- **API Endpoints:** `backend/server.js`
- **Test UI:** `test-generator.html`, `test-multipart.html`
- **Documentation:** `backend/GENERATOR_README.md`
