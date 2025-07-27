#!/bin/bash

# 🧪 Homebrew 설치 테스트 스크립트 (Docker용)

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🍺 Homebrew 설치 테스트 (Docker)      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# 환경 확인
echo -e "${YELLOW}📋 현재 환경:${NC}"
echo "• OS: $(uname -s)"
echo "• Arch: $(uname -m)"
echo "• User: $(whoami)"
echo ""

# Homebrew on Linux 주의사항
if [[ "$(uname -s)" == "Linux" ]]; then
    echo -e "${YELLOW}⚠️  Linux에서 Homebrew 설치 시 주의사항:${NC}"
    echo "• 설치 시간이 더 오래 걸립니다 (5-10분)"
    echo "• 일부 formula는 Linux를 지원하지 않을 수 있습니다"
    echo "• /home/linuxbrew/.linuxbrew에 설치됩니다"
    echo ""
fi

# 설치 확인
echo -e "${BLUE}Homebrew 설치를 시작하시겠습니까? [Y/n]:${NC} \c"
read -r response
case "$response" in
    [nN][oO]|[nN])
        echo -e "${RED}설치가 취소되었습니다.${NC}"
        exit 0
        ;;
esac

# 실제 설치 (진행 상황 표시)
echo ""
echo -e "${YELLOW}📥 설치 스크립트 다운로드 중...${NC}"

if curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh -o /tmp/install_brew.sh; then
    echo -e "${GREEN}✅ 다운로드 완료!${NC}"
    echo ""
    
    # 스크립트 내용 미리보기
    echo -e "${YELLOW}📄 설치 스크립트 정보:${NC}"
    echo "• 크기: $(wc -c < /tmp/install_brew.sh) bytes"
    echo "• 첫 줄: $(head -n1 /tmp/install_brew.sh)"
    echo ""
    
    echo -e "${BLUE}🚀 설치를 시작합니다...${NC}"
    echo -e "${YELLOW}⏱️  예상 시간:${NC}"
    echo "• macOS: 2-5분"
    echo "• Linux: 5-10분"
    echo ""
    echo -e "${YELLOW}설치 중 나타나는 메시지들:${NC}"
    echo "• '==> Checking for sudo access' - 권한 확인"
    echo "• '==> Installing Homebrew...' - 실제 설치 진행"
    echo "• '==> Downloading and installing Homebrew...' - 파일 다운로드"
    echo ""
    
    # 실제 설치 실행
    CI=1 /bin/bash /tmp/install_brew.sh
    
    # 설치 결과 확인
    if [[ "$(uname -s)" == "Linux" ]]; then
        if [ -d "/home/linuxbrew/.linuxbrew" ]; then
            echo -e "${GREEN}✅ Homebrew가 설치되었습니다!${NC}"
            echo ""
            echo -e "${YELLOW}📌 PATH 설정이 필요합니다:${NC}"
            echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"'
        else
            echo -e "${RED}❌ 설치가 실패했을 수 있습니다.${NC}"
        fi
    else
        if command -v brew &> /dev/null || [ -f "/usr/local/bin/brew" ] || [ -f "/opt/homebrew/bin/brew" ]; then
            echo -e "${GREEN}✅ Homebrew가 설치되었습니다!${NC}"
        else
            echo -e "${RED}❌ 설치가 실패했을 수 있습니다.${NC}"
        fi
    fi
    
    rm -f /tmp/install_brew.sh
else
    echo -e "${RED}❌ 설치 스크립트 다운로드 실패${NC}"
    echo "• 인터넷 연결을 확인하세요"
    echo "• https://brew.sh 에 접속 가능한지 확인하세요"
    exit 1
fi