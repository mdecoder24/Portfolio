import { describe, expect, it } from 'vitest';
import { buildFormations, projectToNdc } from '@/scene/formations';

describe('buildFormations', () => {
  it('is deterministic for a seed, so the poster and the first frame agree', () => {
    const a = buildFormations(500);
    const b = buildFormations(500);
    expect(a.orbit).toEqual(b.orbit);
    expect(a.wave).toEqual(b.wave);
  });

  it('keeps a stable prefix across tiers', () => {
    const low = buildFormations(100);
    const high = buildFormations(1000);
    expect(Array.from(high.orbit.slice(0, 300))).toEqual(Array.from(low.orbit));
  });

  it('builds every buffer with three floats per particle', () => {
    const f = buildFormations(64);
    for (const key of ['orbit', 'layers', 'clusters', 'field', 'wave'] as const) expect(f[key]).toHaveLength(192);
    expect(f.seed).toHaveLength(64);
  });

  it('puts the Wave sheet at y -1.6 and the Field inside its 14 × 8 × 6 box', () => {
    const f = buildFormations(200);
    for (let i = 0; i < 200; i++) {
      expect(f.wave[i * 3 + 1]).toBeCloseTo(-1.6);
      expect(Math.abs(f.field[i * 3])).toBeLessThanOrEqual(7);
      expect(Math.abs(f.field[i * 3 + 1])).toBeLessThanOrEqual(4);
    }
  });
});

describe('projectToNdc', () => {
  it('maps the origin to the centre of the screen', () => {
    const [x, y] = projectToNdc(0, 0, 0, 1.6);
    expect(x).toBe(0);
    expect(y).toBe(0);
  });
});
