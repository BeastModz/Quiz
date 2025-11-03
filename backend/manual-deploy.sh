# Manual VPS Deployment Commands
# Copy and paste these commands one by one into your VPS terminal

# 1. Update system
echo "📦 Updating system..."
apt update && apt upgrade -y

# 2. Install Node.js 18.x
echo "📥 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs git

# 3. Verify installation
echo "✅ Node.js version:"
node -v
echo "✅ NPM version:"
npm -v

# 4. Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/quiz-grader
cd /var/www/quiz-grader

# 5. Clone repository
echo "📥 Cloning repository..."
git clone https://github.com/BeastModz/Quiz.git .

# 6. Go to backend directory
cd backend

# 7. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 8. Create .env file
echo "📝 Creating .env file..."
cat > .env << 'EOF'
OPENAI_API_KEY=sk-your-key-here
PORT=3000
ALLOWED_ORIGINS=https://beastmodz.github.io
OPENAI_MODEL_EMBEDDING=text-embedding-3-small
OPENAI_MODEL_LLM=gpt-4o-mini
USE_LLM_FALLBACK=true
EOF

echo "⚠️  IMPORTANT: Edit /var/www/quiz-grader/backend/.env and add your OpenAI API key!"

# 9. Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# 10. Start the application
echo "🚀 Starting Quiz Grader API..."
pm2 start server.js --name quiz-grader
pm2 save
pm2 startup

# 11. Configure firewall
echo "🔥 Configuring firewall..."
ufw allow 3000/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
echo "y" | ufw enable

# 12. Install Nginx
echo "🌐 Setting up Nginx..."
apt install -y nginx

# 13. Create Nginx config
cat > /etc/nginx/sites-available/quiz-grader << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 14. Enable Nginx config
ln -sf /etc/nginx/sites-available/quiz-grader /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment complete!"
echo ""
echo "📝 Next step: Add your OpenAI API key"
echo "   nano /var/www/quiz-grader/backend/.env"
echo ""
echo "🔄 Then restart: pm2 restart quiz-grader"
echo ""
echo "🌐 Your API is at: http://153.92.221.225"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
