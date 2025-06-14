import { cn, formatPhoneNumber } from '../lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'active', false && 'inactive')).toBe(
        'base active'
      );
    });

    it('should handle empty values', () => {
      expect(cn('', 'class1', null, undefined, 'class2')).toBe('class1 class2');
    });

    it('should handle arrays', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });

    it('should handle objects', () => {
      expect(
        cn({
          class1: true,
          class2: false,
          class3: true,
        })
      ).toBe('class1 class3');
    });

    it('should merge Tailwind classes correctly (tailwind-merge functionality)', () => {
      // Testing that conflicting Tailwind classes are merged properly
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should handle complex combinations', () => {
      const result = cn(
        'base-class',
        ['array-class1', 'array-class2'],
        { 'conditional-class': true, 'hidden-class': false },
        null,
        undefined,
        'final-class'
      );
      expect(result).toBe(
        'base-class array-class1 array-class2 conditional-class final-class'
      );
    });

    it('should handle no arguments', () => {
      expect(cn()).toBe('');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format empty string', () => {
      expect(formatPhoneNumber('')).toBe('');
    });

    it('should format 1-3 digits', () => {
      expect(formatPhoneNumber('1')).toBe('1');
      expect(formatPhoneNumber('12')).toBe('12');
      expect(formatPhoneNumber('123')).toBe('123');
    });

    it('should format 4-6 digits with first dash', () => {
      expect(formatPhoneNumber('1234')).toBe('123-4');
      expect(formatPhoneNumber('12345')).toBe('123-45');
      expect(formatPhoneNumber('123456')).toBe('123-456');
    });

    it('should format 7-10 digits with full formatting', () => {
      expect(formatPhoneNumber('1234567')).toBe('123-456-7');
      expect(formatPhoneNumber('12345678')).toBe('123-456-78');
      expect(formatPhoneNumber('123456789')).toBe('123-456-789');
      expect(formatPhoneNumber('1234567890')).toBe('123-456-7890');
    });

    it('should handle more than 10 digits by truncating', () => {
      expect(formatPhoneNumber('12345678901')).toBe('123-456-7890');
      expect(formatPhoneNumber('123456789012345')).toBe('123-456-7890');
    });

    it('should strip non-digit characters', () => {
      expect(formatPhoneNumber('(123) 456-7890')).toBe('123-456-7890');
      expect(formatPhoneNumber('+1-123-456-7890')).toBe('112-345-6789');
      expect(formatPhoneNumber('123.456.7890')).toBe('123-456-7890');
      expect(formatPhoneNumber('123 456 7890')).toBe('123-456-7890');
    });

    it('should handle mixed characters', () => {
      expect(formatPhoneNumber('abc123def456ghi7890jkl')).toBe('123-456-7890');
      expect(formatPhoneNumber('1a2b3c4d5e6f7g8h9i0j')).toBe('123-456-7890');
    });

    it('should handle special characters and symbols', () => {
      expect(
        formatPhoneNumber('!@#1$%^2&*()3_+4={}5[]6|\\:";\'<>?7,./8`~9€£¥₹0')
      ).toBe('123-456-7890');
    });

    it('should handle Unicode and non-ASCII characters', () => {
      expect(formatPhoneNumber('1💎2📱3🏠4🚗5🎉6⭐7🌟8💫9✨0')).toBe(
        '123-456-7890'
      );
    });
  });
});
