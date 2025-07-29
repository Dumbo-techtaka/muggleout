// CI 환경 헬퍼 함수들

export function isCI() {
  return !!(process.env.CI || process.env.MUGGLEOUT_TEST || process.env.GITHUB_ACTIONS);
}

export function createSpinner(text) {
  if (isCI()) {
    // CI 환경에서는 단순 로그만
    console.log(text);
    return {
      start: () => ({ succeed: () => {}, fail: () => {}, stop: () => {} }),
      succeed: (msg) => console.log('✅', msg || text),
      fail: (msg) => console.log('❌', msg || text),
      stop: () => {},
      text: ''
    };
  } else {
    // 일반 환경에서는 ora 사용
    const ora = (await import('ora')).default;
    return ora(text);
  }
}

export function shouldShowInteractive() {
  return !isCI();
}