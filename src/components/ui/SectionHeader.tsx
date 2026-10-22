import type { ReactNode } from 'react';

export function SectionHeader({
  id,
  title,
  summary,
  aside,
}: {
  id: string;
  title: string;
  summary: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="grid max-w-(--measure) gap-3">
        <h2 id={`${id}-title`} className="type-h2 text-pearl">
          {title}
        </h2>
        <p className="type-lead max-w-[60ch] text-mist">{summary}</p>
      </div>
      {aside}
    </div>
  );
}

/** A home-page section: full-bleed band, 1200 px container, Nacre section padding. */
export function Section({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      <div className="container-nacre grid gap-12 py-(--section-pad)">{children}</div>
    </section>
  );
}
