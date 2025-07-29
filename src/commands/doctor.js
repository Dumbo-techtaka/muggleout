import chalk from 'chalk';
import { checkSystem, checkNetwork, checkDiskSpace } from '../utils/system-check.js';
import { runCommand, commandExists } from '../utils/runner.js';
import { createSpinner, isCI } from '../utils/ci-helper.js';
import * as emoji from 'node-emoji';

// 시스템 진단
export async function runDoctor() {
  console.log(chalk.bold('\n🏥 시스템 진단을 시작합니다...\n'));
  
  // PATH 진단 먼저 실행
  const { detectPathIssues } = await import('../utils/path-fixer.js');
  const pathIssues = await detectPathIssues();
  
  if (pathIssues.length > 0) {
    console.log(chalk.yellow('⚠️  PATH 문제가 발견되었습니다:'));
    pathIssues.forEach(issue => {
      console.log(chalk.red(`   • ${issue.description}`));
    });
    console.log(chalk.gray('\n   → muggleout doctor 완료 후 자동 수정을 제안합니다\n'));
  }
  
  const checks = [
    {
      name: 'macOS 버전',
      check: async () => {
        const { stdout } = await runCommand('sw_vers -productVersion', { silent: true });
        const version = stdout.trim();
        const major = parseInt(version.split('.')[0]);
        return {
          success: major >= 11,
          message: `macOS ${version}`,
          fix: major < 11 ? 'macOS 11 (Big Sur) 이상으로 업데이트하세요.' : null
        };
      }
    },
    {
      name: '네트워크 연결',
      check: async () => {
        const connected = await checkNetwork();
        return {
          success: connected,
          message: connected ? '정상' : '연결 안됨',
          fix: !connected ? 'Wi-Fi 또는 이더넷 연결을 확인하세요.' : null
        };
      }
    },
    {
      name: '디스크 공간',
      check: async () => {
        const hasSpace = await checkDiskSpace();
        return {
          success: hasSpace,
          message: hasSpace ? '충분함' : '부족함',
          fix: !hasSpace ? '불필요한 파일을 삭제하여 공간을 확보하세요.' : null
        };
      }
    },
    {
      name: 'Xcode Command Line Tools',
      check: async () => {
        try {
          await runCommand('xcode-select -p', { silent: true });
          return { success: true, message: '설치됨' };
        } catch {
          return {
            success: false,
            message: '미설치',
            fix: 'xcode-select --install 실행'
          };
        }
      }
    },
    {
      name: 'Homebrew',
      check: async () => {
        const exists = await commandExists('brew');
        if (exists) {
          // 버전 확인
          const { stdout } = await runCommand('brew --version', { silent: true });
          return { success: true, message: stdout.split('\n')[0] };
        }
        return {
          success: false,
          message: '미설치',
          fix: 'dev-setup install homebrew'
        };
      }
    },
    {
      name: 'Git',
      check: async () => {
        const exists = await commandExists('git');
        if (exists) {
          const { stdout } = await runCommand('git --version', { silent: true });
          return { success: true, message: stdout.trim() };
        }
        return {
          success: false,
          message: '미설치',
          fix: 'brew install git'
        };
      }
    },
    {
      name: 'Node.js',
      check: async () => {
        const exists = await commandExists('node');
        if (exists) {
          const { stdout } = await runCommand('node --version', { silent: true });
          const version = stdout.trim();
          const major = parseInt(version.slice(1).split('.')[0]);
          return {
            success: major >= 18,
            message: `Node.js ${version}`,
            fix: major < 18 ? 'Node.js 18 이상으로 업데이트하세요.' : null
          };
        }
        return {
          success: false,
          message: '미설치',
          fix: 'brew install node'
        };
      }
    },
    {
      name: 'Shell 환경',
      check: async () => {
        const { stdout } = await runCommand('echo $SHELL', { silent: true });
        const shell = stdout.trim();
        const isZsh = shell.includes('zsh');
        return {
          success: isZsh,
          message: shell,
          fix: !isZsh ? 'chsh -s /bin/zsh로 zsh로 변경하세요.' : null
        };
      }
    }
  ];
  
  const results = [];
  let hasIssues = false;
  
  // 각 항목 체크
  for (const check of checks) {
    const spinner = await createSpinner(check.name);
    spinner.start();
    
    try {
      const result = await check.check();
      
      if (result.success) {
        spinner.succeed(`${check.name}: ${result.message}`);
      } else {
        spinner.fail(`${check.name}: ${result.message}`);
        hasIssues = true;
      }
      
      results.push({ ...check, ...result });
    } catch (error) {
      spinner.fail(`${check.name}: 확인 실패`);
      results.push({
        name: check.name,
        success: false,
        message: '확인 실패',
        error: error.message
      });
      hasIssues = true;
    }
  }
  
  // 진단 결과 요약
  console.log('\n' + chalk.bold('📋 진단 결과 요약\n'));
  
  if (!hasIssues) {
    console.log(chalk.green.bold('✅ 모든 항목이 정상입니다! 시스템이 개발 환경 설정을 위한 준비가 되어 있습니다.'));
  } else {
    console.log(chalk.yellow.bold('⚠️  일부 문제가 발견되었습니다.\n'));
    console.log(chalk.bold('해결 방법:\n'));
    
    results.filter(r => !r.success && r.fix).forEach(result => {
      console.log(`${emoji.get('wrench')} ${chalk.yellow(result.name)}:`);
      console.log(`   ${result.fix}\n`);
    });
  }
  
  // PATH 문제가 있었다면 자동 수정 제안
  if (pathIssues.length > 0) {
    console.log(chalk.yellow('\n🔧 PATH 설정 문제 해결:'));
    const { diagnoseAndFixPath } = await import('../utils/path-fixer.js');
    await diagnoseAndFixPath();
  }
  
  // 추가 팁
  console.log(chalk.gray('\n💡 팁: "muggleout"을 실행하여 누락된 도구를 쉽게 설치할 수 있습니다.'));
}