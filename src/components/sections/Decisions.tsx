import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import { caseStudyHref } from '@/content';
import type { CaseStudy } from '@/content/schema';
import { cn } from '@/lib/cn';
import { DecisionMap } from './DecisionMap';

/**
 * Case-study decisions pinned onto their covers. The project switcher is a set of radios that pick a panel with :has
 * in CSS, so it needs no JavaScript; the decision-deck rules live in globals.css.
 */
export function Decisions({ index, studies }: { index: number; studies: CaseStudy[] }) {
  // A half-pinned project would read as a mistake, so only fully pinned ones take part
  const pinned = studies.filter((s) => s.body.decisions.every((d) => d.at));
  if (pinned.length === 0) return null;
  return (
    <Section
      id="decisions"
      index={index}
      label="How I build"
      title="The calls behind each project"
      intro="Pinned to the part of the screen where each one shows."
    >
      <div className="decision-deck reveal grid gap-10">
        <fieldset className="-mx-(--gutter) min-w-0 overflow-x-auto px-(--gutter) lg:mx-0 lg:px-0">
          <legend className="sr-only">Project</legend>
          <div className="flex w-max gap-2">
            {pinned.map((s, i) => (
              <label key={s.slug} className="decision-pick">
                <input
                  type="radio"
                  name="decision-project"
                  value={s.slug}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    'inline-flex min-h-10 cursor-pointer items-center whitespace-nowrap rounded-control border-[1.5px] border-rule-strong px-4 type-small font-semibold text-ink',
                    'transition-[background-color,border-color,color,scale] duration-150 ease-(--ease-out-quint) hover:border-ink active:scale-[0.97]',
                    'peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:shadow-focus',
                  )}
                >
                  {s.title}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid">
          {pinned.map((s) => (
            <article key={s.slug} aria-label={s.title} className="decision-panel grid gap-6">
              <SampleRibbon placeholder={s.placeholder} />
              <DecisionMap study={s} />
              <div>
                <Button href={caseStudyHref(s)} variant="secondary">
                  Read the case study
                  <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only">: {s.title}</span>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
