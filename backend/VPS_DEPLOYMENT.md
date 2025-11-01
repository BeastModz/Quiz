# Hostinger VPS Deployment Guide

## 🎯 Perfect Setup: VPS with Node.js ($7.99/mo)

Your VPS choice is **excellent** for the quiz grader! Full control, better performance, and cheaper than shared hosting.

---

## 🛒 **Hostinger VPS Setup**

### **Selected Plan:**
- **KVM 1**: $7.99/month (first month), $13.99/month after
- **Location**: Netherlands (16ms latency)
- **OS Template**: **OpenLiteSpeed and Node.js** ← IMPORTANT: Select this!

### **Why VPS is Better:**
✅ Full root access  
✅ Dedicated resources  
✅ Pre-installed Node.js  
✅ Can install any software  
✅ Better performance  
✅ Run multiple services  

---

## 🚀 **One-Command Deployment**

After your VPS is ready:

### **Step 1: Connect via SSH**

Hostinger will give you:
- IP address (e.g., `123.45.67.89`)
- Root password

Connect:
```bash
ssh root@your-vps-ip
```

### **Step 2: Run Deployment Script**

Copy and paste this single command:

```bash
curl -sSL https://raw.githubusercontent.com/BeastModz/Quiz/main/backend/deploy-vps.sh | bash
```

Or manually:

```bash
# Download script
wget https://raw.githubusercontent.com/BeastModz/Quiz/main/backend/deploy-vps.sh

# Make executable
chmod +x deploy-vps.sh

# Run it
./deploy-vps.sh
```

This script will:
1. ✅ Update system
2. ✅ Install Node.js (if needed)
3. ✅ Clone your GitHub repository
4. ✅ Install dependencies
5. ✅ Create .env file template
6. ✅ Install PM2 (keeps server running)
7. ✅ Configure Nginx reverse proxy
8. ✅ Set up firewall
9. ✅ Start the API server

### **Step 3: Add Your API Key**

```bash
# Edit .env file
nano /var/www/quiz-grader/backend/.env

# Replace this line:
OPENAI_API_KEY=sk-your-key-here

# With your actual key:
OPENAI_API_KEY=sk-proj-abc123...

# Save: Ctrl+O, Enter, Ctrl+X
```

### **Step 4: Restart Server**

```bash
pm2 restart quiz-grader
```

---

## 🧪 **Testing Your API**

### Check if it's running:
```bash
curl http://your-vps-ip/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T12:00:00.000Z",
  "node": "v18.17.0"
}
```

### Test grading:
```bash
curl -X POST http://your-vps-ip/api/grade \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": "1a",
    "student_answer": "inertial and viscous forces"
  }'
```

---

## 🔗 **Connect Your Quiz App**

Update `quiz_practice.html`:

```javascript
// Replace YOUR_VPS_IP with actual IP
const API_URL = 'http://YOUR_VPS_IP';

class HumanDynamicsGrader {
    constructor() {
        this.apiUrl = API_URL;
    }

    async gradeAnswer(questionId, studentAnswer) {
        const response = await fetch(`${this.apiUrl}/api/grade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question_id: questionId,
                student_answer: studentAnswer
            })
        });
        
        if (!response.ok) throw new Error('Grading failed');
        const data = await response.json();
        return data.result;
    }
}

// Initialize
const grader = new HumanDynamicsGrader();
```

---

## 🛠️ **Useful PM2 Commands**

```bash
# View logs
pm2 logs quiz-grader

# Monitor
pm2 monit

# Restart
pm2 restart quiz-grader

# Stop
pm2 stop quiz-grader

# Start
pm2 start quiz-grader

# Status
pm2 status
```

---

## 🔒 **Security Setup (Recommended)**

### 1. **Enable HTTPS** (Free SSL)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d your-domain.com
```

### 2. **Change SSH Port** (Optional)

```bash
nano /etc/ssh/sshd_config
# Change Port 22 to Port 2222
systemctl restart sshd

# Update firewall
ufw allow 2222/tcp
ufw delete allow 22/tcp
```

### 3. **Create Non-Root User**

```bash
adduser quizapp
usermod -aG sudo quizapp
su - quizapp
```

---

## 📊 **Monitoring**

### Check Server Resources:
```bash
# CPU & Memory
htop

# Disk usage
df -h

# Network
netstat -tuln | grep 3000
```

### PM2 Dashboard (Web):
```bash
pm2 install pm2-server-monit
pm2 web
```

Access at: `http://your-vps-ip:9615`

---

## 💰 **Cost Breakdown**

### Monthly Costs:
- **VPS**: $13.99/month (after first month)
- **OpenAI API**: ~$0.00011 per graded answer
- **100 students × 17 questions**: ~$0.19
- **Total**: **~$14.20/month** for unlimited grading!

### Comparison:
| Service | Cost | Node.js | Full Control |
|---------|------|---------|--------------|
| InfinityFree | Free | ❌ | ❌ |
| Shared ($2.50) | $2.50/mo | ✅ Limited | ❌ |
| **VPS** | **$13.99/mo** | **✅ Full** | **✅ Yes** |

---

## 🚨 **Troubleshooting**

### "Cannot connect to VPS"
```bash
# Check if SSH is running
systemctl status sshd

# Check firewall
ufw status
```

### "API not responding"
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs quiz-grader --lines 50

# Restart
pm2 restart quiz-grader
```

### "Out of memory"
```bash
# Check memory
free -h

# Restart PM2
pm2 restart all
```

### "EADDRINUSE: Port 3000 already in use"
```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change PORT in .env
echo "PORT=3001" >> .env
pm2 restart quiz-grader
```

---

## 🎯 **Upgrade Path**

If you need more resources later:

| Plan | vCPU | RAM | Storage | Price |
|------|------|-----|---------|-------|
| KVM 1 | 1 | 4GB | 50GB | $13.99 |
| KVM 2 | 2 | 8GB | 100GB | $19.99 |
| KVM 4 | 4 | 16GB | 200GB | $38.99 |

Start with KVM 1 - more than enough for hundreds of students!

---

## 🎉 **Benefits of This Setup**

✅ **Full Node.js power** - Embeddings, caching, LLM fallback  
✅ **Professional deployment** - PM2, Nginx, SSL  
✅ **Always running** - Auto-restart on crashes  
✅ **Scalable** - Easy to upgrade VPS plan  
✅ **Fast** - Dedicated resources, no sharing  
✅ **Flexible** - Can add more features anytime  

---

## 📞 **Need Help?**

- **Hostinger Support**: Available 24/7 via live chat
- **PM2 Docs**: https://pm2.keymetrics.io/
- **Node.js Docs**: https://nodejs.org/docs/

---

**Ready to deploy? Just run that one command and you're live in 5 minutes! 🚀**
