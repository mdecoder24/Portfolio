import { create } from 'zustand';
import type { SectionId } from './ui';

// Transient: written on scroll and resize, read with getState() inside the frame loop. Never subscribe from React.
type ScrollState = {
  y: number;
  viewportH: number;
  sections: Partial<Record<SectionId, { top: number; height: number }>>;
};

export const useScroll = create<ScrollState>(() => ({ y: 0, viewportH: 1, sections: {} }));
