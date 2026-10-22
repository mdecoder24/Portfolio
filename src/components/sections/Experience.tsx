import { ArrowDownRight } from 'lucide-react';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Experience as ExperienceEntry } from '@/content/schema';
import { formatRange } from '@/lib/format';

/** Roles as full-width rows; each opens to its outcomes. Opening works without JavaScript (details/summary). */
export function Experience({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <Section id="experience" label="Experience" title="Where I've worked">
      <ul className="border-t border-rule">
        {entries.map((e, i) => (
          <li key={e.id} className="reveal border-b border-rule" style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
            <details className="group" open={e.current}>
              <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 px-2 py-6 transition-colors duration-300 hover:bg-cream hover:text-on-cream focus-visible:outline-none focus-visible:shadow-focus sm:grid-cols-[11rem_minmax(0,1fr)_minmax(0,16rem)_auto] sm:px-4 [&::-webkit-details-marker]:hidden">
                <span className="type-code opacity-70 max-sm:col-span-2">{formatRange(e.start, e.end)}</span>
                <span className="text-[clamp(1.125rem,0.95rem+0.8vw,1.625rem)] font-extrabold uppercase tracking-[-0.02em]">
                  {e.role}
                </span>
                <span className="type-small opacity-80 max-sm:hidden">
                  {e.org}, {e.location}
                </span>
                <ArrowDownRight
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="size-6 transition-transform duration-300 ease-out-quint group-open:-rotate-90"
                />
              </summary>
              <div className="grid gap-4 px-2 pb-8 pt-2 sm:grid-cols-[11rem_minmax(0,1fr)] sm:px-4">
                <div className="sm:col-start-2 grid gap-4">
                  <SampleRibbon placeholder={e.placeholder} />
                  <p className="type-small text-ink-2 sm:hidden">
                    {e.org}, {e.location}
                  </p>
                  <ul className="grid max-w-(--measure) gap-2 type-body text-ink">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.75em] h-px w-4 shrink-0 bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="type-code text-ink-2">{e.stack.join('  ·  ')}</p>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </Section>
  );
}
