import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { installTool } from '../../src/commands/install.js';
import * as runnerModule from '../../src/utils/runner.js';
import * as configModule from '../../src/utils/config.js';

// 모듈 모킹
vi.mock('../../src/utils/runner.js');
vi.mock('../../src/utils/config.js', () => ({
  checkInstalled: vi.fn(),
  saveInstallRecord: vi.fn(),
  getConfig: vi.fn(() => Promise.resolve({
    anonymousId: 'test-anonymous-id',
    installed: {},
    preferences: {
      language: 'ko',
      skillLevel: 'beginner',
      autoUpdate: true
    },
    history: []
  })),
  saveConfig: vi.fn(() => Promise.resolve())
}));
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(() => Promise.resolve({ consent: true }))
  }
}));
vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis()
  }))
}));

describe('Install Command Integration Tests', () => {
  let consoleSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
    
    // inquirer is mocked globally, no need to reset here
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('installTool', () => {
    it('should skip installation if tool is already installed', async () => {
      runnerModule.commandExists.mockResolvedValue(true);
      
      const { default: inquirer } = await import('inquirer');
      inquirer.prompt.mockResolvedValueOnce({ continueAnyway: false });
      
      await installTool('homebrew');
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('이미 설치되어 있습니다'));
      expect(runnerModule.runCommand).not.toHaveBeenCalled();
    });

    it('should install Homebrew successfully', async () => {
      runnerModule.commandExists.mockResolvedValue(false);
      runnerModule.runCommand.mockResolvedValue({
        stdout: 'Installation successful',
        stderr: '',
        exitCode: 0
      });
      configModule.saveInstallRecord.mockResolvedValue();
      
      await installTool('homebrew');
      
      expect(runnerModule.runCommand).toHaveBeenCalledWith(
        expect.stringContaining('Homebrew/install'),
        expect.objectContaining({ interactive: true })
      );
      expect(configModule.saveInstallRecord).toHaveBeenCalledWith('homebrew');
    });

    it('should handle installation with dependencies', async () => {
      // powerlevel10k 설치 시 oh-my-zsh 의존성 체크
      runnerModule.commandExists.mockResolvedValue(false);
      
      runnerModule.runCommand
        .mockResolvedValueOnce({ // test -d ~/.oh-my-zsh check
          stdout: '',
          stderr: '',
          exitCode: 1
        })
        .mockResolvedValue({ // installation commands
          stdout: 'Installation successful',
          stderr: '',
          exitCode: 0
        });
      
      const { default: inquirer } = await import('inquirer');
      inquirer.prompt
        .mockResolvedValueOnce({ installDep: true }) // Install dependency prompt
        .mockResolvedValue({ consent: true }); // Error reporting consent
      
      configModule.saveInstallRecord.mockResolvedValue();
      
      await installTool('p10k');
      
      // p10k 자체 설치 명령어가 호출되어야 함 (oh-my-zsh는 이미 설치된 것으로 간주)
      const calls = runnerModule.runCommand.mock.calls;
      const p10kInstallCall = calls.find(call => call[0].includes('romkatv/powerlevel10k'));
      expect(p10kInstallCall).toBeTruthy();
    });

    it('should handle installation failure', async () => {
      runnerModule.commandExists.mockResolvedValue(false);
      runnerModule.runCommand.mockRejectedValue(new Error('Installation failed'));
      configModule.saveInstallRecord.mockResolvedValue();
      
      await installTool('homebrew');
      
      // 에러는 console.error로 출력됨 (Installation failed)
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Installation failed'));
    });

    it('should handle virtual tools like terminal-beautify', async () => {
      // Mock commandExists to return false for all tools
      runnerModule.commandExists.mockResolvedValue(false);
      
      // Mock runCommand for various checks and installations
      runnerModule.runCommand
        .mockResolvedValueOnce({ exitCode: 1 }) // test -d /Applications/iTerm.app
        .mockResolvedValueOnce({ exitCode: 0 }) // brew install --cask iterm2
        .mockResolvedValueOnce({ exitCode: 1 }) // test -d ~/.oh-my-zsh
        .mockResolvedValueOnce({ exitCode: 0 }) // oh-my-zsh install
        .mockResolvedValueOnce({ exitCode: 1 }) // test -d p10k
        .mockResolvedValueOnce({ exitCode: 0 }); // p10k install
      
      configModule.saveInstallRecord.mockResolvedValue();
      
      await installTool('terminal-beautify');
      
      // 여러 도구가 순차적으로 설치되어야 함
      const calls = runnerModule.runCommand.mock.calls;
      
      // oh-my-zsh를 확인하는 test 명령어가 호출되었는지 확인
      const ohmyzshCheckCall = calls.find(call => call[0] === 'test -d ~/.oh-my-zsh');
      expect(ohmyzshCheckCall).toBeTruthy();
      
      // p10k를 확인하는 test 명령어가 호출되었는지 확인
      const p10kCheckCall = calls.find(call => call[0].includes('powerlevel10k'));
      expect(p10kCheckCall).toBeTruthy();
    });
  });
});