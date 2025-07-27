import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Mock modules
vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    readdir: vi.fn(() => Promise.resolve([])),
    access: vi.fn(),
    stat: vi.fn(),
    unlink: vi.fn()
  }
}));

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(() => Promise.resolve({ consent: false }))
  }
}));

vi.mock('../../../src/utils/config.js', () => ({
  getConfig: vi.fn(() => Promise.resolve({ 
    anonymousId: 'test-id-123',
    installed: {},
    preferences: {},
    errorReporting: false // Disable error reporting to avoid prompts
  })),
  saveConfig: vi.fn(() => Promise.resolve())
}));

// Import after mocking
const { captureError } = await import('../../../src/utils/error-reporter.js');

describe('error-reporter.js', () => {
  let consoleSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    vi.spyOn(console, 'error').mockImplementation();
    vi.spyOn(console, 'debug').mockImplementation();
    
    // Mock fs methods
    fs.access.mockRejectedValue(new Error('File not found'));
    fs.mkdir.mockResolvedValue();
    fs.writeFile.mockResolvedValue();
    fs.readFile.mockImplementation((path) => {
      if (path.includes('summary.json')) {
        // Return empty summary for summary file
        return Promise.reject(new Error('File not found'));
      }
      // Return empty array for errors directory
      return Promise.resolve('[]');
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('captureError', () => {
    it('should report installation error', async () => {
      const error = {
        type: 'install',
        tool: 'homebrew',
        message: 'Installation failed',
        code: 1
      };
      
      await captureError(error, { tool: 'homebrew' });
      
      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('.muggleout/errors'),
        expect.any(Object)
      );
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should anonymize user paths', async () => {
      const username = os.userInfo().username;
      const error = new Error(`/Users/${username}/Documents/error`);
      error.type = 'install';
      error.details = {
        stderr: `/home/${username}/.config/error`
      };
      
      await captureError(error, { tool: 'git' });
      
      // Check that the written data has anonymized paths
      // Find the call that writes the error report (not the summary)
      const errorReportCall = fs.writeFile.mock.calls.find(call => 
        call[0].includes('.json') && !call[0].includes('summary.json')
      );
      const writtenData = errorReportCall[1];
      const parsedData = JSON.parse(writtenData);
      
      // Check in the error message
      expect(parsedData.error.message).not.toContain(username);
      expect(parsedData.error.message).toContain('/Users/***');
      
      // The details field might not be captured in the error object structure
      // So we check the entire written data string for any username occurrences
      expect(writtenData).not.toContain(username);
    });

    it('should skip duplicate errors within 5 minutes', async () => {
      const error = {
        type: 'network',
        tool: 'npm',
        message: 'Network timeout'
      };
      
      // Report same error twice
      await captureError(error, { tool: 'npm' });
      const callsAfterFirst = fs.writeFile.mock.calls.length;
      
      await captureError(error, { tool: 'npm' });
      const callsAfterSecond = fs.writeFile.mock.calls.length;
      
      // The second call should not write any new error file (might still write summary)
      const newErrorFiles = fs.writeFile.mock.calls.slice(callsAfterFirst, callsAfterSecond)
        .filter(call => call[0].includes('.json') && !call[0].includes('summary.json'));
      
      expect(newErrorFiles).toHaveLength(0);
    });

    it.skip('should handle file system errors gracefully', async () => {
      // Save original mock
      const originalWriteFile = fs.writeFile;
      
      // Create a new mock that rejects when called - catch to prevent unhandled rejection
      const diskFullError = new Error('Disk full');
      fs.writeFile = vi.fn(() => {
        const p = Promise.reject(diskFullError);
        p.catch(() => {}); // Prevent unhandled rejection
        return p;
      });
      
      const error = new Error('System error');
      error.type = 'system';
      
      // Should not throw and return null when file system fails
      const result = await captureError(error, { tool: 'system' });
      
      expect(result).toBe(null);
      expect(console.debug).toHaveBeenCalledWith('Failed to capture error:', expect.any(Error));
      
      // Restore original mock
      fs.writeFile = originalWriteFile;
    });

    it('should create meaningful error fingerprints', async () => {
      const error1 = {
        type: 'install',
        tool: 'homebrew',
        message: 'Failed to install'
      };
      
      const error2 = {
        type: 'install',
        tool: 'git',
        message: 'Failed to install'
      };
      
      await captureError(error1, { tool: 'homebrew' });
      await captureError(error2, { tool: 'git' });
      
      // Different tools should create different fingerprints
      // Count only error report files, not summary files
      const errorReportFiles = fs.writeFile.mock.calls.filter(call => 
        call[0].includes('.json') && !call[0].includes('summary.json')
      );
      
      expect(errorReportFiles).toHaveLength(2);
    });
  });
});