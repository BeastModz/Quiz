# 🚀 Quick Deployment Checklist

## Your VPS Information
- **IP Address**: `153.92.221.225`
- **Location**: Netherlands
- **Provider**: Hostinger

---

## 📋 Deployment Steps

### 1. Connect to VPS
```bash
ssh root@153.92.221.225
```

### 2. Run One-Command Deployment
```bash
curl -sSL https://raw.githubusercontent.com/BeastModz/Quiz/main/backend/deploy-vps.sh | bash
```

This will:
- ✅ Install Node.js and dependencies
- ✅ Clone your repository
- ✅ Set up PM2 process manager
- ✅ Configure Nginx reverse proxy
- ✅ Start the API server on port 3000
- ✅ Enable firewall

### 3. Add OpenAI API Key
```bash
nano /var/www/quiz-grader/backend/.env
```

Change:
```
OPENAI_API_KEY=sk-your-key-here
```

To your actual key:
```
OPENAI_API_KEY=sk-proj-abc123...
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### 4. Restart Server
```bash
pm2 restart quiz-grader
```

### 5. Test the API
Open in browser:
```
http://153.92.221.225/health
```

Or use the test page:
```
http://153.92.221.225/test-api.html
```

---

## 🧪 Quick Tests

### Health Check:
```bash
curl http://153.92.221.225/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T12:00:00.000Z",
  "node": "v18.17.0"
}
```

### List Questions:
```bash
curl http://153.92.221.225/api/questions
```

### Grade Answer:
```bash
curl -X POST http://153.92.221.225/api/grade \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": "1a",
    "student_answer": "inertial and viscous forces"
  }'
```

---

## 📊 Useful Commands

### View Logs:
```bash
pm2 logs quiz-grader
```

### Check Status:
```bash
pm2 status
```

### Restart:
```bash
pm2 restart quiz-grader
```

### Stop:
```bash
pm2 stop quiz-grader
```

### Monitor:
```bash
pm2 monit
```

---

## 🔗 Your URLs

- **API Base**: http://153.92.221.225
- **Health Check**: http://153.92.221.225/health
- **Questions List**: http://153.92.221.225/api/questions
- **Grade Endpoint**: http://153.92.221.225/api/grade
- **Test Page**: http://153.92.221.225/test-api.html

---

## 🔧 Troubleshooting

### Can't connect to VPS?
```bash
# Check if SSH is running
systemctl status sshd
```

### API not responding?
```bash
# Check PM2 status
pm2 status

# View recent logs
pm2 logs quiz-grader --lines 50

# Restart
pm2 restart quiz-grader
```

### "OPENAI_API_KEY ontbreekt"?
```bash
# Check .env file exists
cat /var/www/quiz-grader/backend/.env

# Edit it
nano /var/www/quiz-grader/backend/.env

# Restart after editing
pm2 restart quiz-grader
```

---

## 🎯 Next Steps

1. ✅ Deploy to VPS (run the curl command above)
2. ✅ Add OpenAI API key
3. ✅ Test with test-api.html
4. ✅ Update quiz_practice.html with API endpoint (already done!)
5. ✅ Push changes to GitHub Pages

---

## 💡 Pro Tips

- **Logs location**: `/var/www/quiz-grader/backend/`
- **PM2 saves state**: Server auto-restarts after reboot
- **Nginx config**: `/etc/nginx/sites-available/quiz-grader`
- **Firewall status**: `ufw status`

---

## 🔒 Security (Optional)

### Enable HTTPS:
```bash
apt install certbot python3-certbot-nginx
certbot --nginx
```

### Change SSH port:
```bash
nano /etc/ssh/sshd_config
# Change Port 22 to Port 2222
systemctl restart sshd
```

---

**Ready? SSH into `153.92.221.225` and run the deployment command! 🚀**
