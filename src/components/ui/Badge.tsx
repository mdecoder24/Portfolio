import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'available' | 'limited' | 'booked' | 'neutral' | 'tag';

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const dot = tone === 'available' || tone === 'limited' || tone === 'booked';
  return (
    <span
      className={cn(
        'inline-flex min-h-8 w-fit items-center gap-2 whitespace-nowrap rounded-control px-3.5 type-small font-medium',
        tone === 'available' && 'border border-rule-strong text-ink [&>span]:bg-ok',
        tone === 'limited' && 'border border-rule-strong text-ink [&>span]:bg-warn',
        tone === 'booked' && 'border border-rule text-ink-2',
        tone === 'neutral' && 'border border-rule-strong text-ink',
        tone === 'tag' && 'border border-rule text-ink-2',
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn('size-2 rounded-full', tone === 'booked' ? 'ring-[1.5px] ring-current ring-inset' : 'bg-current')}
        />
      )}
      {children}
    </span>
  );
}

/** Stack names as a plain list separated by thin rules, like a caption naming every part. */
export function TagList({ items, max = 6, label = 'Stack' }: { items: string[]; max?: number; label?: string }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 type-small text-ink-2" aria-label={label}>
      {items.slice(0, max).map((s, i) => (
        <li key={s} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />}
          {s}
        </li>
      ))}
    </ul>
  );
}
