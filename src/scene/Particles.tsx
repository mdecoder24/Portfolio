'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial, Vector2, Vector3 } from 'three';
import { useScroll } from '@/stores/scroll';
import type { SceneColors } from './colors';
import { buildFormations, FORMATION_OPACITY, PEARL_PLACEMENT, SEED } from './formations';
import { rig } from './rig';
import { particlesFrag, particlesVert } from './shaders';
import { formationWeights } from './weights';

const target = new Float32Array(5); // reused every frame
const OPEN_FIELD = 3; // the scatter the particles condense from during the opening

export function Particles({ count, colors, still }: { count: number; colors: SceneColors; still: boolean }) {
  const size = useThree((s) => s.size);
  const geometry = useMemo(() => {
    const f = buildFormations(count, SEED);
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(f.orbit, 3));
    g.setAttribute('aLayers', new BufferAttribute(f.layers, 3));
    g.setAttribute('aClusters', new BufferAttribute(f.clusters, 3));
    g.setAttribute('aField', new BufferAttribute(f.field, 3));
    g.setAttribute('aWave', new BufferAttribute(f.wave, 3));
    g.setAttribute('aSeed', new BufferAttribute(f.seed, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: particlesVert,
        fragmentShader: particlesFrag,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uW: { value: [1, 0, 0, 0, 0] },
          uTime: { value: 0 },
          uSize: { value: 1 },
          uPixelRatio: { value: 1 },
          uPointer: { value: new Vector2(10, 10) },
          uPointerStrength: { value: 0 },
          uOrbitCentre: { value: new Vector3() },
          uOrbitScale: { value: 1 },
          uXScale: { value: 1 },
          uColor: { value: colors.particle },
          uGlow: { value: colors.glow },
          uOpacity: { value: 1 },
          uGlowBoost: { value: 0 },
        },
      }),
    [colors],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // Layout uniforms change only with the viewport, not per frame
  useEffect(() => {
    const u = material.uniforms;
    const aspect = size.width / size.height;
    const phone = aspect < 0.8;
    const p = phone ? PEARL_PLACEMENT.phone : PEARL_PLACEMENT.desktop;
    u.uOrbitCentre.value.set(p.x, p.y, 0);
    u.uOrbitScale.value = p.scale;
    u.uXScale.value = Math.min(1, aspect / 1.6);
  }, [material, size]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.uPixelRatio.value = state.viewport.dpr;
    formationWeights(useScroll.getState(), target);

    // During the opening the orbit condenses out of a wide scatter
    if (rig.open < 1) {
      const t = Math.min(1, rig.open * (1200 / 1400));
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      for (let i = 0; i < 5; i++) target[i] *= e;
      target[OPEN_FIELD] += 1 - e;
    }

    const w = u.uW.value as number[];
    let opacity = 0;
    for (let i = 0; i < 5; i++) {
      w[i] = still || rig.open < 1 ? target[i] : w[i] + (target[i] - w[i]) * (1 - Math.exp(-delta / 0.25));
      rig.weights[i] = w[i];
      opacity += w[i] * FORMATION_OPACITY[i];
    }
    u.uOpacity.value = opacity;
    if (still) return;

    u.uTime.value += delta;
    u.uPointer.value.lerp(state.pointer, 1 - Math.pow(1 - 0.08, delta * 60));
    u.uPointerStrength.value = rig.pointer;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
