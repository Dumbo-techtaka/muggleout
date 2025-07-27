#!/bin/bash

# 🚀 한 줄로 모든 것을 설치하는 스크립트
# 사용법: /bin/bash -c "$(curl -fsSL https://example.com/install)"

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Dev Setup CLI 원클릭 설치${NC}"
echo -e "${YELLOW}모든 개발 환경을 자동으로 설정합니다${NC}\n"

# 1. Homebrew 설치 (이미 있으면 스킵)
if ! command -v brew &> /dev/null; then
    echo -e "${BLUE}1️⃣ Homebrew 설치 중...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Apple Silicon Mac의 경우 PATH 설정
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    echo -e "${GREEN}✅ Homebrew 설치 완료${NC}\n"
else
    echo -e "${GREEN}✅ Homebrew가 이미 설치되어 있습니다${NC}\n"
fi

# 2. Node.js 설치 (이미 있으면 스킵)
if ! command -v node &> /dev/null; then
    echo -e "${BLUE}2️⃣ Node.js 설치 중...${NC}"
    brew install node
    echo -e "${GREEN}✅ Node.js 설치 완료${NC}\n"
else
    echo -e "${GREEN}✅ Node.js가 이미 설치되어 있습니다${NC}\n"
fi

# 3. dev-setup-cli 설치
echo -e "${BLUE}3️⃣ dev-setup-cli 설치 중...${NC}"
npm install -g dev-setup-cli || {
    # npm 전역 설치 실패 시 로컬 설치 시도
    echo -e "${YELLOW}전역 설치 실패. 로컬 설치를 시도합니다...${NC}"
    git clone https://github.com/[username]/dev-setup-cli.git ~/.dev-setup-cli
    cd ~/.dev-setup-cli
    npm install
    npm link
}

echo -e "\n${GREEN}🎉 모든 설치가 완료되었습니다!${NC}"
echo -e "\n${BLUE}이제 새 터미널을 열고 다음 명령어를 사용하세요:${NC}"
echo -e "  ${YELLOW}dev-setup${NC}              # 메뉴 모드"
echo -e "  ${YELLOW}dev-setup 터미널 예쁘게${NC}  # 터미널 꾸미기"
echo -e "  ${YELLOW}dev-setup status${NC}       # 설치 상태 확인"
echo -e "\n${GREEN}즐거운 개발 되세요! 🚀${NC}"