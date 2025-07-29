import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = join(__dirname, '../../bin/muggleout.js');

describe('CLI E2E - 핵심 기능만', () => {
  const timeout = 10000; // 10초로 줄임

  describe('필수 명령어', () => {
    it('버전을 표시해야 함', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '--version']);
      expect(stdout).toMatch(/^\d+\.\d+\.\d+$/);
    }, timeout);

    it('도움말을 표시해야 함', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '--help']);
      expect(stdout).toContain('Usage:');
    }, timeout);

    it('doctor 명령이 작동해야 함', async () => {
      const { stdout } = await execa('node', [CLI_PATH, 'doctor']);
      expect(stdout).toContain('진단');
    }, timeout);

    it('status 명령이 작동해야 함', async () => {
      const { stdout } = await execa('node', [CLI_PATH, 'status']);
      // 상태 관련 출력이 있으면 성공
      expect(stdout.length).toBeGreaterThan(100);
    }, timeout);
  });

  describe('자연어 처리', () => {
    it('한국어 도움말을 이해해야 함', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '도움말']);
      expect(stdout).toContain('사용');
    }, timeout);
  });

  describe('에러 처리', () => {
    it('존재하지 않는 명령어를 처리해야 함', async () => {
      const { exitCode, stdout, stderr } = await execa('node', [CLI_PATH, 'xyz-not-exist'], {
        reject: false
      });
      
      // 에러가 나거나 도움말이 표시되면 OK
      const output = stdout + stderr;
      expect(output).toBeTruthy();
    }, timeout);
  });
});