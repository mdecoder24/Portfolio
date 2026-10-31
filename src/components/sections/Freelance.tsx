import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Badge } from '@/components/ui/Badge';
import { CountUp } from '@/components/ui/CountUp';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Config, Freelance as FreelanceContent } from '@/content/schema';

const AVAILABILITY: Record<Config['availability']['freelance'], string> = {
  available: 'Taking on projects',
  limited: 'Limited availability',
  booked: 'Booked for now',
};

/** Client work, kept apart from the personal projects above it: a short bio, then one row per job. */
export function Freelance({ index, freelance, config }: { index: number; freelance: FreelanceContent; config: Config }) {
  const { availability } = config;
  return (
    <Section
      id="freelance"
      index={index}
      label="Freelance"
      title="Freelance and client work"
      aside={
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={availability.freelance}>{availability.freelanceLabel ?? AVAILABILITY[availability.freelance]}</Badge>
          <span className="type-small text-ink-2">Replies {availability.replyTime}</span>
        </div>
      }
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="grid content-start gap-10 lg:col-span-9 lg:col-start-4">
          {/* The bio on a card like the contact form's, then the numbers as boarding passes (see .ticket in globals.css) */}
          <div className="grid gap-4">
            <div className="reveal grid gap-4 rounded-md border border-rule bg-paper-veil p-6 shadow-float backdrop-blur-md sm:p-8">
              <SampleRibbon placeholder={freelance.placeholder} />
              {freelance.bio.map((p) => (
                <p key={p} className="max-w-(--measure) type-lead text-ink-2">
                  {p}
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
                            style={{ '--s': j, '--r': `${[-8, 5, -3, 7][j % 4]}deg` } as CSSProperties}
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
