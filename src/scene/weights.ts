// Turns scroll position into the five formation weights. Pure, allocation-free, unit-tested.
import type { SectionId } from '@/stores/ui';

/** Which formation each section shows, as an index into FORMATIONS. */
export const SECTION_FORMATION: Record<SectionId, number> = {
  hero: 0,
  about: 1,
  experience: 1,
  freelance: 2,
  projects: 3,
  skills: 3,
  education: 3,
  contact: 4,
};

const ORDER: SectionId[] = ['hero', 'about', 'experience', 'freelance', 'projects', 'skills', 'education', 'contact'];

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

type ScrollLike = {
  y: number;
  viewportH: number;
  sections: Partial<Record<SectionId, { top: number; height: number }>>;
};

/**
 * Writes weights into `out` (length 5) and returns the index of the dominant section. Each section's first 35% of
 * scroll blends from the previous section's formation with a smoothstep; the reading line is the viewport's middle.
 */
export function formationWeights(s: ScrollLike, out: Float32Array): number {
  out.fill(0);
  const line = s.y + s.viewportH * 0.5;
  let current = 0;
  for (let i = 0; i < ORDER.length; i++) {
    const r = s.sections[ORDER[i]];
    if (r && r.top <= line) current = i;
  }
  const rect = s.sections[ORDER[current]];
  const to = SECTION_FORMATION[ORDER[current]];
  if (!rect || current === 0) {
    out[to] = 1;
    return current;
  }
  const from = SECTION_FORMATION[ORDER[current - 1]];
  const t = smoothstep(0, 0.35, (line - rect.top) / Math.max(rect.height, 1));
  out[from] += 1 - t;
  out[to] += t;
  return current;
}
