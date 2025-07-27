# 🧪 Dev Setup CLI 수동 테스트 가이드

## 🚀 빠른 시작

```bash
# 1. Docker 컨테이너 시작
docker-compose up -d test-clean

# 2. 컨테이너 접속
docker-compose exec test-clean bash

# 3. 이제 테스트할 수 있습니다!
dev-setup
```

## 📋 테스트 시나리오

### 1️⃣ 기본 명령어 테스트

```bash
# 버전 확인
dev-setup --version

# 도움말
dev-setup --help

# 상태 확인
dev-setup status

# 시스템 진단
dev-setup doctor
```

### 2️⃣ 자연어 명령 테스트

```bash
# 터미널 꾸미기
dev-setup 터미널 예쁘게 만들어줘

# 도구 설치
dev-setup claude code 설치해줘

# 문제 해결
dev-setup brew command not found 고쳐줘

# 도움 요청
dev-setup 도와줘
```

### 3️⃣ 대화형 모드 테스트

```bash
# 메인 메뉴
dev-setup

# 각 메뉴 테스트:
# 1. 터미널 꾸미기 선택
# 2. 개발 도구 설치 선택
# 3. AI 도구 설정 선택
# 4. 문제 해결 선택
# 5. 설치 상태 확인 선택
# 6. 문서 보기 선택
# 7. 종료 선택
```

### 4️⃣ 직접 명령어 테스트

```bash
# 특정 도구 설치
dev-setup install homebrew
dev-setup install node
dev-setup install claude-code

# 문제 해결
dev-setup fix command-not-found
dev-setup fix permission-denied
```

### 5️⃣ 에러 처리 테스트

```bash
# 잘못된 명령
dev-setup install unknown-tool

# 지원하지 않는 자연어
dev-setup 이상한 명령어 아무거나

# 네트워크 끊김 시뮬레이션 (컨테이너 내에서)
# 1. 네트워크 끊기: sudo ifconfig eth0 down
# 2. 설치 시도: dev-setup install node
# 3. 네트워크 복구: sudo ifconfig eth0 up
```

## 🔍 확인 사항

### ✅ UI/UX
- [ ] 색상이 제대로 표시되는가?
- [ ] 이모지가 깨지지 않는가?
- [ ] 진행 표시(spinner)가 작동하는가?
- [ ] 메뉴 선택이 부드러운가?

### ✅ 기능
- [ ] 자연어 파싱이 정확한가?
- [ ] 의존성 체크가 작동하는가?
- [ ] 이미 설치된 도구를 감지하는가?
- [ ] 에러 메시지가 친절한가?

### ✅ 안정성
- [ ] 잘못된 입력에도 크래시하지 않는가?
- [ ] Ctrl+C로 안전하게 종료되는가?
- [ ] 설정이 제대로 저장되는가?

## 🐛 디버깅

### 로그 확인
```bash
# 컨테이너 밖에서
docker-compose logs -f test-clean

# 컨테이너 안에서 디버그 모드
DEBUG=* dev-setup
```

### 설정 파일 위치
```bash
# 컨테이너 내부
cat ~/.config/configstore/dev-setup-cli.json
```

### 수동으로 Node.js 스크립트 실행
```bash
# 컨테이너 내부
cd /home/testuser/dev-setup-cli
node bin/dev-setup.js
```

## 🎯 특수 테스트

### Linux 환경 (실제 Homebrew)
```bash
# Homebrew가 설치된 컨테이너 사용
docker-compose up -d test-with-brew
docker-compose exec test-with-brew bash

# Homebrew 확인
brew --version

# 실제 패키지 설치 테스트
dev-setup install git
```

### 권한 테스트
```bash
# sudo 없이 실행
dev-setup install homebrew

# 권한 문제 해결 테스트
dev-setup fix permission-denied
```

## 📝 테스트 결과 기록

테스트 후 다음 사항을 기록해주세요:

1. **작동한 기능**: 
2. **발견한 버그**: 
3. **개선 제안**: 
4. **사용성 피드백**: 

## 🧹 정리

```bash
# 컨테이너 중지 및 삭제
docker-compose down

# 이미지도 삭제하려면
docker-compose down --rmi all
```

---

💡 **팁**: `docker-compose exec` 대신 `docker exec -it dev-setup-test-clean bash`를 사용해도 됩니다!