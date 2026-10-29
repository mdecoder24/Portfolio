'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useScene } from '@/stores/scene';
import { prefersReducedMotion, useUi } from '@/stores/ui';

const Backdrop = dynamic(() => import('@/scene/Backdrop'), { ssr: false });

/**
 * The fixed dust canvas behind the whole page. It follows the tier the hero's SceneMount chooses, so it never loads
 * before the GPU check, and goes away whenever 3D is off; under reduced motion it renders one still frame.
 */
export function BackdropMount() {
  const tier = useScene((s) => s.tier);
  const motionPref = useUi((s) => s.motionPref);
  const [still, setStill] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setStill(prefersReducedMotion()));
    return () => cancelAnimationFrame(id);
  }, [motionPref]);

  if (tier === 0 || still === null) return null;
  return (
    <div
      aria-hidden="true"
      data-ready={ready || undefined}
      className="pointer-events-none fixed inset-0 z-canvas opacity-0 transition-opacity duration-1000 ease-out-quint data-ready:opacity-100"
    >
      <Backdrop key={`${tier}-${still}`} tier={tier} still={still} onReady={() => setReady(true)} />
    </div>
  );
}
