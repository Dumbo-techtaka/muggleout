import chalk from 'chalk';
import { promises as fs } from 'fs';
import { homedir } from 'os';
import path from 'path';
import { runCommand } from './runner.js';

// 현재 PATH 확인
export async function getCurrentPath() {
  const { stdout } = await runCommand('echo $PATH', { silent: true });
  return stdout.trim().split(':');
}

// 필요한 PATH 확인
export function getRequiredPaths() {
  const platform = process.platform;
  const arch = process.arch;
  
  const paths = [];
  
  if (platform === 'darwin') {
    // Homebrew 경로
    if (arch === 'arm64') {
      paths.push('/opt/homebrew/bin', '/opt/homebrew/sbin');
    } else {
      paths.push('/usr/local/bin', '/usr/local/sbin');
    }
    
    // 기본 시스템 경로
    paths.push(
      '/usr/bin',
      '/bin',
      '/usr/sbin',
      '/sbin'
    );
  }
  
  // Node.js 전역 모듈 경로
  paths.push(path.join(homedir(), '.npm-global/bin'));
  
  return paths;
}

// PATH 문제 감지
export async function detectPathIssues() {
  const issues = [];
  const currentPaths = await getCurrentPath();
  const requiredPaths = getRequiredPaths();
  
  // Homebrew 설치 확인
  const brewInstalled = await fs.access('/opt/homebrew/bin/brew').then(() => true).catch(() => 
    fs.access('/usr/local/bin/brew').then(() => true).catch(() => false)
  );
  
  if (brewInstalled) {
    // brew 경로가 PATH에 있는지 확인
    const brewPath = process.arch === 'arm64' ? '/opt/homebrew/bin' : '/usr/local/bin';
    if (!currentPaths.includes(brewPath)) {
      issues.push({
        type: 'missing_brew_path',
        path: brewPath,
        description: 'Homebrew가 설치되어 있지만 PATH에 없습니다'
      });
    }
  }
  
  // brew 명령어를 찾을 수 없는 경우
  try {
    await runCommand('which brew', { silent: true });
  } catch {
    if (brewInstalled) {
      issues.push({
        type: 'brew_not_found',
        description: 'brew 명령어를 찾을 수 없습니다'
      });
    }
  }
  
  // node/npm 확인
  try {
    await runCommand('which node', { silent: true });
  } catch {
    const nodeExists = await fs.access('/usr/local/bin/node').then(() => true).catch(() => false);
    if (nodeExists) {
      issues.push({
        type: 'node_not_found',
        description: 'Node.js가 설치되어 있지만 PATH에서 찾을 수 없습니다'
      });
    }
  }
  
  return issues;
}

// Shell 설정 파일 찾기
export async function getShellConfigFile() {
  const home = homedir();
  const shell = process.env.SHELL || '/bin/bash';
  
  if (shell.includes('zsh')) {
    // zsh 사용 중
    const zshrc = path.join(home, '.zshrc');
    const zprofile = path.join(home, '.zprofile');
    
    // .zshrc가 있으면 사용, 없으면 .zprofile
    const hasZshrc = await fs.access(zshrc).then(() => true).catch(() => false);
    return hasZshrc ? zshrc : zprofile;
  } else if (shell.includes('bash')) {
    // bash 사용 중
    const bashProfile = path.join(home, '.bash_profile');
    const bashrc = path.join(home, '.bashrc');
    
    // macOS는 .bash_profile, Linux는 .bashrc
    if (process.platform === 'darwin') {
      return bashProfile;
    }
    return bashrc;
  }
  
  // 기본값
  return path.join(home, '.profile');
}

// PATH 자동 수정
export async function fixPathIssues(issues) {
  if (issues.length === 0) {
    console.log(chalk.green('✅ PATH 설정에 문제가 없습니다!'));
    return true;
  }
  
  console.log(chalk.yellow('\n🔧 PATH 문제를 자동으로 해결하고 있습니다...'));
  
  const configFile = await getShellConfigFile();
  console.log(chalk.gray(`설정 파일: ${configFile}`));
  
  let configContent = '';
  try {
    configContent = await fs.readFile(configFile, 'utf8');
  } catch {
    // 파일이 없으면 생성
    configContent = '';
  }
  
  let modified = false;
  
  for (const issue of issues) {
    if (issue.type === 'missing_brew_path' || issue.type === 'brew_not_found') {
      // Homebrew PATH 추가
      const brewPath = process.arch === 'arm64' ? '/opt/homebrew' : '/usr/local';
      const brewEval = `eval "$(${brewPath}/bin/brew shellenv)"`;
      
      if (!configContent.includes(brewEval)) {
        console.log(chalk.blue(`  → Homebrew PATH 추가 중...`));
        configContent += `\n# Homebrew PATH (added by muggleout)\n${brewEval}\n`;
        modified = true;
      }
    }
  }
  
  if (modified) {
    // 백업 생성
    const backupFile = `${configFile}.backup.${Date.now()}`;
    await fs.copyFile(configFile, backupFile);
    console.log(chalk.gray(`  → 백업 생성: ${backupFile}`));
    
    // 설정 파일 업데이트
    await fs.writeFile(configFile, configContent);
    console.log(chalk.green(`  → ${configFile} 업데이트 완료!`));
    
    // 현재 세션에 적용
    try {
      await runCommand(`source ${configFile}`, { silent: true });
      console.log(chalk.green('  → 현재 세션에 적용 완료!'));
    } catch {
      console.log(chalk.yellow('\n⚠️  변경사항을 적용하려면:'));
      console.log(chalk.cyan(`   source ${configFile}`));
      console.log(chalk.gray('   또는 터미널을 재시작하세요'));
    }
    
    return true;
  }
  
  return false;
}

// PATH 문제 진단 및 해결
export async function diagnoseAndFixPath() {
  console.log(chalk.blue('\n🔍 PATH 설정을 확인하고 있습니다...'));
  
  const issues = await detectPathIssues();
  
  if (issues.length === 0) {
    console.log(chalk.green('✅ PATH 설정이 정상입니다!'));
    return;
  }
  
  console.log(chalk.yellow(`\n⚠️  ${issues.length}개의 문제를 발견했습니다:`));
  issues.forEach((issue, index) => {
    console.log(chalk.red(`   ${index + 1}. ${issue.description}`));
  });
  
  const { autoFix } = await import('inquirer').then(m => m.default.prompt([
    {
      type: 'confirm',
      name: 'autoFix',
      message: '자동으로 수정하시겠습니까?',
      default: true
    }
  ]));
  
  if (autoFix) {
    await fixPathIssues(issues);
  } else {
    console.log(chalk.gray('\n수동으로 수정하려면:'));
    const configFile = await getShellConfigFile();
    console.log(chalk.cyan(`   1. ${configFile} 파일을 열어주세요`));
    console.log(chalk.cyan(`   2. 다음 내용을 추가하세요:`));
    
    if (process.arch === 'arm64') {
      console.log(chalk.gray('      eval "$(/opt/homebrew/bin/brew shellenv)"'));
    } else {
      console.log(chalk.gray('      eval "$(/usr/local/bin/brew shellenv)"'));
    }
  }
}