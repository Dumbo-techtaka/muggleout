# 🚀 Muggleout 배포 체크리스트

> 이 체크리스트는 배포 전 반드시 확인해야 할 사항들입니다.
> 자동화할 수 있는 부분은 스크립트로 만들어 놓았습니다.

## 🤖 자동 체크 (스크립트 실행)

```bash
npm run pre-release-check
```

위 명령어는 다음을 자동으로 확인합니다:
- [ ] 버전 정보 일치 확인
- [ ] 필수 파일 존재 확인 (.gitignore, LICENSE, README.md)
- [ ] 테스트 통과
- [ ] 실행 권한 확인
- [ ] 민감 정보 스캔

## 📝 수동 체크 (빠른 확인)

### 1. 코드 품질 (2분)
- [ ] `npm test` 실행 및 통과
- [ ] `muggleout --version` 정상 작동
- [ ] 주요 기능 1개 테스트 (예: `muggleout doctor`)

### 2. 문서 업데이트 (1분)
- [ ] CHANGELOG.md에 새 버전 추가
- [ ] README.md의 새 기능 반영
- [ ] 버전 번호 일치 확인 (package.json)

### 3. 보안 확인 (30초)
- [ ] `.env` 파일이 .gitignore에 포함
- [ ] API 키나 비밀번호 하드코딩 없음
- [ ] 개인정보 노출 없음

## 🎯 핵심 체크포인트 (꼭 확인!)

1. **package.json 확인**
   ```bash
   grep -E '"version"|"name"|"homepage"|"bugs"' package.json
   ```

2. **설치/제거 테스트**
   ```bash
   npm link && muggleout --version && npm unlink
   ```

3. **Git 상태**
   ```bash
   git status  # 커밋 안 된 파일 확인
   ```

## 📦 배포 명령어

모든 체크가 완료되면:

```bash
# 1. 버전 업데이트 (필요시)
npm version patch  # or minor, major

# 2. 배포
npm publish

# 3. 태그 푸시
git push && git push --tags
```

## 🔄 체크리스트 업데이트 규칙

1. **새 항목 추가 기준**
   - 실제로 문제가 발생했던 경우만 추가
   - 자동화 가능하면 스크립트로 이동
   - 중복 항목은 통합

2. **항목 제거 기준**
   - 3개월간 문제 없었던 항목
   - 자동화된 항목
   - 더 이상 관련 없는 항목

---

마지막 업데이트: 2025-01-28
다음 리뷰 예정: 2025-04-28 (3개월 후)