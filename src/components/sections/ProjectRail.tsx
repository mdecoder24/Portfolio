'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/stores/ui';

/**
 * The featured projects as a row that scrolls sideways. The row is native overflow with scroll snap, so it scrolls by
 * trackpad, touch, keyboard and the always-visible scrollbar without JavaScript; the arrows are an extra, and stay
 * disabled until the row has been measured.
 */
export function ProjectRail({ label, children }: { label: string; children: ReactNode }) {
  const row = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    // A pixel of slack: fractional scroll positions at some zoom levels never quite reach the end
    const measure = () =>
      setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      resize.disconnect();
    };
  }, []);

  // One card at a time, so the snap lands on the next card rather than skipping past it
  const step = (dir: 1 | -1) => {
    const el = row.current;
    const card = el?.firstElementChild;
    if (!el || !(card instanceof HTMLElement)) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
  };

  const arrow =
    'inline-flex size-10 items-center justify-center rounded-full border border-rule-strong text-ink transition-[background-color,border-color,opacity,scale] duration-160 ease-out hover:border-ink-2 hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45';

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="type-code text-ink-2">Scroll sideways to see every project</p>
        <div className="flex shrink-0 gap-2">
          <button type="button" aria-label="Previous project" disabled={edges.start} onClick={() => step(-1)} className={arrow}>
            <ChevronLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next project" disabled={edges.end} onClick={() => step(1)} className={arrow}>
            <ChevronRight className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
      {/* Focusable so keyboard users can scroll it with the arrow keys; named so screen readers know what it holds */}
      <ul
        ref={row}
        role="list"
        aria-label={label}
        tabIndex={0}
        className="scroll-visible flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain scroll-px-px rounded-md px-px pt-px pb-5 focus-visible:outline-none focus-visible:shadow-focus lg:gap-8"
      >
        {children}
      </ul>
    </div>
  );
}
