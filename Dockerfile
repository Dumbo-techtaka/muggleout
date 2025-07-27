# macOS 환경을 시뮬레이션하기 위한 Ubuntu 기반 이미지
FROM ubuntu:22.04

# 환경 변수 설정
ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=ko_KR.UTF-8
ENV LANGUAGE=ko_KR.UTF-8
ENV LC_ALL=ko_KR.UTF-8

# 기본 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    sudo \
    zsh \
    locales \
    software-properties-common \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 한글 로케일 설정
RUN locale-gen ko_KR.UTF-8

# Node.js 18 설치 (dev-setup-cli 실행을 위해)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# 테스트 사용자 생성 (sudo 권한 포함)
RUN useradd -m -s /bin/bash testuser && \
    echo "testuser:password" | chpasswd && \
    usermod -aG sudo testuser && \
    echo "testuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# 작업 디렉토리 설정
WORKDIR /home/testuser

# 프로젝트 파일 복사
COPY --chown=testuser:testuser . /home/testuser/dev-setup-cli/

# 사용자 전환
USER testuser

# 작업 디렉토리로 이동
WORKDIR /home/testuser/dev-setup-cli

# npm 의존성 설치
RUN npm install

# 전역으로 링크 (테스트용)
RUN npm link

# 기본 쉘을 bash로 설정
SHELL ["/bin/bash", "-c"]

# 테스트를 위한 가짜 macOS 명령어들 생성
RUN echo '#!/bin/bash\necho "ProductName:    macOS"\necho "ProductVersion: 13.0"' | sudo tee /usr/local/bin/sw_vers && \
    sudo chmod +x /usr/local/bin/sw_vers

# 컨테이너 실행 시 bash 실행
CMD ["/bin/bash"]