'use client';

import { useEffect } from 'react';
import { watchScrollReplay } from '@/lib/scroll-replay';
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
    const stops: (() => void)[] = [];
    const watch = (selector: string, rootMargin: string) => {
      stops.push(
        watchScrollReplay(
          document.querySelectorAll(selector),
          rootMargin,
          (el) => {
            (el as HTMLElement).dataset.shown = '';
          },
          (el) => {
            delete (el as HTMLElement).dataset.shown;
            // Jump to the hidden state, or a quick return would catch the reverse transition and lose the entrance.
            // Only transitions: scroll-driven and looping animations here cannot be finished
            for (const a of el.getAnimations({ subtree: true })) if (a instanceof CSSTransition) a.finish();
          },
        ),
      );
    };
    const raf = requestAnimationFrame(() => {
      if (prefersReducedMotion()) return;
      document.documentElement.dataset.reveal = '';
      watch('.reveal, .reveal-words, .ticket-slot', '0px 0px -8% 0px');
      // Set pieces that play a longer motion wait until they are well on screen, or the reader catches only the end
      watch('.reveal-late', '0px 0px -30% 0px');
    });

    return () => {
      cancelAnimationFrame(raf);
      stops.forEach((stop) => stop());
      delete document.documentElement.dataset.reveal;
      document.querySelectorAll('[data-shown]').forEach((el) => delete (el as HTMLElement).dataset.shown);
    };
  }, []);

  return null;
}
