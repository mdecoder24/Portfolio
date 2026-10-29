import { describe, expect, it } from 'vitest';
import { formatMonth, formatRange, formatCount, formatRupees, splitCount } from '@/lib/format';

describe('format', () => {
  it('formats months and ranges in the Nacre style', () => {
    expect(formatMonth('2026-07')).toBe('Jul 2026');
    expect(formatRange('2026-07')).toBe('Jul 2026 – present');
    expect(formatRange('2026-01', '2026-06')).toBe('Jan – Jun 2026');
    expect(formatRange('2025-11', '2026-02')).toBe('Nov 2025 – Feb 2026');
    expect(formatRange('2026-02', '2026-02')).toBe('Feb 2026');
  });

  it('groups rupees the Indian way', () => {
    expect(formatRupees(150000)).toBe('₹1,50,000');
    expect(formatRupees(40000)).toBe('₹40,000');
  });

  it('finds the count in a fact and skips years', () => {
    expect(splitCount('14+ projects shipped')).toEqual({
      before: '',
      value: 14,
      decimals: 0,
      grouped: false,
      after: '+ projects shipped',
    });
    expect(splitCount('Served ₹1,50,000 in 2025')).toEqual({
      before: 'Served ₹',
      value: 150000,
      decimals: 0,
      grouped: true,
      after: ' in 2025',
    });
    expect(splitCount('B.Tech CSE - AIML, 2026')).toBeNull();
    expect(splitCount('Hyderabad, India')).toBeNull();
    expect(splitCount('Time on page up 2.3×')).toMatchObject({ value: 2.3, decimals: 1, after: '×' });
  });

  it('writes a count in the fact\'s own format', () => {
    expect(formatCount(1.25, { decimals: 1, grouped: false })).toBe('1.3');
    expect(formatCount(150000, { decimals: 0, grouped: true })).toBe('1,50,000');
    expect(formatCount(7, { decimals: 0, grouped: false })).toBe('7');
  });
});
