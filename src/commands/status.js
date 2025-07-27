import chalk from 'chalk';
import boxen from 'boxen';
import { getInstalledTools } from '../utils/config.js';
import { commandExists } from '../utils/runner.js';
import * as emoji from 'node-emoji';

// 상태 확인 도구 목록
const toolsToCheck = [
  { name: 'Homebrew', command: 'brew', emoji: 'beer' },
  { name: 'iTerm2', command: 'test -d /Applications/iTerm.app', emoji: 'computer' },
  { name: 'Oh My Zsh', command: 'test -d ~/.oh-my-zsh', emoji: 'art' },
  { name: 'Node.js', command: 'node', emoji: 'package' },
  { name: 'npm', command: 'npm', emoji: 'package' },
  { name: 'Git', command: 'git', emoji: 'octopus' },
  { name: 'Visual Studio Code', command: 'code', emoji: 'pencil' },
  { name: 'Claude CLI', command: 'claude', emoji: 'robot' },
  { name: 'Gemini CLI', command: 'gemini', emoji: 'sparkles' }
];

// 설치 상태 표시
export async function showStatus() {
  console.log(chalk.bold('\n📊 시스템 상태 확인\n'));
  
  const results = [];
  
  for (const tool of toolsToCheck) {
    const isInstalled = await checkToolInstalled(tool.command);
    const icon = isInstalled ? '✅' : '❌';
    const status = isInstalled ? chalk.green('설치됨') : chalk.red('미설치');
    const emojiIcon = emoji.get(tool.emoji) || '📦';
    
    results.push(`${icon} ${emojiIcon} ${tool.name}: ${status}`);
  }
  
  // 설정에서 설치 기록 가져오기
  const installedFromConfig = getInstalledTools();
  const installedCount = Object.keys(installedFromConfig).length;
  
  // 박스로 표시
  const statusBox = boxen(results.join('\n'), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue',
    title: '설치 상태',
    titleAlignment: 'center'
  });
  
  console.log(statusBox);
  
  // 추가 정보
  console.log(chalk.gray(`\n💾 설정 파일에 기록된 설치 항목: ${installedCount}개`));
  
  if (installedCount > 0) {
    console.log(chalk.gray('\n최근 설치 기록:'));
    Object.entries(installedFromConfig).slice(-3).forEach(([tool, info]) => {
      const date = new Date(info.date).toLocaleDateString('ko-KR');
      console.log(chalk.gray(`  • ${tool}: ${date}`));
    });
  }
  
  // 추천 사항
  const notInstalled = toolsToCheck.filter(async (tool) => 
    !(await checkToolInstalled(tool.command))
  );
  
  if (notInstalled.length > 0) {
    console.log(chalk.yellow('\n💡 추천: 다음 도구들을 설치하면 좋아요:'));
    console.log(chalk.gray('  • Homebrew (필수)'));
    console.log(chalk.gray('  • iTerm2 (더 나은 터미널)'));
    console.log(chalk.gray('  • Oh My Zsh (예쁜 터미널)'));
  }
}

// 도구 설치 확인
async function checkToolInstalled(command) {
  try {
    if (command.startsWith('test ')) {
      // test 명령어로 파일/폴더 존재 확인
      const { runCommand } = await import('../utils/runner.js');
      const result = await runCommand(command, { silent: true });
      return result.exitCode === 0;
    } else {
      // 명령어 존재 확인
      return await commandExists(command);
    }
  } catch {
    return false;
  }
}