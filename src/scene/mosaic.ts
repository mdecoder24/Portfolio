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

/** Ease-out quint, the curve the mosaic assembles on. */
export function easeOut(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - x, 5);
}
