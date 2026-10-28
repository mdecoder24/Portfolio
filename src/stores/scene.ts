import { create } from 'zustand';

export type Tier = 0 | 1 | 2 | 3; // off, low, medium, high
export type TierReason = 'gpu' | 'fps' | 'user' | 'reduced-motion' | 'no-webgl2' | 'save-data' | 'context-lost' | 'query';

type SceneState = {
  tier: Tier;
  reason: TierReason;
  ready: boolean;
  setTier: (tier: Tier, reason: TierReason) => void;
};

export const useScene = create<SceneState>((set) => ({
  tier: 0,
  reason: 'gpu',
  ready: false,
  setTier: (tier, reason) => set({ tier, reason }),
}));
