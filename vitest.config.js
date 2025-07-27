import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Jest와 유사한 글로벌 API 사용
    globals: true,
    
    // 테스트 환경
    environment: 'node',
    
    // 커버리지 설정
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.test.js',
        '**/*.config.js',
        'coverage/**',
        'dist/**',
        '.devcontainer/**',
        'docker/**'
      ],
      thresholds: {
        global: {
          statements: 5,
          branches: 5,
          functions: 5,
          lines: 5
        }
      }
    },
    
    // 테스트 파일 패턴
    include: ['tests/**/*.test.js'],
    
    // 타임아웃
    testTimeout: 10000,
    
    // 병렬 실행
    maxConcurrency: 5,
    
    // 모의 객체 자동 정리
    clearMocks: true,
    
    // 설정 파일
    setupFiles: ['./tests/setup.js']
  }
});