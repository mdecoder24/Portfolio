import type { CSSProperties } from 'react';
import { CountUp } from '@/components/ui/CountUp';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Config, EducationItem } from '@/content/schema';

// The ring's radius in its 80-unit box, and the length of its outline, which the fill is dashed against
const R = 34;
const C = 2 * Math.PI * R;

/** A score as a ring filled to its share, with the number counting up inside; the label spells it out */
function Score({ score }: { score: NonNullable<EducationItem['score']> }) {
  const text = score.kind === 'percent' ? `${score.value}%` : String(score.value);
  const share = Math.min(1, score.value / score.outOf);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative grid size-20 shrink-0 place-items-center">
        <svg viewBox="0 0 80 80" aria-hidden="true" className="absolute inset-0 -rotate-90">
          <circle cx="40" cy="40" r={R} fill="none" strokeWidth="5" className="stroke-rule" />
          <circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            className="edu-ring stroke-accent"
            style={{ '--c': C.toFixed(2), '--to': (C * (1 - share)).toFixed(2) } as CSSProperties}
          />
        </svg>
        <span className="relative type-ui text-ink tabular-nums">
          <CountUp text={text} delay={400} />
        </span>
      </div>
      <span className="grid gap-0.5">
        <span className="type-ui text-ink">{score.kind === 'cgpa' ? 'CGPA' : 'Percentage'}</span>
        <span className="type-code text-ink-2">out of {score.outOf}</span>
      </span>
    </div>
  );
}

/**
 * Education as a path, newest first: a line runs through a dot for each stage and draws itself as the section scrolls
 * past (see .edu-path in globals.css). Each stage is a card that rises in after the one before, and its score ring
 * fills while the number counts up. Without JavaScript or under reduced motion, everything is simply drawn.
 */
export function Education({
  index,
  education,
  config,
}: {
  index: number;
  education: EducationItem[];
  config: Config;
}) {
  return (
    <Section id="education" index={index} label="Education" title="Education">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <ol className="edu-path relative grid gap-6 pl-8 lg:col-span-9 lg:col-start-4 lg:grid-cols-3 lg:gap-6 lg:pt-10 lg:pl-0">
          <span aria-hidden="true" className="edu-rail" />
          <span aria-hidden="true" className="edu-rail edu-rail-fill" />
          {education.map((e, i) => {
            const showScore = e.score && (e.score.kind !== 'cgpa' || config.flags.showCgpa);
            return (
              <li
                key={e.degree}
                className="edu-stage reveal relative"
                style={{ '--reveal-delay': `${i * 140}ms` } as CSSProperties}
              >
                <span aria-hidden="true" className="edu-dot" />
                <div className="flex h-full flex-col gap-5 rounded-md border border-rule bg-paper-veil p-6 shadow-float backdrop-blur-md transition-[border-color] duration-200 hover:border-rule-strong">
                  <SampleRibbon placeholder={e.placeholder} />
                  <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 type-code text-ink-2">
                    <span className="text-accent">{e.level}</span>
                    <span>
                      {e.start && (
                        <>
                          <time dateTime={String(e.start)}>{e.start}</time> –{' '}
                        </>
                      )}
                      <time dateTime={String(e.end)}>{e.end}</time>
                    </span>
                  </p>
                  <div className="grid gap-1">
                    <h3 className="type-h4 text-ink">{e.degree}</h3>
                    <p className="type-body text-ink-2">{e.institution}</p>
                  </div>
                  {e.coursework.length > 0 && (
                    <p className="max-w-(--measure) type-small text-ink-2">{e.coursework.join(', ')}</p>
                  )}
                  {e.finalProject && (
                    <a
                      href={e.finalProject.href}
                      className="w-fit rounded-xs type-ui text-ink underline decoration-rule-strong underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline-none focus-visible:shadow-focus"
                    >
                      {e.finalProject.label}
                    </a>
                  )}
                  {/* Pinned to the card's foot, so the scores line up across the row however long the titles run */}
                  {showScore && e.score && (
                    <div className="mt-auto border-t border-rule pt-5">
                      <Score score={e.score} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
