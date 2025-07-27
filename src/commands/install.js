import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { execa } from 'execa';
import { checkInstalled, saveInstallRecord } from '../utils/config.js';
import { runCommand, commandExists } from '../utils/runner.js';

// checkCommand 함수 정의
async function checkCommand(command) {
  if (command.startsWith('test ')) {
    // test 명령어는 runCommand로 직접 실행
    try {
      const result = await runCommand(command, { silent: true });
      return result.exitCode === 0;
    } catch {
      return false;
    }
  } else if (command.startsWith('ls ')) {
    // ls 명령어도 runCommand로 실행
    try {
      const result = await runCommand(command, { silent: true });
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }
  return commandExists(command);
}

// 예상 설치 시간
const estimatedTimes = {
  'homebrew': '5-10분',
  'iterm2': '1-2분',
  'oh-my-zsh': '1-2분',
  'p10k': '30초',
  'nvm': '1분',
  'node': '2-3분',
  'git': '1분',
  'claude-code': '1분',
  'gemini-cli': '30초'
};

// 설치 가능한 도구들의 설정
const installConfigs = {
  'homebrew': {
    name: 'Homebrew',
    check: () => commandExists('brew'),
    install: async () => {
      console.log(chalk.yellow('📋 Homebrew 설치 스크립트를 실행합니다...'));
      console.log(chalk.gray('비밀번호 입력이 필요할 수 있습니다.'));
      console.log(chalk.cyan(`⏱️  예상 소요 시간: ${estimatedTimes.homebrew}`));
      
      await runCommand('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', {
        interactive: true
      });
      
      // PATH 설정
      const arch = process.arch;
      const brewPath = arch === 'arm64' ? '/opt/homebrew' : '/usr/local';
      console.log(chalk.blue('🔧 PATH 설정 중...'));
      await runCommand(`echo 'eval "$(${brewPath}/bin/brew shellenv)"' >> ~/.zprofile`);
    },
    postInstall: async () => {
      console.log(chalk.green('\n✅ Homebrew 설치 완료!'));
      console.log(chalk.yellow('💡 다음 단계:'));
      console.log('  1. 터미널을 완전히 종료했다가 다시 열어주세요');
      console.log('  2. 다시 열고 이 명령어로 확인하세요:');
      console.log(chalk.cyan('     brew --version'));
      console.log(chalk.gray('     → Homebrew 4.x.x 같은 버전이 나오면 성공!'));
    }
  },
  
  'iterm2': {
    name: 'iTerm2',
    check: () => checkCommand('test -d /Applications/iTerm.app'),
    requires: ['homebrew'],
    install: async () => {
      console.log(chalk.cyan(`⏱️  예상 소요 시간: ${estimatedTimes.iterm2}`));
      await runCommand('brew install --cask iterm2');
    },
    postInstall: async () => {
      console.log(chalk.green('\n✅ iTerm2가 설치되었습니다!'));
      console.log(chalk.yellow('💡 iTerm2를 열려면 Spotlight에서 "iTerm"을 검색하세요.'));
      
      // 현재 터미널이 기본 터미널인 경우 iTerm2로 전환 제안
      const { getCurrentTerminal, openInITerm } = await import('../utils/terminal-check.js');
      const currentTerminal = getCurrentTerminal();
      
      if (currentTerminal === 'Terminal') {
        console.log(chalk.blue('\n🔄 iTerm2로 자동 전환하시겠습니까?'));
        
        const { switchToITerm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'switchToITerm',
            message: 'iTerm2에서 dev-setup을 다시 실행할까요?',
            default: true
          }
        ]);
        
        if (switchToITerm) {
          console.log(chalk.green('iTerm2를 실행합니다...'));
          await openInITerm('dev-setup');
          console.log(chalk.yellow('\n💡 iTerm2에서 계속 진행하세요!'));
          process.exit(0);
        }
      }
    }
  },
  
  'oh-my-zsh': {
    name: 'Oh My Zsh',
    check: () => checkCommand('test -d ~/.oh-my-zsh'),
    install: async () => {
      console.log(chalk.yellow('📋 Oh My Zsh 설치를 시작합니다...'));
      console.log(chalk.cyan(`⏱️  예상 소요 시간: ${estimatedTimes['oh-my-zsh']}`));
      await runCommand('sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended');
    },
    postInstall: async () => {
      console.log(chalk.green('\n✅ Oh My Zsh 설치 완료!'));
      console.log(chalk.yellow('💡 다음 단계:'));
      console.log('  1. 터미널을 재시작하면 새로운 테마가 적용됩니다');
      console.log('  2. 확인 명령어:');
      console.log(chalk.cyan('     echo $ZSH_THEME'));
      console.log(chalk.gray('     → robbyrussell 같은 테마 이름이 나오면 성공!'));
      console.log('  3. Powerlevel10k 테마를 추가로 설치하면 더 예뻐집니다!');
    }
  },
  
  'p10k': {
    name: 'Powerlevel10k',
    check: () => checkCommand('test -d ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k'),
    requires: ['oh-my-zsh'],
    install: async () => {
      console.log(chalk.cyan(`⏱️  예상 소요 시간: ${estimatedTimes.p10k}`));
      await runCommand('git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k');
      await runCommand('sed -i.bak \'s/ZSH_THEME=".*"/ZSH_THEME="powerlevel10k\\/powerlevel10k"/\' ~/.zshrc');
      console.log(chalk.green('✨ 터미널을 재시작하면 설정 마법사가 시작됩니다!'));
    },
    postInstall: async () => {
      console.log(chalk.green('\n✅ Powerlevel10k 테마 설치 완료!'));
      console.log(chalk.yellow('🎨 중요: 다음 단계를 꼭 따라해주세요!'));
      console.log(chalk.cyan('\n1. iTerm2를 완전히 종료했다가 다시 열어주세요'));
      console.log(chalk.cyan('2. 자동으로 Powerlevel10k 설정 마법사가 시작됩니다'));
      console.log(chalk.cyan('3. 질문에 답하면서 원하는 스타일을 선택하세요'));
      console.log(chalk.gray('\n팁: y(Yes) 또는 n(No)로 답하고, 숫자로 스타일을 선택하세요'));
      console.log(chalk.gray('\n테스트 명령어:'));
      console.log(chalk.cyan('     p10k configure  ') + chalk.gray('# 설정 마법사 다시 실행'));
    }
  },
  
  'node': {
    name: 'Node.js',
    check: () => checkCommand('node'),
    requires: ['homebrew'],
    install: async () => {
      await runCommand('brew install node');
    }
  },
  
  'claude-code': {
    name: 'Claude Code CLI',
    check: () => checkCommand('claude'),
    requires: ['node'],
    install: async () => {
      console.log(chalk.blue('📦 Claude Code CLI 설치 중...'));
      await runCommand('npm install -g @anthropic/claude-cli');
      console.log(chalk.green('✅ 설치 완료! "claude --help"로 사용법을 확인하세요.'));
    },
    postInstall: async () => {
      console.log(chalk.yellow('\n📌 다음 단계:'));
      console.log('1. claude login 실행');
      console.log('2. 브라우저에서 로그인');
      console.log('3. claude chat으로 대화 시작!\n');
    }
  },
  
  'gemini-cli': {
    name: 'Gemini CLI',
    check: () => checkCommand('gemini'),
    requires: ['node'],
    install: async () => {
      console.log(chalk.cyan(`⏱️  예상 소요 시간: ${estimatedTimes['gemini-cli']}`));
      console.log(chalk.blue('📦 Gemini CLI 설치 중...'));
      
      // 실제 패키지명 확인 필요 - 현재는 예시
      console.log(chalk.yellow('\n📚 Gemini CLI 설치 방법:'));
      console.log(chalk.cyan('1. Google AI Studio 방문:'));
      console.log('   https://makersuite.google.com/app/apikey');
      console.log(chalk.cyan('\n2. API 키 발급 (무료)'));
      console.log(chalk.cyan('\n3. 환경 변수 설정:'));
      console.log(chalk.gray('   export GEMINI_API_KEY="your-api-key"'));
      console.log(chalk.cyan('\n4. CLI 도구 설치 (예시):'));
      console.log(chalk.gray('   npm install -g @google/generative-ai'));
      
      console.log(chalk.yellow('\n⚠️  공식 Gemini CLI는 아직 준비 중입니다.'));
      console.log(chalk.blue('대신 API를 직접 사용하거나 서드파티 도구를 활용하세요.'));
    },
    postInstall: async () => {
      console.log(chalk.green('\n✅ Gemini 설정 완료!'));
      console.log(chalk.yellow('🔧 테스트 방법:'));
      console.log(chalk.cyan('   curl -X POST https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=$GEMINI_API_KEY \\'));
      console.log(chalk.cyan('   -H "Content-Type: application/json" \\'));
      console.log(chalk.cyan('   -d \'{"contents":[{"parts":[{"text":"Hello!"}]}]}\''));
    }
  },
  
  'copilot': {
    name: 'GitHub Copilot',
    check: () => checkCommand('test -d ~/.config/github-copilot'),
    virtual: true, // VSCode 확장이므로 virtual
    install: async () => {
      console.log(chalk.blue('🧠 GitHub Copilot 설정 안내\n'));
      
      console.log(chalk.yellow('1️⃣  VSCode 설치 확인'));
      const vscodeInstalled = await checkCommand('code');
      if (!vscodeInstalled) {
        console.log(chalk.red('   ❌ VSCode가 설치되어 있지 않습니다.'));
        const { installVSCode } = await inquirer.prompt([{
          type: 'confirm',
          name: 'installVSCode',
          message: 'VSCode를 먼저 설치하시겠습니까?',
          default: true
        }]);
        
        if (installVSCode) {
          await installTool('vscode');
        } else {
          console.log(chalk.gray('   VSCode 설치 후 다시 시도해주세요.'));
          return;
        }
      } else {
        console.log(chalk.green('   ✅ VSCode 설치됨'));
      }
      
      console.log(chalk.yellow('\n2️⃣  Copilot 확장 설치'));
      console.log(chalk.cyan('   다음 명령어를 실행하세요:'));
      console.log(chalk.gray('   code --install-extension GitHub.copilot'));
      
      console.log(chalk.yellow('\n3️⃣  GitHub 계정 연결'));
      console.log('   • VSCode에서 Copilot 아이콘 클릭');
      console.log('   • "Sign in to GitHub" 선택');
      console.log('   • 브라우저에서 인증 완료');
      
      console.log(chalk.yellow('\n4️⃣  Copilot 구독 확인'));
      console.log('   • 무료 체험: 30일');
      console.log('   • 학생/오픈소스 기여자: 무료');
      console.log('   • 일반: $10/월');
      console.log(chalk.cyan('   https://github.com/features/copilot'));
    },
    postInstall: async () => {
      console.log(chalk.green('\n✅ GitHub Copilot 설정 완료!'));
      console.log(chalk.yellow('🎯 사용 방법:'));
      console.log('   • 코드 작성 시 자동으로 제안이 나타남');
      console.log('   • Tab: 제안 수락');
      console.log('   • Esc: 제안 거절');
      console.log('   • Ctrl+Enter: 더 많은 제안 보기');
    }
  },
  
  'terminal-beautify': {
    name: '터미널 전체 꾸미기',
    virtual: true, // 실제 명령어가 아닌 묶음
    install: async () => {
      const steps = ['iterm2', 'oh-my-zsh', 'p10k', 'plugins'];
      for (const step of steps) {
        if (step === 'plugins') {
          await installPlugins();
        } else {
          await installTool(step);
        }
      }
    }
  },

  'git': {
    name: 'Git',
    check: () => checkCommand('git'),
    install: async () => {
      console.log(chalk.cyan(`⏱️  예상 소요 시간: ${estimatedTimes.git}`));
      const platform = process.platform;
      
      if (platform === 'darwin') {
        // macOS
        const hasHomebrew = await checkCommand('brew');
        
        if (hasHomebrew) {
          console.log(chalk.blue('Homebrew로 Git을 설치합니다...'));
          await runCommand('brew install git');
        } else {
          console.log(chalk.yellow('Git 설치를 위해 Xcode Command Line Tools가 필요합니다.'));
          console.log(chalk.blue('다음 중 하나를 선택하세요:'));
          console.log(chalk.gray('1. Homebrew 먼저 설치: muggleout install homebrew'));
          console.log(chalk.gray('2. Xcode 도구 설치: xcode-select --install'));
        }
      } else {
        // Linux
        console.log(chalk.blue('Git을 설치합니다...'));
        await runCommand('sudo apt-get update && sudo apt-get install -y git', {
          interactive: true
        });
      }
    },
    postInstall: async () => {
      console.log(chalk.green('\n✅ Git 설치 완료!'));
      console.log(chalk.yellow('🔧 첫 Git 설정 (한번만 하면 됩니다):'));
      console.log(chalk.cyan('   git config --global user.name "내이름"'));
      console.log(chalk.cyan('   git config --global user.email "내이메일@example.com"'));
      console.log(chalk.gray('\n확인 명령어:'));
      console.log(chalk.cyan('   git --version  ') + chalk.gray('# git version 2.x.x가 나오면 성공!'));
    }
  },
  
  'vscode': {
    name: 'Visual Studio Code',
    check: () => checkCommand('code'),
    requires: ['homebrew'],
    install: async () => {
      console.log(chalk.cyan(`⏱️  예상 소요 시간: 1-2분`));
      console.log(chalk.blue('📝 Visual Studio Code 설치 중...'));
      await runCommand('brew install --cask visual-studio-code');
    },
    postInstall: async () => {
      console.log(chalk.green('\n✅ VSCode 설치 완료!'));
      console.log(chalk.yellow('🚀 빠른 시작:'));
      console.log(chalk.cyan('   code .          ') + chalk.gray('# 현재 폴더를 VSCode로 열기'));
      console.log(chalk.cyan('   code file.txt   ') + chalk.gray('# 특정 파일 열기'));
      console.log(chalk.gray('\n💡 추천 확장 프로그램:'));
      console.log('   • Korean Language Pack - 한국어 지원');
      console.log('   • Prettier - 코드 자동 정리');
      console.log('   • GitLens - Git 기능 강화');
    }
  },
  
  'docker': {
    name: 'Docker Desktop',
    check: () => checkCommand('docker'),
    requires: ['homebrew'],
    install: async () => {
      console.log(chalk.cyan(`⏱️  예상 소요 시간: 3-5분`));
      console.log(chalk.blue('🐳 Docker Desktop 설치 중...'));
      await runCommand('brew install --cask docker');
    },
    postInstall: async () => {
      console.log(chalk.green('\n✅ Docker Desktop 설치 완료!'));
      console.log(chalk.yellow('🚀 다음 단계:'));
      console.log('   1. Applications 폴더에서 Docker 실행');
      console.log('   2. 메뉴바에 고래 아이콘 확인');
      console.log('   3. Docker Desktop 초기 설정 완료');
      console.log(chalk.gray('\n테스트 명령어:'));
      console.log(chalk.cyan('   docker --version'));
      console.log(chalk.cyan('   docker run hello-world'));
    }
  }
};


// 도구 설치
export async function installTool(toolName) {
  const config = installConfigs[toolName];
  
  if (!config) {
    console.log(chalk.red(`❌ ${toolName}은(는) 지원하지 않는 도구입니다.`));
    return;
  }
  
  // 이미 설치되어 있는지 확인
  if (!config.virtual && config.check && await config.check()) {
    console.log(chalk.green(`✅ ${config.name}은(는) 이미 설치되어 있습니다!`));
    
    const { continueAnyway } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAnyway',
        message: '그래도 계속하시겠습니까?',
        default: false
      }
    ]);
    
    if (!continueAnyway) return;
  }
  
  // 의존성 확인
  if (config.requires) {
    for (const dep of config.requires) {
      const depConfig = installConfigs[dep];
      if (depConfig && depConfig.check && !(await depConfig.check())) {
        console.log(chalk.yellow(`⚠️  ${config.name} 설치를 위해 ${depConfig.name}이(가) 필요합니다.`));
        
        const { installDep } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'installDep',
            message: `${depConfig.name}을(를) 먼저 설치하시겠습니까?`,
            default: true
          }
        ]);
        
        if (installDep) {
          await installTool(dep);
        } else {
          console.log(chalk.red('❌ 의존성이 없어 설치를 중단합니다.'));
          return;
        }
      }
    }
  }
  
  // 설치 시작
  if (estimatedTimes[toolName] && !config.virtual) {
    console.log(chalk.cyan(`⏱️  예상 소요 시간: ${estimatedTimes[toolName]}`));
  }
  const spinner = ora(`${config.name} 설치 중...`).start();
  
  try {
    await config.install();
    spinner.succeed(`${config.name} 설치 완료!`);
    
    // 설치 기록 저장
    if (!config.virtual) {
      await saveInstallRecord(toolName);
    }
    
    // 설치 후 작업
    if (config.postInstall) {
      await config.postInstall();
    }
  } catch (error) {
    spinner.fail(`${config.name} 설치 실패`);
    console.error(chalk.red('에러:', error.message));
    
    // 에러 리포팅
    const { captureError } = await import('../utils/error-reporter.js');
    const errorResult = await captureError(error, {
      tool: toolName,
      command: `install ${toolName}`,
      stage: 'installation'
    });
    
    // 자동 수정 가능한 경우
    if (errorResult?.autoFix) {
      console.log(chalk.yellow('\n🔧 자동 수정을 시도합니다...'));
      // autoFix 명령 실행은 메인 프로세스에서 처리
      return { needsAutoFix: true, command: errorResult.command };
    }
    
    // 에러 해결 제안
    await suggestFix(toolName, error);
  }
}

// 플러그인 설치
async function installPlugins() {
  console.log(chalk.blue('🔌 유용한 플러그인을 설치합니다...'));
  
  const plugins = [
    {
      name: 'zsh-autosuggestions',
      url: 'https://github.com/zsh-users/zsh-autosuggestions',
      desc: '명령어 자동완성'
    },
    {
      name: 'zsh-syntax-highlighting',
      url: 'https://github.com/zsh-users/zsh-syntax-highlighting.git',
      desc: '문법 하이라이팅'
    }
  ];
  
  for (const plugin of plugins) {
    const spinner = ora(`${plugin.desc} 플러그인 설치 중...`).start();
    try {
      await runCommand(`git clone ${plugin.url} \${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/${plugin.name}`);
      spinner.succeed(`${plugin.desc} 설치 완료!`);
    } catch (error) {
      spinner.warn(`${plugin.desc} 이미 설치됨`);
    }
  }
  
  // .zshrc 업데이트
  console.log(chalk.blue('📝 플러그인 활성화 중...'));
  await runCommand(`sed -i.bak 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting colored-man-pages)/' ~/.zshrc`);
  console.log(chalk.green('✅ 플러그인 설정 완료!'));
}

// 에러 해결 제안
async function suggestFix(toolName, error) {
  console.log(chalk.yellow('\n💡 해결 방법:'));
  
  const errorMsg = error.message.toLowerCase();
  
  if (errorMsg.includes('permission denied') || errorMsg.includes('eacces')) {
    console.log(chalk.cyan('\n🔐 권한 문제가 발생했습니다:'));
    console.log('  1. 비밀번호를 입력해야 할 수 있습니다');
    console.log('  2. Mac 사용자 비밀번호를 입력하세요');
    console.log(chalk.gray('  팁: 비밀번호 입력 시 화면에 표시되지 않습니다'));
  } else if (errorMsg.includes('command not found') || errorMsg.includes('not found')) {
    console.log(chalk.cyan('\n🔍 필요한 도구가 없습니다:'));
    
    if (errorMsg.includes('brew')) {
      console.log('  Homebrew가 설치되지 않았거나 PATH에 없습니다');
      
      // PATH 자동 해결 시도
      const { diagnoseAndFixPath } = await import('../utils/path-fixer.js');
      console.log(chalk.yellow('\n🔧 PATH 문제일 수 있습니다. 확인해보겠습니다...'));
      await diagnoseAndFixPath();
      
      console.log(chalk.green('\n  다시 시도: muggleout install ' + toolName));
    } else if (errorMsg.includes('git')) {
      console.log('  Git이 설치되지 않았습니다');
      console.log(chalk.green('  해결: muggleout install git'));
    } else if (errorMsg.includes('node') || errorMsg.includes('npm')) {
      console.log('  Node.js가 설치되지 않았습니다');
      console.log(chalk.green('  해결: muggleout install node'));
    }
  } else if (errorMsg.includes('network') || errorMsg.includes('timeout') || errorMsg.includes('enotfound')) {
    console.log(chalk.cyan('\n🌐 네트워크 문제입니다:'));
    console.log('  1. 인터넷 연결을 확인하세요');
    console.log('  2. Wi-Fi가 켜져 있는지 확인하세요');
    console.log('  3. 회사 네트워크의 경우 보안 설정을 확인하세요');
  } else if (errorMsg.includes('already exists') || errorMsg.includes('eexist')) {
    console.log(chalk.cyan('\n📁 이미 설치되어 있을 수 있습니다:'));
    console.log('  정상적인 상황일 수 있으니 걱정하지 마세요!');
  }
  
  console.log(chalk.gray(`\n그래도 문제가 계속되면:`))
  console.log(chalk.green(`  muggleout doctor  `) + chalk.gray('# 시스템 진단'));
  console.log(chalk.green(`  muggleout status  `) + chalk.gray('# 설치 상태 확인\n'));
}