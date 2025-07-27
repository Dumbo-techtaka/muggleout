#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Dev Setup CLI 환경별 테스트${NC}\n"

# 함수: 컨테이너에서 명령 실행
run_in_container() {
    local container=$1
    local command=$2
    docker-compose -f docker-compose.light.yml exec -T $container bash -c "$command"
}

# 1. 컨테이너 시작
echo -e "${YELLOW}1️⃣ 테스트 환경 준비 중...${NC}"
docker-compose -f docker-compose.light.yml up -d test-clean test-brew

# 잠시 대기
sleep 3

# 2. 클린 환경 테스트
echo -e "\n${BLUE}2️⃣ 클린 환경 테스트 (Homebrew 없음)${NC}"
echo -e "${YELLOW}상태 확인:${NC}"
run_in_container test-clean "dev-setup status | grep Homebrew"

echo -e "\n${YELLOW}Homebrew 설치 시뮬레이션:${NC}"
run_in_container test-clean "echo 'n' | dev-setup install homebrew || true"

echo -e "\n${YELLOW}Doctor 실행:${NC}"
run_in_container test-clean "dev-setup doctor | grep Homebrew"

# 3. Homebrew 환경 테스트
echo -e "\n${BLUE}3️⃣ Homebrew 환경 테스트${NC}"
echo -e "${YELLOW}Homebrew 확인:${NC}"
run_in_container test-brew "brew --version"

echo -e "\n${YELLOW}상태 확인:${NC}"
run_in_container test-brew "dev-setup status | grep Homebrew"

echo -e "\n${YELLOW}패키지 설치 시뮬레이션:${NC}"
run_in_container test-brew "echo 'git 설치' | dev-setup install git || true"

# 4. 비교 테스트
echo -e "\n${BLUE}4️⃣ 환경 비교${NC}"
echo -e "${YELLOW}클린 환경:${NC}"
run_in_container test-clean "which brew || echo 'brew not found'"

echo -e "\n${YELLOW}Homebrew 환경:${NC}"
run_in_container test-brew "which brew && brew list"

# 5. 정리
echo -e "\n${BLUE}5️⃣ 정리${NC}"
read -p "컨테이너를 정리하시겠습니까? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose -f docker-compose.light.yml down
    echo -e "${GREEN}✅ 정리 완료!${NC}"
fi

echo -e "\n${GREEN}✅ 환경별 테스트 완료!${NC}"
echo -e "\n${YELLOW}💡 수동 테스트:${NC}"
echo "# 클린 환경 접속"
echo "docker-compose -f docker-compose.light.yml exec test-clean bash"
echo ""
echo "# Homebrew 환경 접속"
echo "docker-compose -f docker-compose.light.yml exec test-brew bash"