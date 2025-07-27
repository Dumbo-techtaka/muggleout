FROM ubuntu:22.04

# 최소한의 도구만 설치 (Node.js 없음!)
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    sudo \
    vim \
    && rm -rf /var/lib/apt/lists/*

# 일반 사용자 생성
RUN useradd -m -s /bin/bash muggle && \
    echo "muggle:muggle" | chpasswd && \
    usermod -aG sudo muggle

# 작업 디렉토리
WORKDIR /workspace

# README 복사
COPY README.md ./

# 환경 안내 스크립트
RUN echo '#!/bin/bash' > /usr/local/bin/welcome && \
    echo 'echo "🧙 Wizardify - Muggle Environment"' >> /usr/local/bin/welcome && \
    echo 'echo ""' >> /usr/local/bin/welcome && \
    echo 'echo "This is a clean environment without:"' >> /usr/local/bin/welcome && \
    echo 'echo "  ❌ Node.js"' >> /usr/local/bin/welcome && \
    echo 'echo "  ❌ npm"' >> /usr/local/bin/welcome && \
    echo 'echo "  ❌ Oh My Zsh"' >> /usr/local/bin/welcome && \
    echo 'echo ""' >> /usr/local/bin/welcome && \
    echo 'echo "To install Node.js:"' >> /usr/local/bin/welcome && \
    echo 'echo "  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"' >> /usr/local/bin/welcome && \
    echo 'echo "  sudo apt-get install -y nodejs"' >> /usr/local/bin/welcome && \
    echo 'echo ""' >> /usr/local/bin/welcome && \
    echo 'echo "Then install wizardify:"' >> /usr/local/bin/welcome && \
    echo 'echo "  npm install -g wizardify"' >> /usr/local/bin/welcome && \
    chmod +x /usr/local/bin/welcome

# 시작 시 환영 메시지
RUN echo "/usr/local/bin/welcome" >> /home/muggle/.bashrc

USER muggle