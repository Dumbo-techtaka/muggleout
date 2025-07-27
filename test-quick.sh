#!/bin/bash

# 빠른 테스트 스크립트
echo "🚀 Dev Setup CLI 빠른 테스트"

# 최소 이미지로 빌드
echo "📦 이미지 빌드 중... (처음만 오래 걸립니다)"
docker build -f Dockerfile.minimal -t dev-setup-test:minimal .

# 기본 테스트 실행
echo -e "\n✨ 기본 기능 테스트"
docker run --rm dev-setup-test:minimal dev-setup --version
docker run --rm dev-setup-test:minimal dev-setup --help | head -10

# 상태 확인
echo -e "\n📊 상태 확인"
docker run --rm dev-setup-test:minimal dev-setup status

# 대화형 테스트 (타임아웃 포함)
echo -e "\n💬 대화형 모드 테스트 (3초 후 자동 종료)"
echo -e "7\n" | docker run --rm -i dev-setup-test:minimal timeout 3 dev-setup || true

# 자연어 테스트
echo -e "\n🗣️ 자연어 인식 테스트"
docker run --rm dev-setup-test:minimal bash -c "echo '터미널 예쁘게' | head -1 | dev-setup"

echo -e "\n✅ 빠른 테스트 완료!"

# 대화형 환경 실행 옵션
echo -e "\n💡 대화형 환경을 원하시면:"
echo "docker run --rm -it dev-setup-test:minimal bash"