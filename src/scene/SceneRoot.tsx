'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useScene } from '@/stores/scene';
import { sceneColors } from './colors';
import { CAMERA_Z, FOV, HeroField } from './HeroField';
import { QUALITY } from './quality';

export default function SceneRoot({ tier, still }: { tier: 1 | 2 | 3; still: boolean }) {
  const quality = QUALITY[tier];
  const setTier = useScene((s) => s.setTier);
  const [colors, setColors] = useState(sceneColors);
  const [inView, setInView] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  // SceneMount already held this back for most of the intro; this covers the last of the sheet's lift
  const [delay] = useState(() => (document.querySelector('[data-stage]') ? 0.5 : 0.2));

  useEffect(() => {
    const mo = new MutationObserver(() => setColors(sceneColors()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting && !document.hidden));
    if (host.current) io.observe(host.current);
    const onVisibility = () => setInView(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      mo.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      delete document.documentElement.dataset.scene;
    };
  }, []);

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        aria-hidden="true"
        eventSource={typeof document !== 'undefined' ? (document.getElementById('hero') ?? undefined) : undefined}
        eventPrefix="client"
        dpr={[1, quality.dprCap]}
        frameloop={!inView ? 'never' : still ? 'demand' : 'always'}
        camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', () => setTier(0, 'context-lost'), { once: true });
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              document.documentElement.dataset.scene = 'ready';
              useScene.setState({ ready: true });
            }),
          );
        }}
      >
        {!still && (
          <PerformanceMonitor
            onDecline={() => {
              const current = useScene.getState().tier;
              if (current > 1) setTier((current - 1) as 1 | 2, 'fps');
            }}
          />
        )}
        <HeroField colors={colors} stars={quality.stars} step={quality.step} still={still} delay={delay} />
      </Canvas>
    </div>
  );
}
