import { execa } from 'execa';
import chalk from 'chalk';

// 명령어 실행 래퍼
export async function runCommand(command, options = {}) {
  const { interactive = false, silent = false } = options;
  
  // ~ 를 홈 디렉토리로 확장
  const expandedCommand = command.replace(/~/g, process.env.HOME || '');
  
  if (!silent) {
    console.log(chalk.gray(`$ ${command}`));
  }
  
  try {
    if (interactive) {
      // 대화형 명령어 (사용자 입력 필요)
      await execa('bash', ['-c', expandedCommand], {
        stdio: 'inherit',
        shell: true
      });
      return { stdout: '', stderr: '', exitCode: 0 };
    } else {
      // 일반 명령어 - shell: true 제거하여 정확한 exit code 얻기
      const result = await execa('bash', ['-c', expandedCommand]);
      
      if (result.stdout && !silent) {
        console.log(result.stdout);
      }
      
      if (result.stderr && !silent) {
        console.error(chalk.yellow(result.stderr));
      }
      
      return { stdout: result.stdout || '', stderr: result.stderr || '', exitCode: 0 };
    }
  } catch (error) {
    if (!silent) {
      console.error(chalk.red(`명령어 실행 실패: ${error.message}`));
    }
    // silent 모드에서는 에러를 던지지 않고 exitCode 반환
    if (silent && error.exitCode !== undefined) {
      return { stdout: error.stdout || '', stderr: error.stderr || '', exitCode: error.exitCode };
    }
    throw error;
  }
}

// 명령어 존재 확인
export async function commandExists(command) {
  try {
    // which로 먼저 경로 확인
    const { stdout: path } = await execa('which', [command]);
    
    // 실제로 실행 가능한지 확인 (--version 또는 --help 시도)
    try {
      await execa(command, ['--version'], { timeout: 3000 });
      return true;
    } catch {
      // --version이 실패하면 --help 시도
      try {
        await execa(command, ['--help'], { timeout: 3000 });
        return true;
      } catch {
        // 둘 다 실패하면 설치되지 않은 것으로 간주
        return false;
      }
    }
  } catch {
    return false;
  }
}