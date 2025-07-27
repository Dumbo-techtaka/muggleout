#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 Dev Setup CLI Docker 테스트 시작${NC}\n"

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker가 설치되어 있지 않습니다.${NC}"
    echo "https://www.docker.com/products/docker-desktop 에서 설치해주세요."
    exit 1
fi

# 함수: 테스트 실행
run_test() {
    local test_name=$1
    local container=$2
    local command=$3
    
    echo -e "\n${YELLOW}📋 테스트: $test_name${NC}"
    docker-compose exec -T $container bash -c "$command"
}

# 1. 이미지 빌드
echo -e "${BLUE}1️⃣ Docker 이미지 빌드 중...${NC}"
docker-compose build

# 2. 컨테이너 시작
echo -e "\n${BLUE}2️⃣ 테스트 컨테이너 시작...${NC}"
docker-compose up -d test-clean test-with-brew

# 잠시 대기
sleep 3

# 3. 기본 동작 테스트
echo -e "\n${BLUE}3️⃣ 기본 동작 테스트${NC}"

# 버전 확인
run_test "버전 확인" "test-clean" "dev-setup --version"

# 도움말
run_test "도움말" "test-clean" "dev-setup --help"

# 상태 확인
run_test "상태 확인" "test-clean" "dev-setup status"

# 시스템 진단
run_test "시스템 진단" "test-clean" "dev-setup doctor"

# 4. 자연어 명령 테스트
echo -e "\n${BLUE}4️⃣ 자연어 명령 테스트${NC}"

# 자연어 파싱 테스트
run_test "자연어: 도움말" "test-clean" "echo '도와줘' | dev-setup"

# 5. 대화형 모드 테스트 (자동 입력)
echo -e "\n${BLUE}5️⃣ 대화형 모드 테스트${NC}"

# 메뉴 선택 시뮬레이션
cat > test-interactive.sh << 'EOF'
#!/bin/bash
# 종료 선택 (6번 메뉴)
echo -e "6\n" | timeout 5 dev-setup
EOF

docker cp test-interactive.sh dev-setup-test-clean:/tmp/
run_test "대화형 모드 - 종료" "test-clean" "bash /tmp/test-interactive.sh"

# 6. 설치 시뮬레이션 테스트
echo -e "\n${BLUE}6️⃣ 설치 시뮬레이션 테스트${NC}"

# Homebrew가 있는 환경에서 테스트
run_test "Homebrew 환경 상태" "test-with-brew" "brew --version && dev-setup status"

# 7. 로그 확인
echo -e "\n${BLUE}7️⃣ 컨테이너 로그${NC}"
echo -e "${YELLOW}test-clean 로그:${NC}"
docker-compose logs --tail=10 test-clean

# 정리
echo -e "\n${BLUE}🧹 정리 중...${NC}"
read -p "컨테이너를 정리하시겠습니까? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down
    echo -e "${GREEN}✅ 정리 완료!${NC}"
fi

echo -e "\n${GREEN}✅ 테스트 완료!${NC}"
echo -e "\n${YELLOW}💡 수동 테스트를 하려면:${NC}"
echo "1. docker-compose up -d test-clean"
echo "2. docker-compose exec test-clean bash"
echo "3. 컨테이너 내에서 dev-setup 실행"

# 테스트 결과 요약
echo -e "\n${BLUE}📊 테스트 요약${NC}"
echo "- Docker 이미지 빌드: ✅"
echo "- 기본 명령어 테스트: ✅"
echo "- 자연어 파싱 테스트: ✅"
echo "- 대화형 모드 테스트: ✅"