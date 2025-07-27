import { describe, it, expect, vi, beforeEach } from 'vitest';

// ESM 모듈 모킹
let mockRunCommand;
let mockCommandExists;
let mockCheckInstalled;
let mockSaveInstallRecord;
let mockShowToolPreview;
let mockRunSequentially;
let mockReportError;
let mockInquirerPrompt;

vi.mock('../../../src/utils/runner.js', () => ({
  runCommand: (cmd, opts) => mockRunCommand ? mockRunCommand(cmd, opts) : Promise.resolve({ stdout: '', stderr: '', exitCode: 0 }),
  commandExists: (cmd) => mockCommandExists ? mockCommandExists(cmd) : Promise.resolve(false)
}));

vi.mock('../../../src/utils/config.js', () => ({
  checkInstalled: (tool) => mockCheckInstalled ? mockCheckInstalled(tool) : false,
  saveInstallRecord: (tool) => mockSaveInstallRecord ? mockSaveInstallRecord(tool) : Promise.resolve(),
  getConfig: () => Promise.resolve({
    anonymousId: 'test-id',
    installed: {},
    preferences: {
      language: 'ko',
      skillLevel: 'beginner',
      autoUpdate: true
    },
    history: []
  }),
  saveConfig: () => Promise.resolve()
}));

vi.mock('../../../src/utils/preview.js', () => ({
  showToolPreview: (tool) => mockShowToolPreview(tool)
}));

vi.mock('p-queue', () => ({
  default: class PQueue {
    constructor() {
      this.add = vi.fn((fn) => fn());
    }
  }
}));

vi.mock('../../../src/utils/error-reporter.js', () => ({
  captureError: (error, context) => mockReportError ? mockReportError(error, context) : Promise.resolve()
}));

vi.mock('inquirer', () => ({
  default: {
    prompt: (questions) => mockInquirerPrompt ? mockInquirerPrompt(questions) : Promise.resolve({})
  }
}));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    stop: vi.fn().mockReturnThis(),
    text: ''
  }))
}));

// 모킹 후 모듈 import
const install = await import('../../../src/commands/install.js');

describe('install.js', () => {
  let consoleSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    vi.spyOn(console, 'error').mockImplementation();
    
    // Reset mocks
    mockRunCommand = vi.fn();
    mockCommandExists = vi.fn();
    mockCheckInstalled = vi.fn();
    mockSaveInstallRecord = vi.fn();
    mockShowToolPreview = vi.fn();
    mockReportError = vi.fn();
    mockInquirerPrompt = vi.fn();
    
    // Mock 함수 초기화
    mockRunCommand = vi.fn();
    mockCheckInstalled = vi.fn();
    mockSaveInstallRecord = vi.fn();
    mockShowToolPreview = vi.fn();
    mockRunSequentially = vi.fn(fn => fn());
    mockReportError = vi.fn();
    mockInquirerPrompt = vi.fn();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('installTool', () => {
    it('should skip installation if tool is already installed', async () => {
      mockCommandExists.mockResolvedValue(true);
      mockInquirerPrompt.mockResolvedValue({ continueAnyway: false });
      
      await install.installTool('homebrew');
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('이미 설치되어 있습니다'));
      expect(mockRunCommand).not.toHaveBeenCalled();
    });

    it('should install homebrew successfully', async () => {
      mockCommandExists.mockResolvedValue(false);
      mockRunCommand.mockResolvedValue({ stdout: 'Success', stderr: '', exitCode: 0 });
      
      await install.installTool('homebrew');
      
      expect(mockRunCommand).toHaveBeenCalledWith(
        expect.stringContaining('/bin/bash -c'),
        expect.objectContaining({ interactive: true })
      );
      expect(mockSaveInstallRecord).toHaveBeenCalledWith('homebrew');
    });

    it('should handle installation failure', async () => {
      mockCommandExists.mockResolvedValue(false);
      mockRunCommand.mockRejectedValue(new Error('Installation failed'));
      mockInquirerPrompt.mockResolvedValue({ consent: true });
      
      await install.installTool('homebrew');
      
      expect(mockReportError).toHaveBeenCalled();
    });
  });
});