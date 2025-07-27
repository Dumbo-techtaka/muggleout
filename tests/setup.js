// Vitest 테스트 환경 설정
import { vi, beforeEach, afterEach } from 'vitest';

// 전역 모킹
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn()
};

// 테스트 환경 변수 설정
process.env.NODE_ENV = 'test';
process.env.MUGGLEOUT_TEST = 'true';

// 각 테스트 전 초기화
beforeEach(() => {
  vi.clearAllMocks();
});

// 각 테스트 후 정리
afterEach(() => {
  vi.restoreAllMocks();
});