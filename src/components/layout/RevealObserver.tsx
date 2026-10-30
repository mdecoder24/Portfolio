'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/stores/ui';

/**
 * Scroll reveals for the page it is rendered in. It must sit after the sections in the same page tree: the root layout
 * hydrates before the page, so an observer started from there marked on-screen sections with data-shown before React
 * reached them, and hydration reported the attribute as a mismatch.
 */
export function RevealObserver() {
  useEffect(() => {
    // Opt in only when motion is allowed, so content is never hidden without JavaScript. Deferred by one frame so
    // PageObserver, which mounts after the page in the same commit, has loaded the saved motion preference.
    const observers: IntersectionObserver[] = [];
    const watch = (selector: string, rootMargin: string) => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries)
            if (e.isIntersecting) {
              (e.target as HTMLElement).dataset.shown = '';
              io.unobserve(e.target);
            }
        },
        { rootMargin },
      );
      document.querySelectorAll(selector).forEach((el) => io.observe(el));
      observers.push(io);
    };
    const raf = requestAnimationFrame(() => {
      if (prefersReducedMotion()) return;
      document.documentElement.dataset.reveal = '';
      watch('.reveal, .reveal-words', '0px 0px -8% 0px');
      // Set pieces that play a longer motion wait until they are well on screen, or the reader catches only the end
      watch('.reveal-late', '0px 0px -30% 0px');
    });

    return () => {
      cancelAnimationFrame(raf);
      observers.forEach((io) => io.disconnect());
      delete document.documentElement.dataset.reveal;
      document.querySelectorAll('[data-shown]').forEach((el) => delete (el as HTMLElement).dataset.shown);
    };
  }, []);

  return null;
}
