'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { PearlData } from '@/lib/pearl-local/search';
import { cn } from '@/lib/cn';

const loadPanel = () => import('./ChatPanel');
const ChatPanel = dynamic(loadPanel, { ssr: false });

/**
 * Pearl's launcher and, once opened, its panel. Pearl answers entirely in the browser (see src/lib/pearl-local), so
 * there is no server route. The launcher only appears with JavaScript, once the hero is half out of view, because the
 * page reads fine without it.
 */
export function PearlMount({ data }: { data: PearlData }) {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShown(e.intersectionRatio < 0.5), { threshold: [0.5] });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  function close() {
    setOpen(false);
    // After the dialog unmounts, or its own focus restoration would win
    requestAnimationFrame(() => launcher.current?.focus());
  }

  return (
    <>
      <button
        ref={launcher}
        type="button"
        aria-label="Ask Pearl, Kushwant's AI guide"
        aria-expanded={open}
        aria-controls="pearl-panel"
        // Prefetch the panel's code when intent shows, so opening feels instant
        onPointerEnter={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        onTouchStart={() => void loadPanel()}
        onClick={() => (open ? close() : setOpen(true))}
        className={cn(
          'group fixed right-[max(1.5rem,calc(env(safe-area-inset-right)+1rem))] bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] z-nav',
          'inline-flex min-h-12 items-center gap-2.5 rounded-control bg-cream py-2 pr-5 pl-2 type-ui text-on-cream shadow-float',
          'transition-[opacity,translate,scale,background-color] duration-200 ease-out-quint hover:bg-ink-hover focus-visible:outline-none focus-visible:shadow-focus active:scale-[0.97]',
          shown && !open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0 calm:translate-y-0',
        )}
        tabIndex={shown && !open ? 0 : -1}
      >
        <span aria-hidden="true" className="kr-pearl size-8" />
        <span aria-hidden="true">Ask Pearl</span>
      </button>
      {open && <ChatPanel data={data} onClose={close} />}
    </>
  );
}
