import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkSystem, checkNetwork, checkDiskSpace } from '../../../src/utils/system-check.js';

describe('system-check.js', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('checkSystem', () => {
    it('should detect test mode', async () => {
      // Set test environment
      process.env.MUGGLEOUT_TEST = 'true';
      
      await checkSystem();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('테스트 모드로 실행 중')
      );
      
      // Clean up
      delete process.env.MUGGLEOUT_TEST;
    });

    it('should return system info in test mode', async () => {
      process.env.MUGGLEOUT_TEST = 'true';
      
      const result = await checkSystem();
      
      expect(result).toHaveProperty('platform');
      expect(result).toHaveProperty('arch');
      
      delete process.env.MUGGLEOUT_TEST;
    });
  });

  describe('checkNetwork', () => {
    it('should return boolean for network status', async () => {
      const result = await checkNetwork();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('checkDiskSpace', () => {
    it('should return boolean for disk space status', async () => {
      const result = await checkDiskSpace();
      expect(typeof result).toBe('boolean');
    });
  });
});