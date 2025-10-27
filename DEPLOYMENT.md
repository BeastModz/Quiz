# GitHub Pages Deployment Guide 🚀

## Complete Setup Instructions

### Step 1: Install Git (if not already installed)

**Windows:**
1. Download Git from: https://git-scm.com/download/win
2. Run installer with default settings
3. Restart your terminal

**Check installation:**
```bash
git --version
```

### Step 2: Create GitHub Account

1. Go to https://github.com
2. Sign up (if you don't have an account)
3. Verify your email

### Step 3: Create Repository

1. Go to https://github.com/new
2. Repository name: `quiz-app` (or your choice)
3. Description: "Interactive Quiz Practice with Study Materials"
4. Choose **Public** (required for free GitHub Pages)
5. **DO NOT** check "Add a README file"
6. Click **Create repository**

### Step 4: Push Your Code to GitHub

Open PowerShell in your project folder:

```powershell
# Navigate to your project
cd "g:\My Drive\_Projects\quiz\quiz-app"

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Quiz Practice Application"

# Rename branch to main
git branch -M main

# Add your GitHub repository (REPLACE WITH YOUR USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/quiz-app.git

# Push to GitHub
git push -u origin main
```

**Note:** Replace `YOUR-USERNAME` with your actual GitHub username!

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source**: Select **GitHub Actions**
5. Wait 2-3 minutes for the first deployment

### Step 6: Access Your Live Site

Your site will be available at:
```
https://YOUR-USERNAME.github.io/quiz-app/
```

Example: `https://johnsmith.github.io/quiz-app/`

## Updating Your Quiz

After making changes locally:

```powershell
# Add changed files
git add .

# Commit with message
git commit -m "Updated quiz questions"

# Push to GitHub
git push

# Site will auto-update in 2-3 minutes
```

## Troubleshooting 🔧

### "Permission denied" error
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Use token as password when pushing

### Site shows 404
1. Check GitHub Pages settings are correct
2. Make sure repository is Public
3. Wait 5-10 minutes after first deployment
4. Clear browser cache

### Questions not loading
1. Check `data/quiz_questions.json` is committed
2. Check browser console for errors (F12)
3. Verify JSON is valid at https://jsonlint.com

### Changes not appearing
1. Clear browser cache (Ctrl+Shift+Delete)
2. Wait 2-3 minutes after pushing
3. Try incognito/private mode
4. Check GitHub Actions tab for deployment status

## Advanced: Custom Domain

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In GitHub repository settings → Pages
3. Add your custom domain
4. Update DNS records at your domain provider:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

## File Size Limits

- GitHub Pages: 1 GB total
- Individual files: 100 MB max
- If images are large, use the `embed_images.html` tool to compress

## Security Notes

⚠️ **Important:**
- The JSON file is PUBLIC on GitHub Pages
- Don't include sensitive information
- Don't include personal student data
- This is for educational/practice use only

## Need Help?

1. Check GitHub Actions tab for deployment errors
2. Read error messages carefully
3. Search GitHub Docs: https://docs.github.com/pages
4. Check repository Issues section

## Benefits of GitHub Pages 🎉

✅ **Free hosting** - No cost, no credit card needed
✅ **No server required** - Your laptop can be off
✅ **Fast & reliable** - GitHub's CDN
✅ **HTTPS included** - Secure by default
✅ **Easy updates** - Just push to GitHub
✅ **Version control** - Track all changes
✅ **Accessible anywhere** - Any device with internet

---

Questions? Create an issue on GitHub!
