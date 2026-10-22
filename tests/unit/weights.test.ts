import { describe, expect, it } from 'vitest';
import { formationWeights } from '@/scene/weights';

const sections = {
  hero: { top: 0, height: 900 },
  about: { top: 900, height: 800 },
  experience: { top: 1700, height: 900 },
  freelance: { top: 2600, height: 3000 },
  projects: { top: 5600, height: 2000 },
  skills: { top: 7600, height: 600 },
  education: { top: 8200, height: 700 },
  contact: { top: 8900, height: 900 },
};
const out = new Float32Array(5);
const sum = () => out.reduce((a, b) => a + b, 0);

describe('formationWeights', () => {
  it('shows the Orbit at the top of the page', () => {
    formationWeights({ y: 0, viewportH: 900, sections }, out);
    expect(Array.from(out)).toEqual([1, 0, 0, 0, 0]);
  });

  it('blends from the previous formation over the first 35% of a section', () => {
    // Reading line at about.top + 10% of its height: part way through the blend
    formationWeights({ y: 900 + 80 - 450, viewportH: 900, sections }, out);
    expect(out[0]).toBeGreaterThan(0);
    expect(out[1]).toBeGreaterThan(0);
    expect(sum()).toBeCloseTo(1);
  });

  it('settles fully on the section formation after 35%', () => {
    formationWeights({ y: 2600 + 1500 - 450, viewportH: 900, sections }, out);
    expect(out[2]).toBe(1);
  });

  it('keeps one formation across sections that share it', () => {
    formationWeights({ y: 1700 + 50 - 450, viewportH: 900, sections }, out);
    expect(out[1]).toBeCloseTo(1);
  });

  it('shows the Wave at Contact', () => {
    formationWeights({ y: 8900 + 600 - 450, viewportH: 900, sections }, out);
    expect(out[4]).toBe(1);
  });
});
