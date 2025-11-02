// Quiz Grader API Server
// Express.js server for hosting the quiz grader with Node.js support

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { gradeAnswer } from './quiz-grader.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    node: process.version
  });
});

// Load rubrics
let rubrics = null;
async function loadRubrics() {
  try {
    const data = await readFile(new URL('../data/all_rubrics.en.json', import.meta.url), 'utf8');
    rubrics = JSON.parse(data);
    console.log(`✅ Loaded ${rubrics.questions.length} rubrics`);
  } catch (err) {
    console.error('❌ Failed to load rubrics:', err.message);
    process.exit(1);
  }
}

// Grade endpoint
app.post('/api/grade', async (req, res) => {
  try {
    const { question_id, student_answer } = req.body;

    // Validate request
    if (!question_id || !student_answer) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['question_id', 'student_answer']
      });
    }

    // Find rubric
    const rubric = rubrics.questions.find(q => q.question_id === question_id);
    if (!rubric) {
      return res.status(404).json({
        error: 'Question not found',
        question_id
      });
    }

    // Grade the answer
    const result = await gradeAnswer(student_answer, rubric, {
      modelEmb: process.env.OPENAI_MODEL_EMBEDDING || 'text-embedding-3-small',
      modelLLM: process.env.OPENAI_MODEL_LLM || 'gpt-4o-mini',
      useFallback: process.env.USE_LLM_FALLBACK !== 'false'
    });

    // Return result
    res.json({
      success: true,
      question_id,
      question_title: rubric.title,
      max_points: rubric.max_points,
      result
    });

  } catch (err) {
    console.error('Grading error:', err);
    
    if (err.message.includes('OPENAI_API_KEY')) {
      return res.status(500).json({
        error: 'OpenAI API key not configured',
        message: 'Set OPENAI_API_KEY in .env file'
      });
    }

    res.status(500).json({
      error: 'Grading failed',
      message: err.message
    });
  }
});

// List all available questions
app.get('/api/questions', (req, res) => {
  const questions = rubrics.questions.map(q => ({
    question_id: q.question_id,
    title: q.title,
    max_points: q.max_points
  }));

  res.json({
    rubric_set_id: rubrics.rubric_set_id,
    language: rubrics.language,
    total_questions: questions.length,
    questions
  });
});

// Batch grading endpoint (grade multiple answers at once)
app.post('/api/grade/batch', async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        error: 'Invalid request format',
        expected: { answers: [{ question_id: string, student_answer: string }] }
      });
    }

    const results = [];
    for (const answer of answers) {
      const rubric = rubrics.questions.find(q => q.question_id === answer.question_id);
      if (!rubric) {
        results.push({
          question_id: answer.question_id,
          error: 'Question not found'
        });
        continue;
      }

      try {
        const result = await gradeAnswer(answer.student_answer, rubric);
        results.push({
          question_id: answer.question_id,
          question_title: rubric.title,
          result
        });
      } catch (err) {
        results.push({
          question_id: answer.question_id,
          error: err.message
        });
      }
    }

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat endpoint - simple conversational interface
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid message',
        required: ['message']
      });
    }

    // Use OpenAI to respond conversationally
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for a quiz grading system. You help students understand Human Dynamics concepts related to anatomy, physiology, fluid mechanics, biomechanics, and biomaterials. Be concise, friendly, and educational. If asked about the system, explain that you can help with questions about the 18 Human Dynamics quiz questions covering topics like Reynolds number, cardiovascular system, joints, composites, etc.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: 'Chat failed',
      message: err.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    available_endpoints: [
      'GET /health',
      'GET /api/questions',
      'POST /api/grade',
      'POST /api/grade/batch',
      'POST /api/chat'
    ]
  });
});

// Start server
loadRubrics().then(() => {
  app.listen(PORT, () => {
    console.log(`
🚀 Quiz Grader API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server running on port ${PORT}
🌐 Health check: http://localhost:${PORT}/health
📝 Questions list: http://localhost:${PORT}/api/questions
🎯 Grade endpoint: POST http://localhost:${PORT}/api/grade
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
});
