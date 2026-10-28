import { describe, expect, it } from 'vitest';
import { easeOut, imageToCells, maskToCells, scatter, starfield } from '@/scene/mosaic';

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

  it('turns every image pixel into a centred cell with its linear luminance', () => {
    // 2 × 3 image: white, black / black, white / grey, grey
    const px = [255, 0, 0, 255, 128, 128].flatMap((v) => [v, v, v, 255]);
    const cells = imageToCells(px, 2, 3);
    expect(cells.count).toBe(6);
    expect(cells.cell).toBeCloseTo(0.5);
    // Top-left cell: a quarter in from the left, and the image is 1.5 units tall, so it sits half a unit up
    expect(cells.positions[0]).toBeCloseTo(-0.25);
    expect(cells.positions[1]).toBeCloseTo(0.5);
    expect(cells.positions[16]).toBeCloseTo(-0.5);
    expect(cells.tones[0]).toBeCloseTo(1);
    expect(cells.tones[1]).toBeCloseTo(0);
    expect(cells.tones[4]).toBeCloseTo(Math.pow(128 / 255, 2.2));
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
