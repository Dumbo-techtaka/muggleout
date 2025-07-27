import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { runCommand } from '../utils/runner.js';

// 문제 해결 설정
const fixes = {
  'command-not-found': {
    name: 'command not found 에러',
    diagnose: async (details) => {
      const command = extractCommand(details);
      const solutions = [];
      
      if (command === 'brew') {
        solutions.push({
          name: 'Homebrew PATH 재설정',
          fix: async () => {
            const arch = process.arch;
            const brewPath = arch === 'arm64' ? '/opt/homebrew' : '/usr/local';
            await runCommand(`echo 'eval "$(${brewPath}/bin/brew shellenv)"' >> ~/.zprofile`);
            await runCommand('source ~/.zprofile');
          }
        });
        solutions.push({
          name: 'Homebrew 재설치',
          fix: async () => {
            const { installTool } = await import('./install.js');
            await installTool('homebrew');
          }
        });
      } else if (command === 'node' || command === 'npm') {
        solutions.push({
          name: 'Node.js 설치',
          fix: async () => {
            const { installTool } = await import('./install.js');
            await installTool('node');
          }
        });
      } else {
        solutions.push({
          name: `${command} 설치 (Homebrew 사용)`,
          fix: async () => {
            await runCommand(`brew install ${command}`);
          }
        });
      }
      
      return solutions;
    }
  },
  
  'permission-denied': {
    name: 'Permission denied 에러',
    diagnose: async (details) => {
      return [
        {
          name: '파일/폴더 권한 변경',
          fix: async () => {
            const { path } = await inquirer.prompt([
              {
                type: 'input',
                name: 'path',
                message: '권한을 변경할 파일/폴더 경로:',
                default: '/usr/local'
              }
            ]);
            await runCommand(`sudo chown -R $(whoami) ${path}`);
          }
        },
        {
          name: 'npm 전역 디렉토리 변경',
          fix: async () => {
            await runCommand('mkdir ~/.npm-global');
            await runCommand('npm config set prefix "~/.npm-global"');
            await runCommand('echo \'export PATH=~/.npm-global/bin:$PATH\' >> ~/.zprofile');
            console.log(chalk.yellow('⚠️  터미널을 재시작해주세요!'));
          }
        }
      ];
    }
  },
  
  'slow-terminal': {
    name: '터미널이 느림',
    diagnose: async () => {
      return [
        {
          name: 'Oh My Zsh 플러그인 정리',
          fix: async () => {
            console.log(chalk.yellow('🔧 불필요한 플러그인을 제거합니다...'));
            await runCommand('sed -i.bak \'s/plugins=(.*)/plugins=(git)/\' ~/.zshrc');
            console.log(chalk.green('✅ 기본 플러그인만 남겼습니다.'));
          }
        },
        {
          name: 'Git 상태 표시 끄기',
          fix: async () => {
            await runCommand('git config --global oh-my-zsh.hide-dirty 1');
            console.log(chalk.green('✅ Git 상태 표시를 껐습니다.'));
          }
        },
        {
          name: 'Powerlevel10k 인스턴트 프롬프트 활성화',
          fix: async () => {
            console.log(chalk.blue('💡 p10k configure를 실행하여 "Instant Prompt"를 활성화하세요.'));
          }
        }
      ];
    }
  },
  
  'install-failed': {
    name: '설치 실패',
    diagnose: async () => {
      return [
        {
          name: 'Homebrew 업데이트 및 정리',
          fix: async () => {
            const spinner = ora('Homebrew 업데이트 중...').start();
            await runCommand('brew update');
            spinner.text = 'Homebrew 정리 중...';
            await runCommand('brew cleanup');
            spinner.succeed('Homebrew 업데이트 완료!');
          }
        },
        {
          name: 'npm 캐시 정리',
          fix: async () => {
            await runCommand('npm cache clean --force');
            console.log(chalk.green('✅ npm 캐시를 정리했습니다.'));
          }
        },
        {
          name: '시스템 진단 실행',
          fix: async () => {
            const { runDoctor } = await import('./doctor.js');
            await runDoctor();
          }
        }
      ];
    }
  }
};

// 명령어 추출
function extractCommand(details) {
  const match = details.match(/command not found:\s*(\w+)/i) || 
                details.match(/(\w+).*not found/i);
  return match ? match[1] : null;
}

// 문제 해결
export async function fixIssue(issue) {
  console.log(chalk.bold('\n🔧 문제 해결사가 도와드릴게요!\n'));
  
  // 문제 타입 파악
  let issueType = issue;
  let details = '';
  
  // 자연어 입력 처리
  if (!fixes[issue]) {
    if (issue.includes('not found')) {
      issueType = 'command-not-found';
      details = issue;
    } else if (issue.includes('permission') || issue.includes('denied')) {
      issueType = 'permission-denied';
      details = issue;
    } else if (issue.includes('느') || issue.includes('slow')) {
      issueType = 'slow-terminal';
    } else {
      issueType = 'install-failed';
    }
  }
  
  const fixConfig = fixes[issueType];
  
  if (!fixConfig) {
    console.log(chalk.red('❌ 해당 문제에 대한 해결책을 찾을 수 없습니다.'));
    console.log(chalk.yellow('💡 "dev-setup doctor"로 시스템을 진단해보세요.'));
    return;
  }
  
  console.log(chalk.blue(`문제: ${fixConfig.name}`));
  
  // 해결책 찾기
  const solutions = await fixConfig.diagnose(details);
  
  if (solutions.length === 0) {
    console.log(chalk.red('❌ 구체적인 해결책을 찾을 수 없습니다.'));
    return;
  }
  
  // 해결책 선택
  const { solution } = await inquirer.prompt([
    {
      type: 'list',
      name: 'solution',
      message: '시도할 해결 방법을 선택하세요:',
      choices: [
        ...solutions.map((s, i) => ({
          name: s.name,
          value: i
        })),
        { name: '취소', value: -1 }
      ]
    }
  ]);
  
  if (solution === -1) {
    console.log(chalk.gray('취소되었습니다.'));
    return;
  }
  
  // 해결책 실행
  try {
    await solutions[solution].fix();
    console.log(chalk.green('\n✅ 문제 해결을 시도했습니다!'));
    console.log(chalk.yellow('💡 문제가 계속되면 다른 해결책을 시도해보세요.'));
  } catch (error) {
    console.log(chalk.red('\n❌ 해결 중 오류가 발생했습니다:'));
    console.log(chalk.red(error.message));
  }
}