#!/bin/bash

# 🚀 Dev Setup CLI 원클릭 설치 스크립트
# 사용법: curl -fsSL https://example.com/quick-install.sh | bash

set -e

echo "🚀 Dev Setup CLI 설치를 시작합니다..."
echo "비개발자를 위한 개발 환경 설정 도구"
echo ""

# macOS 확인
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ 이 도구는 macOS에서만 작동합니다."
    exit 1
fi

# Homebrew 설치 (없으면)
if ! command -v brew &> /dev/null; then
    echo "📦 Homebrew 설치 중..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Apple Silicon Mac의 경우 PATH 설정
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi

# Node.js 설치 (없으면)
if ! command -v node &> /dev/null; then
    echo "📦 Node.js 설치 중..."
    brew install node
fi

# dev-setup-cli 설치
echo "📦 dev-setup-cli 설치 중..."
npm install -g dev-setup-cli

echo ""
echo "✅ 설치 완료!"
echo ""
echo "이제 터미널에서 'dev-setup'을 입력하세요!"
echo ""
echo "사용 예시:"
echo "  dev-setup                    # 메뉴 모드"
echo "  dev-setup 터미널 예쁘게      # 터미널 꾸미기"
echo "  dev-setup status            # 설치 상태 확인"