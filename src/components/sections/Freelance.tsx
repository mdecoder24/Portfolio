import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Spotlight } from '@/components/layout/Spotlight';
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
          {/* The bio and the numbers sit on cards like the contact form's; a glow and a lit edge follow the mouse */}
          <div className="grid gap-4">
            <div className="spot-card reveal reveal-card grid gap-4 [--tilt:2deg] rounded-md border border-rule bg-paper-veil p-6 shadow-float backdrop-blur-md sm:p-8">
              <SampleRibbon placeholder={freelance.placeholder} />
              {freelance.bio.map((p) => (
                <p key={p} className="max-w-(--measure) type-lead text-ink-2">
                  {p}
                </p>
              ))}
            </div>
            {freelance.stats.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-3">
                {freelance.stats.map((s, i) => (
                  <li
                    key={s.label}
                    className="spot-card reveal reveal-card grid content-start gap-2 [--tilt:6deg] rounded-md border border-rule bg-paper-veil p-6 shadow-float backdrop-blur-md"
                    // One after another, behind the bio card
                    style={{ '--reveal-delay': `${120 + i * 80}ms` } as CSSProperties}
                  >
                    <span className="type-h2 text-ink">
                      <CountUp text={s.value} delay={200 + i * 80} />
                    </span>
                    <span className="type-ui text-ink">{s.label}</span>
                    {s.detail && <span className="type-small text-ink-2">{s.detail}</span>}
                  </li>
                ))}
              </ul>
            )}
            <Spotlight />
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
