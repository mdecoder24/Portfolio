import type { Tier } from '@/stores/scene';

export type Quality = {
  tier: Exclude<Tier, 0>;
  particles: number;
  segments: number;
  dprCap: number;
  physical: boolean;
  effects: 'full' | 'grain' | 'none';
};

// Nacre "Quality tiers" and "The pearl"
export const QUALITY: Record<Exclude<Tier, 0>, Quality> = {
  3: { tier: 3, particles: 40_000, segments: 128, dprCap: 2, physical: true, effects: 'full' },
  2: { tier: 2, particles: 15_000, segments: 64, dprCap: 1.5, physical: true, effects: 'grain' },
  1: { tier: 1, particles: 5_000, segments: 48, dprCap: 1, physical: false, effects: 'none' },
};

export const TIER_QUERY: Record<string, Tier> = { high: 3, medium: 2, low: 1, off: 0 };
