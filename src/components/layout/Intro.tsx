'use client';

import { useEffect, useState } from 'react';

const SEEN_KEY = 'kr-intro';

/**
 * The opening card: the name in metal, handing over to "PORTFOLIO", then lifting away. Plays once per session, never
 * under reduced motion, never blocks: the page underneath is already rendered and a click or key skips it.
 */
export function Intro() {
  const [stage, setStage] = useState<'off' | 'name' | 'word' | 'leave'>('off');

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Storage unavailable: play once per page load
    }
    const motion = document.documentElement.dataset.motion;
    const reduced = motion === 'reduced' || (motion !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches);
    // Automated browsers (tests, crawlers) skip it too
    if (seen || reduced || navigator.webdriver || location.search.includes('intro=off')) return;

    const timers = [
      setTimeout(() => setStage('name'), 0),
      setTimeout(() => setStage('word'), 1100),
      setTimeout(() => setStage('leave'), 2200),
      setTimeout(() => setStage('off'), 3000),
    ];
    const skip = () => setStage((s) => (s === 'off' ? s : 'leave'));
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('wheel', skip, { once: true, passive: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
    };
  }, []);

  useEffect(() => {
    if (stage !== 'leave') return;
    const t = setTimeout(() => setStage('off'), 800);
    return () => clearTimeout(t);
  }, [stage]);

  if (stage === 'off') return null;
  return (
    <div
      aria-hidden="true"
      data-stage={stage}
      className="group/intro fixed inset-0 z-intro grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--tint),var(--paper)_70%)] transition-[translate,opacity] duration-700 ease-in-out-quint data-[stage=leave]:-translate-y-full"
    >
      <div className="relative grid place-items-center">
        <span className="metal depth type-mega col-start-1 row-start-1 transition-[opacity,translate,filter] duration-700 ease-out-quint starting:translate-y-8 starting:opacity-0 starting:blur-sm group-data-[stage=word]/intro:-translate-y-10 group-data-[stage=word]/intro:opacity-0 group-data-[stage=word]/intro:blur-sm group-data-[stage=leave]/intro:opacity-0">
          KUSHWANT
        </span>
        <span className="metal depth type-mega col-start-1 row-start-1 translate-y-10 opacity-0 blur-sm transition-[opacity,translate,filter] duration-700 ease-out-quint group-data-[stage=word]/intro:translate-y-0 group-data-[stage=word]/intro:opacity-100 group-data-[stage=word]/intro:blur-none group-data-[stage=leave]/intro:translate-y-0 group-data-[stage=leave]/intro:opacity-100 group-data-[stage=leave]/intro:blur-none">
          PORTFOLIO
        </span>
      </div>
    </div>
  );
}
