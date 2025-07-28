# 📦 NPM 패키지 배포 모범 사례

## 🎯 배포에 포함해야 할 파일

### ✅ 반드시 포함
```
bin/           # 실행 파일
src/           # 소스 코드
README.md      # 사용 설명서
LICENSE        # 라이센스
CHANGELOG.md   # 변경 이력
package.json   # 패키지 정보
```

### ❌ 포함하지 말아야 할 파일
```
tests/         # 테스트 파일
scripts/       # 개발/빌드 스크립트
docs/          # 추가 문서
.github/       # GitHub 설정
.gitignore     # Git 설정
.env           # 환경 변수
*.log          # 로그 파일
coverage/      # 테스트 커버리지
node_modules/  # 의존성 (자동 제외)
```

## 📊 크기 비교

### 모든 파일 포함 시
```
muggleout-1.1.3.tgz: ~15MB
- 불필요한 파일 포함
- 설치 시간 증가
- 사용자 디스크 공간 낭비
```

### 필수 파일만 포함 시
```
muggleout-1.1.3.tgz: ~500KB
- 빠른 설치
- 최소 공간 사용
- 필요한 기능만 포함
```

## 🤔 왜 테스트 파일을 제외하나요?

1. **크기 절감**: 테스트 파일은 실행에 불필요
2. **보안**: 내부 구현 세부사항 노출 방지
3. **성능**: 다운로드/설치 시간 단축
4. **관례**: npm 생태계의 표준 관행

## 🛠️ prepublishOnly의 역할

```json
"prepublishOnly": "npm run pre-release-check && npm test"
```

- **실행 시점**: `npm publish` 직전
- **실행 위치**: 개발자의 로컬 환경
- **목적**: 배포 전 최종 검증
- **참고**: 사용자 설치 시에는 실행되지 않음

## 📋 files 필드 체크리스트

### Muggleout의 경우
```json
"files": [
  "bin/",        // ✅ muggleout 실행 파일
  "src/",        // ✅ 모든 소스 코드
  "README.md",   // ✅ 사용법
  "LICENSE",     // ✅ MIT 라이센스
  "CHANGELOG.md" // ✅ 버전 히스토리
]
```

### 제외된 파일들
```
scripts/       // ❌ 개발용 스크립트
tests/         // ❌ 테스트 코드
docs/          // ❌ 추가 문서
.github/       // ❌ CI/CD 설정
CLAUDE.md      // ❌ 개발 가이드
*.test.js      // ❌ 테스트 파일
```

## 💡 프로 팁

### 1. 배포 전 확인
```bash
# 실제로 포함될 파일 확인
npm pack --dry-run

# 패키지 크기 확인
npm pack
ls -lh *.tgz
```

### 2. .npmignore vs files
- **추천**: `files` 필드 사용 (화이트리스트)
- **비추천**: `.npmignore` 사용 (블랙리스트)
- **이유**: 실수로 중요 파일 누락 방지

### 3. 패키지 크기 목표
- **이상적**: < 1MB
- **허용 가능**: < 10MB
- **재검토 필요**: > 10MB

## 🎯 결론

> "사용자에게 필요한 것만 제공하라"

테스트와 개발 도구는 개발자를 위한 것이지, 사용자를 위한 것이 아닙니다.

---

마지막 업데이트: 2025-01-28