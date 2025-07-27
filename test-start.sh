#!/bin/bash

# 🧪 초보자 환경 테스트 스크립트
# Docker Alpine Linux에서 실행 가능

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 Dev Setup CLI 설치 시뮬레이터      ║${NC}"
echo -e "${BLUE}║         초보자 환경 테스트 모드           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# 현재 상태 확인
echo -e "${YELLOW}📋 현재 시스템 상태 확인 중...${NC}"
sleep 1

# Node.js 체크
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js: 설치됨 ($(node -v))${NC}"
    NODE_INSTALLED=true
else
    echo -e "${RED}❌ Node.js: 미설치${NC}"
    NODE_INSTALLED=false
fi

# npm 체크
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅ npm: 설치됨 ($(npm -v))${NC}"
    NPM_INSTALLED=true
else
    echo -e "${RED}❌ npm: 미설치${NC}"
    NPM_INSTALLED=false
fi

# Homebrew 체크 (가짜)
if command -v brew &> /dev/null; then
    echo -e "${GREEN}✅ Homebrew: 설치됨${NC}"
    BREW_INSTALLED=true
else
    echo -e "${RED}❌ Homebrew: 미설치${NC}"
    BREW_INSTALLED=false
fi

echo ""

# 설치 필요 여부 확인
if [ "$NODE_INSTALLED" = true ] && [ "$NPM_INSTALLED" = true ]; then
    echo -e "${GREEN}🎉 모든 필수 도구가 이미 설치되어 있습니다!${NC}"
    echo -e "${BLUE}dev-setup을 바로 실행할 수 있습니다.${NC}"
    
    # dev-setup 체크
    if command -v dev-setup &> /dev/null; then
        echo ""
        echo -e "${YELLOW}3초 후 dev-setup을 실행합니다...${NC}"
        for i in 3 2 1; do
            echo -e "${BLUE}$i...${NC}"
            sleep 1
        done
        echo -e "${GREEN}🚀 dev-setup 실행!${NC}"
        dev-setup
    else
        echo -e "${YELLOW}dev-setup이 아직 설치되지 않았습니다.${NC}"
        echo -e "${BLUE}npm install -g dev-setup-cli${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  설치가 필요한 도구가 있습니다.${NC}"
    echo ""
    
    # Homebrew 설치 시뮬레이션
    if [ "$BREW_INSTALLED" = false ]; then
        echo -e "${BLUE}1️⃣ Homebrew 설치를 시뮬레이션합니다...${NC}"
        echo -e "${YELLOW}실제 명령어:${NC}"
        echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
        echo ""
        sleep 2
        echo -e "${GREEN}✅ Homebrew 설치 완료! (시뮬레이션)${NC}"
        echo ""
    fi
    
    # Node.js 설치 시뮬레이션
    if [ "$NODE_INSTALLED" = false ]; then
        echo -e "${BLUE}2️⃣ Node.js 설치를 시뮬레이션합니다...${NC}"
        echo -e "${YELLOW}실제 명령어:${NC}"
        echo "brew install node"
        echo ""
        sleep 2
        echo -e "${GREEN}✅ Node.js 설치 완료! (시뮬레이션)${NC}"
        echo ""
    fi
    
    # dev-setup 설치 시뮬레이션
    echo -e "${BLUE}3️⃣ dev-setup-cli 설치를 시뮬레이션합니다...${NC}"
    echo -e "${YELLOW}실제 명령어:${NC}"
    echo "npm install -g dev-setup-cli"
    echo ""
    sleep 2
    echo -e "${GREEN}✅ dev-setup-cli 설치 완료! (시뮬레이션)${NC}"
    echo ""
    
    echo -e "${GREEN}🎉 모든 설치가 완료되었습니다! (시뮬레이션)${NC}"
    echo ""
    echo -e "${BLUE}실제 환경에서는 이제 dev-setup을 실행할 수 있습니다!${NC}"
    echo -e "${YELLOW}명령어: dev-setup${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${YELLOW}💡 실제 macOS에서는 이 한 줄이면 됩니다:${NC}"
echo 'sh -c "$(curl -fsSL https://example.com/start.sh)"'
echo -e "${BLUE}═══════════════════════════════════════════${NC}"