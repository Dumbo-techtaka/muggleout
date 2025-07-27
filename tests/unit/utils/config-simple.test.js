import { describe, it, expect } from 'vitest';
import { 
  checkInstalled, 
  getInstalledTools, 
  getPreferences,
  updatePreferences,
  getConfig,
  saveConfig
} from '../../../src/utils/config.js';

// Simple tests without mocking
describe('config.js (integration)', () => {
  describe('basic functionality', () => {
    it('should check if a tool is installed', () => {
      // This will use the actual config file
      const result = checkInstalled('test-tool');
      expect(typeof result).toBe('boolean');
    });

    it('should get installed tools', () => {
      const tools = getInstalledTools();
      expect(tools).toBeDefined();
      expect(typeof tools).toBe('object');
    });

    it('should get preferences', () => {
      const prefs = getPreferences();
      expect(prefs).toBeDefined();
      expect(typeof prefs).toBe('object');
    });

    it('should handle config operations', async () => {
      const config = await getConfig();
      expect(config).toBeDefined();
      expect(config).toHaveProperty('installed');
      expect(config).toHaveProperty('preferences');
    });
  });
});