#!/bin/bash
# Hostinger VPS Deployment Script for Quiz Grader API
# Run this on your VPS after connecting via SSH

echo "🚀 Quiz Grader API - VPS Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js (if not pre-installed)
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/quiz-grader
cd /var/www/quiz-grader

# Clone your repository
echo "📥 Cloning repository..."
if [ -d ".git" ]; then
    echo "Repository exists, pulling latest..."
    git pull
else
    git clone https://github.com/BeastModz/Quiz.git .
fi

# Navigate to backend
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file (you'll need to edit this)
if [ ! -f ".env" ]; then
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
fi

# Install PM2 (process manager)
echo "📦 Installing PM2..."
npm install -g pm2

# Start the application
echo "🚀 Starting Quiz Grader API..."
pm2 start server.js --name quiz-grader
pm2 save
pm2 startup

# Configure firewall
echo "🔥 Configuring firewall..."
ufw allow 3000/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw --force enable

# Install and configure Nginx as reverse proxy
echo "🌐 Setting up Nginx reverse proxy..."
apt install -y nginx

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

ln -sf /etc/nginx/sites-available/quiz-grader /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file: nano /var/www/quiz-grader/backend/.env"
echo "2. Add your OpenAI API key"
echo "3. Restart: pm2 restart quiz-grader"
echo ""
echo "🌐 Your API is running at:"
echo "   http://$(curl -s ifconfig.me)"
echo ""
echo "🧪 Test endpoints:"
echo "   curl http://$(curl -s ifconfig.me)/health"
echo "   curl http://$(curl -s ifconfig.me)/api/questions"
echo ""
echo "📊 Monitor logs:"
echo "   pm2 logs quiz-grader"
echo "   pm2 status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
