import { execSync } from 'child_process';
import { createRequire } from 'module';
import chalk from 'chalk';
import boxen from 'boxen';
import semver from 'semver';
import { getConfig, saveConfig } from './config.js';
import { createSpinner, isCI } from './ci-helper.js';

// npm 레지스트리에서 최신 버전 확인
async function getLatestVersion(packageName) {
  try {
    const { runCommand } = await import('./runner.js');
    const { stdout } = await runCommand(`npm view ${packageName} version`, { silent: true });
    return stdout.trim();
  } catch (error) {
    console.debug('Failed to check latest version:', error);
    return null;
  }
}

// 현재 설치된 버전 가져오기
function getCurrentVersion() {
  // 먼저 환경변수 확인 (muggleout.js에서 설정)
  if (process.env.MUGGLEOUT_VERSION) {
    return process.env.MUGGLEOUT_VERSION;
  }
  
  try {
    // createRequire를 사용하여 package.json 로드
    const require = createRequire(import.meta.url);
    const pkg = require('../../package.json');
    return pkg.version;
  } catch (error) {
    console.debug('Failed to read local package.json:', error.message);
    
    // 글로벌 설치된 경우 간단한 방법으로 확인
    try {
      const output = execSync('npm list -g muggleout --depth=0', { encoding: 'utf8' });
      // muggleout@1.1.0 형태에서 버전 추출
      const match = output.match(/muggleout@(\d+\.\d+\.\d+)/);
      if (match && match[1]) {
        return match[1];
      }
    } catch (npmError) {
      console.debug('Failed to get version from npm list:', npmError.message);
    }
    
    return '1.0.0'; // fallback
  }
}

// 업데이트 확인 (하루에 한 번만)
export async function checkForUpdates(options = {}) {
  const config = await getConfig();
  const now = Date.now();
  
  // 강제 체크가 아니면 마지막 체크 시간 확인
  if (!options.force) {
    const lastCheck = config.lastUpdateCheck || 0;
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    if (now - lastCheck < oneDayInMs) {
      return null; // 아직 체크할 시간이 아님
    }
  }
  
  // 업데이트 체크 비활성화 상태 확인
  if (config.disableUpdateCheck && !options.force) {
    return null;
  }
  
  try {
    const currentVersion = getCurrentVersion();
    const latestVersion = await getLatestVersion('muggleout');
    
    // 마지막 체크 시간 업데이트
    config.lastUpdateCheck = now;
    await saveConfig(config);
    
    if (!latestVersion) {
      return null;
    }
    
    // 버전 비교
    if (semver.gt(latestVersion, currentVersion)) {
      return {
        current: currentVersion,
        latest: latestVersion,
        needsUpdate: true
      };
    }
    
    return {
      current: currentVersion,
      latest: latestVersion,
      needsUpdate: false
    };
  } catch (error) {
    console.debug('Update check failed:', error);
    return null;
  }
}

// 업데이트 알림 표시
export function showUpdateNotification(updateInfo) {
  if (!updateInfo || !updateInfo.needsUpdate) {
    return;
  }
  
  const message = chalk.bold(`🎉 새 버전이 출시되었습니다!\n\n`) +
    chalk.yellow(`현재 버전: ${updateInfo.current}\n`) +
    chalk.green(`최신 버전: ${updateInfo.latest}\n\n`) +
    chalk.cyan(`업데이트 방법:\n`) +
    chalk.gray(`  npm update -g muggleout\n`) +
    chalk.gray(`  또는\n`) +
    chalk.gray(`  npm install -g muggleout@latest`);
  
  console.log(boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
    title: '✨ 업데이트 알림',
    titleAlignment: 'center'
  }));
}

// 자동 업데이트 실행
export async function performUpdate() {
  console.log(chalk.blue('\n📦 업데이트를 시작합니다...\n'));
  
  try {
    const spinner = await createSpinner('muggleout 최신 버전 설치 중...');
    spinner.start();
    
    // npm을 통한 글로벌 업데이트
    execSync('npm install -g muggleout@latest', { stdio: 'pipe' });
    
    spinner.succeed('업데이트 완료!');
    
    const newVersion = await getLatestVersion('muggleout');
    console.log(chalk.green(`\n✅ muggleout이 ${newVersion} 버전으로 업데이트되었습니다!`));
    console.log(chalk.yellow('\n💡 터미널을 재시작하면 새 버전이 적용됩니다.\n'));
    
    return true;
  } catch (error) {
    console.error(chalk.red('\n❌ 업데이트 실패:'), error.message);
    console.log(chalk.yellow('\n수동으로 업데이트해주세요:'));
    console.log(chalk.gray('  npm install -g muggleout@latest\n'));
    return false;
  }
}

// 업데이트 체크 비활성화
export async function disableUpdateCheck() {
  const config = await getConfig();
  config.disableUpdateCheck = true;
  await saveConfig(config);
  console.log(chalk.gray('자동 업데이트 체크가 비활성화되었습니다.'));
}

// 업데이트 체크 활성화
export async function enableUpdateCheck() {
  const config = await getConfig();
  config.disableUpdateCheck = false;
  await saveConfig(config);
  console.log(chalk.green('자동 업데이트 체크가 활성화되었습니다.'));
}

// 사용자에게 업데이트 여부 묻기
export async function promptForUpdate(updateInfo) {
  if (!updateInfo || !updateInfo.needsUpdate) {
    return;
  }
  
  const { default: inquirer } = await import('inquirer');
  
  const { shouldUpdate } = await inquirer.prompt([{
    type: 'confirm',
    name: 'shouldUpdate',
    message: `새 버전 ${updateInfo.latest}이(가) 있습니다. 지금 업데이트하시겠습니까?`,
    default: true
  }]);
  
  if (shouldUpdate) {
    await performUpdate();
  } else {
    console.log(chalk.gray('\n나중에 업데이트하려면 다음 명령어를 사용하세요:'));
    console.log(chalk.cyan('  muggleout update\n'));
  }
}

// 시작 시 자동 체크 (백그라운드)
export async function checkUpdateOnStart() {
  // 백그라운드에서 실행
  setTimeout(async () => {
    try {
      const updateInfo = await checkForUpdates();
      if (updateInfo && updateInfo.needsUpdate) {
        showUpdateNotification(updateInfo);
      }
    } catch (error) {
      // 업데이트 체크 실패는 조용히 처리
      console.debug('Update check failed:', error);
    }
  }, 1000); // 1초 후 체크 (메인 작업에 방해되지 않도록)
}