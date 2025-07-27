import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ESM 모듈 모킹
let mockExecSync;
let mockGetConfig;
let mockSaveConfig;
let mockRunCommand;

vi.mock('child_process', () => ({
  execSync: (cmd, opts) => mockExecSync(cmd, opts)
}));

vi.mock('../../../src/utils/config.js', () => ({
  getConfig: () => mockGetConfig(),
  saveConfig: (config) => mockSaveConfig(config)
}));

vi.mock('../../../src/utils/runner.js', () => ({
  runCommand: (cmd, args, opts) => mockRunCommand(cmd, args, opts)
}));

// 모킹 후 모듈 import
const updateChecker = await import('../../../src/utils/update-checker.js');

describe('update-checker.js', () => {
  let consoleSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    vi.spyOn(console, 'debug').mockImplementation();
    
    // 환경변수 설정
    process.env.MUGGLEOUT_VERSION = '1.0.0';
    
    // Mock 함수 초기화
    mockExecSync = vi.fn();
    mockGetConfig = vi.fn();
    mockSaveConfig = vi.fn();
    mockRunCommand = vi.fn();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    delete process.env.MUGGLEOUT_VERSION;
  });

  describe('checkForUpdates', () => {
    it('should detect when update is needed', async () => {
      mockGetConfig.mockResolvedValue({
        lastUpdateCheck: 0
      });
      mockSaveConfig.mockResolvedValue();
      
      mockRunCommand.mockResolvedValue({
        stdout: '1.1.0\n',
        stderr: '',
        exitCode: 0
      });
      
      const result = await updateChecker.checkForUpdates({ force: true });
      
      expect(result).toEqual({
        current: '1.0.0',
        latest: '1.1.0',
        needsUpdate: true
      });
    });

    it('should detect when no update is needed', async () => {
      process.env.MUGGLEOUT_VERSION = '1.1.0';
      
      mockGetConfig.mockResolvedValue({
        lastUpdateCheck: 0
      });
      mockSaveConfig.mockResolvedValue();
      
      mockRunCommand.mockResolvedValue({
        stdout: '1.1.0\n',
        stderr: '',
        exitCode: 0
      });
      
      const result = await updateChecker.checkForUpdates({ force: true });
      
      expect(result).toEqual({
        current: '1.1.0',
        latest: '1.1.0',
        needsUpdate: false
      });
    });

    it('should skip check if recently checked', async () => {
      const recentTime = Date.now() - (12 * 60 * 60 * 1000); // 12시간 전
      
      mockGetConfig.mockResolvedValue({
        lastUpdateCheck: recentTime
      });
      
      const result = await updateChecker.checkForUpdates();
      
      expect(result).toBe(null);
      expect(mockRunCommand).not.toHaveBeenCalled();
    });

    it('should check if more than 24 hours passed', async () => {
      const oldTime = Date.now() - (25 * 60 * 60 * 1000); // 25시간 전
      
      mockGetConfig.mockResolvedValue({
        lastUpdateCheck: oldTime
      });
      mockSaveConfig.mockResolvedValue();
      
      mockRunCommand.mockResolvedValue({
        stdout: '1.0.0\n',
        stderr: '',
        exitCode: 0
      });
      
      const result = await updateChecker.checkForUpdates();
      
      expect(result).toBeDefined();
      expect(mockRunCommand).toHaveBeenCalled();
    });

    it('should respect disabled update check', async () => {
      mockGetConfig.mockResolvedValue({
        disableUpdateCheck: true,
        lastUpdateCheck: 0
      });
      
      const result = await updateChecker.checkForUpdates();
      
      expect(result).toBe(null);
      expect(mockRunCommand).not.toHaveBeenCalled();
    });

    it('should handle network errors gracefully', async () => {
      mockGetConfig.mockResolvedValue({
        lastUpdateCheck: 0
      });
      mockSaveConfig.mockResolvedValue();
      
      mockRunCommand.mockRejectedValue(new Error('Network error'));
      
      const result = await updateChecker.checkForUpdates({ force: true });
      
      expect(result).toBe(null);
    });
  });

  describe('showUpdateNotification', () => {
    it('should show notification for available update', () => {
      const updateInfo = {
        current: '1.0.0',
        latest: '1.1.0',
        needsUpdate: true
      };
      
      updateChecker.showUpdateNotification(updateInfo);
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('새 버전이 출시되었습니다'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('1.0.0'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('1.1.0'));
    });

    it('should not show notification when no update needed', () => {
      const updateInfo = {
        current: '1.1.0',
        latest: '1.1.0',
        needsUpdate: false
      };
      
      updateChecker.showUpdateNotification(updateInfo);
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('performUpdate', () => {
    it('should perform update successfully', async () => {
      mockExecSync.mockImplementation(() => '');
      mockRunCommand.mockResolvedValue({
        stdout: '1.1.0\n',
        stderr: '',
        exitCode: 0
      });
      
      const result = await updateChecker.performUpdate();
      
      expect(result).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith('npm install -g muggleout@latest', expect.any(Object));
    });

    it('should handle update failure', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Update failed');
      });
      
      const result = await updateChecker.performUpdate();
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('수동으로 업데이트해주세요:'));
    });
  });

  describe('disableUpdateCheck', () => {
    it('should disable update check', async () => {
      mockGetConfig.mockResolvedValue({});
      mockSaveConfig.mockResolvedValue();
      
      await updateChecker.disableUpdateCheck();
      
      expect(mockSaveConfig).toHaveBeenCalledWith({
        disableUpdateCheck: true
      });
    });
  });

  describe('enableUpdateCheck', () => {
    it('should enable update check', async () => {
      mockGetConfig.mockResolvedValue({
        disableUpdateCheck: true
      });
      mockSaveConfig.mockResolvedValue();
      
      await updateChecker.enableUpdateCheck();
      
      expect(mockSaveConfig).toHaveBeenCalledWith({
        disableUpdateCheck: false
      });
    });
  });
});