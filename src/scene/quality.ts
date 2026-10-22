import type { Tier } from '@/stores/scene';

export type Quality = { tier: Exclude<Tier, 0>; dprCap: number; stars: number; step: number };

// step: mask pixels per mosaic cell (smaller is denser)
export const QUALITY: Record<Exclude<Tier, 0>, Quality> = {
  3: { tier: 3, dprCap: 2, stars: 5000, step: 5 },
  2: { tier: 2, dprCap: 1.5, stars: 3000, step: 6 },
  1: { tier: 1, dprCap: 1, stars: 1500, step: 8 },
};
