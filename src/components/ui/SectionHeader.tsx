import { Fragment, type CSSProperties, type ReactNode } from 'react';
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
  rail,
  children,
  className,
}: {
  id: string;
  index: number;
  label: string;
  title: string;
  intro?: ReactNode;
  aside?: ReactNode;
  /** Decoration for the left rail on desktop, filling it from below the label to the section's end */
  rail?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('relative border-t border-rule', className)}>
      <div className="container-kit grid gap-12 py-(--section-pad) sm:gap-16 [&>*]:min-w-0">
        <header className="grid gap-5 lg:grid-cols-12 lg:gap-8">
          <p className="reveal flex items-baseline gap-3 type-code text-ink-2 lg:col-span-3 lg:pt-3">
            <span className="text-ink">{String(index).padStart(2, '0')}</span>
            <span aria-hidden="true" className="h-px w-6 translate-y-[-0.3em] bg-rule-strong" />
            {label}
          </p>
          <div className="grid gap-5 lg:col-span-9">
            {/* The title rises word by word after its label; screen readers get it once, whole */}
            <h2 id={`${id}-title`} className="reveal-words max-w-[18ch] type-h2 text-ink">
              <span className="sr-only">{title}</span>
              <span aria-hidden="true">
                {title.split(' ').map((word, i) => (
                  <Fragment key={i}>
                    {i > 0 && ' '}
                    <span className="w inline-block" style={{ '--i': i + 1 } as CSSProperties}>
                      {word}
                    </span>
                  </Fragment>
                ))}
              </span>
            </h2>
            {intro && <div className="reveal max-w-[56ch] type-lead text-ink-2 [--reveal-delay:160ms]">{intro}</div>}
            {aside && <div className="reveal [--reveal-delay:220ms]">{aside}</div>}
          </div>
        </header>
        {children}
      </div>
      {rail && (
        // Laid over the section on the same 12-column grid, so the rail runs beside the header and the content alike
        <div className="container-kit pointer-events-none absolute inset-0 grid py-(--section-pad) max-lg:hidden lg:grid-cols-12 lg:gap-8">
          <div className="pt-16 lg:col-span-3">{rail}</div>
        </div>
      )}
    </section>
  );
}
