import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { MetalTitle } from './MetalTitle';

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
 * A home-page section: divided from the last by a hairline, opened by its mono label and a huge brushed-metal title.
 * `title` is the visible heading; `align` puts it on the right, as the services list does.
 */
export function Section({
  id,
  label,
  title,
  align = 'left',
  aside,
  children,
  className,
}: {
  id: string;
  label: string;
  title: string;
  align?: 'left' | 'right';
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('relative border-t border-rule', className)}>
      <div className="container-kit grid gap-12 py-(--section-pad) sm:gap-16 [&>*]:min-w-0">
        <header className="grid gap-6">
          <Label className="reveal">{label}</Label>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            {align === 'right' && aside}
            <MetalTitle
              id={`${id}-title`}
              text={title}
              className={cn('type-display', align === 'right' && 'ml-auto text-right')}
            />
            {align === 'left' && aside}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}
