import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules
let mockRunCommand;
let mockExistsSync;
let mockReadFileSync;
let mockWriteFileSync;

vi.mock('../../../src/utils/runner.js', () => ({
  runCommand: vi.fn()
}));

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(() => Promise.resolve({ autoFix: true }))
  }
}));

vi.mock('fs', () => ({
  default: {
    promises: {
      readFile: vi.fn(),
      writeFile: vi.fn(),
      access: vi.fn(),
      copyFile: vi.fn()
    },
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn()
  },
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    access: vi.fn(),
    copyFile: vi.fn()
  },
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn()
}));

// Import after mocking
import { runCommand } from '../../../src/utils/runner.js';
import { promises as fsPromises, existsSync, readFileSync, writeFileSync } from 'fs';
const { detectPathIssues, fixPathIssues, diagnoseAndFixPath } = await import('../../../src/utils/path-fixer.js');

describe('path-fixer.js', () => {
  let consoleSpy;
  let originalArch;
  let originalPlatform;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    originalArch = process.arch;
    originalPlatform = process.platform;
    
    // Initialize mocks
    mockRunCommand = vi.fn((cmd) => {
      if (cmd === 'echo $PATH') {
        return Promise.resolve({ stdout: '/usr/bin:/bin', stderr: '', exitCode: 0 });
      }
      return Promise.resolve({ stdout: '', stderr: '', exitCode: 0 });
    });
    runCommand.mockImplementation(mockRunCommand);
    mockExistsSync = vi.fn();
    mockReadFileSync = vi.fn();
    mockWriteFileSync = vi.fn();
    
    // Setup fs mocks with mock functions
    existsSync.mockImplementation((path) => mockExistsSync ? mockExistsSync(path) : false);
    readFileSync.mockImplementation((path) => mockReadFileSync ? mockReadFileSync(path) : '');
    writeFileSync.mockImplementation((path, content) => mockWriteFileSync ? mockWriteFileSync(path, content) : undefined);
    fsPromises.access.mockImplementation((path) => {
      if (mockExistsSync && mockExistsSync(path)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('File not found'));
    });
    fsPromises.readFile.mockImplementation((path) => {
      if (mockReadFileSync) {
        return Promise.resolve(mockReadFileSync(path));
      }
      return Promise.resolve('');
    });
    fsPromises.writeFile.mockImplementation((path, content) => {
      if (mockWriteFileSync) {
        mockWriteFileSync(path, content);
      }
      return Promise.resolve();
    });
    fsPromises.copyFile.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    Object.defineProperty(process, 'arch', { value: originalArch, configurable: true });
    Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
  });

  describe('detectPathIssues', () => {
    it('should detect missing Homebrew in PATH', async () => {
      mockRunCommand = vi.fn()
        .mockResolvedValueOnce({ stdout: '/usr/bin:/bin', exitCode: 0 }) // echo $PATH
        .mockRejectedValueOnce(new Error('Command failed')); // which brew
      runCommand.mockImplementation(mockRunCommand);
      
      // Mock fs.promises.access to indicate brew is installed
      fsPromises.access.mockImplementation((path) => {
        if (path === '/opt/homebrew/bin/brew' || path === '/usr/local/bin/brew') {
          return Promise.resolve();
        }
        return Promise.reject(new Error('File not found'));
      });
      
      const issues = await detectPathIssues();
      
      expect(issues).toContainEqual(expect.objectContaining({
        type: 'brew_not_found',
        description: 'brew 명령어를 찾을 수 없습니다'
      }));
    });

    it('should detect missing Node.js in PATH', async () => {
      mockRunCommand = vi.fn()
        .mockResolvedValueOnce({ stdout: '/usr/bin:/bin', exitCode: 0 }) // echo $PATH
        .mockResolvedValueOnce({ stdout: 'brew', exitCode: 0 }) // which brew
        .mockRejectedValueOnce(new Error('Command failed')); // which node
      runCommand.mockImplementation(mockRunCommand);
      
      // Mock fs.promises.access to indicate node is installed but not in PATH
      fsPromises.access.mockImplementation((path) => {
        if (path === '/usr/local/bin/node') {
          return Promise.resolve();
        }
        return Promise.reject(new Error('File not found'));
      });
      
      const issues = await detectPathIssues();
      
      expect(issues).toContainEqual(expect.objectContaining({
        type: 'node_not_found',
        description: 'Node.js가 설치되어 있지만 PATH에서 찾을 수 없습니다'
      }));
    });

    it('should return empty array when all tools are in PATH', async () => {
      mockRunCommand = vi.fn().mockResolvedValue({ stdout: '/usr/bin:/bin', exitCode: 0 });
      runCommand.mockImplementation(mockRunCommand);
      
      // Mock fs.promises.access to indicate no tools are installed
      fsPromises.access.mockRejectedValue(new Error('File not found'));
      
      const issues = await detectPathIssues();
      
      expect(issues).toEqual([]);
    });
  });

  describe('fixPathIssues', () => {
    it('should fix zsh configuration for Homebrew', async () => {
      const issues = [{
        type: 'missing_brew_path',
        path: '/opt/homebrew/bin',
        description: 'Homebrew가 설치되어 있지만 PATH에 없습니다'
      }];
      
      process.env.SHELL = '/bin/zsh';
      Object.defineProperty(process, 'arch', { value: 'arm64', configurable: true });
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('# Existing config');
      
      await fixPathIssues(issues);
      
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.zsh'),
        expect.stringContaining('eval "$(/opt/homebrew/bin/brew shellenv)"')
      );
    });

    it('should fix bash configuration for Node.js', async () => {
      const issues = [{
        type: 'node_not_found',
        description: 'Node.js가 설치되어 있지만 PATH에서 찾을 수 없습니다'
      }];
      
      process.env.SHELL = '/bin/bash';
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('# Existing config');
      
      await fixPathIssues(issues);
      
      // For node issues, no automatic fix is performed
      expect(fsPromises.writeFile).not.toHaveBeenCalled();
    });

    it('should not duplicate existing PATH entries', async () => {
      const issues = [{
        type: 'missing_brew_path',
        path: '/opt/homebrew/bin',
        description: 'Homebrew가 설치되어 있지만 PATH에 없습니다'
      }];
      
      process.env.SHELL = '/bin/zsh';
      Object.defineProperty(process, 'arch', { value: 'arm64', configurable: true });
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('eval "$(/opt/homebrew/bin/brew shellenv)"');
      
      await fixPathIssues(issues);
      
      // Should not write if brew shellenv already exists
      expect(fsPromises.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('diagnoseAndFixPath', () => {
    it('should diagnose and fix issues automatically', async () => {
      mockRunCommand = vi.fn()
        .mockResolvedValueOnce({ stdout: '/usr/bin:/bin', exitCode: 0 }) // echo $PATH
        .mockRejectedValueOnce(new Error('Command failed')); // which brew
      runCommand.mockImplementation(mockRunCommand);
      
      // Mock fs.promises.access to indicate brew is installed
      fsPromises.access.mockImplementation((path) => {
        if (path === '/opt/homebrew/bin/brew' || path === '/usr/local/bin/brew') {
          return Promise.resolve();
        }
        return Promise.reject(new Error('File not found'));
      });
      
      process.env.SHELL = '/bin/zsh';
      Object.defineProperty(process, 'arch', { value: 'arm64', configurable: true });
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('# Config');
      
      await diagnoseAndFixPath();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('PATH 설정을 확인하고 있습니다')
      );
      expect(fsPromises.writeFile).toHaveBeenCalled();
    });

    it('should report when no issues found', async () => {
      mockRunCommand = vi.fn().mockResolvedValue({ stdout: '/usr/bin:/bin', exitCode: 0 });
      runCommand.mockImplementation(mockRunCommand);
      
      // Mock fs.promises.access to indicate no tools are installed
      fsPromises.access.mockRejectedValue(new Error('File not found'));
      
      await diagnoseAndFixPath();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('PATH 설정이 정상입니다')
      );
      expect(fsPromises.writeFile).not.toHaveBeenCalled();
    });
  });
});