import { Color } from 'three';

// Reads the scene tokens; called on mount and again when data-theme changes. Never per frame.
const read = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

export function sceneColors() {
  return {
    ink: new Color(read('scene-ink')),
    accent: new Color(read('scene-accent')),
    light: document.documentElement.dataset.theme === 'light',
  };
}

export type SceneColors = ReturnType<typeof sceneColors>;
