'use client';

import { Environment, Lightformer } from '@react-three/drei';
import type { SceneColors } from './colors';

/**
 * Procedural studio light, no HDR download: a key panel top-left, an aqua rim ring behind-right, and a warm rose fill
 * below-right, plus a soft wrap panel behind the camera so the pearl reads as pearl-white rather than grey.
 */
export function Lighting({ colors }: { colors: SceneColors }) {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={0.9} position={[0, 0, 10]} scale={[20, 14, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2.2} position={[-5, 5, 4]} scale={[10, 4, 1]} target={[0, 0, 0]} />
      <Lightformer form="ring" intensity={1.4} color={colors.sheenAqua} position={[5, 1, -5]} scale={6} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={0.6} color={colors.sheenRose} position={[4, -5, 3]} scale={[8, 5, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}
