import { Color } from 'three';

// Reads the scene-* tokens once on mount; three converts these sRGB values into its linear working space.
const read = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

export function sceneColors() {
  const fog = read('scene-fog').startsWith('var(') ? read('lagoon') : read('scene-fog');
  return {
    particle: new Color(read('scene-particle')),
    glow: new Color(read('scene-particle-glow')),
    pearl: new Color(read('scene-pearl')),
    sheenRose: new Color(read('scene-sheen-rose')),
    sheenAqua: new Color(read('scene-sheen-aqua')),
    fog: new Color(fog),
  };
}

export type SceneColors = ReturnType<typeof sceneColors>;
