import { describe, expect, it } from 'vitest';
import { formatMonth, formatRange, formatRupees } from '@/lib/format';

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
});
