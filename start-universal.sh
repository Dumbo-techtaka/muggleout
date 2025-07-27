#!/bin/bash

# 🚀 Dev Setup CLI - 범용 자동 설치 스크립트
# macOS와 Linux(테스트 환경) 모두 지원

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

# OS 감지
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/alpine-release ]; then
            echo "alpine"
        elif [ -f /etc/debian_version ]; then
            echo "debian"
        else
            echo "linux"
        fi
    else
        echo "unknown"
    fi
}

# Homebrew 설치 (macOS/Linux)
install_homebrew() {
    echo -e "${YELLOW}📥 Homebrew 다운로드 중...${NC}"
    echo -e "${YELLOW}⏱️  예상 시간: macOS 2-5분, Linux 5-10분${NC}"
    echo -e "${YELLOW}⚠️  설치 중 비밀번호 입력이 필요할 수 있습니다.${NC}"
    echo -e "${BLUE}계속하시겠습니까? [Y/n]:${NC} \c"
    read -r response
    case "$response" in
        [nN][oO]|[nN])
            echo -e "${RED}❌ Homebrew 설치가 취소되었습니다.${NC}"
            return 1
            ;;
    esac
    
    # CI 환경 변수 설정으로 비대화형 설치
    export CI=1
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # PATH 설정
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if [[ $(uname -m) == "arm64" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        else
            echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/usr/local/bin/brew shellenv)"
        fi
    else
        # Linux
        echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
        eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    fi
}

# Node.js 설치
install_node() {
    local os_type=$1
    
    echo -e "${YELLOW}⚠️  Node.js 설치 중 관리자 권한이 필요할 수 있습니다.${NC}"
    echo -e "${BLUE}계속하시겠습니까? [Y/n]:${NC} \c"
    read -r response
    case "$response" in
        [nN][oO]|[nN])
            echo -e "${RED}❌ Node.js 설치가 취소되었습니다.${NC}"
            return 1
            ;;
    esac
    
    case "$os_type" in
        "alpine")
            echo -e "${BLUE}Alpine Linux에서 Node.js를 설치합니다...${NC}"
            sudo apk add nodejs npm
            ;;
        "debian")
            echo -e "${BLUE}Debian/Ubuntu에서 Node.js를 설치합니다...${NC}"
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
        *)
            # macOS 또는 Homebrew가 있는 Linux
            if command -v brew &> /dev/null; then
                echo -e "${BLUE}Homebrew로 Node.js를 설치합니다...${NC}"
                brew install node
            else
                echo -e "${RED}❌ Node.js 설치 방법을 찾을 수 없습니다.${NC}"
                return 1
            fi
            ;;
    esac
}

# 메인 설치 프로세스
main() {
    clear
    print_logo
    
    # OS 감지
    OS_TYPE=$(detect_os)
    echo -e "${YELLOW}🖥️  감지된 OS: $OS_TYPE${NC}\n"
    
    if [ "$OS_TYPE" == "unknown" ]; then
        echo -e "${RED}❌ 지원하지 않는 운영체제입니다.${NC}"
        exit 1
    fi
    
    # 테스트 환경 경고
    if [ "$OS_TYPE" != "macos" ]; then
        echo -e "${YELLOW}⚠️  테스트 환경에서 실행 중입니다.${NC}"
        echo -e "${YELLOW}   일부 기능이 제한될 수 있습니다.${NC}\n"
    fi
    
    # 설치 상태 확인
    NEED_INSTALL=false
    
    # 1. Homebrew 확인 (macOS와 일부 Linux)
    if [ "$OS_TYPE" == "macos" ] || [ "$OS_TYPE" == "debian" ]; then
        if ! check_installed "brew" "Homebrew"; then
            NEED_INSTALL=true
            show_progress "📦 Homebrew를 설치합니다..."
            if ! install_homebrew; then
                echo -e "${YELLOW}Homebrew 없이 계속 진행합니다...${NC}"
            fi
        fi
    fi
    
    # 2. Node.js 확인
    if ! check_installed "node" "Node.js"; then
        NEED_INSTALL=true
        show_progress "📦 Node.js를 설치합니다..."
        if ! install_node "$OS_TYPE"; then
            echo -e "${RED}Node.js 없이는 dev-setup을 설치할 수 없습니다.${NC}"
            exit 1
        fi
    fi
    
    # 3. dev-setup-cli 확인
    if ! check_installed "dev-setup" "dev-setup-cli"; then
        NEED_INSTALL=true
        show_progress "📦 dev-setup-cli를 설치합니다..."
        
        # 로컬 개발 환경 체크
        if [ -f "./package.json" ] && [ -d "./src" ]; then
            echo -e "${YELLOW}로컬 개발 환경에서 설치합니다...${NC}"
            npm install
            npm link
        else
            # npm 레지스트리에서 설치
            npm install -g dev-setup-cli || {
                echo -e "${YELLOW}npm 레지스트리에서 찾을 수 없습니다.${NC}"
                echo -e "${YELLOW}GitHub에서 직접 설치를 시도합니다...${NC}"
                npm install -g https://github.com/your-username/dev-setup-cli.git
            }
        fi
    fi
    
    # 설치 완료 메시지
    if [ "$NEED_INSTALL" = false ]; then
        echo -e "${GREEN}🎉 모든 도구가 이미 설치되어 있습니다!${NC}\n"
    else
        echo -e "${GREEN}🎉 모든 설치가 완료되었습니다!${NC}\n"
    fi
    
    # dev-setup 실행 여부 확인
    if [ "$OS_TYPE" == "macos" ]; then
        # macOS에서는 자동 실행
        echo -e "${BLUE}3초 후 자동으로 dev-setup을 실행합니다...${NC}"
        echo -e "${YELLOW}(취소하려면 Ctrl+C를 누르세요)${NC}\n"
        
        for i in 3 2 1; do
            echo -e "${BLUE}$i...${NC}"
            sleep 1
        done
        
        echo -e "${GREEN}🚀 dev-setup을 실행합니다!${NC}\n"
        exec dev-setup
    else
        # 테스트 환경에서는 수동 실행 안내
        echo -e "${BLUE}이제 다음 명령어로 dev-setup을 실행할 수 있습니다:${NC}"
        echo -e "${YELLOW}dev-setup${NC}"
    fi
}

# 스크립트 실행
main