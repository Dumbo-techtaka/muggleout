# Muggleout 프로젝트 가이드 (Claude용)

> 이 문서는 Claude가 프로젝트를 빠르게 이해하고 작업할 수 있도록 작성되었습니다.

## 🎯 프로젝트 개요

**Muggleout** - 비개발자를 위한 터미널 설정 도구
- **목적**: 터미널을 처음 사용하는 사람들이 쉽게 개발 환경을 설정할 수 있도록 도와주는 CLI 도구
- **타겟**: 개발 경험이 전혀 없는 일반인, 디자이너, 기획자 등
- **핵심 가치**: 친절함, 쉬움, 한국어 지원

## 📦 현재 상태 (2025-01-27)

- **버전**: 1.1.2 (배포 준비 완료)
- **npm 패키지명**: `muggleout`
- **GitHub**: https://github.com/Dumbo-techtaka/muggleout

## 🛠️ 기술 스택

- **언어**: JavaScript (ES6+)
- **런타임**: Node.js 16+
- **주요 라이브러리**:
  - commander.js - CLI 프레임워크
  - inquirer.js - 대화형 프롬프트
  - chalk - 터미널 색상
  - natural - 자연어 처리
  - ora - 로딩 스피너
  - boxen - 박스 UI

## 🌟 주요 기능

1. **대화형 메뉴 시스템**
   - 화살표키로 선택하는 직관적인 UI
   - 한국어 메뉴 및 설명

2. **자연어 명령 지원**
   ```bash
   muggleout "터미널 예쁘게 해줘"
   muggleout "git 설치하고 싶어"
   ```

3. **설치 가능한 도구들**
   - iTerm2, Oh My Zsh, Powerlevel10k
   - Git, Node.js, VS Code
   - Claude Code CLI (@anthropic-ai/claude-code)
   - GitHub Copilot

4. **시스템 진단 기능**
   - `muggleout doctor` - 시스템 상태 확인
   - `muggleout status` - 설치된 도구 확인

## 📁 프로젝트 구조

```
muggleout/
├── bin/
│   └── muggleout.js         # 진입점
├── src/
│   ├── commands/            # 명령어 구현
│   │   ├── install.js       # 설치 로직
│   │   ├── doctor.js        # 시스템 진단
│   │   └── ...
│   ├── ui/
│   │   └── interactive.js   # 대화형 UI
│   ├── parsers/
│   │   └── natural-language.js  # 자연어 처리
│   └── utils/              # 유틸리티
├── tests/                  # 테스트 코드
├── package.json
├── README.md              # 사용자용 문서 (초보자 친화적)
├── INSTALL_GUIDE_KR.md    # 한국어 설치 가이드
└── CHANGELOG.md           # 변경 이력

```

## 📝 2025-01-27 작업 내역

### ✅ 완료된 작업

1. **README.md 전면 개편**
   - 완전 초보자도 이해할 수 있도록 재작성
   - Node.js가 뭔지부터 설명
   - 복사/붙여넣기 방법까지 안내

2. **버그 수정**
   - Claude Code CLI 패키지명 수정
   - `@anthropic/claude-cli` → `@anthropic-ai/claude-code`

3. **프로젝트 정보 업데이트**
   - GitHub URL: Dumbo-techtaka/muggleout
   - Author: dumbo@techtaka.com
   - 문서 링크 수정

4. **파일 정리**
   - 불필요한 Docker 파일 삭제 (9개)
   - 구버전 설치 스크립트 삭제
   - 마이그레이션 문서 삭제
   - cleanup.sh 스크립트 작성

5. **버전 업데이트**
   - 1.1.1 → 1.1.2
   - CHANGELOG.md 업데이트

### 🚀 배포 준비 상태

- [x] 로컬 테스트 완료 (`npm link`)
- [x] package.json 정보 확인
- [x] 실행 권한 설정 필요 (`chmod +x bin/muggleout.js`)
- [ ] Git 커밋 & 푸시
- [ ] NPM 배포 (`npm publish`)

## ⚠️ 주의사항

1. **패키지명 일관성**
   - 프로젝트명: muggleout
   - 실행 명령어: muggleout
   - npm 패키지: muggleout

2. **지원 플랫폼**
   - 현재 macOS만 공식 지원
   - Windows/Linux는 추후 지원 예정

3. **타겟 사용자 고려**
   - 항상 초보자 관점에서 생각
   - 전문 용어 최소화
   - 한국어 우선

## 🔮 다음 세션에서 확인할 사항

1. **배포 결과 확인**
   - npm 페이지 확인
   - 설치 테스트
   - 사용자 피드백

2. **추가 개선사항**
   - Windows 지원 추가
   - 더 많은 AI 도구 지원
   - 에러 메시지 개선

3. **문서 업데이트**
   - 동영상 가이드 링크 추가
   - 스크린샷 추가
   - FAQ 확장

## 💡 개발 팁

1. **테스트 방법**
   ```bash
   npm link
   muggleout
   npm unlink
   ```

2. **주요 파일 위치**
   - 메인 메뉴: `src/ui/interactive.js`
   - 설치 로직: `src/commands/install.js`
   - 자연어 처리: `src/parsers/natural-language.js`

3. **디버깅**
   - `console.log` 대신 `chalk`로 색상 있는 로그 사용
   - 에러는 사용자 친화적으로 표시

## 📞 연락처

- Author: dumbokim
- Email: dumbo@techtaka.com (회사) / rlawlsgus97@gmail.com (개인)
- GitHub: https://github.com/Dumbo-techtaka/muggleout

---

마지막 업데이트: 2025-01-27