'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useScene, type Tier } from '@/stores/scene';
import { prefersReducedMotion, useUi } from '@/stores/ui';

// The only way into src/scene's three.js code: loaded after hydration and idle, never in the first-load bundle.
// Renders inside a positioned box (the hero figure); the poster beneath it stays until the canvas is ready.
const SceneRoot = dynamic(() => import('@/scene/SceneRoot'), { ssr: false });

// Silence three 0.186's THREE.Clock deprecation warning triggered internally by @react-three/fiber 9.8
if (typeof window !== 'undefined') {
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock:')) return;
    origWarn.apply(console, args);
  };
}

const TIER_QUERY: Record<string, Tier> = { high: 3, medium: 2, low: 1, off: 0 };

function hasWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

async function chooseTier(qualityPref: 'auto' | 'low' | 'off'): Promise<{ tier: Tier; reason: Parameters<ReturnType<typeof useScene.getState>['setTier']>[1] }> {
  // The visitor's Off toggle always wins, even over the ?tier= testing override
  if (qualityPref === 'off') return { tier: 0, reason: 'user' };
  const forced = new URLSearchParams(location.search).get('tier');
  if (forced && forced in TIER_QUERY) return { tier: TIER_QUERY[forced], reason: 'query' };
  if (!hasWebGL2()) return { tier: 0, reason: 'no-webgl2' };
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return { tier: 0, reason: 'save-data' };
  if (qualityPref === 'low') return { tier: 1, reason: 'user' };
  try {
    const { getGPUTier } = await import('detect-gpu');
    const gpu = await getGPUTier({ benchmarksURL: '/gpu-benchmarks' });
    const tier = Math.max(1, Math.min(gpu.isMobile ? 2 : 3, gpu.tier)) as Tier;
    return { tier, reason: 'gpu' };
  } catch {
    return { tier: 2, reason: 'gpu' };
  }
}

export function SceneMount() {
  const qualityPref = useUi((s) => s.qualityPref);
  const motionPref = useUi((s) => s.motionPref);
  const tier = useScene((s) => s.tier);
  const [decided, setDecided] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const choice = await chooseTier(qualityPref);
      if (cancelled) return;
      useScene.getState().setTier(choice.tier, choice.reason);
      setStill(prefersReducedMotion());
      setDecided(true);
    };
    // Wait for the page to settle: the headline paints and hydrates first
    const ric = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const id = ric(() => void run(), { timeout: 2000 });
    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? clearTimeout)(id);
    };
  }, [qualityPref, motionPref]);

  if (!decided || tier === 0) return null;
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-0 transition-opacity duration-1000 ease-out-quint in-data-[scene=ready]:opacity-100"
    >
      <SceneRoot key={`${tier}-${still}`} tier={tier as 1 | 2 | 3} still={still} />
    </div>
  );
}
