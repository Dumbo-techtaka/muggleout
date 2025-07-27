import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import { installTool } from '../commands/install.js';
import { showStatus } from '../commands/status.js';
import { runDoctor } from '../commands/doctor.js';
import { handleNaturalCommand } from '../parsers/natural-language.js';
import { commandExists } from '../utils/runner.js';
import * as emoji from 'node-emoji';

// 도구 설치 상태 확인
async function checkToolInstalled(command) {
  if (command.startsWith('test ')) {
    // test 명령어는 runCommand로 실행
    const { runCommand } = await import('../utils/runner.js');
    try {
      const result = await runCommand(command, { silent: true });
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }
  return commandExists(command);
}

// iTerm2 사용 권장 메시지 표시
async function checkITermStatus() {
  if (process.platform !== 'darwin') return;
  
  const currentTerminal = process.env.TERM_PROGRAM;
  const iTermInstalled = await checkToolInstalled('test -d /Applications/iTerm.app');
  
  // iTerm2가 설치되어 있지만 사용하지 않는 경우
  if (iTermInstalled && currentTerminal !== 'iTerm.app') {
    console.log(chalk.bgYellow.black('\n 💡 iTerm2 사용 권장 '));
    console.log(chalk.yellow('iTerm2가 설치되어 있지만 기본 터미널을 사용 중입니다.'));
    console.log(chalk.gray('더 나은 터미널 경험을 위해 iTerm2 사용을 권장합니다!'));
    console.log(chalk.cyan('실행 방법: Spotlight에서 "iTerm" 검색\n'));
  }
}

// 메인 메뉴
const mainMenuChoices = [
  {
    name: `${emoji.get('art')} 터미널 꾸미기`,
    value: 'beautify',
    short: '터미널 꾸미기'
  },
  {
    name: `${emoji.get('package')} 개발 도구 설치`,
    value: 'install',
    short: '도구 설치'
  },
  {
    name: `${emoji.get('robot')} AI 도구 설정`,
    value: 'ai-tools',
    short: 'AI 도구'
  },
  {
    name: `${emoji.get('rocket')} CLI 사용법 가이드`,
    value: 'cli-guide',
    short: 'CLI 가이드'
  },
  {
    name: `${emoji.get('wrench')} 문제 해결`,
    value: 'troubleshoot',
    short: '문제 해결'
  },
  {
    name: `${emoji.get('clipboard')} 설치 상태 확인`,
    value: 'status',
    short: '상태 확인'
  },
  {
    name: `${emoji.get('books')} 문서 보기`,
    value: 'docs',
    short: '문서'
  },
  {
    name: `${emoji.get('speech_balloon')} 프롬프트 모드`,
    value: 'prompt',
    short: '프롬프트'
  },
  {
    name: `${emoji.get('arrows_counterclockwise')} 업데이트 확인`,
    value: 'update',
    short: '업데이트'
  },
  {
    name: `${emoji.get('door')} 종료`,
    value: 'exit',
    short: '종료'
  }
];

// 대화형 모드 시작
export async function startInteractiveMode(initialMenu = null) {
  // 테스트 환경에서는 대화형 모드를 건너뛰기
  if (process.env.NODE_ENV === 'test' || process.env.CI === 'true') {
    console.log('🎮 대화형 모드 (테스트 환경에서는 건너뛰기)');
    return;
  }
  
  console.log(chalk.bold('\n🎮 대화형 모드를 시작합니다!\n'));
  
  if (initialMenu) {
    await handleMenuSelection(initialMenu);
    return;
  }
  
  // iTerm2 권장 체크 (대화형 모드 시작할 때)
  await checkITermStatus();
  
  while (true) {
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: '어떤 작업을 하시겠습니까?',
        choices: mainMenuChoices,
        pageSize: 10
      }
    ]);
    
    if (choice === 'exit') {
      console.log(chalk.green('\n👋 안녕히 가세요!\n'));
      break;
    }
    
    await handleMenuSelection(choice);
    
    // 메뉴 선택 후에도 iTerm2 권장 체크
    await checkITermStatus();
  }
}

// 메뉴 선택 처리
async function handleMenuSelection(choice) {
  switch (choice) {
    case 'beautify':
      await beautifyTerminal();
      break;
      
    case 'install':
      await installTools();
      break;
      
    case 'ai-tools':
      await setupAITools();
      break;
      
    case 'cli-guide':
      await showCLIGuide();
      break;
      
    case 'troubleshoot':
      await troubleshoot();
      break;
      
    case 'status':
      await showStatus();
      break;
      
    case 'docs':
      showDocs();
      break;
      
    case 'prompt':
      await startPromptMode();
      break;
      
    case 'update':
      const { runUpdate } = await import('../commands/update.js');
      await runUpdate();
      break;
  }
}

// 터미널 꾸미기
async function beautifyTerminal() {
  // 먼저 미리보기 표시
  const { showTerminalPreview } = await import('../utils/preview.js');
  showTerminalPreview();
  
  console.log(chalk.yellow('\n💡 위와 같이 터미널이 예뻐집니다!'));
  
  const { confirmInstall } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmInstall',
      message: '설치를 진행하시겠습니까?',
      default: true
    }
  ]);
  
  if (!confirmInstall) {
    console.log(chalk.gray('설치를 취소했습니다.'));
    return;
  }
  // 설치 상태 확인
  const [iterm2Installed, ohmyzshInstalled, p10kInstalled] = await Promise.all([
    checkToolInstalled('test -d /Applications/iTerm.app'),
    checkToolInstalled('test -d ~/.oh-my-zsh'),
    checkToolInstalled('test -d ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k')
  ]);
  
  const choices = [
    {
      name: '✅ 전체 설치 (추천) - iTerm2 + Oh My Zsh + 테마',
      value: 'full',
      short: '전체 설치'
    },
    {
      name: `📱 iTerm2${iterm2Installed ? chalk.green(' ✓ 설치됨') : ''}`,
      value: 'iterm2',
      short: 'iTerm2'
    },
    {
      name: `🎨 Oh My Zsh${ohmyzshInstalled ? chalk.green(' ✓ 설치됨') : ''}`,
      value: 'oh-my-zsh',
      short: 'Oh My Zsh'
    },
    {
      name: `✨ Powerlevel10k 테마${p10kInstalled ? chalk.green(' ✓ 설치됨') : ''}`,
      value: 'p10k',
      short: 'P10k 테마'
    },
    {
      name: '🔌 플러그인 추가',
      value: 'plugins',
      short: '플러그인'
    },
    {
      name: '↩️  뒤로가기',
      value: 'back',
      short: '뒤로'
    }
  ];
  
  const { beautifyChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'beautifyChoice',
      message: '터미널을 어떻게 꾸밀까요?',
      choices
    }
  ]);
  
  if (beautifyChoice === 'back') return;
  
  // 선택한 도구에 대한 미리보기 표시
  const { showToolPreview, showOhMyZshPreview, showP10kPreview } = await import('../utils/preview.js');
  
  if (beautifyChoice === 'oh-my-zsh') {
    showOhMyZshPreview();
    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: '설치를 진행하시겠습니까?',
      default: true
    }]);
    if (!proceed) return;
  } else if (beautifyChoice === 'p10k') {
    showP10kPreview();
    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: '설치를 진행하시겠습니까?',
      default: true
    }]);
    if (!proceed) return;
  }
  
  if (beautifyChoice === 'full') {
    await installTool('terminal-beautify');
  } else {
    await installTool(beautifyChoice);
  }
}

// 개발 도구 설치
async function installTools() {
  // 설치 상태 확인
  const [brewInstalled, nodeInstalled, gitInstalled, vscodeInstalled, dockerInstalled] = await Promise.all([
    checkToolInstalled('brew'),
    checkToolInstalled('node'),
    checkToolInstalled('git'),
    checkToolInstalled('code'),
    checkToolInstalled('docker')
  ]);
  
  const choices = [
    {
      name: `🍺 Homebrew (Mac 패키지 매니저)${brewInstalled ? chalk.green(' ✓ 설치됨') : ''}`,
      value: 'homebrew'
    },
    {
      name: `📦 Node.js${nodeInstalled ? chalk.green(' ✓ 설치됨') : ''}`,
      value: 'node'
    },
    {
      name: `🐙 Git${gitInstalled ? chalk.green(' ✓ 설치됨') : ''}`,
      value: 'git'
    },
    {
      name: `📝 Visual Studio Code${vscodeInstalled ? chalk.green(' ✓ 설치됨') : ''}`,
      value: 'vscode'
    },
    {
      name: `🐳 Docker${dockerInstalled ? chalk.green(' ✓ 설치됨') : ''}`,
      value: 'docker'
    },
    {
      name: '↩️  뒤로가기',
      value: 'back'
    }
  ];
  
  const { toolChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'toolChoice',
      message: '어떤 도구를 설치하시겠습니까?',
      choices
    }
  ]);
  
  if (toolChoice === 'back') return;
  
  await installTool(toolChoice);
}

// AI 도구 설정
async function setupAITools() {
  console.log(chalk.yellow('\n🤖 AI 도구를 선택하여 설치하세요'));
  console.log(chalk.gray('스페이스바로 선택, Enter로 설치 시작\n'));
  
  // 설치 상태 확인
  const [claudeInstalled, geminiInstalled, copilotInstalled] = await Promise.all([
    checkToolInstalled('claude'),
    checkToolInstalled('gemini'),
    checkToolInstalled('test -d ~/.config/github-copilot')
  ]);
  
  const choices = [
    {
      name: `Claude Code CLI - AI 코딩 어시스턴트${claudeInstalled ? chalk.green(' ✓') : ''}`,
      value: 'claude-code',
      checked: !claudeInstalled,
      short: 'Claude'
    },
    {
      name: `Gemini CLI - Google AI 어시스턴트${geminiInstalled ? chalk.green(' ✓') : ''}`,
      value: 'gemini-cli',
      checked: false,
      short: 'Gemini'
    },
    {
      name: `GitHub Copilot - 코드 자동완성${copilotInstalled ? chalk.green(' ✓') : ''}`,
      value: 'copilot',
      checked: false,
      short: 'Copilot'
    }
  ];
  
  const { selectedTools } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedTools',
      message: '설치할 AI 도구를 선택하세요:',
      choices,
      validate: (answers) => {
        if (answers.length === 0) {
          return '최소 하나는 선택하거나 Ctrl+C로 취소하세요';
        }
        return true;
      }
    }
  ]);
  
  if (selectedTools.length === 0) {
    console.log(chalk.gray('설치를 취소했습니다.'));
    return;
  }
  
  console.log(chalk.blue(`\n선택한 도구: ${selectedTools.join(', ')}`));
  
  // 선택한 도구들 순차적으로 설치
  for (const tool of selectedTools) {
    console.log(chalk.cyan(`\n━━━ ${tool} 설치 중 ━━━`));
    await installTool(tool);
  }
  
  // 설치 완료 후 빠른 가이드
  console.log(chalk.green('\n✅ AI 도구 설치 완료!'));
  console.log(chalk.yellow('\n🚀 빠른 시작 가이드:'));
  
  if (selectedTools.includes('claude-code')) {
    console.log(chalk.cyan('\nClaude Code:'));
    console.log('  1. claude login    # 브라우저에서 로그인');
    console.log('  2. claude chat     # 대화 시작');
    console.log('  3. claude --help   # 도움말');
  }
  
  if (selectedTools.includes('gemini-cli')) {
    console.log(chalk.cyan('\nGemini CLI:'));
    console.log('  1. gemini config   # API 키 설정');
    console.log('  2. gemini chat     # 대화 시작');
    console.log('  3. gemini --help   # 도움말');
  }
  
  if (selectedTools.includes('copilot')) {
    console.log(chalk.cyan('\nGitHub Copilot:'));
    console.log('  1. VSCode에서 Copilot 확장 설치');
    console.log('  2. GitHub 계정으로 로그인');
    console.log('  3. 코드 작성 시 자동 제안 확인');
  }
  
}

// 문제 해결
async function troubleshoot() {
  const { issue } = await inquirer.prompt([
    {
      type: 'list',
      name: 'issue',
      message: '어떤 문제가 있으신가요?',
      choices: [
        {
          name: '❌ "command not found" 에러',
          value: 'command-not-found'
        },
        {
          name: '🔐 "Permission denied" 에러',
          value: 'permission-denied'
        },
        {
          name: '🐌 터미널이 느려요',
          value: 'slow-terminal'
        },
        {
          name: '💥 설치가 실패해요',
          value: 'install-failed'
        },
        {
          name: '🔍 시스템 전체 진단',
          value: 'doctor'
        },
        {
          name: '↩️  뒤로가기',
          value: 'back'
        }
      ]
    }
  ]);
  
  if (issue === 'back') return;
  
  if (issue === 'doctor') {
    await runDoctor();
  } else {
    const { fixIssue } = await import('../commands/fix.js');
    await fixIssue(issue);
  }
}

// 문서 표시
function showDocs() {
  console.log(chalk.bold('\n📚 문서 링크:\n'));
  console.log('🔗 프로젝트 홈: https://github.com/Dumbo-techtaka/muggleout');
  console.log('📖 README: https://github.com/Dumbo-techtaka/muggleout#readme');
  console.log('🛠️ 설치 가이드 (한글): https://github.com/Dumbo-techtaka/muggleout/blob/main/INSTALL_GUIDE_KR.md');
  console.log('🐛 문제 신고: https://github.com/Dumbo-techtaka/muggleout/issues');
  console.log('📧 이메일 문의: dumbo@techtaka.com\n');
  
  console.log(chalk.gray('Enter를 눌러 계속...'));
}

// CLI 사용법 가이드 표시
async function showCLIGuide() {
  const { cliChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'cliChoice',
      message: '어떤 CLI의 사용법을 알아볼까요?',
      choices: [
        {
          name: '🤖 Claude Code CLI',
          value: 'claude'
        },
        {
          name: '✨ Gemini CLI', 
          value: 'gemini'
        },
        {
          name: '🛠️ 기본 터미널 명령어',
          value: 'basic'
        },
        {
          name: '↩️  뒤로가기',
          value: 'back'
        }
      ]
    }
  ]);
  
  if (cliChoice === 'back') return;
  
  switch (cliChoice) {
    case 'claude':
      await showClaudeGuide();
      break;
    case 'gemini':
      await showGeminiGuide();
      break;
    case 'basic':
      await showBasicCommands();
      break;
  }
}

// Claude CLI 가이드
async function showClaudeGuide() {
  console.log(boxen(
    chalk.bold.blue('🤖 Claude Code CLI 사용법\n\n') +
    chalk.yellow('1. 로그인하기:\n') +
    chalk.gray('   claude login\n') +
    chalk.gray('   → 브라우저가 열리면 로그인하세요\n\n') +
    
    chalk.yellow('2. 대화 시작하기:\n') +
    chalk.gray('   claude chat                  ') + chalk.green('# 새 대화 시작\n') +
    chalk.gray('   claude chat --continue       ') + chalk.green('# 이전 대화 이어가기\n\n') +
    
    chalk.yellow('3. 코드 작업하기:\n') +
    chalk.gray('   claude "파이썬으로 계산기 만들어줘"\n') +
    chalk.gray('   claude "이 코드 버그 수정해줘" file.py\n\n') +
    
    chalk.yellow('4. 파일과 함께 질문하기:\n') +
    chalk.gray('   claude "이 코드 설명해줘" --file script.js\n') +
    chalk.gray('   claude "리팩토링해줘" --file *.py\n\n') +
    
    chalk.yellow('5. 유용한 옵션들:\n') +
    chalk.gray('   --model claude-3-opus       ') + chalk.green('# 더 강력한 모델 사용\n') +
    chalk.gray('   --output result.txt         ') + chalk.green('# 결과를 파일로 저장\n') +
    chalk.gray('   --web                       ') + chalk.green('# 웹 검색 활성화\n\n') +
    
    chalk.cyan('💡 팁: "claude --help"로 더 많은 옵션을 확인하세요!'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'blue'
    }
  ));
  
  const { nextAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nextAction',
      message: '다음으로 무엇을 할까요?',
      choices: [
        { name: '🚀 Claude 실행해보기', value: 'run' },
        { name: '📖 다른 가이드 보기', value: 'back' },
        { name: '↩️  메인 메뉴로', value: 'main' }
      ]
    }
  ]);
  
  if (nextAction === 'run') {
    console.log(chalk.green('\n터미널에 "claude chat"을 입력해보세요!\n'));
  } else if (nextAction === 'back') {
    await showCLIGuide();
  }
}

// Gemini CLI 가이드
async function showGeminiGuide() {
  console.log(boxen(
    chalk.bold.magenta('✨ Gemini CLI 사용법\n\n') +
    chalk.yellow('1. 설정하기:\n') +
    chalk.gray('   gemini                       ') + chalk.green('# 초기 설정 시작\n') +
    chalk.gray('   → Google 계정으로 로그인 또는\n') +
    chalk.gray('   → API 키 입력 (https://makersuite.google.com/app/apikey)\n\n') +
    
    chalk.yellow('2. 기본 사용법:\n') +
    chalk.gray('   gemini "오늘 날씨 어때?"\n') +
    chalk.gray('   gemini "파이썬 코드 예제 보여줘"\n\n') +
    
    chalk.yellow('3. 파일과 함께 사용:\n') +
    chalk.gray('   gemini "이 코드 분석해줘" code.js\n') +
    chalk.gray('   gemini "문서로 만들어줘" --file notes.txt\n\n') +
    
    chalk.yellow('4. 이미지 분석:\n') +
    chalk.gray('   gemini "이 이미지 뭐야?" image.png\n') +
    chalk.gray('   gemini "이 디자인 개선점 알려줘" screenshot.jpg\n\n') +
    
    chalk.yellow('5. 유용한 옵션들:\n') +
    chalk.gray('   --model gemini-pro-vision   ') + chalk.green('# 이미지 분석 모델\n') +
    chalk.gray('   --temperature 0.9           ') + chalk.green('# 창의적인 답변\n') +
    chalk.gray('   --max-tokens 2000           ') + chalk.green('# 긴 답변\n\n') +
    
    chalk.cyan('💡 팁: Gemini는 무료로 사용할 수 있어요!'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'magenta'
    }
  ));
  
  const { nextAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nextAction',
      message: '다음으로 무엇을 할까요?',
      choices: [
        { name: '🚀 Gemini 실행해보기', value: 'run' },
        { name: '📖 다른 가이드 보기', value: 'back' },
        { name: '↩️  메인 메뉴로', value: 'main' }
      ]
    }
  ]);
  
  if (nextAction === 'run') {
    console.log(chalk.green('\n터미널에 "gemini"를 입력해보세요!\n'));
  } else if (nextAction === 'back') {
    await showCLIGuide();
  }
}

// 기본 터미널 명령어 가이드
async function showBasicCommands() {
  console.log(boxen(
    chalk.bold.green('🛠️ 기본 터미널 명령어\n\n') +
    chalk.yellow('📁 폴더 탐색:\n') +
    chalk.gray('   pwd                          ') + chalk.green('# 현재 위치 확인\n') +
    chalk.gray('   ls                           ') + chalk.green('# 파일 목록 보기\n') +
    chalk.gray('   cd 폴더이름                   ') + chalk.green('# 폴더로 이동\n') +
    chalk.gray('   cd ..                        ') + chalk.green('# 상위 폴더로\n\n') +
    
    chalk.yellow('📄 파일 작업:\n') +
    chalk.gray('   touch 파일이름.txt            ') + chalk.green('# 새 파일 만들기\n') +
    chalk.gray('   cat 파일이름.txt              ') + chalk.green('# 파일 내용 보기\n') +
    chalk.gray('   cp 원본 복사본                ') + chalk.green('# 파일 복사\n') +
    chalk.gray('   mv 원본 대상                  ') + chalk.green('# 파일 이동/이름변경\n') +
    chalk.gray('   rm 파일이름                   ') + chalk.green('# 파일 삭제 (주의!)\n\n') +
    
    chalk.yellow('📂 폴더 작업:\n') +
    chalk.gray('   mkdir 폴더이름                ') + chalk.green('# 새 폴더 만들기\n') +
    chalk.gray('   rmdir 폴더이름                ') + chalk.green('# 빈 폴더 삭제\n\n') +
    
    chalk.yellow('🔍 유용한 단축키:\n') +
    chalk.gray('   Tab                          ') + chalk.green('# 자동완성\n') +
    chalk.gray('   ↑ ↓                         ') + chalk.green('# 이전 명령어\n') +
    chalk.gray('   Ctrl + C                     ') + chalk.green('# 실행 중단\n') +
    chalk.gray('   Ctrl + L                     ') + chalk.green('# 화면 지우기\n\n') +
    
    chalk.cyan('💡 팁: Tab 키로 파일/폴더 이름을 자동완성할 수 있어요!'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));
  
  console.log(chalk.gray('\nEnter를 눌러 계속...'));
}

// 프롬프트 모드
async function startPromptMode() {
  console.log(chalk.bold('\n💬 프롬프트 모드를 시작합니다!'));
  console.log(chalk.gray('자연어로 명령을 입력하세요. 메뉴로 돌아가려면 "menu" 또는 "메뉴"를 입력하세요.'));
  console.log(chalk.cyan('💡 Tip: /help를 입력하면 모든 사용 가능한 명령어를 볼 수 있어요!\n'));
  
  while (true) {
    const { command } = await inquirer.prompt([
      {
        type: 'input',
        name: 'command',
        message: '➜',
        prefix: '',
        suffix: chalk.gray(' (exit: 종료, menu: 메뉴)')
      }
    ]);
    
    // 메뉴로 돌아가기
    if (command.toLowerCase() === 'menu' || command === '메뉴') {
      console.log(chalk.yellow('\n📋 메인 메뉴로 돌아갑니다...\n'));
      break;
    }
    
    // 종료 명령어
    if (command.toLowerCase() === 'exit' || command === '종료' || command === '나가기') {
      console.log(chalk.green('\n👋 안녕히 가세요!\n'));
      process.exit(0);
    }
    
    // 도움말
    if (command.toLowerCase() === 'help' || command === '도움말' || command === '?' || command === '/help') {
      showDetailedHelp();
      continue;
    }
    
    // 빈 입력은 무시
    if (!command.trim()) {
      continue;
    }
    
    // 자연어 명령 처리
    await handleNaturalCommand(command);
    console.log(); // 줄바꿈 추가
  }
}

// 상세 도움말
function showDetailedHelp() {
  console.log(chalk.bold('\n📝 프롬프트 모드 전체 키워드 목록:\n'));
  
  console.log(chalk.green('🔧 설치 명령어:'));
  console.log(chalk.cyan('  키워드: 설치, install, 설치해줘, 설치하고싶어, 깔아줘, 인스톨'));
  console.log(chalk.gray('  예시:'));
  console.log('    • "homebrew 설치해줘" → Homebrew 설치');
  console.log('    • "claude code install" → Claude CLI 설치');
  console.log('    • "터미널 깔아줘" → iTerm2 설치');
  console.log();
  
  console.log(chalk.green('📦 설치 가능한 도구들:'));
  console.log('  • claude, claude code, 클로드, 클로드 코드 → Claude Code CLI');
  console.log('  • gemini, gemini cli, 제미니 → Gemini CLI');
  console.log('  • 터미널, terminal, iterm, 아이텀 → iTerm2');
  console.log('  • oh my zsh, zsh, 오마이zsh → Oh My Zsh');
  console.log('  • homebrew, brew, 홈브루, 브루 → Homebrew');
  console.log('  • node, nodejs, 노드 → Node.js');
  console.log('  • vscode, visual studio code, 비주얼 스튜디오 → VS Code');
  console.log('  • git, 깃 → Git');
  console.log();
  
  console.log(chalk.green('🎨 꾸미기 명령어:'));
  console.log(chalk.cyan('  키워드: 예쁘게, 꾸미기, 꾸며줘, 이쁘게, 테마, 컬러풀'));
  console.log(chalk.gray('  예시:'));
  console.log('    • "터미널 예쁘게 만들어줘"');
  console.log('    • "테마 설치해줘"');
  console.log();
  
  console.log(chalk.green('🔍 상태 확인:'));
  console.log(chalk.cyan('  키워드: 상태, status, 확인, 뭐 설치됐어'));
  console.log(chalk.gray('  예시:'));
  console.log('    • "내 시스템 상태 확인해줘"');
  console.log('    • "설치된 도구 보여줘"');
  console.log();
  
  console.log(chalk.green('🛠️ 문제 해결:'));
  console.log(chalk.cyan('  키워드: 고쳐줘, 안돼, 에러, error, 문제, 해결, fix'));
  console.log(chalk.gray('  예시:'));
  console.log('    • "command not found 에러 고쳐줘"');
  console.log('    • "brew가 안돼요"');
  console.log();
  
  console.log(chalk.green('❓ 도움말:'));
  console.log(chalk.cyan('  키워드: 도움, 도와줘, help, 뭐해, 사용법'));
  console.log();
  
  console.log(chalk.yellow('🎮 특수 명령어:'));
  console.log('  • /help - 이 전체 키워드 목록 보기');
  console.log('  • menu, 메뉴 - 메인 메뉴로 돌아가기');
  console.log('  • exit, 종료, 나가기 - 프로그램 종료');
  console.log();
  
  console.log(chalk.gray('💡 Tip: 키워드가 포함된 자연스러운 문장으로 입력하세요!'));
  console.log();
}