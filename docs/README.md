# Quiz Practice App - Flask Edition

A comprehensive anatomy and physiology quiz application with 160 questions across 2 exams. Features a built-in admin panel for editing questions directly in the `quiz_questions.json` file.

## 🚀 Quick Start

### 1. Install Flask (First Time Only)

Double-click `install.bat` or run in PowerShell:
```powershell
pip install -r requirements.txt
```

### 2. Start the Server

Double-click `start_flask.bat` or run:
```powershell
python app.py
```

### 3. Open the Quiz

Open your browser to: **http://localhost:5000**

## ✨ Features

### Quiz Features
- **160 Questions** - 80 questions per exam (Exam 1 & Exam 2)
- **Multiple Question Types** - Multiple choice, multiple answer, true/false
- **Dark Mode** - Toggle between light and dark themes
- **Progress Tracking** - Real-time progress with passing indicator (52/80 to pass)
- **Retry Mode** - Automatically review incorrect questions
- **Pass/Fail System** - 65% passing grade (52 out of 80 questions)

### Admin Panel Features
- **Press Ctrl+Alt+A** to open admin mode
- **Edit Questions** - Modify question text, options, correct answers, and explanations
- **Add New Questions** - Create new questions for any exam
- **Delete Questions** - Remove unwanted questions
- **Import/Export** - Backup and restore questions via JSON
- **Live Updates** - All changes save directly to `quiz_questions.json`
- **Image Support** - Add image URLs to questions

## 📁 File Structure

```
quiz_practice_app/
│
├── app.py                    # Flask server with API endpoints
├── quiz_practice.html        # Main quiz application
├── quiz_questions.json       # Question database (160 questions)
├── requirements.txt          # Python dependencies
├── install.bat              # Install script
├── start_flask.bat          # Server startup script
└── README.md                # This file
```

## 🔧 API Endpoints

The Flask server provides these API endpoints:

- `GET /api/questions` - Get all questions
- `POST /api/questions` - Save all questions
- `PUT /api/question/<id>` - Update a single question
- `DELETE /api/question/<id>` - Delete a single question
- `POST /api/question` - Add a new question

## 💾 How It Works

1. **Quiz loads questions** from Flask API → `quiz_questions.json`
2. **Admin panel edits** save directly to `quiz_questions.json`
3. **No localStorage** - all data comes from and goes to the JSON file
4. **Live updates** - changes are immediately available

## 🎓 Usage Tips

### Taking the Quiz
1. Select your exam (Exam 1, Exam 2, or Both)
2. Answer questions by clicking options
3. For multiple-answer questions, select all correct answers and click "Submit Answer"
4. Track your progress - you need 52/80 correct to pass
5. Review incorrect questions at the end

### Editing Questions (Admin Mode)
1. Press **Ctrl+Alt+A** to open admin panel
2. Click a question to edit it
3. Make your changes
4. Click "Save Question" - changes write to `quiz_questions.json`
5. Close admin panel (changes are already saved)

### Backing Up Questions
1. Open admin panel (Ctrl+Alt+A)
2. Click "Export JSON"
3. Save the file as a backup

### Restoring Questions
1. Open admin panel (Ctrl+Alt+A)
2. Click "Import JSON"
3. Select your backup file
4. Confirm to restore

## 🛠️ Troubleshooting

### Server won't start
- Make sure Python is installed: `python --version`
- Make sure Flask is installed: `pip install flask`
- Check if port 5000 is already in use

### Questions won't save
- Make sure the Flask server is running
- Check the console for error messages
- Verify `quiz_questions.json` file exists and is writable

### Can't access admin panel
- Press **Ctrl+Alt+A** to open
- Make sure you're using the Flask server (not opening HTML directly)

## 🔒 Security Note

This app is designed for **local use only**. The Flask server runs in debug mode and should not be exposed to the internet or used in production without proper security measures.

## 📝 Question Format

Each question in `quiz_questions.json` follows this structure:

```json
{
  "id": 1,
  "exam": "Exam 1",
  "type": "multiple-choice",
  "question": "Question text here?",
  "image": null,
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correct": "A",
  "explanation": null,
  "originalNumber": 1
}
```

### Question Types
- `"multiple-choice"` - Single correct answer (A, B, C, D, or E)
- `"multiple-answer"` - Multiple correct answers (array: ["A", "C"])
- `"true-false"` - True/False questions (A=True, B=False)

## 📊 Grading System

- **Total Questions per Exam**: 80
- **Passing Grade**: 65% (52 questions correct)
- **Progress Bar Colors**:
  - 🔵 Blue: Default
  - 🟠 Orange: Close to passing (48-51 correct)
  - 🟢 Green: Passing (52+ correct)

## 🎨 Dark Mode

Toggle dark mode using the moon/sun icon in the top right corner. Your theme preference is remembered for your next session.

## 🤝 Contributing

To add more questions:
1. Open admin panel (Ctrl+Alt+A)
2. Click "Add New Question"
3. Fill in the details
4. Click "Save Question"

Or directly edit `quiz_questions.json` and restart the server.

---

**Enjoy studying! 📚✨**
