import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatToMonthDate, isOverdue } from './dates';

describe('isOverdue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for a date before today', () => {
    expect(isOverdue('2026-06-14')).toBe(true);
  });

  it('returns false for today', () => {
    expect(isOverdue('2026-06-15')).toBe(false);
  });

  it('returns false for a date after today', () => {
    expect(isOverdue('2026-06-16')).toBe(false);
  });
});

describe('formatToMonthDate', () => {
  it('formats a date as abbreviated-month and day', () => {
    expect(formatToMonthDate('2024-04-13')).toBe('Apr 13');
  });

  it('does not zero-pad the day', () => {
    expect(formatToMonthDate('2026-01-01')).toBe('Jan 1');
  });

  it('handles a December date correctly', () => {
    expect(formatToMonthDate('2024-12-25')).toBe('Dec 25');
  });
});
