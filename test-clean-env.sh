#!/bin/bash

# 깨끗한 테스트 환경 실행 스크립트

echo "🧙 Creating clean test environment..."

# Docker 실행
docker run -it --rm \
  -v "$(pwd)":/workspace \
  -w /workspace \
  ubuntu:22.04 \
  bash -c "
    echo '🧙 Welcome to Muggle Environment!'
    echo ''
    echo 'This is a clean Ubuntu without:'
    echo '  ❌ Node.js'
    echo '  ❌ npm'
    echo '  ❌ Homebrew'
    echo ''
    echo 'To test the installation process:'
    echo '1. Install Node.js:'
    echo '   apt update && apt install -y curl'
    echo '   curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -'
    echo '   apt install -y nodejs'
    echo ''
    echo '2. Install muggleout:'
    echo '   npm install -g muggleout'
    echo ''
    bash
  "