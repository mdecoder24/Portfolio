'use client';

import { useEffect } from 'react';

/**
 * Feeds the pointer's position to every .spot-card on the page, so its glow follows the mouse and it tilts towards it.
 * It renders nothing:
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
        // From -0.5 to 0.5 across the card, for the tilt
        card.style.setProperty('--px', `${((e.clientX - r.left) / r.width - 0.5).toFixed(3)}`);
        card.style.setProperty('--py', `${((e.clientY - r.top) / r.height - 0.5).toFixed(3)}`);
      });
    };
    // Back to flat when the pointer leaves, so the card eases down instead of staying tipped
    const leave = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      const card = e.currentTarget as HTMLElement;
      card.style.setProperty('--px', '0');
      card.style.setProperty('--py', '0');
    };
    cards.forEach((c) => {
      c.addEventListener('pointermove', move);
      c.addEventListener('pointerleave', leave);
    });
    return () => {
      cancelAnimationFrame(raf);
      cards.forEach((c) => {
        c.removeEventListener('pointermove', move);
        c.removeEventListener('pointerleave', leave);
      });
    };
  }, []);

  return null;
}
