# 🚀 배포 가이드

Dev Setup CLI를 조직이나 커뮤니티에 배포하는 방법

## 🏢 기업 내부 배포

### 1. Private NPM Registry 사용 (권장)

```bash
# 1. 사내 npm registry 설정
npm config set registry https://npm.company.com

# 2. 패키지 배포
npm publish

# 3. 직원 설치 안내
# one-liner 제공
curl -fsSL https://intranet.company.com/dev-setup-install.sh | bash

# 또는 직접 설치
npm install -g @company/dev-setup-cli
```

### 2. 사내 Git 서버 활용

```bash
# 1. 사내 Git에 미러링
git remote add internal https://git.company.com/tools/dev-setup-cli
git push internal main

# 2. 설치 스크립트 커스터마이징
# start.sh 수정하여 사내 URL 사용
INSTALL_URL="https://git.company.com/tools/dev-setup-cli/raw/main/start.sh"

# 3. 직원용 설치 명령어
sh -c "$(curl -fsSL $INSTALL_URL)"
```

### 3. 바이너리 배포 (IT 부서 관리)

```bash
# 1. 실행 파일 생성
npm install -g pkg
pkg . --targets node18-macos-x64,node18-macos-arm64

# 2. 코드 서명 (macOS)
codesign --sign "Developer ID Application: Company Name" dev-setup-macos-x64
codesign --sign "Developer ID Application: Company Name" dev-setup-macos-arm64

# 3. 배포
# 내부 다운로드 서버에 업로드
# 또는 MDM(Mobile Device Management) 시스템 활용
```

### 4. Docker 이미지 배포

```bash
# 1. 이미지 빌드
docker build -t company/dev-setup:latest .

# 2. 사내 Docker Registry에 푸시
docker push registry.company.com/tools/dev-setup:latest

# 3. 사용법 안내
docker run -it --rm company/dev-setup
```

## 🌍 오픈소스 배포

### 1. NPM Public Registry

```bash
# 1. npm 계정 생성 및 로그인
npm login

# 2. 패키지명 확인 (중복 체크)
npm view dev-setup-cli

# 3. 배포
npm publish --access public

# 4. 설치 안내
npm install -g dev-setup-cli
```

### 2. GitHub Releases

```bash
# 1. 버전 태그 생성
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 2. GitHub Actions로 자동 릴리즈
# .github/workflows/release.yml 참고

# 3. 바이너리 첨부
# macOS, Windows, Linux용 실행 파일 업로드
```

### 3. Homebrew Tap (macOS)

```bash
# 1. Homebrew Tap 저장소 생성
# homebrew-tap/Formula/dev-setup-cli.rb

class DevSetupCli < Formula
  desc "개발 환경 자동 설정 도구"
  homepage "https://github.com/org/dev-setup-cli"
  url "https://github.com/org/dev-setup-cli/archive/v1.0.0.tar.gz"
  sha256 "..."
  
  depends_on "node"
  
  def install
    system "npm", "install", "--production"
    system "npm", "run", "build"
    bin.install "bin/dev-setup"
  end
end

# 2. 사용자 설치
brew tap org/tap
brew install dev-setup-cli
```

## 🌏 다국어 지원

### 1. i18n 구조

```javascript
// src/i18n/locales/ko.json
{
  "welcome": "Dev Setup CLI에 오신 것을 환영합니다",
  "menu.customize": "터미널 꾸미기",
  "menu.install": "개발 도구 설치"
}

// src/i18n/locales/en.json
{
  "welcome": "Welcome to Dev Setup CLI",
  "menu.customize": "Customize Terminal",
  "menu.install": "Install Dev Tools"
}

// src/i18n/locales/ja.json
{
  "welcome": "Dev Setup CLIへようこそ",
  "menu.customize": "ターミナルのカスタマイズ",
  "menu.install": "開発ツールのインストール"
}
```

### 2. 언어 자동 감지

```javascript
// src/i18n/index.js
import { getSystemLocale } from './utils.js';
import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

const locales = { ko, en, ja };
const systemLocale = getSystemLocale();
const locale = locales[systemLocale] || locales.en;

export function t(key) {
  return locale[key] || key;
}
```

### 3. 언어 설정

```bash
# 환경 변수로 설정
export DEV_SETUP_LANG=ko
dev-setup

# 또는 명령어로
dev-setup --lang=en
```

## 📊 사용 통계 (선택사항)

### 1. 익명 통계 수집

```javascript
// 사용자 동의 후에만
if (await confirmAnalytics()) {
  trackEvent('install', {
    tool: 'homebrew',
    os: process.platform,
    locale: systemLocale
  });
}
```

### 2. 오류 리포팅

```javascript
// Sentry 등 활용
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  beforeSend(event) {
    // PII 제거
    delete event.user;
    return event;
  }
});
```

## 🔐 보안 고려사항

### 1. 코드 서명
- macOS: Developer ID로 서명
- Windows: Authenticode 인증서 사용

### 2. 체크섬 제공
```bash
# 설치 스크립트에 체크섬 검증 추가
EXPECTED_SHA="abc123..."
ACTUAL_SHA=$(shasum -a 256 dev-setup | cut -d' ' -f1)
if [ "$EXPECTED_SHA" != "$ACTUAL_SHA" ]; then
  echo "체크섬 불일치! 설치 중단"
  exit 1
fi
```

### 3. HTTPS 전용
- 모든 다운로드 URL은 HTTPS 사용
- 중간자 공격 방지

## 📈 성공 지표

### 1. 설치 성공률
- 목표: 95% 이상
- 측정: 설치 시작 vs 완료

### 2. 사용자 만족도
- NPS(Net Promoter Score) 조사
- GitHub Star, 이슈 피드백

### 3. 활성 사용자
- 주간/월간 활성 사용자 수
- 가장 많이 사용되는 기능

## 🎯 홍보 전략

### 1. 내부 홍보 (기업)
- 사내 위키/문서에 가이드 작성
- Slack/Teams 채널에 공지
- 온보딩 프로세스에 포함
- 사내 교육 세션 진행

### 2. 외부 홍보 (오픈소스)
- 블로그 포스트 작성
- 개발자 커뮤니티 공유
- YouTube 튜토리얼 제작
- 컨퍼런스 발표

## 📝 체크리스트

### 배포 전
- [ ] 모든 테스트 통과
- [ ] 문서 최신화
- [ ] 버전 번호 업데이트
- [ ] CHANGELOG 작성
- [ ] 보안 취약점 스캔

### 배포 후
- [ ] 설치 테스트 (각 플랫폼)
- [ ] 모니터링 확인
- [ ] 사용자 피드백 채널 확인
- [ ] 핫픽스 대응 준비