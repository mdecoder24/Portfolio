import { create } from 'zustand';

export const SECTION_IDS = ['hero', 'about', 'experience', 'freelance', 'projects', 'skills', 'education', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export type MotionPref = 'auto' | 'reduced';
export type QualityPref = 'auto' | 'low' | 'off';

type UiState = {
  activeSection: SectionId;
  motionPref: MotionPref;
  qualityPref: QualityPref;
  setActiveSection: (id: SectionId) => void;
  setMotionPref: (p: MotionPref) => void;
  setQualityPref: (p: QualityPref) => void;
};

const KEY = { motion: 'kr-motion', quality: 'kr-3d' } as const;

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable (private mode): the preference lasts for this page only.
  }
}

export const useUi = create<UiState>((set) => ({
  activeSection: 'hero',
  motionPref: 'auto',
  qualityPref: 'auto',
  setActiveSection: (activeSection) => set({ activeSection }),
  setMotionPref: (motionPref) => {
    write(KEY.motion, motionPref);
    document.documentElement.dataset.motion = motionPref;
    set({ motionPref });
  },
  setQualityPref: (qualityPref) => {
    write(KEY.quality, qualityPref);
    set({ qualityPref });
  },
}));

/** Called once on the client to load saved preferences; ?3d=off and ?tier= override for testing. */
export function hydratePrefs() {
  const params = new URLSearchParams(location.search);
  const forced = params.get('3d') === 'off' || params.get('tier') === 'off' ? 'off' : null;
  useUi.setState({
    motionPref: read(KEY.motion, ['auto', 'reduced'] as const, 'auto'),
    qualityPref: forced ?? read(KEY.quality, ['auto', 'low', 'off'] as const, 'auto'),
  });
}

export function prefersReducedMotion(): boolean {
  return useUi.getState().motionPref === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches;
}
