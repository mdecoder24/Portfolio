import { describe, expect, it } from 'vitest';
import { BREATH, breath, diffusionTarget, dust, easeOut, imageToCells, maskToCells, scatter, starfield } from '@/scene/mosaic';

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
    expect(imageToCells(new Uint8ClampedArray(16), 2, 2).count).toBe(0);
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

  it('builds backdrop dust orbits in range and the same every time', () => {
    const a = dust(500);
    expect(a.orbits).toHaveLength(1500);
    expect(a.seeds).toHaveLength(500);
    for (let i = 0; i < 500; i++) {
      expect(a.orbits[i * 3]).toBeGreaterThanOrEqual(0);
      expect(a.orbits[i * 3]).toBeLessThanOrEqual(1);
      expect(a.orbits[i * 3 + 1]).toBeLessThan(Math.PI * 2);
      expect(Math.abs(a.orbits[i * 3 + 2])).toBeLessThanOrEqual(1);
    }
    expect(dust(500).orbits).toEqual(a.orbits);
  });

  it('diffuses the portrait as it scrolls away and reassembles it on the way back', () => {
    // Desktop: the frame starts in view, so it diffuses from the first pixel of scroll
    expect(diffusionTarget(0, 900, 420, 500)).toBe(0);
    expect(diffusionTarget(200, 900, 420, 500)).toBeCloseTo(0.5);
    expect(diffusionTarget(400, 900, 420, 500)).toBe(1);
    expect(diffusionTarget(5000, 900, 420, 500)).toBe(1);
    expect(diffusionTarget(-40, 900, 420, 500)).toBe(0);
    // Phone: the frame sits below the fold and stays whole until its centre passes the middle of the screen
    expect(diffusionTarget(300, 780, 690, 380)).toBe(0);
    expect(diffusionTarget(452, 780, 690, 380)).toBeCloseTo(0.5);
    expect(diffusionTarget(300, 780, 690, 0)).toBe(0);
  });

  it('breathes the idle portrait out to dust and back on a loop', () => {
    const { hold, out, dust: drift, back } = BREATH;
    expect(breath(0)).toBe(0);
    expect(breath(hold - 0.1)).toBe(0);
    expect(breath(hold + out / 2)).toBeCloseTo(0.5);
    expect(breath(hold + out + drift / 2)).toBe(1);
    expect(breath(hold + out + drift + back / 2)).toBeCloseTo(0.5);
    expect(breath(hold + out + drift + back)).toBe(0);
    expect(breath(hold + out + drift + back + hold + out / 2)).toBeCloseTo(0.5);
  });
});
