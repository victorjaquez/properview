import { formatTimeAgo, formatDate, formatDateTime } from '../lib/dateUtils';

describe('dateUtils', () => {
  beforeEach(() => {
    // Mock the current date to ensure consistent test results
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('formatTimeAgo', () => {
    it('should return "Just now" for times less than 1 minute ago', () => {
      const date = new Date('2024-01-15T11:59:30Z'); // 30 seconds ago
      expect(formatTimeAgo(date)).toBe('Just now');
    });

    it('should return "Just now" for exactly 1 minute ago', () => {
      const date = new Date('2024-01-15T11:59:00Z'); // 1 minute ago
      expect(formatTimeAgo(date)).toBe('Just now');
    });

    it('should return minutes for times between 2-59 minutes ago', () => {
      const date2min = new Date('2024-01-15T11:58:00Z'); // 2 minutes ago
      const date30min = new Date('2024-01-15T11:30:00Z'); // 30 minutes ago
      const date59min = new Date('2024-01-15T11:01:00Z'); // 59 minutes ago

      expect(formatTimeAgo(date2min)).toBe('2 minutes ago');
      expect(formatTimeAgo(date30min)).toBe('30 minutes ago');
      expect(formatTimeAgo(date59min)).toBe('59 minutes ago');
    });

    it('should return "1 hour ago" for exactly 1 hour ago', () => {
      const date = new Date('2024-01-15T11:00:00Z'); // 1 hour ago
      expect(formatTimeAgo(date)).toBe('1 hour ago');
    });

    it('should return hours for times between 2-23 hours ago', () => {
      const date2h = new Date('2024-01-15T10:00:00Z'); // 2 hours ago
      const date12h = new Date('2024-01-15T00:00:00Z'); // 12 hours ago
      const date23h = new Date('2024-01-14T13:00:00Z'); // 23 hours ago

      expect(formatTimeAgo(date2h)).toBe('2 hours ago');
      expect(formatTimeAgo(date12h)).toBe('12 hours ago');
      expect(formatTimeAgo(date23h)).toBe('23 hours ago');
    });

    it('should return "1 day ago" for exactly 1 day ago', () => {
      const date = new Date('2024-01-14T12:00:00Z'); // 1 day ago
      expect(formatTimeAgo(date)).toBe('1 day ago');
    });

    it('should return days for times between 2-6 days ago', () => {
      const date2d = new Date('2024-01-13T12:00:00Z'); // 2 days ago
      const date6d = new Date('2024-01-09T12:00:00Z'); // 6 days ago

      expect(formatTimeAgo(date2d)).toBe('2 days ago');
      expect(formatTimeAgo(date6d)).toBe('6 days ago');
    });

    it('should return formatted date for times 7+ days ago', () => {
      const date7d = new Date('2024-01-08T12:00:00Z'); // 7 days ago
      const dateOld = new Date('2023-12-01T12:00:00Z'); // Much older

      expect(formatTimeAgo(date7d)).toBe('1/8/2024');
      expect(formatTimeAgo(dateOld)).toBe('12/1/2023');
    });

    it('should handle future dates', () => {
      const futureDate = new Date('2024-01-16T12:00:00Z'); // 1 day in future
      expect(formatTimeAgo(futureDate)).toBe('Just now');
    });
  });

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(date)).toBe('Jan 15, 2024');
    });

    it('should format string date correctly', () => {
      expect(formatDate('2024-01-15T12:00:00Z')).toBe('Jan 15, 2024');
      // Date-only strings get converted to local timezone too
      expect(formatDate('2024-12-25')).toBe('Dec 24, 2024');
    });

    it('should handle different months', () => {
      expect(formatDate('2024-02-29T12:00:00Z')).toBe('Feb 29, 2024'); // Leap year
      expect(formatDate('2024-07-04T12:00:00Z')).toBe('Jul 4, 2024');
      expect(formatDate('2024-11-30T12:00:00Z')).toBe('Nov 30, 2024');
    });

    it('should handle single digit days', () => {
      expect(formatDate('2024-01-01T12:00:00Z')).toBe('Jan 1, 2024');
      expect(formatDate('2024-01-09T12:00:00Z')).toBe('Jan 9, 2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format Date object with time', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDateTime(date);
      expect(result).toMatch(/Jan 15, 2024/);
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });

    it('should format string date with time', () => {
      const result = formatDateTime('2024-01-15T09:15:00Z');
      expect(result).toMatch(/Jan 15, 2024/);
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });

    it('should handle midnight UTC (converts to local time)', () => {
      const result = formatDateTime('2024-01-15T00:00:00Z');
      // UTC midnight converts to local time (GMT-7 = 5:00 PM previous day)
      expect(result).toMatch(/Jan 14, 2024/);
      expect(result).toMatch(/5:00 PM/);
    });

    it('should handle noon UTC (converts to local time)', () => {
      const result = formatDateTime('2024-01-15T12:00:00Z');
      // UTC noon converts to local time (GMT-7 = 5:00 AM same day)
      expect(result).toMatch(/Jan 15, 2024/);
      expect(result).toMatch(/5:00 AM/);
    });

    it('should format minutes correctly', () => {
      const result1 = formatDateTime('2024-01-15T15:05:00Z');
      const result2 = formatDateTime('2024-01-15T15:30:00Z');

      expect(result1).toMatch(/Jan 15, 2024/);
      expect(result2).toMatch(/Jan 15, 2024/);
      expect(result1).toMatch(/:05/);
      expect(result2).toMatch(/:30/);
    });
  });
});
