import chalk from 'chalk';
import ora from 'ora';
import { checkForUpdates, performUpdate, showUpdateNotification, promptForUpdate } from '../utils/update-checker.js';

// update 명령어 실행
export async function runUpdate(options = {}) {
  console.log(chalk.bold('\n🔄 업데이트 확인\n'));
  
  const spinner = ora('최신 버전 확인 중...').start();
  
  try {
    // 강제로 업데이트 체크
    const updateInfo = await checkForUpdates({ force: true });
    spinner.stop();
    
    if (!updateInfo) {
      console.log(chalk.red('❌ 업데이트 정보를 가져올 수 없습니다.'));
      console.log(chalk.gray('네트워크 연결을 확인해주세요.'));
      return;
    }
    
    // 디버그 정보 출력 (임시)
    console.log(chalk.gray(`현재 버전: ${updateInfo.current}`));
    console.log(chalk.gray(`최신 버전: ${updateInfo.latest}`));
    
    if (!updateInfo.needsUpdate) {
      console.log(chalk.green('✅ 최신 버전을 사용 중입니다!'));
      console.log(chalk.gray(`현재 버전: ${updateInfo.current}`));
      return;
    }
    
    // 업데이트 알림 표시
    showUpdateNotification(updateInfo);
    
    // 자동 업데이트 옵션이 있으면 바로 실행
    if (options.yes) {
      await performUpdate();
    } else {
      // 사용자에게 물어보기
      await promptForUpdate(updateInfo);
    }
    
  } catch (error) {
    spinner.fail('업데이트 확인 실패');
    console.error(chalk.red('에러:'), error.message);
  }
}

// 업데이트 설정 변경
export async function configureUpdateSettings() {
  const { default: inquirer } = await import('inquirer');
  const { getConfig, saveConfig } = await import('../utils/config.js');
  
  const config = await getConfig();
  
  console.log(chalk.bold('\n⚙️  업데이트 설정\n'));
  
  const { settings } = await inquirer.prompt([
    {
      type: 'list',
      name: 'settings',
      message: '업데이트 확인 설정을 선택하세요:',
      choices: [
        {
          name: '자동으로 확인하고 알림 표시 (권장)',
          value: 'auto'
        },
        {
          name: '수동으로만 확인',
          value: 'manual'
        },
        {
          name: '현재 설정 유지',
          value: 'keep'
        }
      ],
      default: config.disableUpdateCheck ? 'manual' : 'auto'
    }
  ]);
  
  if (settings === 'keep') {
    console.log(chalk.gray('설정이 변경되지 않았습니다.'));
    return;
  }
  
  if (settings === 'auto') {
    config.disableUpdateCheck = false;
    console.log(chalk.green('✅ 자동 업데이트 확인이 활성화되었습니다.'));
    console.log(chalk.gray('하루에 한 번 자동으로 새 버전을 확인합니다.'));
  } else {
    config.disableUpdateCheck = true;
    console.log(chalk.yellow('⚠️  자동 업데이트 확인이 비활성화되었습니다.'));
    console.log(chalk.gray('muggleout update 명령어로 수동 확인할 수 있습니다.'));
  }
  
  await saveConfig(config);
}