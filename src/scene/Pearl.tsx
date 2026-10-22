'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { type Mesh, Vector3 } from 'three';
import type { SceneColors } from './colors';
import { LAYERS_CENTRE_X, PEARL_PLACEMENT } from './formations';
import { HALF_H, rig } from './rig';

const target = new Vector3();
const start = new Vector3();
const place = new Vector3();
const SPIN = (Math.PI * 2) / 40; // one turn every 40 s

/** Where the pearl rests for each formation, blended by the formation weights. */
function restingPlace(aspect: number, out: Vector3): number {
  const halfW = HALF_H * aspect;
  const phone = aspect < 0.8;
  const hero = phone ? PEARL_PLACEMENT.phone : PEARL_PLACEMENT.desktop;
  const xs = Math.min(1, aspect / 1.6);
  const spots: [number, number, number][] = [
    [hero.x, hero.y, hero.scale],
    [LAYERS_CENTRE_X * xs, -0.2, 0.45 * (phone ? 0.75 : 1)], // at the heart of the nacre layers
    [halfW - 0.45, HALF_H * 0.62, 0.18], // small, at the top-right edge, clear of the service rows
    [halfW - 0.3, -HALF_H + 0.3, 0.09], // docked in the bottom-right corner, where the launcher will live (P1)
    [halfW - 0.3, -HALF_H + 0.3, 0.09],
  ];
  out.set(0, 0, 0);
  let scale = 0;
  for (let i = 0; i < 5; i++) {
    const w = rig.weights[i];
    out.x += spots[i][0] * w;
    out.y += spots[i][1] * w;
    scale += spots[i][2] * w;
  }
  return scale;
}

/** The headline's full stop, unprojected onto the z = 0 plane: where the opening starts. */
function anchorStart(size: { width: number; height: number }, out: Vector3): number {
  const dot = document.getElementById('hero-dot')?.getBoundingClientRect();
  if (!dot || dot.width === 0) return -1;
  const halfW = HALF_H * (size.width / size.height);
  const nx = ((dot.left + dot.width / 2) / size.width) * 2 - 1;
  const ny = 1 - ((dot.top + dot.height / 2) / size.height) * 2;
  out.set(nx * halfW, ny * HALF_H, 0);
  return (dot.width / 2) * ((2 * HALF_H) / size.height);
}

export function Pearl({ colors, physical, segments, still }: { colors: SceneColors; physical: boolean; segments: number; still: boolean }) {
  const mesh = useRef<Mesh>(null);
  const size = useThree((s) => s.size);
  const startScale = useRef<number | null>(null);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const scale = restingPlace(size.width / size.height, target);

    if (rig.open < 1 && !still) {
      if (startScale.current === null) startScale.current = anchorStart(size, start);
      const s0 = startScale.current;
      if (s0 > 0) {
        const t = Math.min(1, rig.open);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // ease-in-out
        place.lerpVectors(start, target, e);
        m.position.copy(place);
        m.scale.setScalar(s0 + (scale - s0) * e);
      } else {
        m.position.copy(target);
        m.scale.setScalar(scale);
      }
    } else if (still) {
      m.position.copy(target);
      m.scale.setScalar(scale);
    } else {
      const k = 1 - Math.exp(-delta / 0.25);
      m.position.lerp(target, k);
      m.scale.setScalar(m.scale.x + (scale - m.scale.x) * k);
    }
    if (still) return;

    m.rotation.y += SPIN * delta;
    // The highlight follows the pointer: turn the studio light, not the (symmetric) sphere
    const env = state.scene.environmentRotation;
    const k = 1 - Math.pow(1 - 0.08, delta * 60);
    env.y += (state.pointer.x * 0.6 * rig.pointer - env.y) * k;
    env.x += (-state.pointer.y * 0.4 * rig.pointer - env.x) * k;
  });

  return (
    <mesh ref={mesh} scale={0.001}>
      <sphereGeometry args={[1, segments, segments]} />
      {physical ? (
        <meshPhysicalMaterial
          color={colors.pearl}
          roughness={0.18}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[200, 600]}
          sheen={0.4}
          sheenColor={colors.sheenRose}
          sheenRoughness={0.5}
          envMapIntensity={1.2}
        />
      ) : (
        <meshStandardMaterial color={colors.pearl} roughness={0.22} metalness={0.05} envMapIntensity={1} />
      )}
    </mesh>
  );
}
