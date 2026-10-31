'use client';

import { useEffect } from 'react';

/**
 * Feeds the pointer's position to every .spot-card on the page, so its glow follows the mouse. It renders nothing:
 * the cards are server-rendered and look finished without it. Touch screens are skipped, since a tap has no hover.
 */
export function Spotlight() {
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const cards = [...document.querySelectorAll<HTMLElement>('.spot-card')];
    let raf = 0;
    const move = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      cancelAnimationFrame(raf);
      // Once a frame, and on the card itself rather than a shared parent, so only that card restyles
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - r.left}px`);
        card.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    };
    cards.forEach((c) => c.addEventListener('pointermove', move));
    return () => {
      cancelAnimationFrame(raf);
      cards.forEach((c) => c.removeEventListener('pointermove', move));
    };
  }, []);

  return null;
}
