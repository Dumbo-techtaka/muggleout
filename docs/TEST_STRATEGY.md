# 🧪 Muggleout 테스트 전략

## 📊 현재 테스트 범위

### 1. 기본 동작 테스트 (Critical Path)
```bash
# 이것만은 꼭! (모든 플랫폼)
✅ muggleout --version     # 실행 가능 여부
✅ muggleout --help       # 도움말 표시
✅ muggleout doctor       # 시스템 진단
✅ muggleout status       # 상태 확인
```

### 2. 플랫폼별 설치/실행 테스트
```yaml
# GitHub Actions에서 자동 실행
- Ubuntu: Node 16, 18, 20
- macOS: Node 18, 20  
- Windows: Node 16, 18, 20
```

### 3. 패키지 품질 테스트
- 📦 npm pack 성공 여부
- 📏 패키지 크기 (10MB 이하)
- 🔍 민감 정보 스캔
- 📋 필수 파일 포함 여부

## 🎯 핵심 기능 테스트 전략

### 우선순위 1: 생존 필수 (Smoke Test)
**목적**: 앱이 죽지 않고 실행되는가?

```bash
# 1. 시작과 종료
muggleout --version        # 버전 표시
muggleout --help          # 도움말
muggleout                 # 메인 메뉴 (대화형 모드는 테스트 어려움)

# 2. 에러 처리
muggleout invalid-command  # 잘못된 명령어
muggleout install invalid  # 존재하지 않는 도구
```

### 우선순위 2: 핵심 경로 (Critical Path)
**목적**: 사용자가 가장 많이 쓰는 기능이 작동하는가?

```bash
# 1. 시스템 체크 (읽기 전용, 안전)
muggleout doctor          # 시스템 진단
muggleout status          # 설치 상태

# 2. 자연어 파싱 (실제 설치 X)
muggleout "help"          # 도움말 인식
muggleout "도움말"        # 한국어 인식
```

### 우선순위 3: 중요 기능 (선택적)
**목적**: 주요 기능들이 최소한 시작은 되는가?

```bash
# Release 브랜치에서만 테스트
muggleout fix --dry-run    # 수정 명령 (실행 안 함)
muggleout update --check   # 업데이트 확인만
```

## 🚫 테스트하지 않는 것들

### 1. 실제 설치 작업
```bash
# ❌ 이런 건 테스트 안 함
muggleout install homebrew     # 실제 Homebrew 설치
muggleout install iterm2       # 실제 앱 설치
muggleout beautify             # 전체 터미널 꾸미기
```
**이유**: 
- CI 환경 오염
- 시간이 너무 오래 걸림 (20분+)
- 외부 의존성 (네트워크, 권한)

### 2. 대화형 UI
```bash
# ❌ inquirer 메뉴 선택
# ❌ 비밀번호 입력
# ❌ Y/N 확인 프롬프트
```
**이유**: CI에서 대화형 입력 불가능

### 3. 시스템 변경 작업
```bash
# ❌ PATH 수정
# ❌ 설정 파일 변경
# ❌ sudo 권한 필요 작업
```
**이유**: CI 환경 보호

## 📈 테스트 커버리지 목표

```
100% - 죽지 않고 실행 (Smoke)
 80% - 핵심 명령어 동작 (Critical)
 30% - 전체 기능 커버리지 (Acceptable)
```

## 🎭 테스트 시나리오 (E2E)

### 시나리오 1: 첫 사용자
```bash
# 설치 직후 상황
npm install -g muggleout
muggleout --version
muggleout
# Ctrl+C로 종료
```

### 시나리오 2: 문제 해결
```bash
# 뭔가 안 될 때
muggleout doctor
muggleout status
muggleout --help
```

### 시나리오 3: 자연어 사용
```bash
# 초보자가 대충 입력
muggleout "도움"
muggleout "help me"
muggleout "뭐지?"
```

## 🤖 자동화 가능한 테스트

### 1. Unit Tests (vitest)
```javascript
// 자연어 파서
test('한국어 명령 인식', () => {
  expect(parseCommand('터미널 예쁘게')).toBe('beautify')
})

// 설정 관리
test('설정 저장/불러오기', () => {
  saveConfig({...})
  expect(loadConfig()).toEqual({...})
})
```

### 2. Integration Tests
```javascript
// CLI 명령어
test('version 명령어', async () => {
  const { stdout } = await execa('muggleout', ['--version'])
  expect(stdout).toMatch(/\d+\.\d+\.\d+/)
})
```

### 3. Smoke Tests (CI)
```yaml
# 모든 플랫폼에서
- muggleout --version
- muggleout --help
- muggleout doctor
```

## 📋 수동 테스트 체크리스트

### 배포 전 필수 (5분)
- [ ] `muggleout` 실행 → 메뉴 표시
- [ ] 화살표키로 메뉴 이동
- [ ] ESC로 종료
- [ ] `muggleout doctor` 실행
- [ ] `muggleout "도움말"` 실행

### 메이저 업데이트 시 (15분)
- [ ] 위 필수 테스트 +
- [ ] 새 기능 1개 실제 테스트
- [ ] 다른 OS에서 1개 테스트 (VM 또는 Docker)
- [ ] 설치/제거 과정 테스트

## 💡 테스트 철학

> "모든 것을 테스트할 수는 없다. 
> 중요한 것은 사용자가 첫 번째로 하는 일이 실패하지 않는 것이다."

### 80/20 규칙
- 20%의 기능이 80%의 사용량
- 그 20%만 확실하게 테스트

### 테스트 ROI (투자 대비 효과)
1. **높음**: --version, --help, doctor (1분 투자 → 큰 효과)
2. **중간**: 자연어 파싱, 에러 메시지 (5분 투자 → 적당한 효과)
3. **낮음**: 전체 설치 과정 (30분 투자 → 작은 효과)

## 🔄 지속적 개선

### 월별 리뷰
- 가장 많이 실패하는 테스트는?
- 가장 쓸모없는 테스트는?
- 놓치고 있는 중요한 테스트는?

### 테스트 추가 기준
1. 실제 버그가 발생한 부분
2. 사용자 리포트가 많은 기능
3. 복잡도가 높은 로직

---

마지막 업데이트: 2025-01-28
다음 리뷰: 2025-02-28