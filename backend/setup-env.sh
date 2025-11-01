#!/bin/bash

# Simple script to create .env file with OpenAI API key
# Run this on your VPS after cloning the repository

echo "🔧 Setting up environment variables..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create .env file with the API key
cat > .env << 'EOL'
# OpenAI API Configuration
OPENAI_API_KEY=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

# Server Configuration
PORT=3000
ALLOWED_ORIGINS=https://beastmodz.github.io

# OpenAI Model Configuration
OPENAI_MODEL_EMBEDDING=text-embedding-3-small
OPENAI_MODEL_LLM=gpt-4o-mini

# Feature Flags
USE_LLM_FALLBACK=true
EOL

echo "✅ .env file created successfully at: $SCRIPT_DIR/.env"
echo ""
echo "📋 Configuration:"
echo "   - API Key: sk-proj-d063HlAk...hjTwA (configured)"
echo "   - Port: 3000"
echo "   - CORS: https://beastmodz.github.io"
echo "   - Embedding Model: text-embedding-3-small"
echo "   - LLM Model: gpt-4o-mini"
echo ""
echo "🔐 Security: .env file has been created with proper settings"
echo ""
echo "Next steps:"
echo "  1. pm2 restart quiz-grader"
echo "  2. pm2 logs quiz-grader"
echo "  3. curl http://localhost:3000/health"
