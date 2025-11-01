# Node.js Backend Deployment Guide

## 🎯 Deploy to Hostinger/Premium Hosting with Node.js Support

Perfect for the $2.50/month plan with Node.js support!

---

## 📦 **Step 1: Prepare Files**

Upload these files via FTP/cPanel File Manager:

```
backend/
├── server.js                    (Express API server)
├── package.json                 (Dependencies)
├── .env                         (Your config - copy from .env.example)
├── quiz-grader.js              (Main grading logic)
└── data/
    └── all_rubrics.en.json     (Question rubrics)
```

---

## 🔑 **Step 2: Configure Environment**

1. Copy `.env.example` to `.env`
2. Edit `.env` with your settings:

```env
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3000
ALLOWED_ORIGINS=https://beastmodz.github.io
OPENAI_MODEL_EMBEDDING=text-embedding-3-small
OPENAI_MODEL_LLM=gpt-4o-mini
USE_LLM_FALLBACK=true
```

---

## 🚀 **Step 3: Install & Start**

### Via SSH (if available):
```bash
cd ~/backend
npm install
npm start
```

### Via cPanel Node.js App Manager:
1. Go to cPanel → **Setup Node.js App**
2. Create new application:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/username/backend`
   - **Application URL**: `your-domain.com` or subdomain
   - **Application startup file**: `server.js`
3. Click "Create"
4. Click "Run NPM Install"
5. Click "Start Application"

---

## 🧪 **Step 4: Test the API**

### Health Check:
```bash
curl https://your-domain.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T12:00:00.000Z",
  "node": "v18.17.0"
}
```

### Test Grading:
```bash
curl -X POST https://your-domain.com/api/grade \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": "1a",
    "student_answer": "Reynolds number represents the ratio of inertial forces to viscous forces"
  }'
```

Expected response:
```json
{
  "success": true,
  "question_id": "1a",
  "question_title": "Reynolds number: which forces?",
  "max_points": 2,
  "result": {
    "label": "correct",
    "score": 0.950,
    "points": 2,
    "breakdown": {
      "semantic": 0.95,
      "concepts": 1.0,
      "numbers": 1.0,
      "structure": 0.5,
      "penalty": 0.0
    },
    "missing_concepts": [],
    "decided_by": "heuristic"
  }
}
```

---

## 🔗 **Step 5: Connect Quiz App**

Update your `quiz_practice.html` to use the API:

```javascript
// Add this to your quiz app
class HumanDynamicsGrader {
    constructor(apiUrl) {
        this.apiUrl = apiUrl || 'https://your-domain.com';
    }

    async gradeAnswer(questionId, studentAnswer) {
        try {
            const response = await fetch(`${this.apiUrl}/api/grade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question_id: questionId,
                    student_answer: studentAnswer
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.result;
        } catch (err) {
            console.error('Grading error:', err);
            throw err;
        }
    }

    async getAvailableQuestions() {
        const response = await fetch(`${this.apiUrl}/api/questions`);
        return await response.json();
    }
}

// Usage example
const grader = new HumanDynamicsGrader('https://your-domain.com');

// When student submits an essay answer
async function handleEssaySubmit(questionId, answer) {
    const result = await grader.gradeAnswer(questionId, answer);
    
    console.log(`Grade: ${result.label}`);
    console.log(`Score: ${result.score}`);
    console.log(`Points: ${result.points}/${maxPoints}`);
    console.log(`Feedback: ${result.breakdown}`);
    
    // Show to user...
}
```

---

## 🎨 **API Endpoints**

### `GET /health`
Check if server is running

### `GET /api/questions`
Get list of all available questions
```json
{
  "rubric_set_id": "practice-exam-en-20251101",
  "total_questions": 17,
  "questions": [
    { "question_id": "1a", "title": "Reynolds number: which forces?", "max_points": 2 },
    ...
  ]
}
```

### `POST /api/grade`
Grade a single answer
```json
{
  "question_id": "1a",
  "student_answer": "your answer here"
}
```

### `POST /api/grade/batch`
Grade multiple answers at once
```json
{
  "answers": [
    { "question_id": "1a", "student_answer": "..." },
    { "question_id": "1b_i", "student_answer": "..." }
  ]
}
```

---

## 🔒 **Security Checklist**

✅ **Never commit `.env` file** - Already in `.gitignore`  
✅ **Use HTTPS** - Configure SSL certificate in cPanel  
✅ **CORS protection** - Only allow your GitHub Pages domain  
✅ **Rate limiting** - Consider adding if needed  
✅ **API key rotation** - Change periodically  

---

## 💰 **Cost Estimates**

### Hosting: **$2.50/month** ($30/year)
- 5 GB storage
- 250 GB bandwidth
- Node.js support
- cPanel

### OpenAI API: **~$1 per 10,000 questions**
- Embeddings: ~$0.00001 per question
- GPT-4o-mini: ~$0.0001 per question
- Total: ~$0.00011 per graded answer

**Example:** 100 students × 17 questions = 1,700 answers = **~$0.19** in API costs

---

## 🐛 **Troubleshooting**

### "Cannot find module 'openai'"
```bash
cd ~/backend
npm install
```

### "OPENAI_API_KEY ontbreekt"
- Check `.env` file exists
- Verify API key starts with `sk-`
- Restart Node.js application

### "CORS error"
- Update `ALLOWED_ORIGINS` in `.env`
- Add your GitHub Pages URL
- Restart server

### "Port already in use"
- Check cPanel Node.js App Manager
- Stop other Node.js apps if needed
- Use different PORT in `.env`

### High CPU usage
- Embeddings are cached automatically
- Consider adding Redis cache for even better performance
- Monitor via cPanel resource usage

---

## 🚀 **Performance Tips**

1. **Caching**: Embeddings are cached in memory (Map)
2. **Batch requests**: Use `/api/grade/batch` for multiple questions
3. **CDN**: Use Cloudflare (free) in front of your domain
4. **Compression**: Enable gzip in cPanel
5. **Keep-alive**: Already configured in Express

---

## 📊 **Monitoring**

Check logs in cPanel:
- **Error log**: `~/logs/error.log`
- **Access log**: `~/logs/access.log`
- **Node.js log**: cPanel Node.js App Manager

---

## 🆚 **Why This Is Better Than Free Hosting**

| Feature | Free (InfinityFree) | Hostinger ($2.50/mo) |
|---------|-------------------|---------------------|
| Node.js | ❌ PHP only | ✅ Full Node.js |
| Embeddings | ❌ | ✅ |
| Advanced scoring | ❌ | ✅ |
| LLM fallback | ❌ | ✅ |
| Caching | ❌ | ✅ |
| SSH access | ❌ | ✅ |
| Custom domains | Limited | ✅ |
| Performance | Slow | Fast |

**Bottom line**: For $2.50/month, you get the FULL power of the advanced grader! 🎉
