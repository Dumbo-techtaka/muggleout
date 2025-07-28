# 🧙 Muggleout - 누구나 쓸 수 있는 터미널 마법사

> 💡 **컴퓨터 전원 버튼만 누를 줄 아시나요? 그럼 충분합니다!**

<p align="center">
  <img src="https://img.shields.io/npm/v/muggleout.svg" alt="npm version">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
</p>

---

## 🤔 이게 뭔가요?

**터미널**(그 무서운 검은 화면)을 **예쁘고 편하게** 만들어주는 프로그램입니다!

### 이런 분들을 위해 만들었어요
- 😱 터미널이 무서운 분
- 🤷 개발자가 아닌데 터미널을 써야 하는 분  
- 🎨 예쁜 것을 좋아하는 분
- 🚀 개발자처럼 멋있어 보이고 싶은 분

---

## 📸 이렇게 바뀝니다!

### Before (지금의 터미널)
```
Last login: Mon Jan 15 10:30:22
MacBook-Pro:~ user$
```

### After (Muggleout 설치 후)
```
╭─ 🏠 ~/Documents 
╰─ ❯ 
```
색깔도 예쁘고, 아이콘도 있고, 훨씬 친근해집니다! ✨

---

## 🚀 5분만에 설치하기 (Mac 기준)

> ⚠️ **주의**: Windows는 곧 지원 예정입니다!

### 📱 Step 1: 터미널 열기

#### 방법 1 - Spotlight 검색 (가장 쉬워요! ⭐)
1. 키보드에서 `Command(⌘) + Space` 동시에 누르기
2. "터미널" 또는 "terminal" 입력
3. 나타난 터미널 앱 클릭

<details>
<summary>📷 스크린샷 보기</summary>

![Spotlight 검색](./docs/images/spotlight-terminal.png)
</details>

#### 방법 2 - Launchpad 사용
1. Dock 하단의 로켓 모양 아이콘(🚀) 클릭
2. "기타" 폴더 찾기
3. "터미널" 클릭

#### 방법 3 - Finder 사용
1. Finder 열기
2. 응용 프로그램 → 유틸리티 → 터미널

---

### 🎨 Step 2: 검은 화면이 나타났나요?

이런 화면이 보이면 성공입니다! 👏

```
Last login: Mon Jan 15 10:30:22 on ttys000
사용자이름@MacBook-Pro ~ %
```

> 💡 **팁**: 겁먹지 마세요! 아무것도 망가지지 않아요. 😊

---

### 🛠️ Step 3: Node.js 설치하기

#### 🤷 Node.js가 뭔가요?
- Muggleout을 실행하기 위해 필요한 프로그램입니다
- 카카오톡을 쓰려면 스마트폰이 필요한 것처럼, Muggleout을 쓰려면 Node.js가 필요해요!

#### 📥 설치하는 방법

1. **웹브라우저 열기** (Safari, Chrome 아무거나)

2. **주소창에 입력하고 Enter**: 
   ```
   nodejs.org/ko
   ```

3. **큰 초록색 버튼 클릭** ("LTS 다운로드"라고 써있어요)

4. **다운로드된 파일 실행**
   - 다운로드 폴더에서 `node-v20.11.0.pkg` 같은 파일 더블클릭
   - 계속 → 계속 → 동의 → 설치 클릭
   - Mac 비밀번호 입력 (화면에 안 보여도 정상이에요!)
   - "설치 완료"가 나올 때까지 기다리기

5. **설치 확인하기**
   - 터미널로 돌아가서 이렇게 입력:
   ```bash
   node --version
   ```
   - Enter 누르기
   - `v20.11.0` 같은 숫자가 나오면 성공! 🎉

<details>
<summary>❓ 안 되시나요?</summary>

터미널을 완전히 종료했다가 다시 열어보세요:
1. Command + Q로 터미널 종료
2. 다시 터미널 열기
3. `node --version` 다시 입력
</details>

---

### 🎯 Step 4: Muggleout 설치하기

이제 진짜 거의 다 왔어요! 터미널에 이거 복사해서 붙여넣기:

```bash
npm install -g muggleout
```

> 💡 **복사하는 법**: 
> 1. 위의 명령어를 마우스로 드래그해서 선택
> 2. Command + C (복사)
> 3. 터미널 클릭
> 4. Command + V (붙여넣기)
> 5. Enter!

설치 중에 이런 것들이 나타나요 (정상입니다):
```
⸨░░░░░░░░░░░░░░░⸩ ⠏ fetchMetadata: ...
```

완료되면 이렇게 나옵니다:
```
added 42 packages in 5s
```

---

### ✨ Step 5: Muggleout 실행하기!

터미널에 입력:
```bash
muggleout
```

🎊 **축하합니다!** 이런 화면이 나오면 성공입니다:

```
╔════════════════════════════════════════╗
║                                        ║
║        🧙 Muggleout v1.1.1            ║
║                                        ║
║    머글을 터미널 마법사로 만들어드려요!    ║
║                                        ║
╚════════════════════════════════════════╝

무엇을 도와드릴까요?

❯ 🎨 터미널 꾸미기
  📦 개발 도구 설치
  🤖 AI 도구 설치  
  🔍 시스템 상태 확인
  🏥 문제 진단
  ❓ 도움말
  🚪 종료
```

---

## 🚀 주요 기능

### 🔐 안전한 설치 과정
- **자동 권한 관리**: 비밀번호가 필요할 때 친절하게 안내
- **에러 자동 해결**: 권한 문제 발생 시 즉시 해결 방법 제시
- **초보자 보호**: 위험한 시스템 파일은 자동으로 보호

### 🎯 똑똑한 도구 설치
- **Homebrew**: Mac의 앱스토어 같은 패키지 관리자
- **터미널 꾸미기**: iTerm2 + Oh My Zsh + Powerlevel10k
- **AI 도구**: Claude Code CLI로 AI와 함께 코딩
- **개발 도구**: Git, Node.js, VS Code 등

### 🩹 문제 자동 해결
- `muggleout fix`: 권한 문제, PATH 설정 등 자동 수정
- `muggleout doctor`: 시스템 진단 및 해결책 제시
- 에러 발생 시 즉시 해결 방법 안내

---

## 🎮 사용법 (정말 쉬워요!)

### 1️⃣ 메뉴 선택하기
- **↑↓ 화살표키**로 메뉴 이동
- **Enter**로 선택
- **Esc**로 뒤로 가기

### 2️⃣ 터미널 예쁘게 만들기 (추천! ⭐)
1. "🎨 터미널 꾸미기" 선택 → Enter
2. "전체 설치 (추천)" 선택 → Enter
3. 비밀번호 입력하라고 나오면 Mac 비밀번호 입력
   - 🔐 입력해도 화면에 안 보이는게 정상이에요!
   - Touch ID 사용자도 비밀번호를 타이핑하세요
4. 5분 정도 기다리면 완성! ✨

### 3️⃣ 자연스럽게 대화하기
메뉴 대신 이렇게 말해도 알아들어요:

```bash
muggleout "터미널 예쁘게 해줘"
```

```bash
muggleout "git이 뭔지 알려줘"
```

```bash
muggleout "claude 설치하고 싶어"
```

---

## 💬 자주 묻는 질문

<details>
<summary><b>Q: "command not found" 라고 나와요</b></summary>

**A**: Node.js 설치 후 터미널을 완전히 종료했다가 다시 열어보세요
- Command + Q로 터미널 완전 종료
- 터미널 다시 열기
- `muggleout` 다시 입력
</details>

<details>
<summary><b>Q: 비밀번호 입력할 때 아무것도 안 보여요</b></summary>

**A**: 정상입니다! 보안을 위해 일부러 안 보이게 한 거예요
- 그냥 비밀번호 입력하고 Enter 누르세요
- Mac 로그인할 때 사용하는 비밀번호예요
- Touch ID 사용자도 비밀번호를 타이핑해야 해요
- 틀렸다면 다시 물어볼 거예요 (3번까지)
</details>

<details>
<summary><b>Q: "관리자 권한이 필요합니다"라고 나와요</b></summary>

**A**: Muggleout이 자동으로 안내해드려요!
- 비밀번호 입력 안내가 나오면 Mac 비밀번호 입력
- Caps Lock이 켜져있지 않은지 확인
- 한글로 입력하고 있지 않은지 확인
- 회사 Mac이라면 IT 부서에 문의하세요
</details>

<details>
<summary><b>Q: 설치가 너무 오래 걸려요</b></summary>

**A**: 인터넷 연결을 확인하세요
- Wi-Fi가 연결되어 있나요?
- 보통 1-2분이면 끝나요
- 5분 이상 걸리면 Ctrl+C 눌러서 중단하고 다시 시도
</details>

<details>
<summary><b>Q: 터미널이 무서워요</b></summary>

**A**: 걱정 마세요! 
- 아무것도 망가뜨리지 않아요
- 실수해도 다시 하면 됩니다
- 모르는 건 `muggleout help`로 물어보세요
</details>

---

## 🆘 도움이 필요하신가요?

### 방법 1: Muggleout에게 직접 물어보기
```bash
muggleout doctor
```
시스템을 진단하고 문제를 찾아드려요!

### 방법 2: 이메일로 문의
📧 rlawlsgus97@gmail.com (한국어 환영!)

### 방법 3: GitHub Issues
문제를 [여기에](https://github.com/Dumbo-techtaka/muggleout/issues) 남겨주세요

---

## 🎬 동영상 가이드

> 🎥 **[5분만에 따라하는 설치 영상](https://youtube.com/placeholder)** (준비 중)

---

## 🌟 다음 단계

Muggleout을 설치하셨나요? 이제 이런 것들을 해보세요:

### 1. 터미널 꾸미기 완료하기
```bash
muggleout beautify
```

### 2. 유용한 도구 설치하기
```bash
muggleout
```
메뉴에서 "📦 개발 도구 설치" 선택!

### 3. AI 비서 설치하기
```bash
muggleout "claude 설치해줘"
```

---

## 🏆 당신도 이제 터미널 마법사!

<p align="center">
  <b>🎉 축하합니다! 이제 터미널이 무섭지 않으시죠? 🎉</b><br><br>
  더 많은 마법을 부리고 싶다면<br>
  <code>muggleout help</code>를 입력해보세요!
</p>

---

<p align="center">
  Made with ❤️ for muggles everywhere<br>
  <i>마법 지팡이는 필요 없어요!</i> 🪄
</p>