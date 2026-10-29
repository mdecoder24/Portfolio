'use client';

import { useEffect, useRef } from 'react';
import { formatCount, splitCount } from '@/lib/format';
import { prefersReducedMotion } from '@/stores/ui';

const COUNT_MS = 1200;

/**
 * A fact whose number counts up from zero the first time it scrolls into view. The server renders the final text, so
 * it reads correctly without JavaScript and under reduced motion; screen readers only ever get the final text.
 */
export function CountUp({ text, delay = 0 }: { text: string; delay?: number }) {
  const shown = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = shown.current;
    const parts = splitCount(text);
    if (!el || !parts || prefersReducedMotion()) return;
    const write = (n: number) => {
      el.textContent = `${parts.before}${formatCount(n, parts)}${parts.after}`;
    };
    write(0);
    let raf = 0;
    let timer = 0;
    // Written straight to the text node each frame: no React render per tick
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / COUNT_MS);
        write(parts.value * (1 - Math.pow(1 - t, 5)));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      timer = window.setTimeout(run, delay);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text, delay]);

  if (!splitCount(text)) return text;
  return (
    <>
      <span ref={shown} aria-hidden="true" className="tabular">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}
