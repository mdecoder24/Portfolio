import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Experience as ExperienceEntry } from '@/content/schema';
import { formatMonth, formatRange } from '@/lib/format';

function Dates({ e }: { e: ExperienceEntry }) {
  if (!e.start) return null;
  // A current role ends in the word itself, in its status colour, rather than "present" plus a tag
  if (e.current)
    return (
      <>
        {formatMonth(e.start)} – <span className="text-ok">Current</span>
      </>
    );
  return formatRange(e.start, e.end);
}

/** The organisation's mark beside the role; its name is written next to it, so the picture is decorative */
function Logo({ e }: { e: ExperienceEntry }) {
  const box = 'size-10 shrink-0 overflow-hidden sm:size-12 rounded-sm border border-rule';
  if (e.logo)
    return <Image src={e.logo} alt="" width={48} height={48} className={`${box} bg-cream object-contain`} />;
  const initials = e.org
    .split(/[\s,]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <span aria-hidden="true" className={`${box} grid place-items-center bg-plate type-code text-ink-2`}>
      {initials}
    </span>
  );
}

/** Dates, then the logo, role and organisation: the same in a row that opens and one that doesn't */
function Head({ e }: { e: ExperienceEntry }) {
  return (
    <>
      <span className="type-code text-ink-2 max-lg:col-span-2 lg:col-span-3 lg:self-center">
        <Dates e={e} />
      </span>
      <span className="flex items-center gap-4 lg:col-span-8">
        <Logo e={e} />
        <span className="grid gap-1">
          <span className="type-h3 text-ink">{e.role}</span>
          <span className="type-body text-ink-2">
            {e.org}
            {e.location && `, ${e.location}`}
          </span>
        </span>
      </span>
    </>
  );
}

/** Roles as full-width rows on the section grid; each opens to its outcomes. Opening works without JavaScript. */
function Roles({ title, entries }: { title: string; entries: ExperienceEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="grid gap-2">
      <h3 className="reveal flex items-baseline justify-between gap-4 border-b border-rule pb-4 type-h4 text-ink">
        {title}
        <span className="type-code text-ink-2">
          {entries.length} {entries.length === 1 ? 'role' : 'roles'}
        </span>
      </h3>
      <ul>
        {entries.map((e, i) => (
          <li
            key={e.id}
            className="reveal border-b border-rule"
            style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
          >
            {e.points.length === 0 ? (
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-6 lg:grid-cols-12 lg:gap-x-8">
                <Head e={e} />
              </div>
            ) : (
              <details className="group">
                <summary className="role-row relative isolate grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-6 transition-colors duration-200 hover:text-ink-hover focus-visible:outline-none focus-visible:shadow-focus lg:grid-cols-12 lg:gap-x-8 [&::-webkit-details-marker]:hidden">
                  {/* Light behind the row: a sweep when it first shows, and a pool by the toggle on hover */}
                  <span
                    aria-hidden="true"
                    className="role-light pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                  >
                    <span className="role-sweep" />
                  </span>
                  <Head e={e} />
                  <span className="role-toggle grid size-10 place-items-center self-center rounded-full border border-rule text-ink-2 transition-[rotate,border-color,color,box-shadow] duration-200 ease-out group-hover:border-accent group-hover:text-accent group-open:rotate-180 lg:col-span-1 lg:justify-self-end">
                    <ChevronDown aria-hidden="true" strokeWidth={1.75} className="size-4" />
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
                    {e.stack.length > 0 && <p className="type-code text-ink-2">{e.stack.join(', ')}</p>}
                  </div>
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Experience({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <Section id="experience" index={2} label="Experience" title="Where I've worked">
      <div className="grid gap-16 lg:gap-20">
        <Roles title="Professional experience" entries={entries.filter((e) => e.kind === 'professional')} />
        <Roles title="Volunteer experience" entries={entries.filter((e) => e.kind === 'volunteer')} />
      </div>
    </Section>
  );
}
