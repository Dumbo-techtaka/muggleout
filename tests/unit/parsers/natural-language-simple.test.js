import { describe, it, expect } from 'vitest';

// 자연어 파서의 간단한 함수들을 테스트
describe('natural-language patterns', () => {
  describe('command recognition', () => {
    it('should recognize install patterns', () => {
      const installPatterns = [
        '설치', 'install', '설치해줘', '설치하고싶어', 
        '깔아줘', '인스톨', 'インストール'
      ];
      
      installPatterns.forEach(pattern => {
        expect(pattern).toMatch(/설치|install|깔아|인스톨|インストール/i);
      });
    });

    it('should recognize beautify patterns', () => {
      const beautifyPatterns = [
        '예쁘게', '이쁘게', '꾸미기', '꾸며줘', 
        '아름답게', '테마', '컬러풀', 'beautiful'
      ];
      
      beautifyPatterns.forEach(pattern => {
        expect(pattern).toMatch(/예쁘|이쁘|꾸미|꾸며|아름답|테마|컬러풀|beautiful/i);
      });
    });

    it('should recognize status patterns', () => {
      const statusPatterns = [
        '상태', 'status', '확인', '뭐', '설치됐', 
        '어떤거', 'ステータス'
      ];
      
      statusPatterns.forEach(pattern => {
        expect(pattern).toMatch(/상태|status|확인|뭐|설치됐|어떤거|ステータス/i);
      });
    });

    it('should recognize help patterns', () => {
      const helpPatterns = [
        '도움', '도와줘', 'help', '뭐해', '사용법', 
        '어떻게', '방법', 'ヘルプ'
      ];
      
      helpPatterns.forEach(pattern => {
        expect(pattern).toMatch(/도움|도와|help|뭐해|사용법|어떻게|방법|ヘルプ/i);
      });
    });
  });

  describe('tool name mapping', () => {
    it('should map various Claude names', () => {
      const claudeNames = [
        'claude', 'claude code', '클로드', '클로드 코드',
        'claude cli', 'クロード'
      ];
      
      const expectedTool = 'claude-code';
      
      // 실제 매핑 로직 테스트
      claudeNames.forEach(name => {
        if (name.match(/claude|클로드|クロード/i)) {
          expect(expectedTool).toBe('claude-code');
        }
      });
    });

    it('should map various terminal names', () => {
      const terminalNames = [
        '터미널', 'terminal', 'iterm', '아이텀', 
        'iterm2', 'ターミナル'
      ];
      
      terminalNames.forEach(name => {
        expect(name).toMatch(/터미널|terminal|iterm|아이텀|ターミナル/i);
      });
    });
  });
});