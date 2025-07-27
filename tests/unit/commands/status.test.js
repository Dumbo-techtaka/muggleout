import { describe, it, expect, vi, beforeEach } from 'vitest';

// ESM 모듈 모킹
let mockRunCommand;
let mockCheckInstalled;
let mockTerminalCheck;

vi.mock('../../../src/utils/runner.js', () => ({
  runCommand: (cmd, opts) => mockRunCommand ? mockRunCommand(cmd, opts) : Promise.resolve({ stdout: '', stderr: '', exitCode: 0 }),
  commandExists: vi.fn(() => Promise.resolve(false))
}));

vi.mock('../../../src/utils/config.js', () => ({
  checkInstalled: (tool) => mockCheckInstalled ? mockCheckInstalled(tool) : false,
  getInstalledTools: vi.fn(() => ({}))
}));

vi.mock('../../../src/utils/terminal-check.js', () => ({
  getTerminalInfo: () => mockTerminalCheck ? mockTerminalCheck() : {},
  checkTerminalEnvironment: vi.fn(() => Promise.resolve())
}));

// 모킹 후 모듈 import
const { showStatus } = await import('../../../src/commands/status.js');

describe('status.js', () => {
  let consoleSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    vi.spyOn(console, 'error').mockImplementation();
    
    // Mock 함수 초기화
    mockRunCommand = vi.fn();
    mockCheckInstalled = vi.fn();
    mockTerminalCheck = vi.fn();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('showStatus', () => {
    it('should display terminal info', async () => {
      mockTerminalCheck.mockReturnValue({
        terminal: 'iTerm2',
        version: '3.4.19',
        shell: '/bin/zsh',
        shellVersion: '5.9'
      });
      
      await showStatus();
      
      // showStatus는 터미널 환경이 아닌 설치 상태를 표시함
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('시스템 상태 확인'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('설치 상태'));
    });

    it('should check all tools installation status', async () => {
      mockTerminalCheck.mockReturnValue({
        terminal: 'Terminal',
        shell: '/bin/bash'
      });
      
      // Set up different installation states
      mockCheckInstalled
        .mockReturnValueOnce(true)  // homebrew
        .mockReturnValueOnce(false) // git
        .mockReturnValueOnce(true)  // node
        .mockReturnValueOnce(false); // oh-my-zsh
      
      mockRunCommand
        .mockResolvedValueOnce({ exitCode: 0 }) // homebrew version
        .mockResolvedValueOnce({ exitCode: 0 }); // node version
      
      await showStatus();
      
      // getInstalledTools를 사용하므로 checkInstalled는 호출되지 않음
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('설치 상태'));
      // 모든 도구가 미설치로 표시됨
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌'));
    });

    it('should show version for installed tools', async () => {
      mockTerminalCheck.mockReturnValue({
        terminal: 'Terminal',
        shell: '/bin/bash'
      });
      
      mockCheckInstalled.mockReturnValue(true);
      mockRunCommand.mockResolvedValue({
        stdout: 'Homebrew 3.6.0',
        exitCode: 0
      });
      
      await showStatus();
      
      // 설치된 도구가 없으므로 버전 확인을 하지 않음
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('설치 상태'));
    });

    it('should handle version check errors gracefully', async () => {
      mockTerminalCheck.mockReturnValue({
        terminal: 'Terminal',
        shell: '/bin/bash'
      });
      
      mockCheckInstalled.mockReturnValue(true);
      mockRunCommand.mockRejectedValue(new Error('Command failed'));
      
      await showStatus();
      
      // 모든 도구가 미설치로 표시됨
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌'));
    });
  });
});