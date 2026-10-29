'use client';

import { useEffect } from 'react';

const SEEN = 'kr-intro';

/**
 * The intro's behaviour: marks it seen for this session, skips it on the first click, key or scroll, and takes it out
 * of the page (and out of the 3D scene's timing, which waits for [data-stage]) once it has lifted.
 */
export function IntroSkip() {
  useEffect(() => {
    const intro = document.getElementById('intro');
    if (!intro) return;
    const root = document.documentElement;
    const done = () => {
      intro.hidden = true;
      delete intro.dataset.stage;
      root.dataset.introSeen = '';
    };
    if ('introSeen' in root.dataset || getComputedStyle(intro).display === 'none') {
      done();
      return;
    }
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {}
    const skip = () => {
      intro.dataset.skip = '';
      root.dataset.introSeen = '';
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === intro) done();
    };
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    events.forEach((t) => window.addEventListener(t, skip, { once: true, passive: true }));
    intro.addEventListener('animationend', onEnd);
    return () => {
      events.forEach((t) => window.removeEventListener(t, skip));
      intro.removeEventListener('animationend', onEnd);
    };
  }, []);

  return null;
}
