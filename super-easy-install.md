# 🚀 초보자를 위한 가장 쉬운 설치 방법

## 방법 1: Node.js 공식 사이트에서 다운로드 (가장 쉬움!)

1. **[nodejs.org](https://nodejs.org/ko)** 접속
2. **"LTS 다운로드"** 버튼 클릭
3. 다운로드된 파일 더블클릭
4. **"계속"** 버튼만 계속 클릭
5. 설치 완료!

### 설치 확인
터미널 열고:
```bash
node --version
npm --version
```

### dev-setup 설치
```bash
npm install -g dev-setup-cli
```

---

## 방법 2: 웹에서 바로 실행 (준비 중)

```bash
# Python3로 스크립트 다운로드 후 실행
curl -fsSL https://example.com/install.py | python3
```

이 스크립트가:
1. Node.js 설치 파일 자동 다운로드
2. 자동 설치
3. dev-setup-cli 설치

---

## 방법 3: Homebrew 사용 (개발자 추천)

```bash
# Homebrew 설치 (한 번만)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 설치
brew install node

# dev-setup 설치
npm install -g dev-setup-cli
```

---

## 🎯 정말 쉬운 원클릭 설치기 (개발 예정)

### macOS 앱으로 제공
1. DevSetup.app 다운로드
2. 더블클릭
3. "설치" 버튼 클릭
4. 완료!

### 기능:
- Node.js 자동 설치
- dev-setup-cli 자동 설치
- 터미널 자동 설정
- GUI로 모든 작업 처리