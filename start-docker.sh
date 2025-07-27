#!/bin/bash

# 🚀 Docker 테스트 환경용 설치 스크립트
# Alpine Linux에서 실행 가능하도록 수정

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# 로고 출력
print_logo() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════╗"
    echo "║     🚀 Dev Setup CLI 설치 테스트     ║"
    echo "║   초보자 환경 시뮬레이션             ║"
    echo "╚══════════════════════════════════════╝"
    echo -e "${NC}\n"
}

# 명령어 존재 확인
check_command() {
    if command -v $1 &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# 메인 설치 프로세스
main() {
    clear
    print_logo
    
    echo -e "${YELLOW}⚠️  이것은 테스트 환경입니다.${NC}"
    echo -e "${BLUE}실제 macOS에서는 더 쉽게 설치됩니다!${NC}\n"
    
    # Node.js 확인
    if check_command "node"; then
        echo -e "${GREEN}✅ Node.js가 이미 설치되어 있습니다! $(node -v)${NC}"
    else
        echo -e "${RED}❌ Node.js가 설치되어 있지 않습니다.${NC}"
        echo -e "${YELLOW}실제 환경에서는 다음과 같이 설치합니다:${NC}\n"
        
        echo "1. Homebrew 설치:"
        echo '   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
        echo ""
        echo "2. Node.js 설치:"
        echo "   brew install node"
        echo ""
        echo "3. dev-setup 설치:"
        echo "   npm install -g dev-setup-cli"
        echo ""
        
        # 시뮬레이션
        echo -e "${BLUE}📦 설치를 시뮬레이션합니다...${NC}"
        sleep 2
        
        # 가짜 Node.js 생성
        echo -e "${YELLOW}Node.js 설치 중... (시뮬레이션)${NC}"
        sudo sh -c 'echo "#!/bin/sh\necho \"v20.11.0\"" > /usr/local/bin/node && chmod +x /usr/local/bin/node'
        sudo sh -c 'echo "#!/bin/sh\necho \"10.2.4\"" > /usr/local/bin/npm && chmod +x /usr/local/bin/npm'
        sleep 1
        echo -e "${GREEN}✅ Node.js 설치 완료! (시뮬레이션)${NC}\n"
        
        # 가짜 dev-setup 생성
        echo -e "${YELLOW}dev-setup-cli 설치 중... (시뮬레이션)${NC}"
        sudo sh -c 'cat > /usr/local/bin/dev-setup << EOF
#!/bin/sh
echo "🚀 Dev Setup CLI (시뮬레이션 모드)"
echo ""
echo "실제 환경에서는 다음 기능을 사용할 수 있습니다:"
echo "  • 터미널 꾸미기"
echo "  • 개발 도구 설치"
echo "  • AI 도구 설정"
echo "  • 문제 해결"
echo ""
echo "지금은 테스트 환경이므로 실제 설치는 진행되지 않습니다."
EOF
chmod +x /usr/local/bin/dev-setup'
        sleep 1
        echo -e "${GREEN}✅ dev-setup-cli 설치 완료! (시뮬레이션)${NC}\n"
    fi
    
    # 완료 메시지
    echo -e "${GREEN}🎉 설치 시뮬레이션이 완료되었습니다!${NC}\n"
    
    echo -e "${BLUE}이제 다음 명령어를 실행해보세요:${NC}"
    echo "  dev-setup"
    echo ""
    echo -e "${YELLOW}💡 실제 macOS에서는 다음 한 줄이면 됩니다:${NC}"
    echo 'sh -c "$(curl -fsSL https://example.com/start.sh)"'
}

# 스크립트 실행
main