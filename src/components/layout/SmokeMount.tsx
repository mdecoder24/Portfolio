'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { prefersReducedMotion, useUi } from '@/stores/ui';

const Smoke = dynamic(() => import('@/scene/Smoke'), { ssr: false });

/** Mounts the contact smoke only when motion and 3D are allowed; otherwise the section's static ground shows. */
export function SmokeMount() {
  const qualityPref = useUi((s) => s.qualityPref);
  const motionPref = useUi((s) => s.motionPref);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setOk(qualityPref !== 'off' && !prefersReducedMotion() && !!document.createElement('canvas').getContext('webgl2')),
    );
    return () => cancelAnimationFrame(id);
  }, [qualityPref, motionPref]);

  return ok ? <Smoke /> : null;
}
