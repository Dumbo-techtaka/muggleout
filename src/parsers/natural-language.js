import natural from 'natural';
import chalk from 'chalk';
import { installTool } from '../commands/install.js';
import { startInteractiveMode } from '../ui/interactive.js';

const tokenizer = new natural.WordTokenizer();

// 키워드 매핑
const keywordMappings = {
  install: {
    keywords: ['설치', 'install', '설치해줘', '설치하고싶어', '깔아줘', '인스톨'],
    tools: {
      'claude-code': ['claude', 'claude code', '클로드', '클로드 코드'],
      'gemini-cli': ['gemini', 'gemini cli', '제미니'],
      'terminal': ['터미널', 'terminal', 'iterm', '아이텀'],
      'oh-my-zsh': ['oh my zsh', 'zsh', '오마이zsh', '터미널 꾸미기', '예쁘게'],
      'homebrew': ['homebrew', 'brew', '홈브루', '브루'],
      'node': ['node', 'nodejs', '노드'],
      'vscode': ['vscode', 'visual studio code', '비주얼 스튜디오'],
      'git': ['git', '깃']
    }
  },
  
  beautify: {
    keywords: ['예쁘게', '꾸미기', '꾸며줘', '이쁘게', '테마', '컬러풀'],
    action: 'terminal-beautify'
  },
  
  fix: {
    keywords: ['고쳐줘', '안돼', '에러', 'error', '문제', '해결', 'fix'],
    action: 'fix'
  },
  
  help: {
    keywords: ['도움', '도와줘', 'help', '뭐해', '사용법'],
    action: 'help'
  },
  
  status: {
    keywords: ['상태', 'status', '확인', '뭐 설치됐어', '설치된', '보여줘'],
    action: 'status'
  }
};

// 자연어 명령 파싱
export async function handleNaturalCommand(input) {
  console.log(chalk.blue('🔍 명령을 분석하고 있어요...'));
  
  const lowercaseInput = input.toLowerCase();
  const tokens = tokenizer.tokenize(lowercaseInput);
  
  // 설치 명령 감지
  for (const keyword of keywordMappings.install.keywords) {
    if (lowercaseInput.includes(keyword)) {
      // 어떤 도구를 설치할지 찾기
      for (const [tool, aliases] of Object.entries(keywordMappings.install.tools)) {
        for (const alias of aliases) {
          if (lowercaseInput.includes(alias)) {
            console.log(chalk.green(`✅ ${tool} 설치를 시작합니다!`));
            await installTool(tool);
            return;
          }
        }
      }
      
      // 도구를 특정하지 않았다면
      console.log(chalk.yellow('💡 어떤 도구를 설치하고 싶으신가요?'));
      await startInteractiveMode('install');
      return;
    }
  }
  
  // 터미널 꾸미기 명령 감지
  for (const keyword of keywordMappings.beautify.keywords) {
    if (lowercaseInput.includes(keyword)) {
      console.log(chalk.green('✨ 터미널을 예쁘게 꾸며드릴게요!'));
      await installTool('terminal-beautify');
      return;
    }
  }
  
  // 문제 해결 명령 감지
  for (const keyword of keywordMappings.fix.keywords) {
    if (lowercaseInput.includes(keyword)) {
      console.log(chalk.yellow('🔧 문제를 해결해드릴게요!'));
      const { fixIssue } = await import('../commands/fix.js');
      await fixIssue(input);
      return;
    }
  }
  
  // 도움말 명령 감지
  for (const keyword of keywordMappings.help.keywords) {
    if (lowercaseInput.includes(keyword)) {
      showHelp();
      return;
    }
  }
  
  // 상태 확인 명령 감지
  for (const keyword of keywordMappings.status.keywords) {
    if (lowercaseInput.includes(keyword)) {
      console.log(chalk.green('📊 시스템 상태를 확인합니다!'));
      const { showStatus } = await import('../commands/status.js');
      await showStatus();
      return;
    }
  }
  
  // 명령을 이해하지 못한 경우
  console.log(chalk.yellow('🤔 무엇을 도와드릴까요?'));
  console.log(chalk.gray('이해하지 못했어요. 메뉴에서 선택해주세요!'));
  await startInteractiveMode();
}

// 도움말 표시
function showHelp() {
  console.log(chalk.bold('\n📚 사용 가능한 명령어:\n'));
  
  console.log(chalk.green('자연어 명령 예시:'));
  console.log('  • "터미널 예쁘게 만들어줘"');
  console.log('  • "claude code 설치해줘"');
  console.log('  • "gemini cli 설치"');
  console.log('  • "brew command not found 에러 고쳐줘"\n');
  
  console.log(chalk.green('직접 명령어:'));
  console.log('  • dev-setup install <tool>');
  console.log('  • dev-setup fix <issue>');
  console.log('  • dev-setup status');
  console.log('  • dev-setup doctor\n');
}