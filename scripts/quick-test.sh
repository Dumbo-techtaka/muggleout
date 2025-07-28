#!/bin/bash

# 빠른 로컬 테스트 스크립트
# 사용법: ./scripts/quick-test.sh

echo "🧪 Muggleout 빠른 테스트 시작..."
echo "================================"

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 테스트 성공/실패 카운터
PASSED=0
FAILED=0

# 테스트 함수
test_command() {
    local name=$1
    local command=$2
    local timeout=${3:-5}
    
    echo -n "테스트: $name ... "
    
    if timeout $timeout bash -c "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC}"
        ((FAILED++))
    fi
}

# 현재 디렉토리 저장
ORIGINAL_DIR=$(pwd)

# 프로젝트 루트로 이동
cd "$(dirname "$0")/.." || exit 1

echo "1️⃣  필수 명령어 테스트"
echo "------------------------"
test_command "버전 확인" "node bin/muggleout.js --version"
test_command "도움말" "node bin/muggleout.js --help"
test_command "시스템 진단" "node bin/muggleout.js doctor"
test_command "상태 확인" "node bin/muggleout.js status"

echo -e "\n2️⃣  에러 처리 테스트"
echo "------------------------"
test_command "잘못된 명령어" "! node bin/muggleout.js invalid-command 2>&1 | grep -q 'Error'"
test_command "존재하지 않는 도구" "! node bin/muggleout.js install not-exist 2>&1 | grep -q 'Error'"

echo -e "\n3️⃣  자연어 인식 테스트"
echo "------------------------"
test_command "영어 help" "node bin/muggleout.js help"
test_command "한국어 도움말" "node bin/muggleout.js 도움말 2>&1 | grep -q '도움말'"

echo -e "\n4️⃣  기본 기능 테스트"
echo "------------------------"
test_command "업데이트 체크" "node bin/muggleout.js update --check" 10

# 결과 요약
echo -e "\n================================"
echo "📊 테스트 결과"
echo "================================"
echo -e "통과: ${GREEN}$PASSED${NC}"
echo -e "실패: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✅ 모든 테스트 통과!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ 일부 테스트 실패${NC}"
    echo -e "${YELLOW}💡 'npm test'로 상세 테스트를 실행하세요${NC}"
    exit 1
fi

# 원래 디렉토리로 복귀
cd "$ORIGINAL_DIR" || exit 1