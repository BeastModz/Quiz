# Quiz Practice Application 🎓

An interactive quiz application with comprehensive study materials and textbook references.

## Features ✨

- **Two Exam Sets**: Exam 1 and Exam 2 with 80 questions each
- **Study Materials**: Detailed explanations, textbook references, key points, and common pitfalls
- **Interactive Learning**: Instant feedback with correct answers and study recommendations
- **Review System**: Track missed questions and get targeted study recommendations
- **Dark Mode**: Eye-friendly dark theme support
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Admin Panel**: Edit questions, add textbook references (press Ctrl+Alt+A)

## Live Demo 🌐

Visit: `https://[your-username].github.io/[repository-name]/`

## Local Development 💻

### Option 1: GitHub Pages (Recommended - No Server Needed)
The app works entirely in the browser using the `quiz_questions.json` file.

1. Simply open `quiz_practice.html` in your browser
2. Or use the Flask server for API support (optional)

### Option 2: Flask Server (For API Features)

```bash
# Install dependencies
pip install flask flask-cors

# Run the server
python app.py

# Open browser to http://localhost:5000
```

## Deployment to GitHub Pages 🚀

### Quick Setup (5 minutes)

1. **Create a GitHub repository**
   - Go to https://github.com/new
   - Name it `quiz-app` (or any name)
   - Make it Public
   - Don't initialize with README (we have one)

2. **Push your code**
   ```bash
   cd "g:\My Drive\_Projects\quiz\quiz-app"
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/quiz-app.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **GitHub Actions**
   - Wait 2-3 minutes for deployment

4. **Access your site**
   - URL: `https://YOUR-USERNAME.github.io/quiz-app/`
   - The workflow will automatically deploy on every push to main

## File Structure 📁

```
quiz-app/
├── index.html                  # Landing page (redirects to quiz)
├── quiz_practice.html          # Main quiz application
├── app.py                      # Flask server (optional)
├── data/
│   └── quiz_questions.json     # All quiz questions with study materials
├── parsers/
│   ├── add_textbook_info.py    # Add textbook references to questions
│   ├── parse_exam1.py          # Parse Exam 1 questions
│   └── parse_exam2.py          # Parse Exam 2 questions
├── tools/
│   ├── embed_images.html       # Convert images to base64
│   └── generate_json.html      # JSON generator tool
├── docs/                       # Documentation
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Pages deployment

```

## Usage 📖

### Taking a Quiz

1. Select exam (Exam 1 or Exam 2)
2. Answer questions
3. Get instant feedback with explanations
4. Review textbook references for wrong answers
5. See study recommendations at the end

### Admin Mode

Press **Ctrl+Alt+A** to open admin panel:
- Edit questions and answers
- Add/update textbook references
- Manage key points, notes, and pitfalls
- Export/import JSON data

### Adding Images

1. Open `tools/embed_images.html`
2. Upload images
3. Copy base64 output
4. Paste into question's `image` field

## Data Structure 📊

Each question includes:
- Question text and options
- Correct answer(s)
- Explanation
- Textbook reference (chapter, section, pages)
- Key notes
- Key points (bulleted)
- Common pitfalls
- Cross-references to related topics

## Technologies Used 🛠️

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Icons**: Lucide Icons
- **Backend** (Optional): Python Flask
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions

## Browser Support 🌍

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

This project is for educational purposes.

## Support 💬

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for better learning
