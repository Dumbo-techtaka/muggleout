# 📚 사용자 가이드

Dev Setup CLI 완벽 가이드 - 비개발자를 위한

## 🚀 시작하기

### 설치하기 (한 번만!)

1. **Mac 터미널 열기**
   - Spotlight 검색(⌘ + Space)에서 "터미널" 입력
   - 또는 응용 프로그램 > 유틸리티 > 터미널

2. **설치 명령어 실행**
   ```bash
   sh -c "$(curl -fsSL https://raw.githubusercontent.com/your-org/dev-setup-cli/main/start.sh)"
   ```
   > 💡 복사: 위 코드 블록 오른쪽 상단의 📋 버튼 클릭

3. **설치 중 나오는 질문들**
   - "관리자 권한이 필요합니다" → **Y 입력**
   - "비밀번호를 입력하세요" → **Mac 로그인 비밀번호 입력**
   - 비밀번호는 화면에 표시되지 않아요! 그냥 입력하고 Enter

### 첫 실행

설치가 끝나면 자동으로 실행됩니다! 

```
🚀 Dev Setup CLI
비개발자를 위한 개발 환경 설정 도구

🎮 대화형 모드를 시작합니다!

? 어떤 작업을 하시겠습니까? (화살표로 이동, Enter로 선택)
❯ 🎨 터미널 꾸미기
  📦 개발 도구 설치  
  🤖 AI 도구 설정
  🔧 문제 해결
  💬 프롬프트 모드
```

## 🎨 터미널 꾸미기

### iTerm2 설치 (더 좋은 터미널)

1. 메뉴에서 "🎨 터미널 꾸미기" 선택
2. "iTerm2 설치" 선택
3. 설치 완료 후 iTerm2가 자동으로 열립니다

### 예쁜 테마 적용하기

1. "Oh My Zsh 설치" 선택
2. "Powerlevel10k 테마" 선택
3. 설정 마법사가 자동으로 시작됩니다
   - 질문에 답하면서 원하는 스타일 선택
   - 잘 모르겠으면 추천 설정(p10k configure) 사용

### 결과

- ✨ 컬러풀한 터미널
- 🎯 현재 폴더 위치 표시
- ⚡ 명령어 자동완성
- 📝 명령어 히스토리 검색

## 🤖 AI 도구 설치

### Claude CLI 설치

1. "🤖 AI 도구 설정" 선택
2. "Claude Code CLI" 선택
3. 설치 완료 후:
   ```bash
   claude login  # 브라우저에서 로그인
   claude chat   # 대화 시작
   ```

### Gemini CLI 설치

1. "Gemini CLI" 선택
2. API 키 입력 (Google AI Studio에서 발급)
3. 사용법:
   ```bash
   gemini "코드 리뷰해줘"
   gemini -c "이전 대화 이어서"
   ```

## 💬 프롬프트 모드

자연어로 명령하는 편리한 모드!

### 시작하기
- 메인 메뉴에서 "💬 프롬프트 모드" 선택
- 또는 `dev-setup prompt` 실행

### 사용 예시
```
➜ 터미널 예쁘게 만들어줘
➜ claude 설치해줘
➜ 도와줘
➜ /help  # 모든 가능한 명령어 보기
```

### 나가기
- `exit` 또는 `종료` 입력
- `menu` 또는 `메뉴` 입력하면 메인 메뉴로

## 🔧 문제 해결

### "command not found" 에러

1. 메뉴에서 "🔧 문제 해결" 선택
2. "command not found 해결" 선택
3. 자동으로 PATH 설정 수정

### 권한 오류

```bash
dev-setup fix permission
```

### 시스템 상태 확인

```bash
dev-setup status
```

출력 예시:
```
📊 시스템 상태 확인
✅ Homebrew: 설치됨 (4.2.0)
✅ Node.js: 설치됨 (v20.11.0)
✅ Git: 설치됨 (2.43.0)
❌ iTerm2: 미설치
```

## 📝 자주 묻는 질문

### Q: 설치가 중간에 멈췄어요
A: Ctrl+C로 중단하고 다시 실행하세요. 이미 설치된 것은 건너뜁니다.

### Q: 비밀번호를 입력해도 화면에 안 보여요
A: 정상입니다! 보안을 위해 표시하지 않아요. 그냥 입력하고 Enter.

### Q: iTerm2 vs 기본 터미널?
A: iTerm2가 더 많은 기능과 예쁜 디자인을 제공합니다. 추천!

### Q: 설치한 것들을 지우고 싶어요
A: 
```bash
# 개별 삭제
brew uninstall node
npm uninstall -g dev-setup-cli

# 전체 초기화 (주의!)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
```

### Q: 다른 컴퓨터에서도 사용하고 싶어요
A: 같은 설치 명령어를 실행하면 됩니다!

## 🎯 활용 팁

### 1. 자주 사용하는 명령어 별칭 만들기

```bash
# ~/.zshrc에 추가
alias ll='ls -la'
alias gs='git status'
alias dc='docker-compose'
```

### 2. 터미널 단축키
- `Ctrl + A`: 줄 맨 앞으로
- `Ctrl + E`: 줄 맨 뒤로
- `Ctrl + R`: 명령어 히스토리 검색
- `Tab`: 자동완성

### 3. 유용한 도구들
- `tldr`: 명령어 간단 설명 (`tldr git`)
- `bat`: 더 예쁜 cat (`bat file.txt`)
- `exa`: 더 예쁜 ls (`exa -la`)

## 🆘 도움말

### 도움이 필요할 때

1. **프로그램 내에서**
   ```bash
   dev-setup help
   dev-setup --help
   ```

2. **문제 신고**
   - GitHub Issues: https://github.com/your-org/dev-setup-cli/issues
   - 이메일: support@company.com

3. **커뮤니티**
   - Slack: #dev-setup-help
   - Discord: 초보자 도움말 채널

## 🎉 축하합니다!

이제 당신도 멋진 개발 환경을 갖추었습니다! 

다음 단계:
1. Claude나 Gemini로 코딩 시작하기
2. Git으로 버전 관리 배우기
3. VS Code로 코드 편집하기

**Remember**: 모든 전문가도 처음엔 초보자였습니다. 천천히, 하나씩! 🚀