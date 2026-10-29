'use client';

import { useEffect } from 'react';
import { useScroll } from '@/stores/scroll';
import { hydratePrefs, prefersReducedMotion, SECTION_IDS, useUi, type SectionId } from '@/stores/ui';

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

    // Scroll reveals: opt in only when motion is allowed, so content is never hidden without JavaScript.
    // Deferred by one frame so hydration completes before any DOM data-shown attributes are mutated.
    let revealIo: IntersectionObserver | undefined;
    let raf = 0;
    if (!prefersReducedMotion()) {
      raf = requestAnimationFrame(() => {
        document.documentElement.dataset.reveal = '';
        revealIo = new IntersectionObserver(
          (entries) => {
            for (const e of entries)
              if (e.isIntersecting) {
                (e.target as HTMLElement).dataset.shown = '';
                revealIo?.unobserve(e.target);
              }
          },
          { rootMargin: '0px 0px -8% 0px' },
        );
        document.querySelectorAll('.reveal, .reveal-words').forEach((el) => revealIo?.observe(el));
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      revealIo?.disconnect();
      delete document.documentElement.dataset.reveal;
      document.querySelectorAll('[data-shown]').forEach((el) => delete (el as HTMLElement).dataset.shown);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
