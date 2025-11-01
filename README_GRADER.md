# Quiz Grader System

This quiz app now includes an advanced AI-powered grading system for essay questions.

## Files

- **`quiz-grader.js`** - Full Node.js version with embeddings + LLM fallback (requires backend)
- **`openai_integration.js`** - Browser-compatible version (simpler, direct OpenAI API calls)
- **`data/all_rubrics.en.json`** - Human Dynamics exam rubrics with 17 questions

## Architecture

### Grading Flow
1. **Semantic matching**: Compares student answer to reference answers using embeddings (cosine similarity)
2. **Concept coverage**: Checks for required concepts and synonyms with fuzzy matching
3. **Number validation**: Extracts and validates numerical answers with unit conversion
4. **Structure scoring**: Basic formatting/organization assessment
5. **LLM fallback**: Uses GPT in "gray zone" scores (0.68-0.78) for human-like judgment

### Scoring Weights
Each question defines weights for:
- `semantic`: Similarity to reference answers (typically 0.25-0.45)
- `concepts`: Coverage of required concepts (typically 0.35-0.70)
- `numbers`: Numerical accuracy (0.35-0.45 for calculation questions, 0.0 for conceptual)
- `structure`: Answer organization (typically 0.05)

### Thresholds
- **correct_score**: Minimum score for full credit (typically 0.85)
- **partial_score**: Minimum for partial credit (typically 0.70)
- **min_concept_hit_required**: Minimum concept coverage needed (0.5-0.8)
- **gray_zone**: Range where LLM arbiter is consulted (0.68-0.78)

## Usage

### Node.js CLI (Backend)
```bash
# Install dependencies
npm install openai

# Set API key
export OPENAI_API_KEY="sk-..."

# Grade single answer
node quiz-grader.js data/all_rubrics.en.json --qid 1a "inertial and viscous"

# Output:
{
  "label": "correct",
  "score": 0.912,
  "points": 2,
  "breakdown": {
    "semantic": 0.89,
    "concepts": 1.0,
    "numbers": 1.0,
    "structure": 0.5,
    "penalty": 0.0
  },
  "missing_concepts": [],
  "decided_by": "heuristic"
}
```

### Browser Integration (GitHub Pages)
```javascript
// Load rubrics
const rubrics = await fetch('data/all_rubrics.en.json').then(r => r.json());

// Get API key from localStorage
const apiKey = localStorage.getItem('openai_api_key');

// Simple browser version (openai_integration.js)
const evaluator = new OpenAIEvaluator(apiKey);
const result = await evaluator.evaluateAnswer(
  questionText,
  studentAnswer,
  correctAnswer
);
```

## Question Types

### Conceptual Questions (1a-1j)
- **Focus**: Understanding of concepts, terminology
- **Weight**: High on concepts (0.65-0.70), moderate semantic (0.25-0.45)
- **Examples**: Reynolds number, heart function, blood cells

### Calculation Questions (2-6)
- **Focus**: Numerical accuracy with unit handling
- **Weight**: High on numbers (0.35-0.45), moderate concepts (0.30-0.35)
- **Examples**: Hydrostatics (103 kPa), diving safety, Bernoulli equation

## Human Dynamics Exam Structure

Total: 17 questions, 100 points
- **Question 1** (10 sub-questions): 50 points - Conceptual understanding
  - 1a: Reynolds number (2 pts)
  - 1b: Conservation laws (8 pts)
  - 1c: Heart anatomy (5 pts)
  - 1d: Valves (2 pts)
  - 1e: Respiration (3 pts)
  - 1f: Synovial fluid (5 pts)
  - 1g: Titanium (4 pts)
  - 1h: CFD (5 pts)
  - 1i: Blood cells (6 pts)
  - 1j: Blood rheology (10 pts)

- **Questions 2-6**: 50 points - Calculations
  - Q2: Hydrostatics (15 pts)
  - Q3: Diving safety (7 pts)
  - Q4: Composite materials (5 pts)
  - Q5: Bernoulli (15 pts)
  - Q6: Ideal gas law (8 pts)

## Future Enhancements

1. **Backend Server**: Deploy Node.js grader to protect API key
2. **Real-time Feedback**: Show concept coverage as student types
3. **Study Hints**: Generate personalized recommendations from missing concepts
4. **Progress Tracking**: Store grading history for learning analytics
5. **Multi-language**: Add rubrics in other languages
