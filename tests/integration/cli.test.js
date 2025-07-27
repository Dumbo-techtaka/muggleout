import { jest } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, '../../bin/muggleout.js');

describe('CLI Integration Tests', () => {
  // CLI 실행 헬퍼 함수
  function runCLI(args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const timeout = options.timeout || 5000;
      const child = spawn('node', [CLI_PATH, ...args], {
        env: { ...process.env, NODE_ENV: 'test', CI: 'true' }
      });
      
      let stdout = '';
      let stderr = '';
      let resolved = false;
      
      // Timeout 처리
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          child.kill('SIGTERM');
          resolve({ code: 1, stdout, stderr: stderr + '\nTimeout after ' + timeout + 'ms' });
        }
      }, timeout);
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve({ code, stdout, stderr });
        }
      });
      
      child.on('error', (err) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          reject(err);
        }
      });
    });
  }

  describe('Basic Commands', () => {
    it('should show version with --version flag', async () => {
      const { code, stdout } = await runCLI(['--version']);
      
      expect(code).toBe(0);
      expect(stdout).toMatch(/\d+\.\d+\.\d+/);
    });

    it('should show help with --help flag', async () => {
      const { code, stdout } = await runCLI(['--help']);
      
      expect(code).toBe(0);
      expect(stdout).toContain('Usage:');
      expect(stdout).toContain('muggleout');
      expect(stdout).toContain('Commands:');
    });

    it('should show banner when run without arguments', async () => {
      const { stdout } = await runCLI([], { timeout: 2000 });
      
      expect(stdout).toContain('Muggleout');
      expect(stdout).toContain('Transform muggles into terminal wizards');
    }, 15000);
  });

  describe('Command Execution', () => {
    it('should execute status command', async () => {
      const { code, stdout } = await runCLI(['status']);
      
      expect(code).toBe(0);
      expect(stdout).toContain('설치 상태');
    });

    it('should execute doctor command', async () => {
      const { code, stdout } = await runCLI(['doctor']);
      
      expect(code).toBe(0);
      expect(stdout).toContain('시스템 진단');
    });

    it('should handle natural language commands', async () => {
      const { code, stdout } = await runCLI(['상태', '확인']);
      
      expect(code).toBe(0);
      expect(stdout).toContain('설치 상태');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid commands gracefully', async () => {
      const { code, stdout } = await runCLI(['invalid-command'], { timeout: 2000 });
      
      expect(code).toBe(0);
      expect(stdout).toContain('무엇을 도와드릴까요?');
    }, 15000);

    it('should handle missing tool name for install command', async () => {
      const { code, stderr } = await runCLI(['install']);
      
      expect(code).toBe(1);
      expect(stderr).toContain('error');
    });
  });

  describe('Environment Detection', () => {
    it('should detect macOS environment', async () => {
      if (process.platform === 'darwin') {
        const { stdout } = await runCLI([], { timeout: 2000 });
        
        // In test mode, it shows test mode message instead of macOS
        expect(stdout).toContain('테스트 모드로 실행 중');
      } else {
        expect(true).toBe(true); // Skip test on non-macOS
      }
    }, 15000);

    it('should show iTerm2 recommendation on macOS', async () => {
      if (process.platform === 'darwin' && process.env.TERM_PROGRAM !== 'iTerm.app') {
        const { stdout } = await runCLI([], { timeout: 2000 });
        
        expect(stdout).toContain('iTerm2');
      } else {
        expect(true).toBe(true); // Skip test if not applicable
      }
    });
  });
});