import chalk from 'chalk';
import boxen from 'boxen';

// 터미널 미리보기 표시
export function showTerminalPreview() {
  console.log('\n🖼️  설치하면 터미널이 이렇게 바뀝니다:\n');
  
  // Before
  console.log(chalk.bold('지금 (기본 터미널):'));
  console.log(boxen(
    'Last login: Mon Jan 27 10:30:21 on ttys000\n' +
    'user@MacBook-Pro ~ % ls\n' +
    'Applications Desktop     Documents    Downloads\n' +
    'Library      Movies      Music        Pictures\n' +
    'user@MacBook-Pro ~ % cd projects\n' +
    'user@MacBook-Pro projects % git status\n' +
    'On branch main\n' +
    'Your branch is up to date with \'origin/main\'.\n' +
    'user@MacBook-Pro projects % ',
    { 
      padding: 1, 
      borderStyle: 'round',
      borderColor: 'gray',
      title: '😐 Before',
      titleAlignment: 'center'
    }
  ));
  
  console.log(''); // 공백
  
  // After
  console.log(chalk.bold('설치 후 (iTerm2 + Oh My Zsh + Powerlevel10k):'));
  console.log(boxen(
    chalk.blue('╭─') + ' 🏠 ' + chalk.cyan('user@MacBook-Pro') + ' ' + 
    chalk.blue('~/projects') + ' ' + 
    chalk.yellow('git:') + chalk.red('main') + ' ' +
    chalk.green('✓') + '\n' +
    chalk.blue('╰─') + chalk.green('$') + ' ' + chalk.gray('ls') + '\n' +
    chalk.blue('📁 ') + 'src  ' + chalk.blue('📁 ') + 'tests  ' + 
    chalk.green('📄 ') + 'README.md  ' + chalk.yellow('📄 ') + 'package.json\n\n' +
    
    chalk.blue('╭─') + ' 🏠 ' + chalk.cyan('user@MacBook-Pro') + ' ' + 
    chalk.blue('~/projects') + ' ' + 
    chalk.yellow('git:') + chalk.red('main') + ' ' +
    chalk.green('✓') + ' ' + chalk.gray('[10:30:45]') + '\n' +
    chalk.blue('╰─') + chalk.green('$') + ' ' + chalk.gray('git st') + 
    chalk.dim('atus') + chalk.gray(' (자동완성)') + '\n' +
    chalk.green('✓') + ' Your branch is up to date\n' +
    chalk.yellow('📝') + ' 2 files modified\n\n' +
    
    chalk.dim('추가 기능:') + '\n' +
    chalk.dim('• 명령어 자동완성 (탭 키)') + '\n' +
    chalk.dim('• 문법 하이라이팅') + '\n' +
    chalk.dim('• Git 상태 실시간 표시') + '\n' +
    chalk.dim('• 실행 시간 표시'),
    { 
      padding: 1, 
      borderStyle: 'round',
      borderColor: 'green',
      title: '🤩 After',
      titleAlignment: 'center'
    }
  ));
}

// Oh My Zsh 미리보기
export function showOhMyZshPreview() {
  console.log('\n🖼️  Oh My Zsh 설치 효과:\n');
  
  console.log(chalk.bold('주요 기능:'));
  console.log(boxen(
    '1. ' + chalk.cyan('명령어 자동완성') + '\n' +
    '   cd pro' + chalk.gray('jects/') + ' (탭 키로 자동완성)\n\n' +
    
    '2. ' + chalk.yellow('명령어 추천') + '\n' +
    '   gti status → ' + chalk.green('git status로 자동 수정') + '\n\n' +
    
    '3. ' + chalk.green('유용한 단축키') + '\n' +
    '   ll = ls -la (파일 목록 자세히)\n' +
    '   .. = cd .. (상위 폴더로)\n' +
    '   - = cd - (이전 폴더로)\n\n' +
    
    '4. ' + chalk.magenta('플러그인 200개+') + '\n' +
    '   git, docker, npm 등 자동 설정',
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  ));
}

// Powerlevel10k 미리보기
export function showP10kPreview() {
  console.log('\n🖼️  Powerlevel10k 테마 미리보기:\n');
  
  console.log(chalk.bold('설정 마법사에서 선택 가능한 스타일:'));
  
  // Lean 스타일
  console.log('\n' + chalk.gray('1. Lean (깔끔한 스타일)'));
  console.log(boxen(
    chalk.green('❯') + ' ~/projects ' + chalk.blue('main') + ' ' + chalk.gray('10:30:45') + '\n' +
    chalk.green('❯') + ' npm install',
    { padding: { left: 2, right: 2, top: 0, bottom: 0 }, borderStyle: 'single' }
  ));
  
  // Classic 스타일
  console.log('\n' + chalk.gray('2. Classic (아이콘 포함)'));
  console.log(boxen(
    '╭─ ' + chalk.cyan('user@mac') + ' in ' + chalk.blue('~/projects') + ' on ' + 
    chalk.yellow('⎇ main') + '\n' +
    '╰─' + chalk.green('λ') + ' npm install',
    { padding: { left: 2, right: 2, top: 0, bottom: 0 }, borderStyle: 'single' }
  ));
  
  // Rainbow 스타일
  console.log('\n' + chalk.gray('3. Rainbow (화려한 스타일)'));
  console.log(boxen(
    chalk.bgBlue.white(' user ') + chalk.bgCyan.black(' ~/projects ') + 
    chalk.bgYellow.black(' main ') + chalk.bgGreen.black(' ✓ ') + '\n' +
    chalk.blue('▶') + ' npm install',
    { padding: { left: 2, right: 2, top: 0, bottom: 0 }, borderStyle: 'single' }
  ));
}

// 도구별 미리보기
export function showToolPreview(toolName) {
  switch(toolName) {
    case 'terminal-beautify':
      showTerminalPreview();
      break;
    case 'oh-my-zsh':
      showOhMyZshPreview();
      break;
    case 'p10k':
      showP10kPreview();
      break;
    default:
      // 다른 도구들은 나중에 추가
      break;
  }
}