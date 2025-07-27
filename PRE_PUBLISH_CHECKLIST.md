# 🚀 NPM 배포 전 체크리스트

## 📝 필수 수정 사항

### 1. package.json
```json
// Line 37: author 수정
"author": "Your Name <your-email@example.com>",
// 실제 이름과 이메일로 변경하세요
```

### 2. LICENSE
```
// Line 3: 저작권자 수정
Copyright (c) 2024 [Your Name]
// 실제 이름으로 변경하세요
```

### 3. README.md
```markdown
// 기여 링크들 제거 또는 수정
- 🐛 [Report Issues](https://github.com/your-username/muggleout/issues)
- 💡 [Request Features](https://github.com/your-username/muggleout/issues/new)
- 🔧 [Submit PRs](https://github.com/your-username/muggleout/pulls)

// NPM 페이지로 변경
- 🐛 문제 제보: npm 페이지 참조
- 💡 기능 제안: 이메일로 연락
```

## 🔒 민감 정보 확인

### 확인할 파일들:
- [ ] 회사 정보 노출 없음
- [ ] 개인 이메일/연락처 적절함
- [ ] API 키나 토큰 없음
- [ ] 내부 URL 없음

## 📦 배포 명령어

### 1. 마지막 테스트
```bash
# 로컬 설치 테스트
npm link
muggleout
muggleout status

# 언링크
npm unlink
```

### 2. npm 로그인
```bash
npm login
# Username: your-npm-username
# Password: 
# Email: your-email@example.com
```

### 3. 최종 배포
```bash
# 마지막 확인
npm pack
tar -tzf muggleout-1.0.0.tgz

# 실제 배포
npm publish

# 확인
npm info muggleout
```

## 🎯 배포 후 확인

### 즉시 확인:
```bash
# 5분 후 설치 테스트
npm install -g muggleout
muggleout --version
```

### 웹에서 확인:
- https://www.npmjs.com/package/muggleout
- 다운로드 통계
- 문서 표시 확인

## 📢 배포 후 홍보

### 1. 회사 내부
```
🎉 muggleout 출시!

터미널이 어려운 분들을 위한 도구를 만들었습니다.

설치: npm install -g muggleout
실행: muggleout

피드백 환영합니다!
```

### 2. 개인 SNS (선택)
```
비개발자를 위한 터미널 설정 도구를 만들었습니다 🧙

✨ 자연어 명령 지원
🎨 예쁜 터미널 자동 설정
📦 필수 도구 간편 설치

npm install -g muggleout

#cli #opensource #npm
```

## ⚠️ 주의사항

1. **버전 관리**
   - 첫 배포는 1.0.0
   - 버그 수정: patch (1.0.1)
   - 기능 추가: minor (1.1.0)
   - 큰 변경: major (2.0.0)

2. **되돌리기 불가**
   - npm은 24시간 내 unpublish 가능
   - 하지만 같은 버전 재배포 불가
   - 신중하게 결정

3. **사용자 피드백**
   - npm 페이지 주기적 확인
   - 이메일 확인
   - 빠른 대응

---

준비되셨나요? 🚀 Let's ship it!