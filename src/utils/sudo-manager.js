import chalk from 'chalk';
import { runCommand } from './runner.js';

export class SudoManager {
  static sudoAttempts = 0;
  static maxAttempts = 3;

  static async requestSudo(purpose) {
    console.log(chalk.yellow(`\n🔐 관리자 권한이 필요합니다`));
    console.log(chalk.gray(`목적: ${purpose}`));
    console.log(chalk.blue('\n💡 비밀번호 입력 안내:'));
    console.log('  • Mac 로그인 비밀번호를 입력하세요');
    console.log('  • 입력 시 화면에 표시되지 않습니다 (정상입니다!)');
    console.log('  • Touch ID 사용자: 비밀번호를 직접 타이핑하세요');
    console.log(chalk.gray('\n취소하려면 Ctrl+C를 누르세요\n'));
    
    try {
      await runCommand('sudo -v', { interactive: true });
      this.sudoAttempts = 0; // 성공 시 초기화
      console.log(chalk.green('✅ 권한 획득 성공!\n'));
      return true;
    } catch (error) {
      return this.handleSudoError(error);
    }
  }
  
  static async handleSudoError(error) {
    this.sudoAttempts++;
    
    // 취소한 경우
    if (error.message.includes('SIGINT') || error.message.includes('canceled')) {
      console.log(chalk.yellow('\n작업이 취소되었습니다.'));
      return false;
    }
    
    // 비밀번호 틀린 경우
    if (error.message.includes('Sorry, try again') || 
        error.message.includes('incorrect password') ||
        error.message.includes('3 incorrect password attempts')) {
      
      if (this.sudoAttempts >= this.maxAttempts) {
        console.log(chalk.red('\n❌ 비밀번호를 3번 틀렸습니다!'));
        console.log(chalk.yellow('\n🔒 보안을 위해 잠시 후 다시 시도해주세요.'));
        this.sudoAttempts = 0;
        return false;
      }
      
      console.log(chalk.red(`\n❌ 비밀번호가 틀렸습니다! (${this.sudoAttempts}/${this.maxAttempts}번 시도)`));
      console.log(chalk.yellow('\n✅ 확인사항:'));
      console.log('  • Mac에 로그인할 때 사용하는 비밀번호인가요?');
      console.log('  • Caps Lock이 켜져 있나요? (⇪ 키 확인)');
      console.log('  • 한/영 상태가 맞나요? (한글로 입력하고 있지 않나요?)');
      
      if (this.sudoAttempts === 1) {
        console.log(chalk.blue('\n💡 팁: 천천히 정확하게 입력해보세요'));
      } else if (this.sudoAttempts === 2) {
        console.log(chalk.blue('\n💡 팁: Touch ID를 사용중이라면 지문 대신 비밀번호를 입력하세요'));
      }
      
      return false;
    }
    
    // 권한 없는 경우
    if (error.message.includes('not in the sudoers file') || 
        error.message.includes('not allowed to run sudo')) {
      console.log(chalk.red('\n❌ 이 계정은 관리자 권한이 없습니다!'));
      console.log(chalk.yellow('\n🔧 해결 방법:'));
      console.log('  1. Mac 설정 > 사용자 및 그룹 열기');
      console.log('  2. 좌물쇠 🔒 클릭 후 관리자 비밀번호 입력');
      console.log('  3. 본인 계정 선택 후 "사용자가 이 컴퓨터를 관리하도록 허용" 체크');
      console.log(chalk.gray('\n💼 회사 Mac인 경우: IT 부서에 관리자 권한을 요청하세요'));
      return false;
    }
    
    // 기타 에러
    console.log(chalk.red('\n❌ 예상치 못한 오류가 발생했습니다'));
    console.log(chalk.gray(`오류: ${error.message}`));
    return false;
  }
  
  static async runWithSudo(command, purpose, options = {}) {
    const hasSudo = await this.requestSudo(purpose);
    if (!hasSudo) {
      throw new Error('sudo 권한 획득 실패');
    }
    
    try {
      return await runCommand(`sudo ${command}`, options);
    } catch (error) {
      // sudo 타임아웃 등의 경우 재시도
      if (error.message.includes('sudo: a password is required')) {
        console.log(chalk.yellow('\n⏱️  sudo 권한이 만료되었습니다. 다시 입력해주세요.'));
        return this.runWithSudo(command, purpose, options);
      }
      throw error;
    }
  }
}