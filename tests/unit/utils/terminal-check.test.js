import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the execa module
vi.mock('execa', () => ({
  execa: vi.fn()
}));

// Import after mocking
import { getTerminalInfo } from '../../../src/utils/terminal-check.js';

describe('terminal-check.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    delete process.env.TERM_PROGRAM;
    delete process.env.ITERM_PROFILE;
  });

  describe('getTerminalInfo', () => {
    it('should detect iTerm2 from environment', () => {
      process.env.TERM_PROGRAM = 'iTerm.app';
      
      const info = getTerminalInfo();
      
      expect(info.terminal).toBe('iTerm2');
    });

    it('should detect Terminal.app from environment', () => {
      process.env.TERM_PROGRAM = 'Apple_Terminal';
      
      const info = getTerminalInfo();
      
      expect(info.terminal).toBe('Terminal.app');
    });

    it('should detect zsh shell', () => {
      process.env.SHELL = '/bin/zsh';
      
      const info = getTerminalInfo();
      
      expect(info.shell).toBe('/bin/zsh');
    });

    it('should detect bash shell', () => {
      process.env.SHELL = '/bin/bash';
      
      const info = getTerminalInfo();
      
      expect(info.shell).toBe('/bin/bash');
    });

    it('should return unknown for unrecognized terminal', () => {
      process.env.TERM_PROGRAM = 'UnknownTerminal';
      
      const info = getTerminalInfo();
      
      expect(info.terminal).toBe('Unknown Terminal');
    });

    it('should handle missing environment variables', () => {
      // All env vars are cleared in beforeEach
      const info = getTerminalInfo();
      
      expect(info).toHaveProperty('terminal');
      expect(info).toHaveProperty('shell');
    });
  });
});