import { describe, it, expect, beforeEach } from 'vitest';
import { checkInstalled, saveInstallRecord, resetConfig } from '../../src/utils/config.js';

describe('설정 관리 - 핵심 기능', () => {
  beforeEach(async () => {
    await resetConfig();
  });

  it('도구 설치 기록을 저장하고 조회할 수 있어야 함', async () => {
    // 설치 전
    expect(checkInstalled('test-tool')).toBe(false);
    
    // 설치 기록
    await saveInstallRecord('test-tool');
    
    // 설치 후
    expect(checkInstalled('test-tool')).toBe(true);
  });

  it('여러 도구의 설치 상태를 관리할 수 있어야 함', async () => {
    const tools = ['homebrew', 'git', 'node'];
    
    // 일부만 설치
    await saveInstallRecord('homebrew');
    await saveInstallRecord('git');
    
    // 상태 확인
    expect(checkInstalled('homebrew')).toBe(true);
    expect(checkInstalled('git')).toBe(true);
    expect(checkInstalled('node')).toBe(false);
  });

  it('설정을 초기화할 수 있어야 함', async () => {
    // 설정 추가
    await saveInstallRecord('tool1');
    expect(checkInstalled('tool1')).toBe(true);
    
    // 초기화
    await resetConfig();
    expect(checkInstalled('tool1')).toBe(false);
  });
});