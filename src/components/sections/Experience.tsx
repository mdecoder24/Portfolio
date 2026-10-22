import { TagList } from '@/components/ui/Badge';
import { PearlDot } from '@/components/ui/PearlDot';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import type { Experience as ExperienceEntry } from '@/content/schema';
import { formatRange } from '@/lib/format';

function When({ start, end }: { start: string; end?: string }) {
  // "Jan – Jun 2026": the range formatter drops the repeated year, each half keeps its machine-readable date
  const [from, to] = formatRange(start, end).split(' – ');
  return (
    <p className="type-small tabular font-[560] text-mist">
      <time dateTime={start}>{from}</time>
      {' – '}
      {end ? <time dateTime={end}>{to}</time> : to}
    </p>
  );
}

export function Experience({ entries, summary }: { entries: ExperienceEntry[]; summary: string }) {
  return (
    <Section id="experience">
      <SectionHeader id="experience" title="Experience" summary={summary} />
      <ol className="grid">
        {entries.map((e) => (
          <li key={e.id} className="grid grid-cols-[148px_minmax(0,1fr)] gap-x-6 max-sm:grid-cols-1 max-sm:gap-y-2">
            <div className="pt-1 max-sm:pl-8">
              <When start={e.start} end={e.end} />
            </div>
            <div className="relative grid max-w-(--measure) gap-3 border-l border-line pb-12 pl-8 [li:last-child_&]:pb-0">
              {e.current ? (
                <PearlDot className="absolute -left-[7px] top-2 size-[13px]" />
              ) : (
                <span aria-hidden="true" className="absolute -left-[7px] top-2 size-[13px] rounded-full bg-lagoon ring-[1.5px] ring-inset ring-line-strong" />
              )}
              <SampleRibbon placeholder={e.placeholder} />
              <div>
                <h3 className="type-h4 text-pearl">{e.role}</h3>
                <p className="type-body">
                  <span className="font-semibold text-pearl">{e.org}</span>
                  <span className="text-mist">, {e.location}</span>
                </p>
              </div>
              <ul className="grid list-disc gap-1.5 pl-5 type-body marker:text-rose">
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <TagList items={e.stack} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
