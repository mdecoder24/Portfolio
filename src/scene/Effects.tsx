'use client';

import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';

/** High: bloom, grain, vignette. Medium: grain only. Low and Off never mount this. */
export function Effects({ tier }: { tier: 2 | 3 }) {
  if (tier === 3) {
    return (
      <EffectComposer multisampling={4}>
        <Bloom intensity={0.6} luminanceThreshold={0.6} mipmapBlur />
        <Noise opacity={0.035} premultiply={false} />
        <Vignette offset={0.3} darkness={0.6} />
      </EffectComposer>
    );
  }
  return (
    <EffectComposer multisampling={0}>
      <Noise opacity={0.035} premultiply={false} />
    </EffectComposer>
  );
}
