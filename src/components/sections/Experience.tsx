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
  const box = 'size-12 shrink-0 overflow-hidden rounded-sm border border-rule sm:size-16';
  if (e.logo)
    return <Image src={e.logo} alt="" width={64} height={64} className={`${box} bg-cream object-contain`} />;
  const initials = e.org
    .split(/[\s,]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <span aria-hidden="true" className={`${box} grid place-items-center bg-plate type-h4 text-ink-2`}>
      {initials}
    </span>
  );
}

/** Logo, role, organisation and dates: the same in a page that opens and one that doesn't */
function Head({ e }: { e: ExperienceEntry }) {
  return (
    <>
      <Logo e={e} />
      <span className="grid min-w-0 flex-1 gap-1">
        <span className="type-h4 text-ink">{e.role}</span>
        <span className="type-body text-ink-2">
          {e.org}
          {e.location && `, ${e.location}`}
        </span>
        <span className="type-code text-ink-2">
          <Dates e={e} />
        </span>
      </span>
    </>
  );
}

/**
 * A group of roles as cards, evenly spaced. Each opens to its outcomes without JavaScript; the page turn and the
 * lighting (a beam round the border, a sheen on hover) live in .passport, and the stacking on scroll in .stack-card,
 * in globals.css.
 */
function Roles({ title, entries }: { title: string; entries: ExperienceEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
      <h3 className="reveal flex items-baseline justify-between gap-4 border-b border-rule pb-4 type-h4 text-ink lg:sticky lg:top-32 lg:col-span-3 lg:grid lg:self-start lg:border-0 lg:pb-0">
        {title}
        <span className="type-code text-ink-2">
          {entries.length} {entries.length === 1 ? 'role' : 'roles'}
        </span>
      </h3>
      {/* Clipped sideways: mid-turn, a card leans towards the reader and would otherwise widen the page */}
      {/* A deck: every card names its own scroll timeline, and the card before it shrinks back on that timeline as this
          one slides over it (see .stack-card in globals.css); the list makes the names visible to each other */}
      <ul
        className="grid gap-4 [overflow-clip-margin:0.5rem] [overflow-x:clip] sm:[overflow-clip-margin:1rem] lg:col-span-9"
        style={{ '--deck': entries.map((e) => `--card-${e.id}`).join(', ') } as React.CSSProperties}
      >
        {entries.map((e, i) => (
          <li
            key={e.id}
            data-role={e.id}
            data-current={e.current || undefined}
            style={
              {
                '--i': i,
                '--self': `--card-${e.id}`,
                '--next': i < entries.length - 1 ? `--card-${entries[i + 1].id}` : 'none',
              } as React.CSSProperties
            }
            className="passport stack-card reveal relative isolate min-w-0 overflow-hidden rounded-md border border-rule bg-paper shadow-float"
          >
            {e.points.length === 0 ? (
              <div className="flex items-start gap-4 p-5 sm:gap-5 sm:p-6">
                <Head e={e} />
              </div>
            ) : (
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start gap-4 rounded-md p-5 focus-visible:outline-none focus-visible:shadow-focus sm:gap-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <Head e={e} />
                  <span className="grid size-10 shrink-0 place-items-center self-center rounded-full border border-rule text-ink-2 transition-[rotate,border-color,color] duration-200 ease-out group-hover:border-accent group-hover:text-accent group-open:rotate-180">
                    <ChevronDown aria-hidden="true" strokeWidth={1.75} className="size-4" />
                  </span>
                </summary>
                {/* Lined up under the role, past the logo */}
                <div className="grid min-w-0 gap-5 border-t border-rule px-5 pt-5 pb-6 sm:px-6 sm:pl-[calc(1.5rem+4rem+1.25rem)]">
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
      <div className="grid gap-16 lg:gap-24">
        <Roles title="Professional experience" entries={entries.filter((e) => e.kind === 'professional')} />
        <Roles title="Volunteer experience" entries={entries.filter((e) => e.kind === 'volunteer')} />
      </div>
    </Section>
  );
}
