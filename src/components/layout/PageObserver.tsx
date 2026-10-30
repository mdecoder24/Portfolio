'use client';

import { useEffect } from 'react';
import { useScroll } from '@/stores/scroll';
import { hydratePrefs, SECTION_IDS, useUi, type SectionId } from '@/stores/ui';

/** Feeds the ui and scroll stores: preferences, the section in view, and section offsets for the 3D layer. */
export function PageObserver() {
  useEffect(() => {
    hydratePrefs();
    document.documentElement.dataset.motion = useUi.getState().motionPref;

    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => e !== null);

    // A section is "in view" when it crosses the middle of the viewport, which works for sections taller than the screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) useUi.getState().setActiveSection(e.target.id as SectionId);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));

    const measure = () => {
      const y = window.scrollY;
      const sections: Partial<Record<SectionId, { top: number; height: number }>> = {};
      for (const el of els) {
        const r = el.getBoundingClientRect();
        sections[el.id as SectionId] = { top: r.top + y, height: r.height };
      }
      useScroll.setState({ sections, viewportH: window.innerHeight, y });
    };
    const onScroll = () => useScroll.setState({ y: window.scrollY });

    const ro = new ResizeObserver(measure);
    els.forEach((el) => ro.observe(el));
    void document.fonts.ready.then(measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();

    // Scroll reveals live in RevealObserver, inside the page tree, so they never touch sections still hydrating

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
