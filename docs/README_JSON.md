# Quiz Application - JSON Data System

## Overview
The quiz application now supports loading questions from an external JSON file (`quiz_questions.json`), making it easier to manage and update questions without modifying the HTML file.

## Data Loading Priority

The application loads questions in the following order:

1. **localStorage** - Questions edited in Admin Mode are stored here
2. **quiz_questions.json** - External JSON file (recommended for production)
3. **Embedded text data** - Fallback data hardcoded in the HTML file

## How to Use External JSON File

### Method 1: Export from Admin Mode (Easiest)

1. Open `quiz_practice.html` in your browser
2. Press `Ctrl+Alt+A` to open Admin Mode
3. Click the "Export JSON" button
4. Save the downloaded file as `quiz_questions.json`
5. Place it in the same directory as `quiz_practice.html`
6. Refresh the page - it will now load from the JSON file

### Method 2: Use the Generator Tool

1. Open `generate_json.html` in your browser
2. Click "Generate from LocalStorage" (after opening quiz_practice.html at least once)
3. Click "Download quiz_questions.json"
4. Place the file in the same directory as `quiz_practice.html`

## Benefits of Using JSON File

✅ **Cleaner HTML** - Separate data from presentation
✅ **Easier editing** - Edit questions in a JSON editor or admin panel
✅ **Version control** - Track question changes with Git
✅ **Sharing** - Easy to share question banks between users
✅ **Performance** - Faster loading after first fetch (cached)
✅ **Dynamic exams** - Add new exams without touching HTML code

## JSON File Structure

```json
[
  {
    "id": 1,
    "exam": "Exam 1",
    "type": "multiple-choice",
    "question": "Which of these physiological phenomena is an example of a POSITIVE feedback loop?",
    "image": null,
    "options": [
      "Blood clotting.",
      "Glycolysis in the liver.",
      "Hypothalamic regulation of urine production.",
      "Thyroidal regulation of metabolic rate."
    ],
    "correct": "A",
    "explanation": null,
    "originalNumber": 1
  }
]
```

## Question Types Supported

- `multiple-choice` - Single correct answer (A, B, C, D, E)
- `multiple-answer` - Multiple correct answers (array like ["A", "C"])
- `true-false` - True/False questions

## Creating New Exams

1. Open Admin Mode (`Ctrl+Alt+A`)
2. Click "Add New Question"
3. In the "Exam:" field, type a new exam name (e.g., "Midterm 2025")
4. Fill in question details and click "Save Changes"
5. Export to JSON to persist the changes

## Resetting to Default Questions

If you want to reset to the original embedded questions:

1. Clear browser localStorage: Open browser console (F12) and type:
   ```javascript
   localStorage.removeItem('quizQuestions');
   ```
2. Delete or rename the `quiz_questions.json` file
3. Refresh the page

## File Structure

```
your-folder/
├── quiz_practice.html      (Main quiz application)
├── quiz_questions.json     (Question data - create this)
├── generate_json.html      (Helper tool to generate JSON)
└── README_JSON.md          (This file)
```

## Troubleshooting

**Questions not loading from JSON:**
- Ensure `quiz_questions.json` is in the same directory as the HTML file
- Check browser console (F12) for error messages
- Make sure the JSON file has valid syntax

**Changes not saving:**
- Changes in Admin Mode are saved to localStorage first
- Export to JSON to make changes permanent
- Replace the `quiz_questions.json` file with the exported version

**CORS errors (when opening as file://):**
- Some browsers block JSON loading from `file://` URLs
- Solution: Use a local web server (e.g., Python: `python -m http.server`)
- Or open directly from disk and use localStorage/export instead

## Tips

💡 **Backup regularly**: Export your JSON after making changes
💡 **Version control**: Keep your JSON file in Git for change tracking
💡 **Collaborate**: Share JSON files between instructors
💡 **Organize**: Create separate JSON files for different courses
