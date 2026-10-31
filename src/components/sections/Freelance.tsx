import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CountUp } from '@/components/ui/CountUp';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import { TravelGlobe } from './TravelGlobe';
import type { Config, Freelance as FreelanceContent } from '@/content/schema';

/** A bio paragraph with its ==marked== phrases as highlights; each knows its place, so they sweep in one by one */
function Marked({ text, from }: { text: string; from: number }) {
  return text.split(/==(.+?)==/).map((part, i) =>
    i % 2 === 0 ? (
      part
    ) : (
      <mark key={i} className="highlight text-ink" style={{ '--m': from + (i - 1) / 2 } as CSSProperties}>
        {part}
      </mark>
    ),
  );
}

const AVAILABILITY: Record<Config['availability']['freelance'], string> = {
  available: 'Taking on projects',
  limited: 'Limited availability',
  booked: 'Booked for now',
};

/** Client work, kept apart from the personal projects above it: a short bio, then one row per job. */
export function Freelance({
  index,
  freelance,
  config,
}: {
  index: number;
  freelance: FreelanceContent;
  config: Config;
}) {
  const { availability } = config;
  return (
    <Section
      id="freelance"
      index={index}
      label="Freelance"
      title="Freelance and client work"
      aside={
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={availability.freelance}>
            {availability.freelanceLabel ?? AVAILABILITY[availability.freelance]}
          </Badge>
          <span className="type-small text-ink-2">Replies {availability.replyTime}</span>
        </div>
      }
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* In the empty rail under the section label on wide screens; above the letter on narrow ones */}
        <div className="reveal grid justify-items-center gap-4 lg:sticky lg:top-32 lg:col-span-3 lg:row-start-1 lg:self-start lg:justify-items-start">
          <TravelGlobe />
          <p aria-hidden="true" className="type-code text-ink-2">
            Clients in 5 countries
          </p>
        </div>
        <div className="grid content-start gap-10 lg:col-span-9 lg:col-start-4 lg:row-start-1">
          {/* The bio on a card like the contact form's, then the numbers as boarding passes (see .ticket in globals.css) */}
          <div className="grid gap-4">
            <div className="letter reveal relative grid gap-4 overflow-hidden rounded-md border border-rule bg-paper-veil p-6 pt-8 shadow-float backdrop-blur-md sm:p-8 sm:pt-10 sm:pr-40">
              {/* A postmark from where the letters are sent; decoration, like the ticket stamps */}
              <span
                aria-hidden="true"
                className="postmark absolute top-8 right-8 grid size-24 place-content-center rounded-full border-[1.5px] border-accent text-center type-code text-accent max-sm:hidden"
              >
                <span className="border-y border-accent px-1 py-0.5">Hyderabad</span>
                <span className="mt-1">Since 2023</span>
              </span>
              <SampleRibbon placeholder={freelance.placeholder} />
              {freelance.bio.map((p, i) => (
                <p
                  key={p}
                  className="reveal max-w-(--measure) type-lead text-ink-2"
                  style={{ '--reveal-delay': `${300 + i * 160}ms` } as CSSProperties}
                >
                  <Marked
                    text={p}
                    from={freelance.bio
                      .slice(0, i)
                      .reduce((n, t) => n + (t.match(/==(.+?)==/g)?.length ?? 0), 0)}
                  />
                </p>
              ))}
            </div>
            {freelance.stats.length > 0 && (
              <ul className="grid gap-4 lg:grid-cols-3">
                {freelance.stats.map((s, i) => (
                  <li
                    key={s.label}
                    className="ticket reveal grid grid-cols-[minmax(0,1fr)_auto] rounded-md border border-rule bg-paper-veil shadow-float backdrop-blur-md"
                    // Printed one after another, after the bio card
                    style={{ '--reveal-delay': `${160 + i * 220}ms` } as CSSProperties}
                  >
                    <div className="grid content-start gap-2 p-6">
                      <span className="type-h2 text-ink">
                        <CountUp text={s.value} delay={500 + i * 220} />
                      </span>
                      <span className="type-ui text-ink">{s.label}</span>
                      {s.detail && <span className="type-small text-ink-2">{s.detail}</span>}
                    </div>
                    {s.stamps.length > 0 && (
                      <div
                        aria-hidden="true"
                        className="ticket-stub relative grid place-content-center gap-2 border-l border-dashed border-rule-strong px-4 py-6 data-[many=true]:grid-cols-2"
                        data-many={s.stamps.length > 2}
                      >
                        {s.stamps.map((t, j) => (
                          <span
                            key={t}
                            className="stamp rounded-xs border-[1.5px] border-accent px-1.5 py-0.5 text-center type-code whitespace-nowrap text-accent"
                            // A slightly different angle per stamp, as if pressed by hand
                            style={{ '--s': j, '--r': `${[-8, 5, -3, 7, -5][j % 5]}deg` } as CSSProperties}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {freelance.cta && (
              <div className="reveal flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-md border border-rule bg-paper-veil p-6 backdrop-blur-md sm:p-8">
                <p className="max-w-[44ch] type-lead text-ink">{freelance.cta.text}</p>
                <Button href={freelance.cta.href} target="_blank" rel="noopener noreferrer">
                  {freelance.cta.label}
                  <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only">: at Krudex Technologies, in a new tab</span>
                </Button>
              </div>
            )}
          </div>

          {freelance.work.length > 0 && (
            <ul className="border-t border-rule" aria-label="Client work">
              {freelance.work.map((w, i) => (
                <li
                  key={w.title}
                  className="reveal grid gap-2 border-b border-rule py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6"
                  style={{ '--reveal-delay': `${i * 60}ms` } as CSSProperties}
                >
                  {/* An undated entry keeps its empty column so the titles stay aligned */}
                  {w.year ? (
                    <time dateTime={w.year} className="type-code text-ink-2">
                      {w.year}
                    </time>
                  ) : (
                    <span aria-hidden="true" className="max-sm:hidden" />
                  )}
                  <div className="grid gap-2">
                    <SampleRibbon placeholder={w.placeholder} />
                    <h3 className="type-h4 text-ink">
                      {w.href ? (
                        <a
                          href={w.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xs underline decoration-rule-strong underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline-none focus-visible:shadow-focus"
                        >
                          {w.title}
                          <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                        </a>
                      ) : (
                        w.title
                      )}
                      {w.client && <span className="font-normal text-ink-2">, {w.client}</span>}
                    </h3>
                    <p className="max-w-(--measure) type-body text-ink-2">{w.summary}</p>
                    {w.stack.length > 0 && <p className="type-code text-ink-2">{w.stack.join(', ')}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
