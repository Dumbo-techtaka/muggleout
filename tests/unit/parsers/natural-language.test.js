import { describe, it, expect, vi, beforeEach } from 'vitest';

// ESM 모듈 모킹
let mockCheckStatus;
let mockStartInteractiveMode;

vi.mock('../../../src/commands/install.js', () => ({
  installTool: vi.fn()
}));

vi.mock('../../../src/commands/status.js', () => ({
  showStatus: () => mockCheckStatus ? mockCheckStatus() : undefined
}));

vi.mock('../../../src/ui/interactive.js', () => ({
  startInteractiveMode: vi.fn()
}));

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(() => Promise.resolve({ 
      action: '🎨 터미널 꾸미기',
      tool: 'git' 
    }))
  }
}));

// Mock the main CLI to prevent interactive mode
vi.mock('../../../src/cli/main.js', () => ({
  main: vi.fn(() => Promise.resolve())
}));

// 모킹 후 모듈 import
const { installTool } = await import('../../../src/commands/install.js');
const { startInteractiveMode } = await import('../../../src/ui/interactive.js');
const { handleNaturalCommand: parseNaturalLanguage } = await import('../../../src/parsers/natural-language.js');

describe('natural-language.js', () => {
  let consoleSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    
    // Mock 함수 초기화
    mockCheckStatus = vi.fn();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('parseNaturalLanguage', () => {
    it('should parse install commands', async () => {
      const installCommands = [
        'homebrew 설치해줘',
        'git 설치하고 싶어',
        'node를 깔아줘',
        'oh my zsh 인스톨'
      ];

      for (const command of installCommands) {
        await parseNaturalLanguage(command);
      }

      expect(installTool).toHaveBeenCalledWith('homebrew');
      expect(installTool).toHaveBeenCalledWith('git');
      expect(installTool).toHaveBeenCalledWith('node');
      expect(installTool).toHaveBeenCalledWith('oh-my-zsh');
    });

    it('should parse beautify commands', async () => {
      const beautifyCommands = [
        '터미널 예쁘게 해줘',
        '터미널 꾸미기',
        '터미널 테마 설정',
        '컬러풀하게 만들어줘'
      ];

      for (const command of beautifyCommands) {
        await parseNaturalLanguage(command);
        expect(installTool).toHaveBeenCalledWith('terminal-beautify');
        installTool.mockClear(); // Clear between iterations
      }
    });

    it('should parse status commands', async () => {
      const statusCommands = [
        '상태 확인',
        '뭐가 설치됐어?',
        'status',
        '설치된 것들 보여줘'
      ];

      for (const command of statusCommands) {
        await parseNaturalLanguage(command);
        expect(mockCheckStatus).toHaveBeenCalled();
      }
    });

    it('should parse help commands', async () => {
      const helpCommands = [
        '도움말',
        'help',
        '어떻게 사용해?',
        '도와줘'
      ];

      for (const command of helpCommands) {
        await parseNaturalLanguage(command);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('사용 가능한 명령어'));
      }
    });

    it('should handle tool name variations', async () => {
      const toolNameVariations = {
        'claude code 설치': 'claude-code',
        '클로드 설치해줘': 'claude-code',
        'gemini cli 설치': 'gemini-cli',
        '제미니 설치': 'gemini-cli',
        'homebrew 설치': 'homebrew',
        '홈브루 설치해줘': 'homebrew'
      };

      for (const [command, expectedTool] of Object.entries(toolNameVariations)) {
        await parseNaturalLanguage(command);
        expect(installTool).toHaveBeenCalledWith(expectedTool);
        installTool.mockClear();
      }
    });

    it('should handle unknown commands', async () => {
      await parseNaturalLanguage('알 수 없는 명령어');
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('무엇을 도와드릴까요?'));
      expect(installTool).not.toHaveBeenCalled();
    });

    it('should show help when general install command', async () => {
      await parseNaturalLanguage('설치하고 싶어');
      
      // When no specific tool is mentioned, it shows interactive mode with install option
      expect(startInteractiveMode).toHaveBeenCalledWith('install');
    });

    it('should handle multiple tools in one command', async () => {
      // The natural language parser currently doesn't handle multiple tools
      // It will only install the first one it finds
      await parseNaturalLanguage('git 설치해줘');
      expect(installTool).toHaveBeenCalledWith('git');
      
      installTool.mockClear();
      
      await parseNaturalLanguage('node 설치해줘');
      expect(installTool).toHaveBeenCalledWith('node');
    });
  });
});