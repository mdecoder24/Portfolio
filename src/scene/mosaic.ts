// Pure maths for the hero mosaic and starfield: no three.js and no DOM, so it is unit-testable.

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Turns an alpha mask (row-major, width × height, 0–255) into mosaic cells: one point per `step` pixels where the
 * mask is solid, centred on the origin and scaled so the mask is `worldWidth` units wide.
 */
export function maskToCells(alpha: ArrayLike<number>, width: number, height: number, step: number, worldWidth: number) {
  const scale = worldWidth / width;
  const out: number[] = [];
  for (let y = 0; y < height; y += step)
    for (let x = 0; x < width; x += step)
      if (alpha[y * width + x] > 128) out.push((x - width / 2) * scale, (height / 2 - y) * scale, 0);
  return { positions: new Float32Array(out), count: out.length / 3, cell: step * scale };
}

/**
 * Turns an RGBA image already scaled to `cols × rows` (one pixel per cell) into mosaic cells: each opaque pixel becomes
 * a cell, centred on the origin, one unit wide. `tones` holds each cell's luminance in linear light (0–1), since the
 * shader's colour-space step expects linear values. Transparent background pixels (alpha <= 128) are skipped.
 */
export function imageToCells(rgba: ArrayLike<number>, cols: number, rows: number) {
  const pos: number[] = [];
  const toneList: number[] = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if ((rgba[i * 4 + 3] ?? 255) <= 128) continue;
      pos.push((x + 0.5) / cols - 0.5, ((rows / 2 - y - 0.5) / rows) * (rows / cols), 0);
      const luma = (0.2126 * rgba[i * 4] + 0.7152 * rgba[i * 4 + 1] + 0.0722 * rgba[i * 4 + 2]) / 255;
      toneList.push(Math.pow(luma, 2.2));
    }
  return {
    positions: new Float32Array(pos),
    tones: new Float32Array(toneList),
    count: toneList.length,
    cell: 1 / cols,
  };
}

/** Where each mosaic cell starts before it assembles: scattered on a shell (in monogram widths), seeded. */
export function scatter(count: number, seed = 7): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 0.9 + rand() * 1.3;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    out[i * 3] = r * Math.sin(ph) * Math.cos(th);
    out[i * 3 + 1] = r * Math.cos(ph) * 0.6;
    out[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) * 0.5;
  }
  return out;
}

/** A box of stars in front of and behind the mosaic. */
export function starfield(count: number, seed = 11): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rand() - 0.5) * 34;
    out[i * 3 + 1] = (rand() - 0.5) * 20;
    out[i * 3 + 2] = (rand() - 0.5) * 16 - 2;
  }
  return out;
}

/**
 * The page backdrop's dust, as orbits rather than positions: per particle a radius (0–1, square-root spread so the
 * disc fills evenly), a start angle, a height (-1–1) and a seed. The shader scales and spins them, so the buffer is
 * built once and never rebuilt on resize.
 */
export function dust(count: number, seed = 23): { orbits: Float32Array; seeds: Float32Array } {
  const rand = mulberry32(seed);
  const orbits = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    orbits[i * 3] = Math.sqrt(rand());
    orbits[i * 3 + 1] = rand() * Math.PI * 2;
    orbits[i * 3 + 2] = rand() * 2 - 1;
    seeds[i] = rand();
  }
  return { orbits, seeds };
}

/**
 * How far the hero portrait has diffused for a scroll position (page pixels): whole until its centre rises past the
 * middle of the viewport, or from the top of the page when it starts above that, then fully dust once it has moved
 * up another 80% of its height, before it leaves the screen. Scrolling back reverses it. On phones the portrait
 * sits below the fold, so it stays whole while the visitor scrolls down to it.
 */
export function diffusionTarget(scrollY: number, viewportH: number, frameCentre: number, frameHeight: number): number {
  if (frameHeight <= 0) return 0;
  const start = Math.max(0, frameCentre - viewportH / 2);
  return Math.min(1, Math.max(0, (scrollY - start) / (frameHeight * 0.8)));
}

/**
 * The portrait's idle breath while it sits on screen, in seconds since it first assembled: whole for 5 s, dissolving
 * into dust over 1.6 s, drifting as dust for 0.8 s, then reassembling over 1.8 s, and round again. 0 is whole, 1 dust.
 */
export const BREATH = { hold: 5, out: 1.6, dust: 0.8, back: 1.8 } as const;
export function breath(t: number): number {
  const period = BREATH.hold + BREATH.out + BREATH.dust + BREATH.back;
  let c = (((t % period) + period) % period) - BREATH.hold;
  if (c < 0) return 0;
  if (c < BREATH.out) return c / BREATH.out;
  c -= BREATH.out;
  if (c < BREATH.dust) return 1;
  return 1 - (c - BREATH.dust) / BREATH.back;
}

/** Ease-out quint, the curve the mosaic assembles on. */
export function easeOut(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - x, 5);
}
