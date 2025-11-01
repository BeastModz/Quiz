# InfinityFree Deployment Guide

## 🚀 Deploy Quiz Grader API to InfinityFree

### Step 1: Sign Up
1. Go to https://www.infinityfree.com/
2. Click "Sign Up" and create a free account
3. Create a new website (choose a subdomain like `quiz-grader.infinityfreeapp.com`)

### Step 2: Prepare Files
Upload these files to your InfinityFree hosting via FTP:

```
htdocs/
├── api/
│   └── grade.php          (rename grade-api.php to this)
├── data/
│   └── all_rubrics.en.json
└── config.php             (copy from config.example.php)
```

### Step 3: Configure
1. **Edit `config.php`**:
   ```php
   define('OPENAI_API_KEY', 'sk-your-real-key-here');
   ```

2. **Update CORS in `grade.php`**:
   ```php
   header('Access-Control-Allow-Origin: https://beastmodz.github.io');
   ```

### Step 4: Upload via FTP
1. Download an FTP client (FileZilla recommended)
2. Get FTP credentials from InfinityFree control panel
3. Connect and upload files to `htdocs/` folder

**FTP Details from InfinityFree:**
- Host: `ftpupload.net`
- Username: Your InfinityFree username
- Password: Your InfinityFree password
- Port: 21

### Step 5: Update Quiz App
In your `quiz_practice.html`, add this JavaScript function:

```javascript
async function gradeEssayAnswer(questionId, studentAnswer) {
    const response = await fetch('https://your-subdomain.infinityfreeapp.com/api/grade.php', {
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
        throw new Error('Grading failed');
    }
    
    const data = await response.json();
    return data.result;
}
```

### Step 6: Test
1. Open browser console on your quiz page
2. Test the API:
   ```javascript
   gradeEssayAnswer('1a', 'inertial and viscous forces').then(console.log);
   ```

3. Should return:
   ```json
   {
     "grade": "correct",
     "score": 0.95,
     "points": 2,
     "feedback": "Excellent! You correctly identified both forces.",
     "missing_concepts": [],
     "strengths": ["Identified inertial forces", "Identified viscous forces"],
     "improvements": []
   }
   ```

## 🔒 Security Notes

### ⚠️ API Key Protection
- **NEVER** commit `config.php` to Git
- Add to `.gitignore`:
  ```
  backend/config.php
  ```

### 🛡️ CORS Protection
- Only allow requests from your GitHub Pages URL
- Update `ALLOWED_ORIGINS` in config.php

### 📊 Rate Limiting (Optional)
InfinityFree has some limits:
- **50,000 hits/day** (should be plenty)
- **CPU usage limits** (keep requests fast)

## 🐛 Troubleshooting

### "API key not configured"
- Check that `config.php` exists and has correct key
- Verify file is in same directory as `grade.php`

### "CORS error"
- Update `Access-Control-Allow-Origin` header
- Make sure your GitHub Pages URL is correct

### "OpenAI API error"
- Check your OpenAI account has credits
- Verify API key is valid (starts with `sk-`)

### "500 Internal Server Error"
- Check PHP error logs in InfinityFree control panel
- Verify file permissions (should be 644)
- Check that curl extension is enabled

## 💰 Costs

- **InfinityFree**: FREE
- **OpenAI API**: 
  - GPT-4o-mini: ~$0.15 per 1M input tokens
  - ~$0.0001 per question graded
  - 10,000 questions = ~$1

## 🆚 Alternative Free Hosting

If InfinityFree doesn't work:

1. **Railway.app** - Free Node.js hosting (500 hrs/month)
2. **Render.com** - Free tier with 750 hrs/month
3. **Vercel** - Free serverless functions (Node.js)
4. **Netlify** - Free serverless functions
5. **000webhost.com** - Free PHP hosting (alternative to InfinityFree)

Railway/Render are better because they support Node.js natively, so you can use the original `quiz-grader.js` without converting to PHP.
