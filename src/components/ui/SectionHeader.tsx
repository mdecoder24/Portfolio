import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** A small mono label with a rule running out to the right edge. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-4 type-code text-ink-2', className)}>
      <span className="shrink-0">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-rule" />
    </p>
  );
}

/**
 * A home-page section on a 12-column grid: the numbered label sits in the left rail, the title and an optional intro
 * line in the right nine columns, so every section starts on the same vertical line.
 */
export function Section({
  id,
  index,
  label,
  title,
  intro,
  aside,
  children,
  className,
}: {
  id: string;
  index: number;
  label: string;
  title: string;
  intro?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('relative border-t border-rule', className)}>
      <div className="container-kit grid gap-12 py-(--section-pad) sm:gap-16 [&>*]:min-w-0">
        <header className="reveal grid gap-5 lg:grid-cols-12 lg:gap-8">
          <p className="flex items-baseline gap-3 type-code text-ink-2 lg:col-span-3 lg:pt-3">
            <span className="text-ink">{String(index).padStart(2, '0')}</span>
            <span aria-hidden="true" className="h-px w-6 translate-y-[-0.3em] bg-rule-strong" />
            {label}
          </p>
          <div className="grid gap-5 lg:col-span-9">
            <h2 id={`${id}-title`} className="max-w-[18ch] type-h2 text-ink">
              {title}
            </h2>
            {intro && <div className="max-w-[56ch] type-lead text-ink-2">{intro}</div>}
            {aside}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
