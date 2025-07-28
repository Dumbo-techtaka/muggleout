import Conf from 'conf';
import chalk from 'chalk';

// 설정 저장소 초기화
const config = new Conf({
  projectName: 'muggleout',
  defaults: {
    installed: {},
    preferences: {
      language: 'ko',
      skillLevel: 'beginner',
      autoUpdate: true
    },
    history: []
  }
});

// 설치 여부 확인
export function checkInstalled(tool) {
  const installed = config.get('installed');
  return installed[tool] !== undefined;
}

// 설치 기록 저장
export async function saveInstallRecord(tool) {
  const installed = config.get('installed');
  installed[tool] = {
    version: 'latest', // 나중에 실제 버전 확인 로직 추가
    date: new Date().toISOString()
  };
  config.set('installed', installed);
  
  // 히스토리에도 기록
  const history = config.get('history');
  history.push({
    action: 'install',
    tool,
    date: new Date().toISOString()
  });
  config.set('history', history);
}

// 설치된 도구 목록 가져오기
export function getInstalledTools() {
  return config.get('installed');
}

// 선호 설정 가져오기
export function getPreferences() {
  return config.get('preferences');
}

// 선호 설정 업데이트
export function updatePreferences(updates) {
  const preferences = config.get('preferences');
  config.set('preferences', { ...preferences, ...updates });
}

// 설정 초기화
export function resetConfig() {
  config.clear();
  console.log(chalk.green('✅ 설정이 초기화되었습니다.'));
}

// 설정 경로 가져오기
export function getConfigPath() {
  return config.path;
}

// 전체 설정 가져오기
export async function getConfig() {
  return config.store;
}

// 전체 설정 저장
export async function saveConfig(newConfig) {
  config.store = newConfig;
}

// 도구 버전 가져오기
async function getToolVersion(tool) {
  try {
    const { runCommand } = await import('./runner.js');
    let versionCmd = '';
    
    switch(tool) {
      case 'node':
        versionCmd = 'node --version';
        break;
      case 'brew':
      case 'homebrew':
        versionCmd = 'brew --version';
        break;
      case 'git':
        versionCmd = 'git --version';
        break;
      default:
        return 'unknown';
    }
    
    if (versionCmd) {
      const { stdout } = await runCommand(versionCmd, { silent: true });
      return stdout.trim();
    }
  } catch {
    return 'unknown';
  }
}