import chalk from 'chalk';
import { execa } from 'execa';
import { commandExists } from './runner.js';
import boxen from 'boxen';

// 현재 터미널 환경 확인
export function getCurrentTerminal() {
  const term = process.env.TERM_PROGRAM;
  
  if (term === 'iTerm.app') {
    return 'iTerm2';
  } else if (term === 'Apple_Terminal') {
    return 'Terminal';
  } else if (term === 'vscode') {
    return 'VS Code';
  } else {
    return 'Unknown';
  }
}

// iTerm2 설치 확인
export async function isITerm2Installed() {
  try {
    await execa('test', ['-d', '/Applications/iTerm.app']);
    return true;
  } catch {
    return false;
  }
}

// iTerm2 사용 권장 메시지
export async function checkTerminalEnvironment() {
  const currentTerminal = getCurrentTerminal();
  const itermInstalled = await isITerm2Installed();
  
  if (currentTerminal !== 'iTerm2' && itermInstalled && process.platform === 'darwin') {
    console.log(boxen(
      chalk.yellow('⚠️  iTerm2가 설치되어 있지만 기본 터미널을 사용 중입니다!\n\n') +
      chalk.blue('iTerm2를 사용하면:\n') +
      chalk.gray('• 더 예쁜 테마와 색상\n') +
      chalk.gray('• 분할 화면 기능\n') +
      chalk.gray('• 더 나은 복사/붙여넣기\n') +
      chalk.gray('• 강력한 검색 기능\n\n') +
      chalk.green('💡 iTerm2 실행: Spotlight에서 "iTerm" 검색'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'yellow'
      }
    ));
    return false;
  }
  
  return true;
}

// iTerm2에서 명령 실행
export async function openInITerm(command) {
  const script = `
    tell application "iTerm"
      activate
      
      if (count of windows) = 0 then
        create window with default profile
      end if
      
      tell current window
        tell current session
          write text "${command}"
        end tell
      end tell
    end tell
  `;
  
  try {
    await execa('osascript', ['-e', script]);
    return true;
  } catch (error) {
    console.error(chalk.red('iTerm2 실행 실패:', error.message));
    return false;
  }
}

// iTerm2 자동 전환 제안
export async function suggestITermSwitch() {
  const currentTerminal = getCurrentTerminal();
  const itermInstalled = await isITerm2Installed();
  
  if (currentTerminal === 'Terminal' && itermInstalled) {
    console.log(chalk.yellow('\n🔄 iTerm2로 전환하시겠습니까?'));
    console.log(chalk.gray('iTerm2는 더 많은 기능과 더 나은 사용자 경험을 제공합니다.'));
    
    // inquirer로 선택 받기 (상위에서 처리)
    return true;
  }
  
  return false;
}

// 터미널 정보 가져오기
export function getTerminalInfo() {
  const term = process.env.TERM_PROGRAM;
  let terminal = 'Unknown Terminal';
  
  if (term === 'iTerm.app') {
    terminal = 'iTerm2';
  } else if (term === 'Apple_Terminal') {
    terminal = 'Terminal.app';
  } else if (term === 'vscode') {
    terminal = 'VS Code Terminal';
  } else if (process.env.ITERM_PROFILE) {
    terminal = 'iTerm2';
  }
  
  return {
    terminal,
    version: process.env.TERM_PROGRAM_VERSION || 'Unknown',
    shell: process.env.SHELL || 'Unknown',
    shellVersion: process.env.ZSH_VERSION || process.env.BASH_VERSION || 'Unknown'
  };
}