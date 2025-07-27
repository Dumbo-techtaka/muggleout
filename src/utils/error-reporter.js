import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { getConfig, saveConfig } from './config.js';

// 에러 중복 제거를 위한 핑거프린트 생성
function generateErrorFingerprint(error) {
  const key = `${error.type}-${error.tool}-${error.code || ''}-${error.message.slice(0, 50)}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

// 알려진 에러 패턴과 해결책
const KNOWN_ERROR_PATTERNS = {
  'EACCES': {
    pattern: /permission denied|EACCES/i,
    solution: '권한 문제입니다. sudo를 사용하거나 파일 권한을 확인하세요.',
    autoFix: false
  },
  'ENOTFOUND': {
    pattern: /ENOTFOUND|getaddrinfo/i,
    solution: '네트워크 연결을 확인하세요. 방화벽이나 프록시 설정도 확인해보세요.',
    autoFix: false
  },
  'COMMAND_NOT_FOUND': {
    pattern: /command not found|not found/i,
    solution: 'PATH 설정을 확인하세요. muggleout doctor를 실행해보세요.',
    autoFix: true,
    fixCommand: 'doctor'
  },
  'BREW_NOT_FOUND': {
    pattern: /brew.*not found/i,
    solution: 'Homebrew가 설치되지 않았거나 PATH에 없습니다.',
    autoFix: true,
    fixCommand: 'install homebrew'
  },
  'DISK_FULL': {
    pattern: /ENOSPC|no space left/i,
    solution: '디스크 공간이 부족합니다. 불필요한 파일을 삭제하세요.',
    autoFix: false
  }
};

class ErrorReporter {
  constructor() {
    this.errorDir = path.join(os.homedir(), '.muggleout', 'errors');
    this.summaryFile = path.join(this.errorDir, 'error-summary.json');
    this.recentErrors = new Map(); // 최근 에러 추적 (중복 방지)
  }

  async init() {
    await fs.mkdir(this.errorDir, { recursive: true });
    await this.loadSummary();
  }

  async loadSummary() {
    try {
      const data = await fs.readFile(this.summaryFile, 'utf8');
      this.summary = JSON.parse(data);
    } catch {
      this.summary = {
        totalErrors: 0,
        errorsByType: {},
        errorsByTool: {},
        commonErrors: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // 노이즈 필터링: 중복 에러 체크
  isDuplicateError(error) {
    const fingerprint = generateErrorFingerprint(error);
    const now = Date.now();
    
    // 5분 내 동일한 에러는 무시
    if (this.recentErrors.has(fingerprint)) {
      const lastOccurred = this.recentErrors.get(fingerprint);
      if (now - lastOccurred < 5 * 60 * 1000) {
        return true;
      }
    }
    
    this.recentErrors.set(fingerprint, now);
    
    // 오래된 에러 기록 정리
    for (const [fp, time] of this.recentErrors.entries()) {
      if (now - time > 30 * 60 * 1000) {
        this.recentErrors.delete(fp);
      }
    }
    
    return false;
  }

  // 에러가 보고할 가치가 있는지 판단
  isReportableError(error) {
    // 사용자가 취소한 경우
    if (error.message?.includes('User cancelled') || error.cancelled) {
      return false;
    }
    
    // 네트워크 일시적 오류
    if (error.code === 'ETIMEDOUT' && error.retryCount < 3) {
      return false;
    }
    
    // 이미 알려진 해결책이 있는 에러
    const knownError = this.identifyKnownError(error);
    if (knownError && knownError.autoFix) {
      return false; // 자동 수정 가능하므로 보고 불필요
    }
    
    return true;
  }

  // 알려진 에러 패턴 식별
  identifyKnownError(error) {
    const errorString = `${error.message} ${error.stack || ''}`;
    
    for (const [key, pattern] of Object.entries(KNOWN_ERROR_PATTERNS)) {
      if (pattern.pattern.test(errorString)) {
        return { key, ...pattern };
      }
    }
    
    return null;
  }

  async captureError(error, context) {
    // 중복 체크
    if (this.isDuplicateError(error)) {
      return null;
    }
    
    // 보고 가치 체크
    if (!this.isReportableError(error)) {
      return null;
    }
    
    const errorReport = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      fingerprint: generateErrorFingerprint(error),
      version: process.env.npm_package_version || 'unknown',
      error: {
        type: error.constructor.name,
        message: this.sanitizeMessage(error.message),
        stack: this.sanitizeStack(error.stack),
        code: error.code,
        tool: context.tool,
        details: error.details ? this.sanitizeMessage(JSON.stringify(error.details)) : undefined
      },
      system: await this.getSystemInfo(),
      context: this.sanitizeContext(context),
      anonymousId: await this.getAnonymousId()
    };

    // 로컬 저장
    await this.saveLocal(errorReport);
    
    // 통계 업데이트
    await this.updateStatistics(errorReport);
    
    // 즉시 해결 가능한지 확인
    const knownError = this.identifyKnownError(error);
    if (knownError) {
      console.log(chalk.yellow('\n💡 알려진 문제입니다:'));
      console.log(chalk.cyan(`   ${knownError.solution}`));
      
      if (knownError.autoFix) {
        const { autoFix } = await inquirer.prompt([{
          type: 'confirm',
          name: 'autoFix',
          message: '자동으로 해결을 시도하시겠습니까?',
          default: true
        }]);
        
        if (autoFix) {
          console.log(chalk.blue(`\n실행: muggleout ${knownError.fixCommand}`));
          // 자동 수정 명령 실행을 위한 플래그 반환
          return { autoFix: true, command: knownError.fixCommand };
        }
      }
    }
    
    // 사용자 동의 시 원격 전송
    if (await this.shouldSendReport(errorReport)) {
      await this.sendToRemote(errorReport);
    }
    
    return errorReport;
  }

  // 개인정보 제거
  sanitizeMessage(message) {
    if (!message) return '';
    
    return message
      // 사용자 홈 디렉토리 경로 제거
      .replace(/\/Users\/[^/]+/g, '/Users/***')
      .replace(/\/home\/[^/]+/g, '/home/***')
      .replace(/C:\\Users\\[^\\]+/g, 'C:\\Users\\***')
      // API 키나 토큰 같은 민감한 정보 제거
      .replace(/[A-Z_]+_TOKEN=['"][^'"]+['"]/g, 'SECRET_TOKEN="***"');
  }

  sanitizeStack(stack) {
    if (!stack) return '';
    
    return stack
      // 사용자 홈 디렉토리 경로 제거
      .replace(/\/Users\/[^/]+/g, '/Users/[USERNAME]')
      .replace(/\/home\/[^/]+/g, '/home/[USERNAME]')
      .replace(/C:\\Users\\[^\\]+/g, 'C:\\Users\\[USERNAME]')
      // 민감한 환경변수 제거
      .replace(/[A-Z_]+_KEY=['"][^'"]+['"]/g, 'SECRET_KEY="***"')
      .replace(/[A-Z_]+_TOKEN=['"][^'"]+['"]/g, 'SECRET_TOKEN="***"');
  }

  sanitizeContext(context) {
    const sanitized = { ...context };
    
    // 민감한 정보 제거
    delete sanitized.env;
    delete sanitized.apiKeys;
    delete sanitized.passwords;
    
    // 경로 정보 익명화
    if (sanitized.cwd) {
      sanitized.cwd = sanitized.cwd.replace(/\/Users\/[^/]+/, '/Users/[USERNAME]');
    }
    
    return sanitized;
  }

  async getSystemInfo() {
    const info = {
      os: process.platform,
      osVersion: os.release(),
      arch: process.arch,
      node: process.version,
      shell: process.env.SHELL?.split('/').pop() || 'unknown',
      locale: process.env.LANG || 'unknown'
    };

    // 추가 시스템 정보 (macOS)
    if (process.platform === 'darwin') {
      try {
        const { stdout } = await import('../utils/runner.js').then(m => 
          m.runCommand('sw_vers -productVersion', { silent: true })
        );
        info.macOSVersion = stdout.trim();
      } catch {}
    }

    return info;
  }

  async getAnonymousId() {
    const config = await getConfig();
    
    if (!config.anonymousId) {
      // 머신 ID 기반 익명 ID 생성
      const machineId = os.hostname() + os.platform() + os.arch();
      config.anonymousId = crypto
        .createHash('sha256')
        .update(machineId)
        .digest('hex')
        .slice(0, 16);
      await saveConfig(config);
    }
    
    return config.anonymousId;
  }

  async shouldSendReport(report) {
    const config = await getConfig();
    
    // 첫 실행이거나 설정이 없는 경우
    if (config.errorReporting === undefined) {
      console.log(chalk.yellow('\n📊 에러 리포팅 설정'));
      console.log(chalk.gray('익명화된 에러 정보를 전송하여 제품 개선에 도움을 주실 수 있습니다.'));
      console.log(chalk.gray('개인정보는 수집하지 않으며, 언제든 설정에서 변경 가능합니다.\n'));
      
      const { consent } = await inquirer.prompt([{
        type: 'confirm',
        name: 'consent',
        message: '익명 에러 리포트를 전송하시겠습니까?',
        default: false
      }]);
      
      config.errorReporting = consent;
      await saveConfig(config);
    }
    
    return config.errorReporting;
  }

  async saveLocal(report) {
    const filename = `error-${report.timestamp.replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(this.errorDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(report, null, 2));
    
    // 오래된 에러 파일 정리 (30일 이상)
    await this.cleanupOldErrors();
  }

  async cleanupOldErrors() {
    const files = await fs.readdir(this.errorDir);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    for (const file of files) {
      if (!file.startsWith('error-') || !file.endsWith('.json')) continue;
      
      const filepath = path.join(this.errorDir, file);
      const stats = await fs.stat(filepath);
      
      if (stats.mtimeMs < thirtyDaysAgo) {
        await fs.unlink(filepath);
      }
    }
  }

  async updateStatistics(report) {
    this.summary.totalErrors++;
    
    // 에러 타입별 통계
    const errorType = report.error.type;
    this.summary.errorsByType[errorType] = (this.summary.errorsByType[errorType] || 0) + 1;
    
    // 도구별 통계
    const tool = report.error.tool;
    if (tool) {
      this.summary.errorsByTool[tool] = (this.summary.errorsByTool[tool] || 0) + 1;
    }
    
    // 자주 발생하는 에러 추적
    this.updateCommonErrors(report);
    
    this.summary.lastUpdated = new Date().toISOString();
    await fs.writeFile(this.summaryFile, JSON.stringify(this.summary, null, 2));
  }

  updateCommonErrors(report) {
    const fingerprint = report.fingerprint;
    const existing = this.summary.commonErrors.find(e => e.fingerprint === fingerprint);
    
    if (existing) {
      existing.count++;
      existing.lastSeen = report.timestamp;
    } else {
      this.summary.commonErrors.push({
        fingerprint,
        type: report.error.type,
        message: report.error.message.slice(0, 100),
        tool: report.error.tool,
        count: 1,
        firstSeen: report.timestamp,
        lastSeen: report.timestamp
      });
    }
    
    // 발생 빈도순 정렬 및 상위 10개만 유지
    this.summary.commonErrors.sort((a, b) => b.count - a.count);
    this.summary.commonErrors = this.summary.commonErrors.slice(0, 10);
  }

  async sendToRemote(report) {
    try {
      // GitHub Issues API를 사용한 자동 리포트
      // 노이즈 감소를 위해 일정 수 이상 발생한 에러만 전송
      const commonError = this.summary.commonErrors.find(
        e => e.fingerprint === report.fingerprint && e.count >= 3
      );
      
      if (!commonError) {
        return; // 3회 미만 발생한 에러는 전송하지 않음
      }
      
      // 이미 보고된 에러인지 확인
      if (await this.isAlreadyReported(report.fingerprint)) {
        return;
      }
      
      // GitHub 이슈 생성 (실제 구현 시)
      console.log(chalk.gray('에러 리포트가 저장되었습니다.'));
      
    } catch (error) {
      // 리포트 전송 실패는 조용히 처리
      console.debug('Failed to send error report:', error);
    }
  }

  async isAlreadyReported(fingerprint) {
    // 실제 구현 시 GitHub API로 중복 체크
    return false;
  }

  // 수동 리포트 생성
  async generateReport() {
    console.log(chalk.blue('\n📋 에러 리포트 생성 중...\n'));
    
    const files = await fs.readdir(this.errorDir);
    const errorFiles = files.filter(f => f.startsWith('error-') && f.endsWith('.json'));
    
    if (errorFiles.length === 0) {
      console.log(chalk.green('✅ 최근 에러가 없습니다!'));
      return;
    }
    
    const recentErrors = [];
    for (const file of errorFiles.slice(-5)) { // 최근 5개만
      const content = await fs.readFile(path.join(this.errorDir, file), 'utf8');
      recentErrors.push(JSON.parse(content));
    }
    
    const report = {
      summary: this.summary,
      recentErrors,
      generated: new Date().toISOString()
    };
    
    const reportPath = path.join(this.errorDir, `report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(chalk.green('✅ 리포트 생성 완료!'));
    console.log(chalk.gray(`   위치: ${reportPath}`));
    console.log(chalk.yellow('\n💡 이 파일을 GitHub 이슈에 첨부해주세요.'));
  }
}

// 싱글톤 인스턴스
let instance = null;

export async function getErrorReporter() {
  if (!instance) {
    instance = new ErrorReporter();
    await instance.init();
  }
  return instance;
}

// 에러 캡처 헬퍼
export async function captureError(error, context) {
  try {
    const reporter = await getErrorReporter();
    return reporter.captureError(error, context);
  } catch (err) {
    // 에러 리포팅 자체가 실패해도 원래 작업에 영향을 주지 않도록
    console.debug('Failed to capture error:', err);
    return null;
  }
}

// 리포트 생성 헬퍼
export async function generateErrorReport() {
  const reporter = await getErrorReporter();
  return reporter.generateReport();
}