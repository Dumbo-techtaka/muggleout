import os from 'os';

// 언어 팩
const locales = {
  ko: {
    welcome: 'Dev Setup CLI에 오신 것을 환영합니다',
    subtitle: '비개발자를 위한 개발 환경 설정 도구',
    
    // 메인 메뉴
    menu: {
      title: '어떤 작업을 하시겠습니까?',
      customize: '🎨 터미널 꾸미기',
      install: '📦 개발 도구 설치',
      ai: '🤖 AI 도구 설정',
      troubleshoot: '🔧 문제 해결',
      prompt: '💬 프롬프트 모드',
      exit: '👋 종료'
    },
    
    // 상태 메시지
    status: {
      checking: '시스템 상태 확인 중...',
      installed: '설치됨',
      notInstalled: '미설치',
      permission: '관리자 권한이 필요합니다',
      continue: '계속하시겠습니까?',
      cancelled: '취소되었습니다',
      completed: '완료되었습니다'
    },
    
    // 설치 메시지
    install: {
      starting: '설치를 시작합니다...',
      inProgress: '설치 중...',
      success: '설치 완료!',
      failed: '설치 실패',
      passwordRequired: '설치 중 비밀번호 입력이 필요할 수 있습니다'
    },
    
    // 프롬프트 모드
    prompt: {
      welcome: '프롬프트 모드를 시작합니다!',
      instruction: '자연어로 명령을 입력하세요. 메뉴로 돌아가려면 "menu" 또는 "메뉴"를 입력하세요.',
      tip: '💡 Tip: /help를 입력하면 모든 사용 가능한 명령어를 볼 수 있어요!',
      exit: 'exit: 종료, menu: 메뉴'
    }
  },
  
  en: {
    welcome: 'Welcome to Dev Setup CLI',
    subtitle: 'Development environment setup tool for non-developers',
    
    menu: {
      title: 'What would you like to do?',
      customize: '🎨 Customize Terminal',
      install: '📦 Install Dev Tools',
      ai: '🤖 Setup AI Tools',
      troubleshoot: '🔧 Troubleshooting',
      prompt: '💬 Prompt Mode',
      exit: '👋 Exit'
    },
    
    status: {
      checking: 'Checking system status...',
      installed: 'Installed',
      notInstalled: 'Not installed',
      permission: 'Administrator permission required',
      continue: 'Continue?',
      cancelled: 'Cancelled',
      completed: 'Completed'
    },
    
    install: {
      starting: 'Starting installation...',
      inProgress: 'Installing...',
      success: 'Installation complete!',
      failed: 'Installation failed',
      passwordRequired: 'Password may be required during installation'
    },
    
    prompt: {
      welcome: 'Starting prompt mode!',
      instruction: 'Enter commands in natural language. Type "menu" to return to menu.',
      tip: '💡 Tip: Type /help to see all available commands!',
      exit: 'exit: quit, menu: menu'
    }
  },
  
  ja: {
    welcome: 'Dev Setup CLIへようこそ',
    subtitle: '非開発者のための開発環境設定ツール',
    
    menu: {
      title: '何をしますか？',
      customize: '🎨 ターミナルのカスタマイズ',
      install: '📦 開発ツールのインストール',
      ai: '🤖 AIツールの設定',
      troubleshoot: '🔧 トラブルシューティング',
      prompt: '💬 プロンプトモード',
      exit: '👋 終了'
    },
    
    status: {
      checking: 'システムステータスを確認中...',
      installed: 'インストール済み',
      notInstalled: '未インストール',
      permission: '管理者権限が必要です',
      continue: '続行しますか？',
      cancelled: 'キャンセルされました',
      completed: '完了しました'
    },
    
    install: {
      starting: 'インストールを開始します...',
      inProgress: 'インストール中...',
      success: 'インストール完了！',
      failed: 'インストール失敗',
      passwordRequired: 'インストール中にパスワードが必要になる場合があります'
    },
    
    prompt: {
      welcome: 'プロンプトモードを開始します！',
      instruction: '自然な言葉でコマンドを入力してください。メニューに戻るには"menu"と入力します。',
      tip: '💡 ヒント: /helpと入力すると、利用可能なコマンドがすべて表示されます！',
      exit: 'exit: 終了, menu: メニュー'
    }
  }
};

// 시스템 언어 감지
function getSystemLocale() {
  const locale = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || '';
  
  if (locale.includes('ko') || locale.includes('KR')) return 'ko';
  if (locale.includes('ja') || locale.includes('JP')) return 'ja';
  return 'en';
}

// 사용자 설정 언어 가져오기
function getUserLocale() {
  // 환경 변수에서 확인
  if (process.env.DEV_SETUP_LANG) {
    return process.env.DEV_SETUP_LANG;
  }
  
  // 시스템 언어 사용
  return getSystemLocale();
}

// 현재 언어
let currentLocale = getUserLocale();

// 번역 함수
export function t(key) {
  const keys = key.split('.');
  let value = locales[currentLocale] || locales.en;
  
  for (const k of keys) {
    value = value[k];
    if (!value) {
      // 기본값으로 영어 사용
      value = locales.en;
      for (const k2 of keys) {
        value = value[k2];
        if (!value) return key; // 키 자체 반환
      }
      return value;
    }
  }
  
  return value;
}

// 언어 변경
export function setLocale(locale) {
  if (locales[locale]) {
    currentLocale = locale;
    process.env.DEV_SETUP_LANG = locale;
  }
}

// 현재 언어 가져오기
export function getLocale() {
  return currentLocale;
}

// 지원 언어 목록
export function getSupportedLocales() {
  return Object.keys(locales);
}

// i18n 객체 export for testing
const i18n = {
  t,
  changeLanguage: setLocale,
  get language() { return currentLocale; },
  getLocale
};

export default i18n;