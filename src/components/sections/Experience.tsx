import { Plus } from 'lucide-react';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Experience as ExperienceEntry } from '@/content/schema';
import { formatRange } from '@/lib/format';

/** Roles as full-width rows on the section grid; each opens to its outcomes. Opening works without JavaScript. */
export function Experience({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <Section id="experience" index={2} label="Experience" title="Where I've worked">
      <ul className="border-t border-rule">
        {entries.map((e, i) => (
          <li key={e.id} className="reveal border-b border-rule" style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
            <details className="group" open={e.current}>
              <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-6 transition-colors duration-200 hover:text-ink-hover focus-visible:outline-none focus-visible:shadow-focus lg:grid-cols-12 lg:gap-x-8 [&::-webkit-details-marker]:hidden">
                <span className="type-code text-ink-2 max-lg:col-span-2 lg:col-span-3">
                  {formatRange(e.start, e.end)}
                  {e.current && <span className="ml-2 text-ok">Current</span>}
                </span>
                <span className="grid gap-1 lg:col-span-8">
                  <span className="type-h3 text-ink">{e.role}</span>
                  <span className="type-body text-ink-2">
                    {e.org}
                    {e.location && `, ${e.location}`}
                  </span>
                </span>
                <span className="grid size-10 place-items-center self-center rounded-full border border-rule text-ink-2 transition-[rotate,border-color,color] duration-200 ease-out group-hover:border-rule-strong group-hover:text-ink group-open:rotate-45 lg:col-span-1 lg:justify-self-end">
                  <Plus aria-hidden="true" strokeWidth={1.75} className="size-4" />
                </span>
              </summary>
              <div className="grid gap-4 pb-8 lg:grid-cols-12 lg:gap-x-8">
                <div className="grid gap-5 lg:col-span-8 lg:col-start-4">
                  <SampleRibbon placeholder={e.placeholder} />
                  <ul className="grid max-w-(--measure) gap-3 type-body text-ink">
                    {e.points.map((p) => (
                      <li key={p} className="grid grid-cols-[1.25rem_minmax(0,1fr)]">
                        <span aria-hidden="true" className="mt-[0.8em] h-px w-2.5 bg-ink-2" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="type-code text-ink-2">{e.stack.join(', ')}</p>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </Section>
  );
}
