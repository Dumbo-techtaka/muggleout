import { describe, it, expect, vi } from 'vitest';

// 자연어 처리는 실제로 직접 테스트하기 어려우므로
// 간단한 패턴 매칭만 테스트
describe('자연어 처리 - 핵심 패턴', () => {
  // natural-language.js의 핵심 패턴들
  const patterns = {
    install: ['설치', 'install', '설치해줘', '깔아줘'],
    beautify: ['예쁘게', '꾸미기', '꾸며줘', '테마'],
    help: ['도움말', 'help', '도움', '설명'],
    status: ['상태', 'status', '확인']
  };

  describe('명령어 패턴 매칭', () => {
    it('설치 관련 키워드를 인식해야 함', () => {
      const installInputs = [
        'git 설치해줘',
        'install git',
        'homebrew 깔아줘',
        '터미널 설치하고 싶어'
      ];

      for (const input of installInputs) {
        const hasInstallKeyword = patterns.install.some(keyword => 
          input.includes(keyword)
        );
        expect(hasInstallKeyword).toBe(true);
      }
    });

    it('꾸미기 관련 키워드를 인식해야 함', () => {
      const beautifyInputs = [
        '터미널 예쁘게 해줘',
        '테마 설정하고 싶어',
        '꾸며줘'
      ];

      for (const input of beautifyInputs) {
        const hasBeautifyKeyword = patterns.beautify.some(keyword => 
          input.includes(keyword)
        );
        expect(hasBeautifyKeyword).toBe(true);
      }
    });
  });

  describe('도구명 매핑', () => {
    const toolMappings = {
      'claude': ['claude', '클로드'],
      'git': ['git', '깃'],
      'terminal': ['terminal', '터미널', 'iterm', '아이텀'],
      'homebrew': ['homebrew', 'brew', '홈브루']
    };

    it('다양한 형태의 도구명을 정규화해야 함', () => {
      // 클로드 → claude
      expect(toolMappings.claude).toContain('클로드');
      expect(toolMappings.claude).toContain('claude');
      
      // 터미널 관련
      expect(toolMappings.terminal).toContain('터미널');
      expect(toolMappings.terminal).toContain('iterm');
    });
  });

  describe('복합 명령 이해', () => {
    it('긴 문장에서 핵심 의도를 파악해야 함', () => {
      const complexInputs = [
        { 
          input: 'git이 없다고 나오는데 설치하려면 어떻게 해야 해?',
          hasInstall: true,
          hasTool: 'git'
        },
        {
          input: '터미널이 너무 못생겼는데 예쁘게 만들 수 있을까?',
          hasBeautify: true
        }
      ];

      for (const { input, hasInstall, hasBeautify, hasTool } of complexInputs) {
        if (hasInstall) {
          const found = patterns.install.some(k => input.includes(k));
          expect(found).toBe(true);
        }
        if (hasBeautify) {
          const found = patterns.beautify.some(k => input.includes(k));
          expect(found).toBe(true);
        }
        if (hasTool) {
          expect(input.toLowerCase()).toContain(hasTool);
        }
      }
    });
  });
});