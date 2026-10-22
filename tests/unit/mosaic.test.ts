import { describe, expect, it } from 'vitest';
import { easeOut, maskToCells, scatter, starfield } from '@/scene/mosaic';

describe('mosaic', () => {
  it('turns solid mask pixels into centred cells on the step grid', () => {
    const w = 8;
    const h = 4;
    const alpha = new Uint8ClampedArray(w * h).fill(255);
    const cells = maskToCells(alpha, w, h, 2, 1);
    expect(cells.count).toBe(8);
    expect(cells.cell).toBeCloseTo(0.25);
    expect(cells.positions[0]).toBeCloseTo(-0.5);
    expect(cells.positions[1]).toBeCloseTo(0.25);
  });

  it('skips transparent pixels', () => {
    expect(maskToCells(new Uint8ClampedArray(16), 4, 4, 1, 1).count).toBe(0);
  });

  it('scatters and seeds stars deterministically', () => {
    expect(scatter(50)).toEqual(scatter(50));
    expect(starfield(50)).toEqual(starfield(50));
    expect(starfield(10)).toHaveLength(30);
  });

  it('eases out from 0 to 1', () => {
    expect(easeOut(0)).toBe(0);
    expect(easeOut(1)).toBe(1);
    expect(easeOut(0.5)).toBeGreaterThan(0.9);
  });
});
