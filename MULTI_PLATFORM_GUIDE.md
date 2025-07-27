# 🚀 Multi-Platform Publishing Guide

## 📋 Overview

NPM에 한 번 배포하면 여러 패키지 매니저에서 자동으로 사용 가능합니다!

## 🔧 패키지 매니저별 설치 방법

### 1. NPM (기본)
```bash
npm install -g muggleout
```

### 2. Yarn
```bash
# Yarn 1.x (Classic)
yarn global add muggleout

# Yarn 2+ (Berry) - 전역 설치 다름
yarn dlx muggleout  # 일회성 실행
```

### 3. pnpm
```bash
pnpm add -g muggleout
```

### 4. Bun
```bash
bun add -g muggleout
```

## 🤖 GitHub Actions 설정

### 1. NPM Token 생성
1. https://www.npmjs.com 로그인
2. Account Settings → Access Tokens
3. "Generate New Token" → "Automation" 선택
4. 토큰 복사

### 2. GitHub Secret 추가
1. GitHub 저장소 → Settings → Secrets
2. "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: 복사한 토큰

### 3. 자동 배포 트리거
```bash
# Git 태그로 릴리스
git tag v1.0.0
git push origin v1.0.0

# 또는 GitHub Releases 페이지에서 직접 생성
```

## 📊 패키지 매니저 비교

| Feature | NPM | Yarn | pnpm | Bun |
|---------|-----|------|------|-----|
| 설치 속도 | 보통 | 빠름 | 매우 빠름 | 가장 빠름 |
| 디스크 사용 | 높음 | 보통 | 낮음 (심링크) | 낮음 |
| 호환성 | 100% | 99% | 99% | 95% |
| 전역 설치 | ✅ | ✅ | ✅ | ✅ |

## 🎯 배포 전략

### 1단계: NPM 수동 배포 (지금)
```bash
npm login
npm publish
```

### 2단계: 사용자 테스트
- 각 패키지 매니저로 설치 테스트
- 피드백 수집

### 3단계: GitHub Actions 설정 (나중에)
- 자동화된 배포
- 버전 태그 관리
- 릴리스 노트 자동 생성

## ⚠️ 주의사항

### 1. 버전 호환성
```json
{
  "engines": {
    "node": ">=16.0.0"  // 모든 패키지 매니저가 지원하는 버전
  }
}
```

### 2. 의존성 관리
- `package-lock.json` 커밋 필수
- peer dependencies 최소화
- 선택적 의존성 주의

### 3. 스크립트 호환성
```json
{
  "scripts": {
    "postinstall": "echo Thanks for installing!"  // 모든 매니저에서 작동
  }
}
```

## 📈 성공 지표

### 설치 통계 확인
```bash
# NPM
npm info muggleout

# 웹에서 확인
https://www.npmjs.com/package/muggleout
https://npmtrends.com/muggleout
```

### 패키지 매니저별 사용률
- NPM: 60-70%
- Yarn: 20-25%
- pnpm: 5-10%
- Bun: 1-5%

## 🔍 트러블슈팅

### Yarn 2+ 전역 설치 문제
```bash
# 해결책: .yarnrc.yml 설정
echo 'nodeLinker: node-modules' > ~/.yarnrc.yml
```

### pnpm 권한 문제
```bash
# 해결책: 전역 bin 경로 설정
pnpm setup
source ~/.bashrc
```

### Bun 호환성
```bash
# 최신 버전 확인
bun upgrade
```

## 🎉 결론

**NPM에만 배포해도 충분합니다!**

모든 주요 패키지 매니저가 NPM registry를 사용하므로,
한 번의 배포로 모든 사용자를 지원할 수 있습니다.

GitHub Actions는 나중에 설정해도 늦지 않아요! 🚀