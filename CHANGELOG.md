# Changelog

모든 주요 변경사항은 이 파일에 기록됩니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따르며,
버전 관리는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [Unreleased]

### 추가될 기능
- Windows 지원
- Linux 완전 지원  
- 더 많은 AI 도구 지원 (GitHub Copilot CLI 등)
- 플러그인 시스템
- 웹 기반 설정 UI

## [1.1.3] - 2025-01-28

### 알려진 이슈
- vitest의 ESM 모킹 제한으로 일부 단위 테스트 임시 비활성화
- v1.1.4에서 테스트 프레임워크 개선 예정

### 추가됨
- 🔐 **통합 sudo 권한 관리 시스템 (SudoManager)**
  - 일관된 비밀번호 입력 안내
  - Touch ID 사용자를 위한 특별 안내
  - 3회 시도 제한 및 보안 강화
  - Caps Lock, 한/영 상태 확인 안내

- 📋 **배포 자동화 시스템**
  - pre-release-check 스크립트
  - GitHub Actions 플랫폼별 테스트
  - release 브랜치 전용 테스트

- 📚 **프로젝트 문서화**
  - 배포 체크리스트 (RELEASE_CHECKLIST.md)
  - 브랜치 전략 (BRANCH_STRATEGY.md)
  - 테스트 전략 (TEST_STRATEGY.md)

### 개선됨
- 🚀 **Homebrew 설치 프로세스 전면 개선**
  - 설치 중 발생하는 프롬프트 사전 안내
  - ora 스피너와 interactive 모드 충돌 해결
  - 비밀번호 입력이 화면에 표시되지 않는다는 명확한 안내
  
- 📦 **npm 전역 설치 권한 문제 해결**
  - EACCES 에러 자동 감지
  - 3가지 해결 옵션 제시 (sudo, npm-global, 나중에)
  - sudo 사용 시 권장하지 않는 이유 설명

- 🛠️ **fix 명령어 보안 강화**
  - 위험한 시스템 경로 차단 (/, /System, /etc 등)
  - 권한 변경 전 충분한 경고 메시지

### 수정됨
- Git 설치 시 Linux 환경에서 sudo 처리 개선
- 모든 sudo 관련 에러 메시지 통일
- 초보자가 이해하기 쉬운 에러 메시지로 개선
- package.json의 projectName 수정 (dev-setup-cli → muggleout)
- config.js의 projectName 통일

## [1.1.2] - 2025-01-27

### 수정됨
- Claude Code CLI 설치 시 잘못된 패키지명 수정 (@anthropic/claude-cli → @anthropic-ai/claude-code)
- GitHub 저장소 URL 업데이트 (Dumbo-techtaka/muggleout)
- 문서 링크 수정 및 업데이트

### 개선됨
- README.md를 완전 초보자 친화적으로 전면 개편
- Node.js가 무엇인지부터 설명하는 상세한 설치 가이드 추가
- 복사/붙여넣기 방법까지 포함한 친절한 안내
- FAQ 섹션 확장 및 개선

## [1.1.1] - 2025-01-27

### 수정됨
- 업데이트 체크 시 버전 감지 문제 수정
- 글로벌 설치 환경에서 버전 정보를 정확히 읽도록 개선
- 환경변수를 통한 버전 전달 방식 추가

## [1.1.0] - 2025-01-27

### 추가됨
- ✨ **자동 업데이트 알림 기능**
  - 하루에 한 번 자동으로 새 버전 확인
  - `muggleout update` 명령어로 수동 업데이트
  - `muggleout update --config`로 업데이트 설정 변경
  - `muggleout update -y`로 확인 없이 바로 업데이트
  - 백그라운드에서 자동 체크 (메인 작업 방해 없음)

- 🚨 **스마트 에러 리포팅 시스템**
  - 중복 에러 자동 필터링 (5분 내 동일 에러 무시)
  - 알려진 에러 패턴 인식 및 즉시 해결책 제안
  - 프라이버시 보호 (경로 익명화, 민감정보 제거)
  - `muggleout report` 명령어로 에러 리포트 생성
  - `muggleout report --stats`로 에러 통계 확인

### 개선됨
- 메인 메뉴에 업데이트 확인 옵션 추가
- 에러 발생 시 자동 해결 가능한 경우 즉시 수정 제안
- 설치 실패 시 더 자세한 해결 방법 안내

### 보안
- 에러 리포트에서 개인정보 자동 제거
- 사용자 동의 기반 에러 수집
- SHA256 기반 익명 ID 사용

## [1.0.0] - 2025-01-26

### 🎉 첫 릴리즈!

#### 추가됨
- 🗣️ 자연어 명령 인식 (`dev-setup "터미널 예쁘게 만들어줘"`)
- 🎮 대화형 메뉴 인터페이스
- 💬 프롬프트 모드 (연속 명령 입력)
- 🌍 다국어 지원 (한국어, 영어, 일본어)
- 🚀 원클릭 자동 설치 스크립트

#### 지원 도구
- **기본 도구**: Homebrew, iTerm2, Oh My Zsh, Powerlevel10k, Node.js, Git
- **AI 도구**: Claude Code CLI, Gemini CLI
- **개발 도구**: Visual Studio Code

#### 문제 해결
- `command not found` 에러 자동 해결
- PATH 설정 자동 수정
- 권한 문제 해결 가이드

#### 설치 방법
- Homebrew (`brew install dev-setup-cli`)
- npm/yarn/bun 지원
- 자동 설치 스크립트

## 버전 비교

### v1.0.0 vs v0.x
- 프로덕션 준비 완료
- 안정적인 API
- 완전한 문서화
- 테스트 커버리지 80% 이상

---

## 기여하기

버그를 발견하거나 새로운 기능을 제안하고 싶다면:
1. [Issues](https://github.com/your-username/dev-setup-cli/issues)에 등록
2. Pull Request 제출
3. [기여 가이드](CONTRIBUTING.md) 참조