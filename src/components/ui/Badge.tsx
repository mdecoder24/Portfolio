import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'available' | 'limited' | 'booked' | 'neutral' | 'tag';

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const dot = tone === 'available' || tone === 'limited' || tone === 'booked';
  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-sm px-2.5 type-small font-medium',
        tone === 'available' && 'bg-seaglass-soft text-seaglass',
        tone === 'limited' && 'bg-amber-soft text-amber',
        (tone === 'booked' || tone === 'neutral') && 'bg-reef text-mist',
        tone === 'tag' && 'text-mist ring-1 ring-inset ring-line',
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            'size-2 rounded-full',
            tone === 'booked' ? 'bg-transparent ring-[1.5px] ring-inset ring-current' : 'bg-current',
          )}
        />
      )}
      {children}
    </span>
  );
}

export function TagList({ items, max = 5, label = 'Stack' }: { items: string[]; max?: number; label?: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.slice(0, max).map((s) => (
        <li key={s}>
          <Badge tone="tag">{s}</Badge>
        </li>
      ))}
    </ul>
  );
}
