import { create } from 'zustand';

export const SECTION_IDS = ['hero', 'about', 'experience', 'work', 'education', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export type MotionPref = 'auto' | 'reduced' | 'full';
export type QualityPref = 'auto' | 'low' | 'off';

type UiState = {
  activeSection: SectionId;
  motionPref: MotionPref;
  qualityPref: QualityPref;
  setActiveSection: (id: SectionId) => void;
  setMotionPref: (p: MotionPref) => void;
  setQualityPref: (p: QualityPref) => void;
};

// Versioned so a reset can start everyone fresh: v2 dropped choices saved before 30 Oct 2026, which left some browsers
// stuck on 3D off without anyone remembering choosing it
const KEY = { motion: 'kr-motion-v2', quality: 'kr-3d-v2' } as const;
const RETIRED_KEYS = ['kr-motion', 'kr-3d'];

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
  try {
    RETIRED_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Storage unavailable: nothing saved to clear.
  }
  useUi.setState({
    motionPref: read(KEY.motion, ['auto', 'reduced', 'full'] as const, 'auto'),
    qualityPref: forced ?? read(KEY.quality, ['auto', 'low', 'off'] as const, 'auto'),
  });
}

/** Reduced when the visitor chose Reduced, or when the OS asks and the visitor has not chosen Full. */
export function prefersReducedMotion(): boolean {
  const pref = useUi.getState().motionPref;
  if (pref === 'full') return false;
  return pref === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches;
}
