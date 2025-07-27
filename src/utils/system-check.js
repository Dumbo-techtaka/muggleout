import chalk from 'chalk';
import os from 'os';
import { execa } from 'execa';

// 시스템 정보 확인
export async function checkSystem() {
  const platform = process.env.TEST_PLATFORM || os.platform();
  
  // 개발/테스트 환경에서는 체크 스킵
  if (process.env.MUGGLEOUT_TEST || process.env.NODE_ENV === 'development') {
    console.log(chalk.gray('🧪 테스트 모드로 실행 중...'));
    return { platform, arch: os.arch() };
  }
  
  if (platform !== 'darwin') {
    console.log(chalk.red('❌ 이 도구는 현재 macOS에서만 작동합니다.'));
    console.log(chalk.yellow('💡 Windows/Linux 지원은 준비 중입니다!'));
    process.exit(1);
  }
  
  // macOS 버전 확인
  try {
    const { stdout } = await execa('sw_vers', ['-productVersion']);
    const version = stdout.trim();
    console.log(chalk.gray(`📱 macOS ${version} 감지됨`));
  } catch (error) {
    console.log(chalk.yellow('⚠️  macOS 버전을 확인할 수 없습니다.'));
  }
  
  // 프로세서 타입 확인
  const arch = os.arch();
  if (arch === 'arm64') {
    console.log(chalk.gray('🚀 Apple Silicon (M1/M2/M3) 프로세서'));
  } else if (arch === 'x64') {
    console.log(chalk.gray('💻 Intel 프로세서'));
  }
  
  return { platform, arch };
}

// 관리자 권한 확인
export async function checkSudo() {
  try {
    await execa('sudo', ['-n', 'true']);
    return true;
  } catch {
    return false;
  }
}

// 네트워크 연결 확인
export async function checkNetwork() {
  try {
    await execa('ping', ['-c', '1', '-t', '3', 'google.com']);
    return true;
  } catch {
    return false;
  }
}

// 디스크 공간 확인
export async function checkDiskSpace() {
  try {
    const { stdout } = await execa('df', ['-h', '/']);
    const lines = stdout.split('\n');
    const dataLine = lines[1];
    const parts = dataLine.split(/\s+/);
    const used = parseInt(parts[4]);
    
    if (used > 90) {
      console.log(chalk.yellow('⚠️  디스크 공간이 부족합니다 (90% 이상 사용 중)'));
      return false;
    }
    return true;
  } catch {
    return true; // 확인 실패시 계속 진행
  }
}