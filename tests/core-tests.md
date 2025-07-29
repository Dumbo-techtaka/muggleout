# 핵심 테스트 전략

## 🎯 테스트 원칙
1. **실제 동작 검증**: 모킹 최소화, 실제 실행 위주
2. **사용자 시나리오**: 초보자가 실제로 하는 일 테스트
3. **빠른 피드백**: 30초 내 전체 테스트 완료

## 📋 핵심 테스트 목록 (총 30개)

### 1. 자연어 처리 (10개)
- ✅ 한국어 명령 인식
- ✅ 도구명 변환 (클로드 → claude)
- ✅ 오타 허용 (터미날 → terminal)
- ✅ 복합 명령 (git 설치하고 싶어)

### 2. CLI 기본 동작 (8개)
- ✅ --version
- ✅ --help
- ✅ doctor (시스템 진단)
- ✅ status (설치 상태)
- ✅ 자연어 명령 실행
- ✅ 잘못된 명령 에러 처리

### 3. PATH 문제 해결 (5개)
- ✅ Homebrew PATH 감지
- ✅ .zshrc 자동 수정
- ✅ 중복 PATH 방지
- ✅ Node.js PATH 설정

### 4. 설정 관리 (4개)
- ✅ 설치 기록 저장
- ✅ 사용자 설정 유지
- ✅ 설정 초기화
- ✅ 업데이트 체크 상태

### 5. 에러 처리 (3개)
- ✅ 네트워크 오류
- ✅ 권한 오류
- ✅ 의존성 누락

## 🚀 구현 방법

```javascript
// tests/core/cli.test.js
import { execa } from 'execa';

describe('CLI 핵심 기능', () => {
  const cli = 'node bin/muggleout.js';
  
  it('버전 표시', async () => {
    const { stdout } = await execa(cli, ['--version']);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });
  
  it('한국어 명령 처리', async () => {
    const { stdout } = await execa(cli, ['도움말']);
    expect(stdout).toContain('사용법');
  });
});
```