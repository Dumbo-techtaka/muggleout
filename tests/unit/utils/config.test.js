import { describe, it, expect, vi, beforeEach } from 'vitest';

// ESM 모듈 모킹
let mockConfInstance = {
  get: vi.fn(),
  set: vi.fn(),
  clear: vi.fn(),
  store: {},
  path: '/mock/config/path'
};

vi.mock('conf', () => ({
  default: vi.fn(() => mockConfInstance)
}));

// 모킹 후 모듈 import
const {
  checkInstalled,
  saveInstallRecord,
  getInstalledTools,
  getPreferences,
  updatePreferences,
  resetConfig,
  getConfig,
  saveConfig
} = await import('../../../src/utils/config.js');

describe('config.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock implementation
    mockConfInstance.get.mockReset();
    mockConfInstance.set.mockReset();
    mockConfInstance.clear.mockReset();
    mockConfInstance.store = {};
  });

  describe('checkInstalled', () => {
    it('should return true if tool is installed', () => {
      mockConfInstance.get.mockReturnValue({
        'homebrew': { version: '3.0.0', date: '2025-01-27' }
      });
      
      const isInstalled = checkInstalled('homebrew');
      
      expect(isInstalled).toBe(true);
      expect(mockConfInstance.get).toHaveBeenCalledWith('installed');
    });

    it('should return false if tool is not installed', () => {
      mockConfInstance.get.mockReturnValue({});
      
      const isInstalled = checkInstalled('git');
      
      expect(isInstalled).toBe(false);
    });
  });

  describe('saveInstallRecord', () => {
    it('should save installation record', async () => {
      const mockInstalled = {};
      const mockHistory = [];
      mockConfInstance.get
        .mockReturnValueOnce(mockInstalled) // first call for installed
        .mockReturnValueOnce(mockHistory); // second call for history
      
      await saveInstallRecord('node');
      
      expect(mockConfInstance.set).toHaveBeenCalledWith('installed', expect.objectContaining({
        node: expect.objectContaining({
          version: 'latest',
          date: expect.any(String)
        })
      }));
    });

    it('should update history', async () => {
      const mockHistory = [];
      mockConfInstance.get
        .mockReturnValueOnce({}) // installed
        .mockReturnValueOnce(mockHistory); // history
      
      await saveInstallRecord('git');
      
      expect(mockConfInstance.set).toHaveBeenCalledWith('history', expect.arrayContaining([
        expect.objectContaining({
          action: 'install',
          tool: 'git',
          date: expect.any(String)
        })
      ]));
    });
  });

  describe('getInstalledTools', () => {
    it('should return installed tools', () => {
      const mockTools = {
        'homebrew': { version: '3.0.0' },
        'node': { version: 'v18.0.0' }
      };
      mockConfInstance.get.mockReturnValue(mockTools);
      
      const tools = getInstalledTools();
      
      expect(tools).toEqual(mockTools);
      expect(mockConfInstance.get).toHaveBeenCalledWith('installed');
    });
  });

  describe('getPreferences', () => {
    it('should return user preferences', () => {
      const mockPrefs = {
        language: 'ko',
        skillLevel: 'beginner',
        autoUpdate: true
      };
      mockConfInstance.get.mockReturnValue(mockPrefs);
      
      const prefs = getPreferences();
      
      expect(prefs).toEqual(mockPrefs);
      expect(mockConfInstance.get).toHaveBeenCalledWith('preferences');
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences with new values', () => {
      const currentPrefs = {
        language: 'ko',
        skillLevel: 'beginner',
        autoUpdate: true
      };
      mockConfInstance.get.mockReturnValue(currentPrefs);
      
      const updates = { language: 'en', autoUpdate: false };
      updatePreferences(updates);
      
      expect(mockConfInstance.set).toHaveBeenCalledWith('preferences', {
        language: 'en',
        skillLevel: 'beginner',
        autoUpdate: false
      });
    });
  });

  describe('resetConfig', () => {
    it('should clear all configuration', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
      
      resetConfig();
      
      expect(mockConfInstance.clear).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('설정이 초기화되었습니다'));
      
      consoleSpy.mockRestore();
    });
  });

  describe('getConfig and saveConfig', () => {
    it('should get entire config store', async () => {
      const mockStore = { test: 'value' };
      mockConfInstance.store = mockStore;
      
      const config = await getConfig();
      
      expect(config).toEqual(mockStore);
    });

    it('should save entire config store', async () => {
      const newConfig = { updated: 'config' };
      
      await saveConfig(newConfig);
      
      expect(mockConfInstance.store).toEqual(newConfig);
    });
  });
});