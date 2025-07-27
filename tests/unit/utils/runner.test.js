import { describe, it, expect, vi, beforeEach } from 'vitest';

// ESM 모듈 모킹
let mockExeca;

vi.mock('execa', () => ({
  execa: (cmd, args, opts) => mockExeca(cmd, args, opts)
}));

// 모킹 후 모듈 import
const { runCommand, commandExists } = await import('../../../src/utils/runner.js');

describe('runner.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExeca = vi.fn();
  });

  describe('runCommand', () => {
    it('should execute command successfully', async () => {
      const mockResult = {
        stdout: 'command output',
        stderr: '',
        exitCode: 0
      };
      
      mockExeca.mockResolvedValue(mockResult);
      
      const result = await runCommand('echo "test"');
      
      expect(result).toEqual(mockResult);
      expect(mockExeca).toHaveBeenCalledWith('bash', ['-c', 'echo "test"'], undefined);
    });

    it('should handle command with home directory expansion', async () => {
      const mockResult = {
        stdout: 'expanded',
        stderr: '',
        exitCode: 0
      };
      
      mockExeca.mockResolvedValue(mockResult);
      
      await runCommand('ls ~/test');
      
      expect(mockExeca).toHaveBeenCalledWith(
        'bash', 
        ['-c', expect.stringContaining('ls ')],
        undefined
      );
    });

    it('should handle command failure', async () => {
      const mockError = new Error('Command failed');
      mockError.exitCode = 1;
      mockError.stdout = '';
      mockError.stderr = 'error output';
      
      mockExeca.mockRejectedValue(mockError);
      
      // Should throw error in non-silent mode
      await expect(runCommand('invalid-command')).rejects.toThrow('Command failed');
    });

    it('should handle interactive mode', async () => {
      const mockResult = {
        stdout: 'interactive output',
        stderr: '',
        exitCode: 0
      };
      
      mockExeca.mockResolvedValue(mockResult);
      
      await runCommand('command', { interactive: true });
      
      expect(mockExeca).toHaveBeenCalledWith(
        'bash',
        ['-c', 'command'],
        expect.objectContaining({ stdio: 'inherit' })
      );
    });

    it('should handle silent mode', async () => {
      const mockResult = {
        stdout: 'silent output',
        stderr: '',
        exitCode: 0
      };
      
      mockExeca.mockResolvedValue(mockResult);
      
      await runCommand('command', { silent: true });
      
      expect(mockExeca).toHaveBeenCalledWith(
        'bash',
        ['-c', 'command'],
        undefined
      );
    });
  });

  describe('commandExists', () => {
    it('should return true for existing command', async () => {
      // First call to 'which'
      mockExeca.mockResolvedValueOnce({
        stdout: '/usr/bin/git',
        stderr: '',
        exitCode: 0
      });
      
      // Second call to 'git --version'
      mockExeca.mockResolvedValueOnce({
        stdout: 'git version 2.39.0',
        stderr: '',
        exitCode: 0
      });
      
      const exists = await commandExists('git');
      
      expect(exists).toBe(true);
      expect(mockExeca).toHaveBeenCalledWith('which', ['git'], undefined);
      expect(mockExeca).toHaveBeenCalledWith('git', ['--version'], { timeout: 3000 });
    });

    it('should return false for non-existing command', async () => {
      const mockError = new Error('Command not found');
      mockError.exitCode = 1;
      
      mockExeca.mockRejectedValue(mockError);
      
      const exists = await commandExists('nonexistent');
      
      expect(exists).toBe(false);
    });

    it('should handle command check errors gracefully', async () => {
      mockExeca.mockRejectedValue(new Error('Unknown error'));
      
      const exists = await commandExists('command');
      
      expect(exists).toBe(false);
    });
  });
});