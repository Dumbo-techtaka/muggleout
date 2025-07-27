import { describe, it, expect, beforeEach } from 'vitest';
import i18n from '../../../src/i18n/index.js';

describe('i18n', () => {
  beforeEach(() => {
    // 기본 언어로 리셋
    i18n.changeLanguage('ko');
  });

  describe('language support', () => {
    it('should have Korean translations', () => {
      expect(i18n.language).toBe('ko');
      expect(i18n.t('welcome')).toBe('Dev Setup CLI에 오신 것을 환영합니다');
    });

    it('should support English', () => {
      i18n.changeLanguage('en');
      expect(i18n.language).toBe('en');
      expect(i18n.t('welcome')).toBe('Welcome to Dev Setup CLI');
    });

    it('should support Japanese', () => {
      i18n.changeLanguage('ja');
      expect(i18n.language).toBe('ja');
      expect(i18n.t('welcome')).toBe('Dev Setup CLIへようこそ');
    });
  });

  describe('fallback behavior', () => {
    it('should fallback to key if translation missing', () => {
      const nonExistentKey = 'non.existent.key';
      expect(i18n.t(nonExistentKey)).toBe(nonExistentKey);
    });

    it('should use Korean as default language', () => {
      // 새로운 i18n 인스턴스의 기본 언어 확인
      expect(i18n.language).toBe('ko');
    });
  });

  describe('translation keys', () => {
    const requiredKeys = [
      'welcome',
      'menu.install',
      'menu.customize',
      'status.installed',
      'status.notInstalled',
      'install.success'
    ];

    it('should have all required keys in Korean', () => {
      requiredKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).not.toBe(key);
        expect(translation).toBeTruthy();
      });
    });

    it('should have all required keys in English', () => {
      i18n.changeLanguage('en');
      requiredKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).not.toBe(key);
        expect(translation).toBeTruthy();
      });
    });
  });
});