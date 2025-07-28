# 🌲 Muggleout 브랜치 전략 및 테스트 가이드

## 📋 브랜치 구조

```
main (배포)
  ↑
release/v1.2.0 (배포 준비)
  ↑
develop (개발)
  ↑
feature/브랜치명 (기능 개발)
```

## 🔄 워크플로우

### 1. 기능 개발
```bash
# develop에서 새 기능 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/awesome-feature

# 개발 작업...
git add .
git commit -m "feat: 멋진 기능 추가"
git push origin feature/awesome-feature

# PR 생성 → develop 브랜치로
```

### 2. 릴리즈 준비
```bash
# develop에서 release 브랜치 생성
git checkout develop
git checkout -b release/v1.2.0

# 버전 업데이트
npm version minor  # or patch, major

# CHANGELOG 업데이트
# 수동으로 CHANGELOG.md 편집

git add .
git commit -m "chore: v1.2.0 릴리즈 준비"
git push origin release/v1.2.0
```

### 3. 릴리즈 테스트
release 브랜치에 푸시하면 자동으로 실행되는 테스트:

#### 🤖 자동 테스트 (GitHub Actions)
- **플랫폼 테스트**: Ubuntu, macOS, Windows
- **Node 버전**: 16, 18, 20
- **설치 시뮬레이션**: npm install 테스트
- **성능 측정**: 시작 시간, 메모리 사용량
- **번들 크기**: 패키지 크기 확인

#### 🧪 수동 테스트 체크리스트
```bash
# 1. 로컬에서 최종 테스트
git checkout release/v1.2.0
npm ci
npm test
npm run pre-release-check

# 2. 설치 테스트
npm pack
npm install -g ./muggleout-*.tgz
muggleout --version
muggleout  # 실제 사용 테스트

# 3. 주요 기능 테스트 (3개 이상)
muggleout doctor
muggleout "터미널 예쁘게"
muggleout install homebrew  # 실제 설치는 X, 프로세스만 확인

# 4. 제거 테스트
npm uninstall -g muggleout
```

## 🚀 배포 프로세스

### 1. Release → Main PR
```bash
# GitHub에서 PR 생성
# release/v1.2.0 → main
# 제목: "Release v1.2.0"
```

### 2. PR 체크리스트
- [ ] 모든 자동 테스트 통과
- [ ] CHANGELOG.md 업데이트 확인
- [ ] package.json 버전 확인
- [ ] README.md 새 기능 반영
- [ ] Breaking changes 문서화

### 3. 머지 및 태그
```bash
# PR 승인 후 main에 머지
git checkout main
git pull origin main
git tag v1.2.0
git push origin v1.2.0
```

### 4. NPM 배포
```bash
# 태그 생성 시 자동 배포 (GitHub Actions)
# 또는 수동 배포
npm publish
```

## 📊 테스트 결과 확인

### GitHub Actions 탭에서 확인
1. **Actions** 탭 클릭
2. **워크플로우 선택**:
   - `Cross-Platform Test`: 모든 푸시/PR
   - `Release Branch Test`: release 브랜치만
   - `Release`: 태그 생성 시

### 테스트 실패 시
1. 실패한 job 클릭
2. 로그 확인
3. 로컬에서 재현:
   ```bash
   # Ubuntu 테스트 실패 시
   docker run -it ubuntu:latest
   # 테스트 환경 재현...
   ```

## 🔥 핫픽스

긴급 수정이 필요한 경우:

```bash
# main에서 직접 브랜치
git checkout main
git checkout -b hotfix/critical-bug

# 수정 작업...
git add .
git commit -m "fix: 치명적 버그 수정"

# main으로 바로 PR
# PR 머지 후 develop에도 반영
git checkout develop
git merge main
```

## 💡 팁

### 1. 병렬 테스트 활용
- release 브랜치에서는 모든 플랫폼이 병렬로 테스트됨
- 10분 내에 모든 결과 확인 가능

### 2. 로컬 테스트 먼저
```bash
# 푸시 전 로컬 테스트로 시간 절약
npm test
npm run pre-release-check
```

### 3. 테스트 건너뛰기 (긴급 시)
```bash
# 커밋 메시지에 추가 (권장하지 않음)
git commit -m "fix: 긴급 수정 [skip ci]"
```

## 📈 테스트 커버리지 목표

- **단위 테스트**: 80% 이상
- **통합 테스트**: 주요 시나리오 5개
- **플랫폼 테스트**: 3개 OS × 3개 Node 버전
- **성능 테스트**: 시작 시간 < 500ms

---

마지막 업데이트: 2025-01-28
다음 리뷰: 매 분기