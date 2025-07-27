#!/usr/bin/env node

import { existsSync } from 'fs';

// Check if running in iTerm2
async function checkITermRecommendation() {
  if (process.platform === 'darwin' && process.env.TERM_PROGRAM !== 'iTerm.app') {
    // iTerm2가 설치되어 있는지 확인
    const iTermInstalled = existsSync('/Applications/iTerm.app');
    
    if (iTermInstalled) {
      console.log('\x1b[33m⚠️  iTerm2가 설치되어 있습니다! iTerm2를 사용하면 더 나은 경험을 할 수 있습니다.\x1b[0m');
      console.log('\x1b[33m   Spotlight에서 "iTerm"을 검색하거나 Applications 폴더에서 실행하세요.\x1b[0m\n');
    } else {
      console.log('\x1b[33m⚠️  iTerm2를 사용하면 더 나은 경험을 할 수 있습니다!\x1b[0m');
      console.log('\x1b[33m   brew install --cask iterm2\x1b[0m\n');
    }
  }
}

checkITermRecommendation();

import { program } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { createRequire } from 'module';
import { handleNaturalCommand } from '../src/parsers/natural-language.js';
import { startInteractiveMode } from '../src/ui/interactive.js';
import { checkSystem } from '../src/utils/system-check.js';
import { checkTerminalEnvironment } from '../src/utils/terminal-check.js';
import { checkUpdateOnStart } from '../src/utils/update-checker.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

// 시작 배너
const showBanner = () => {
  const banner = chalk.bold.blue('🧿 Muggleout') + ' ' + chalk.gray(`v${version}`) + '\n' + 
                 chalk.gray('Transform muggles into terminal wizards');
  
  console.log(boxen(banner, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'magenta'
  }));
};

// 메인 프로그램 설정
// 버전을 환경변수로 설정 (update-checker에서 사용)
process.env.MUGGLEOUT_VERSION = version;

program
  .name('muggleout')
  .description('Transform your terminal into a magical development environment')
  .version(version);

// 기본 명령어 (자연어 또는 대화형 모드)
program
  .argument('[command...]', '자연어 명령')
  .action(async (command) => {
    showBanner();
    
    // 업데이트 체크 (백그라운드)
    checkUpdateOnStart();
    
    // 시스템 체크
    await checkSystem();
    
    // 터미널 환경 체크
    await checkTerminalEnvironment();
    
    if (command.length === 0) {
      // 인자가 없으면 대화형 모드
      await startInteractiveMode();
    } else {
      // 자연어 명령 처리
      const naturalCommand = command.join(' ');
      await handleNaturalCommand(naturalCommand);
    }
  });

// install 서브커맨드
program
  .command('install <tool>')
  .description('특정 도구 설치')
  .action(async (tool) => {
    showBanner();
    const { installTool } = await import('../src/commands/install.js');
    await installTool(tool);
  });

// fix 서브커맨드
program
  .command('fix <issue>')
  .description('문제 해결')
  .action(async (issue) => {
    showBanner();
    const { fixIssue } = await import('../src/commands/fix.js');
    await fixIssue(issue);
  });

// status 서브커맨드
program
  .command('status')
  .description('설치 상태 확인')
  .action(async () => {
    showBanner();
    const { showStatus } = await import('../src/commands/status.js');
    await showStatus();
  });

// doctor 서브커맨드
program
  .command('doctor')
  .description('시스템 진단')
  .action(async () => {
    showBanner();
    const { runDoctor } = await import('../src/commands/doctor.js');
    await runDoctor();
  });

// report 서브커맨드
program
  .command('report')
  .description('에러 리포트 생성 및 통계 확인')
  .option('--stats', '에러 통계만 표시')
  .action(async (options) => {
    showBanner();
    if (options.stats) {
      const { showErrorStats } = await import('../src/commands/report.js');
      await showErrorStats();
    } else {
      const { runReport } = await import('../src/commands/report.js');
      await runReport();
    }
  });

// update 서브커맨드
program
  .command('update')
  .description('muggleout 업데이트 확인 및 설치')
  .option('-y, --yes', '확인 없이 바로 업데이트')
  .option('--config', '업데이트 설정 변경')
  .action(async (options) => {
    showBanner();
    if (options.config) {
      const { configureUpdateSettings } = await import('../src/commands/update.js');
      await configureUpdateSettings();
    } else {
      const { runUpdate } = await import('../src/commands/update.js');
      await runUpdate(options);
    }
  });

// 에러 처리
process.on('unhandledRejection', async (error) => {
  console.error(chalk.red('❌ 오류가 발생했습니다:'), error.message);
  
  // 에러 리포팅
  try {
    const { captureError } = await import('../src/utils/error-reporter.js');
    await captureError(error, {
      command: process.argv.slice(2).join(' '),
      stage: 'unhandled-rejection'
    });
  } catch (reportError) {
    // 리포트 실패는 조용히 처리
    console.debug('Failed to report error:', reportError);
  }
  
  process.exit(1);
});

// 프로그램 실행
program.parse();