#!/bin/bash

# 🚀 Dev Setup CLI - 완전 자동 설치 및 실행 스크립트
# 사용법: sh -c "$(curl -fsSL https://example.com/start.sh)"

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
    echo "║     🚀 Dev Setup CLI 자동 설치기     ║"
    echo "║   비개발자를 위한 개발 환경 설정     ║"
    echo "╚══════════════════════════════════════╝"
    echo -e "${NC}\n"
}

# 진행 상황 표시
show_progress() {
    echo -e "${BLUE}$1${NC}"
    sleep 0.5
}

# 설치 확인 함수
check_installed() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $2가 이미 설치되어 있습니다${NC}"
        return 0
    else
        return 1
    fi
}

# 메인 설치 프로세스
main() {
    clear
    print_logo
    
    # macOS 확인
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo -e "${RED}❌ 이 도구는 macOS에서만 작동합니다.${NC}"
        exit 1
    fi
    
    # 설치 상태 확인
    NEED_INSTALL=false
    
    # 1. Homebrew 확인
    if ! check_installed "brew" "Homebrew"; then
        NEED_INSTALL=true
        show_progress "📦 Homebrew를 설치합니다..."
        echo -e "${YELLOW}⚠️  Homebrew 설치 중 비밀번호 입력이 필요할 수 있습니다.${NC}"
        echo -e "${BLUE}계속하시겠습니까? [Y/n]:${NC} \c"
        read -r brew_response
        case "$brew_response" in
            [nN][oO]|[nN])
                echo -e "${RED}❌ Homebrew 설치가 취소되었습니다.${NC}"
                echo -e "${YELLOW}Homebrew 없이는 다음 단계를 진행할 수 없습니다.${NC}"
                exit 1
                ;;
            *)
                echo -e "${YELLOW}📥 Homebrew 다운로드 중...${NC}"
                echo -e "${YELLOW}⏱️  약 2-5분 정도 소요됩니다. 잠시만 기다려주세요...${NC}"
                echo ""
                
                # 진행 상황을 보여주며 설치
                if curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh -o /tmp/install_brew.sh; then
                    echo -e "${GREEN}✅ 다운로드 완료! 설치를 시작합니다...${NC}"
                    echo -e "${YELLOW}📦 필요한 도구들을 설치하는 중... (Xcode Command Line Tools 등)${NC}"
                    echo ""
                    /bin/bash /tmp/install_brew.sh
                    rm -f /tmp/install_brew.sh
                else
                    echo -e "${RED}❌ Homebrew 다운로드 실패${NC}"
                    exit 1
                fi
                
                # Apple Silicon Mac PATH 설정
                if [[ $(uname -m) == "arm64" ]]; then
                    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
                    eval "$(/opt/homebrew/bin/brew shellenv)"
                fi
                echo -e "${GREEN}✅ Homebrew 설치 완료${NC}\n"
                ;;
        esac
    fi
    
    # 2. Node.js 확인
    if ! check_installed "node" "Node.js"; then
        NEED_INSTALL=true
        show_progress "📦 Node.js를 설치합니다..."
        echo -e "${YELLOW}⚠️  Node.js 설치 중 관리자 권한이 필요할 수 있습니다.${NC}"
        echo -e "${BLUE}계속하시겠습니까? [Y/n]:${NC} \c"
        read -r node_response
        case "$node_response" in
            [nN][oO]|[nN])
                echo -e "${RED}❌ Node.js 설치가 취소되었습니다.${NC}"
                echo -e "${YELLOW}Node.js 없이는 dev-setup을 설치할 수 없습니다.${NC}"
                exit 1
                ;;
            *)
                brew install node
                echo -e "${GREEN}✅ Node.js 설치 완료${NC}\n"
                ;;
        esac
    fi
    
    # 3. dev-setup-cli 확인
    if ! check_installed "dev-setup" "dev-setup-cli"; then
        NEED_INSTALL=true
        show_progress "📦 dev-setup-cli를 설치합니다..."
        echo -e "${YELLOW}⚠️  전역 패키지 설치 시 권한이 필요할 수 있습니다.${NC}"
        echo -e "${BLUE}계속하시겠습니까? [Y/n]:${NC} \c"
        read -r devsetup_response
        case "$devsetup_response" in
            [nN][oO]|[nN])
                echo -e "${RED}❌ dev-setup-cli 설치가 취소되었습니다.${NC}"
                echo -e "${YELLOW}나중에 다음 명령어로 설치할 수 있습니다:${NC}"
                echo -e "${BLUE}npm install -g dev-setup-cli${NC}"
                exit 0
                ;;
            *)
                npm install -g dev-setup-cli || {
                    # 실패 시 로컬 설치
                    echo -e "${YELLOW}로컬 설치를 시도합니다...${NC}"
                    mkdir -p ~/.dev-setup-cli
                    cd ~/.dev-setup-cli
                    curl -fsSL https://github.com/[username]/dev-setup-cli/archive/main.tar.gz | tar xz --strip-components=1
                    npm install
                    npm link
                }
                echo -e "${GREEN}✅ dev-setup-cli 설치 완료${NC}\n"
                ;;
        esac
    fi
    
    # 설치 완료 메시지
    if [ "$NEED_INSTALL" = false ]; then
        echo -e "${GREEN}🎉 모든 도구가 이미 설치되어 있습니다!${NC}\n"
    else
        echo -e "${GREEN}🎉 모든 설치가 완료되었습니다!${NC}\n"
    fi
    
    # 자동으로 dev-setup 실행
    echo -e "${BLUE}3초 후 자동으로 dev-setup을 실행합니다...${NC}"
    echo -e "${YELLOW}(취소하려면 Ctrl+C를 누르세요)${NC}\n"
    
    for i in 3 2 1; do
        echo -e "${BLUE}$i...${NC}"
        sleep 1
    done
    
    echo -e "${GREEN}🚀 dev-setup을 실행합니다!${NC}\n"
    
    # PATH 새로고침
    export PATH="/usr/local/bin:$PATH"
    if [[ $(uname -m) == "arm64" ]]; then
        export PATH="/opt/homebrew/bin:$PATH"
    fi
    
    # dev-setup 실행
    exec dev-setup
}

# sudo 권한 확인 함수
check_sudo() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${YELLOW}⚠️  일부 작업에 관리자 권한이 필요합니다.${NC}"
        echo -e "${BLUE}설치를 계속하시겠습니까? (설치 중 비밀번호를 입력해야 할 수 있습니다)${NC}"
        echo -e "${YELLOW}[Y/n]:${NC} \c"
        read -r response
        case "$response" in
            [nN][oO]|[nN])
                echo -e "${RED}설치가 취소되었습니다.${NC}"
                echo -e "${YELLOW}💡 팁: 나중에 다시 시도하려면 이 스크립트를 다시 실행하세요.${NC}"
                exit 0
                ;;
            *)
                echo -e "${GREEN}✅ 설치를 계속합니다...${NC}"
                ;;
        esac
    fi
}

# 스크립트 실행
check_sudo
main