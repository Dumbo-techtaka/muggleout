import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  showTerminalPreview, 
  showOhMyZshPreview, 
  showP10kPreview,
  showToolPreview 
} from '../../../src/utils/preview.js';

describe('preview.js', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('showTerminalPreview', () => {
    it('should display terminal preview with before and after', () => {
      showTerminalPreview();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('설치하면 터미널이 이렇게 바뀝니다')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Before')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('After')
      );
    });
  });

  describe('showOhMyZshPreview', () => {
    it('should display Oh My Zsh features', () => {
      showOhMyZshPreview();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Oh My Zsh')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('명령어 자동완성')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('플러그인')
      );
    });
  });

  describe('showP10kPreview', () => {
    it('should display Powerlevel10k theme styles', () => {
      showP10kPreview();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Powerlevel10k')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Lean')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Classic')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Rainbow')
      );
    });
  });

  describe('showToolPreview', () => {
    it('should show terminal preview for terminal-beautify', () => {
      showToolPreview('terminal-beautify');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('설치하면 터미널이 이렇게 바뀝니다')
      );
    });

    it('should show Oh My Zsh preview for oh-my-zsh', () => {
      showToolPreview('oh-my-zsh');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Oh My Zsh')
      );
    });

    it('should show P10k preview for p10k', () => {
      showToolPreview('p10k');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Powerlevel10k')
      );
    });

    it('should do nothing for unknown tool', () => {
      showToolPreview('unknown-tool');
      
      // consoleSpy가 호출되지 않아야 함
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});