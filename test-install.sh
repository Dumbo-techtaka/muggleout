#!/bin/bash

# 🚀 실제 설치를 수행하는 테스트 스크립트
# Docker Alpine Linux에서 실행 가능

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 Dev Setup CLI 실제 설치 테스트     ║${NC}"
echo -e "${BLUE}║         초보자 환경에서 실제 설치         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# 현재 상태 확인
echo -e "${YELLOW}📋 현재 시스템 상태 확인 중...${NC}"

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

echo ""

# Node.js가 없으면 설치
if [ "$NODE_INSTALLED" = false ] || [ "$NPM_INSTALLED" = false ]; then
    echo -e "${YELLOW}⚠️  Node.js와 npm을 설치해야 합니다.${NC}"
    echo -e "${BLUE}Alpine Linux에서 Node.js를 설치합니다...${NC}"
    echo ""
    
    # Alpine Linux에서 Node.js 설치
    echo -e "${YELLOW}실행 명령: sudo apk add nodejs npm${NC}"
    if sudo apk add nodejs npm; then
        echo -e "${GREEN}✅ Node.js와 npm 설치 완료!${NC}"
        echo -e "${BLUE}  Node.js: $(node -v)${NC}"
        echo -e "${BLUE}  npm: $(npm -v)${NC}"
    else
        echo -e "${RED}❌ Node.js 설치 실패${NC}"
        exit 1
    fi
    echo ""
fi

# dev-setup-cli 설치
echo -e "${BLUE}📦 dev-setup-cli를 설치합니다...${NC}"

# 로컬 프로젝트에서 설치 (Docker 마운트된 경우)
if [ -d "/home/testuser/dev-setup-cli" ] && [ -f "/home/testuser/dev-setup-cli/package.json" ]; then
    echo -e "${YELLOW}로컬 프로젝트에서 설치합니다...${NC}"
    cd /home/testuser/dev-setup-cli
    
    # npm install
    echo -e "${YELLOW}의존성 설치 중...${NC}"
    npm install
    
    # 글로벌 설치
    echo -e "${YELLOW}글로벌 설치 중...${NC}"
    sudo npm install -g . --unsafe-perm
    
    if command -v dev-setup &> /dev/null; then
        echo -e "${GREEN}✅ dev-setup-cli 설치 완료!${NC}"
    else
        echo -e "${RED}❌ dev-setup-cli 설치 실패${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}npm 레지스트리에서 설치를 시도합니다...${NC}"
    echo -e "${BLUE}실행 명령: npm install -g dev-setup-cli${NC}"
    echo -e "${RED}⚠️  패키지가 npm에 배포되지 않았으므로 실패할 수 있습니다.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 설치가 완료되었습니다!${NC}"
echo ""

# dev-setup 실행
echo -e "${BLUE}이제 dev-setup을 실행할 수 있습니다:${NC}"
echo -e "${YELLOW}  dev-setup${NC}"
echo ""

# 자동 실행 옵션
echo -e "${BLUE}3초 후 자동으로 dev-setup을 실행합니다...${NC}"
echo -e "${YELLOW}(취소하려면 Ctrl+C를 누르세요)${NC}"
for i in 3 2 1; do
    echo -e "${BLUE}$i...${NC}"
    sleep 1
done

echo -e "${GREEN}🚀 dev-setup 실행!${NC}"
dev-setup