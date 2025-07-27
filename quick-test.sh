#!/bin/bash

echo "🧙 Muggleout 빠른 테스트 환경"
echo ""

# Node.js가 있는 환경으로 바로 시작
docker run -it --rm \
  -v "$(pwd)":/app \
  -w /app \
  node:20-slim \
  bash -c "
    echo '📦 Installing muggleout locally...'
    npm install
    npm link
    
    echo ''
    echo '✅ Ready to test!'
    echo 'Try these commands:'
    echo '  muggleout'
    echo '  muggleout status'
    echo '  muggleout install git'
    echo ''
    
    bash
  "