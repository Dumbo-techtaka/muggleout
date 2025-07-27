# 🎯 누구나 할 수 있는 muggleout 설치 가이드

> 💡 **이 가이드는 컴퓨터를 켜고 끄는 것만 할 줄 아는 분들을 위해 만들었습니다!**

## 🤔 muggleout이 뭔가요?

터미널(검은 화면)을 예쁘고 편하게 만들어주는 마법 도구입니다! 
설치하면 개발자처럼 멋진 터미널을 쓸 수 있어요.

---

# 💻 Mac 사용자를 위한 설치법

## 📱 Step 1: 터미널 열기

### 방법 1 - Spotlight 검색 (추천! ⭐)
1. 키보드에서 `Command(⌘) + Space` 누르기
2. "터미널" 또는 "terminal" 입력
3. 터미널 앱 클릭

<img width="600" alt="spotlight-terminal" src="https://user-images.githubusercontent.com/placeholder/spotlight-terminal.png">

### 방법 2 - Launchpad
1. Dock에서 Launchpad 클릭 (로켓 모양 🚀)
2. "기타" 폴더 찾기
3. "터미널" 클릭

### 방법 3 - Finder
1. Finder 열기
2. 응용 프로그램 → 유틸리티 → 터미널

---

## 🎨 Step 2: 검은 화면이 나타났나요?

이런 화면이 보이면 성공입니다! 👏

```
Last login: Mon Jan 15 10:30:22 on ttys000
사용자이름@MacBook-Pro ~ %
```

겁먹지 마세요! 이제부터 하나씩 따라하면 됩니다.

---

## 🛠️ Step 3: Node.js 설치하기

### 🤷 Node.js가 뭔가요?
- muggleout을 실행하기 위해 필요한 프로그램입니다
- 카카오톡을 쓰려면 스마트폰이 필요한 것처럼, muggleout을 쓰려면 Node.js가 필요해요

### 📥 설치 방법

1. **웹브라우저 열기** (Safari, Chrome 등)

2. **주소창에 입력**: [nodejs.org/ko](https://nodejs.org/ko)

3. **"LTS 다운로드" 버튼 클릭** (왼쪽의 초록색 버튼)
   
   <img width="600" alt="nodejs-download" src="https://user-images.githubusercontent.com/placeholder/nodejs-download.png">

4. **다운로드된 파일 실행**
   - 다운로드 폴더에서 `node-v20.x.x.pkg` 파일 더블클릭
   - "계속" → "계속" → "동의" → "설치" 클릭
   - Mac 비밀번호 입력
   - "설치 완료" 나올 때까지 기다리기

5. **설치 확인하기**
   - 터미널로 돌아가서 이렇게 입력하고 Enter:
   ```bash
   node --version
   ```
   - `v20.11.0` 같은 숫자가 나오면 성공! 🎉

---

## 🎯 Step 4: muggleout 설치하기

이제 거의 다 왔어요! 터미널에 다음 명령어를 **정확히** 입력하세요:

```bash
npm install -g muggleout
```

> 💡 **팁**: 복사(Command+C) → 붙여넣기(Command+V) 하세요!

Enter를 누르면 이런 화면이 나옵니다:
```
added 42 packages in 5s
```

---

## ✨ Step 5: muggleout 실행하기!

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
  🔍 시스템 상태 확인
  🏥 문제 진단 (Doctor)
  ❓ 도움말
  🚪 종료
```

---

# 🎮 사용법 (정말 쉬워요!)

## 1️⃣ 메뉴 선택하기
- **위/아래 화살표키**로 원하는 메뉴 이동
- **Enter**로 선택

## 2️⃣ 터미널 예쁘게 만들기
1. "🎨 터미널 꾸미기" 선택
2. Enter 누르기
3. 나머지는 알아서 해드려요! ✨

## 3️⃣ 자연스럽게 대화하기
이렇게 말해도 알아들어요:
- "터미널 예쁘게 해줘"
- "git 설치하고 싶어"
- "뭐가 설치되어 있는지 확인해줘"

---

# ❓ 자주 묻는 질문

### Q: "command not found" 에러가 나요
**A**: Node.js를 설치하고 터미널을 완전히 종료했다가 다시 열어보세요

### Q: 비밀번호 입력할 때 아무것도 안 보여요
**A**: 정상입니다! 보안을 위해 안 보이는 거예요. 그냥 입력하고 Enter 누르세요

### Q: 설치가 너무 오래 걸려요
**A**: 인터넷 연결을 확인하세요. 보통 1-2분이면 끝나요

### Q: 터미널이 무서워요
**A**: 걱정 마세요! 아무것도 망가뜨리지 않아요. 실수해도 다시 하면 됩니다 😊

---

# 🆘 도움이 필요하신가요?

### 방법 1: muggleout에게 직접 물어보기
```bash
muggleout doctor
```

### 방법 2: 커뮤니티
- GitHub Issues: [문제 신고하기](https://github.com/YOUR_USERNAME/muggleout/issues)
- 한국어로 편하게 질문하세요!

---

# 🎬 동영상 가이드

> 🎥 **[설치 과정 전체를 5분 안에 보기](https://youtube.com/placeholder)**

---

# 🏁 다음 단계

muggleout 설치를 완료하셨나요? 이제 이런 것들을 해보세요:

1. **터미널 꾸미기** - 5분이면 예쁜 터미널 완성!
2. **Git 설치하기** - 개발자들이 쓰는 도구
3. **VS Code 설치하기** - 코드 편집기

모든 것이 메뉴에서 선택만 하면 됩니다! 🎯

---

<div align="center">

### 🌟 당신도 이제 터미널 마법사입니다! 🌟

</div>