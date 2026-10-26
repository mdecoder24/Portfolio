import { createElement, type CSSProperties } from 'react';
import { cn } from '@/lib/cn';

/**
 * Big brushed-metal type with extruded depth, split into words that rise in one after another when the title scrolls
 * into view. Line breaks in `text` ("What I\ncan build") are kept. Screen readers get the plain text once.
 */
export function MetalTitle({
  text,
  as = 'h2',
  id,
  className,
  delay = 0,
  letters = false,
  decorative = false,
  entrance = 'scroll',
}: {
  text: string;
  as?: 'h1' | 'h2' | 'p' | 'span';
  id?: string;
  className?: string;
  delay?: number;
  /** Split into letters instead of words, for a single big word */
  letters?: boolean;
  /** Hide from assistive technology entirely (the words exist elsewhere on the page) */
  decorative?: boolean;
  /** 'scroll' rises when scrolled into view (needs JavaScript); 'load' plays on first paint, for the first viewport */
  entrance?: 'scroll' | 'load';
}) {
  let i = 0;
  const lines = text.split('\n');
  return createElement(
    as,
    { id, className: cn(entrance === 'load' ? 'rise-words' : 'reveal-words', className), 'aria-hidden': decorative || undefined },
    !decorative && <span className="sr-only">{text.replace(/\n/g, ' ')}</span>,
    lines.map((line, li) => (
      <span key={li} aria-hidden="true" className="block">
        {(letters ? [...line] : line.split(' ')).map((word, wi) => (
          <span
            key={wi}
            className={cn('w metal depth inline-block pb-[0.08em]', !letters && 'mr-[0.18em] last:mr-0')}
            style={{ '--i': delay + i++ } as CSSProperties}
          >
            {word}
          </span>
        ))}
      </span>
    )),
  );
}
