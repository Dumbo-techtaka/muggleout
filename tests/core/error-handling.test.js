import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = join(__dirname, '../../bin/muggleout.js');

describe('에러 처리 - 필수 테스트만', () => {
  const timeout = 5000;

  it('잘못된 명령어를 graceful하게 처리해야 함', async () => {
    const { stdout, stderr, exitCode } = await execa('node', [CLI_PATH, 'wrong-command-xyz'], {
      reject: false
    });
    
    // 뭔가 출력이 있어야 함 (에러든 도움말이든)
    const output = stdout + stderr;
    expect(output).toBeTruthy();
  }, timeout);

  it('여러 번 실행해도 안정적이어야 함', async () => {
    // 연속 실행 테스트
    const results = await Promise.all([
      execa('node', [CLI_PATH, '--version']),
      execa('node', [CLI_PATH, '--version']),
      execa('node', [CLI_PATH, '--version'])
    ]);
    
    // 모두 같은 버전을 반환해야 함
    const versions = results.map(r => r.stdout);
    expect(versions[0]).toBe(versions[1]);
    expect(versions[1]).toBe(versions[2]);
  }, timeout);
});