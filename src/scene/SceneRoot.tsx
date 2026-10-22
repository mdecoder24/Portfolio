'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { AgXToneMapping } from 'three';
import { useScene } from '@/stores/scene';
import { sceneColors } from './colors';
import { Effects } from './Effects';
import { Lighting } from './Lighting';
import { Particles } from './Particles';
import { Pearl } from './Pearl';
import { QUALITY } from './quality';
import { rig } from './rig';

const OPENED_KEY = 'kr-opened';

function Opening({ enabled }: { enabled: boolean }) {
  useFrame((_, delta) => {
    if (!enabled || rig.open >= 1) return;
    rig.open = Math.min(1, rig.open + delta / 1.2);
  });
  return null;
}

function CameraParallax({ enabled }: { enabled: boolean }) {
  useFrame((state, delta) => {
    if (!enabled) return;
    const k = 1 - Math.exp(-delta * 3);
    state.camera.position.x += (state.pointer.x * 0.15 - state.camera.position.x) * k;
    state.camera.position.y += (state.pointer.y * 0.15 - state.camera.position.y) * k;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Reduced motion renders on demand: redraw (without animating) when the section in view changes or light bakes. */
function StillFrames() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => invalidate());
    };
    const settle = setTimeout(() => invalidate(), 100); // after the environment map bakes
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      clearTimeout(settle);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [invalidate]);
  return null;
}

export default function SceneRoot({ tier, still }: { tier: 1 | 2 | 3; still: boolean }) {
  const quality = QUALITY[tier];
  const setTier = useScene((s) => s.setTier);
  const [colors] = useState(sceneColors);
  const [hidden, setHidden] = useState(false);
  const [opening] = useState(() => {
    let opened = false;
    try {
      opened = sessionStorage.getItem(OPENED_KEY) === '1';
      sessionStorage.setItem(OPENED_KEY, '1');
    } catch {
      // Storage unavailable: play the opening once per page load instead
    }
    // The opening plays only from the top of the page, where the headline's full stop is visible
    return !still && !opened && window.scrollY < window.innerHeight * 0.5;
  });

  useEffect(() => {
    rig.open = opening ? 0 : 1;
    rig.pointer = !still && matchMedia('(pointer: fine)').matches ? 1 : 0;
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      delete document.documentElement.dataset.scene;
    };
  }, [opening, still]);

  return (
    <Canvas
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      eventSource={document.body}
      eventPrefix="client"
      dpr={[1, quality.dprCap]}
      frameloop={hidden ? 'never' : still ? 'demand' : 'always'}
      camera={{ fov: 35, position: [0, 0, 8], near: 0.1, far: 50 }}
      gl={{ antialias: tier >= 2, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = AgXToneMapping;
        gl.toneMappingExposure = 1;
        gl.domElement.addEventListener('webglcontextlost', () => setTier(0, 'context-lost'), { once: true });
        // Two frames in, the first image is on screen: fade the canvas over the poster
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            document.documentElement.dataset.scene = 'ready';
            useScene.setState({ ready: true });
          }),
        );
      }}
    >
      <color attach="background" args={[colors.fog]} />
      <fog attach="fog" args={[colors.fog, 6, 16]} />
      {!still && (
        <PerformanceMonitor
          onDecline={() => {
            const current = useScene.getState().tier;
            if (current > 1) setTier((current - 1) as 1 | 2, 'fps');
          }}
        />
      )}
      <Lighting colors={colors} />
      <Pearl colors={colors} physical={quality.physical} segments={quality.segments} still={still} />
      <Particles count={quality.particles} colors={colors} still={still} />
      <Opening enabled={opening} />
      {still && <StillFrames />}
      <CameraParallax enabled={!still && tier >= 2 && rig.pointer === 1} />
      {!still && tier >= 2 && <Effects tier={tier as 2 | 3} />}
    </Canvas>
  );
}
