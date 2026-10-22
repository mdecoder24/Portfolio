import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Label, Section } from '@/components/ui/SectionHeader';
import { caseStudyHref, testimonials } from '@/content';
import type { CaseStudy } from '@/content/schema';
import { cn } from '@/lib/cn';
import { DeviceStage } from './DeviceStage';

/** "Clinic booking assistant" → "Clinic booking" + italic "assistant": the last word carries the serif accent. */
function Title({ text }: { text: string }) {
  const words = text.split(' ');
  if (words.length < 2) return <>{text}</>;
  return (
    <>
      {words.slice(0, -1).join(' ')} <span className="type-accent font-normal">{words.at(-1)}</span>
    </>
  );
}

function Row({ study, n, flip }: { study: CaseStudy; n: number; flip: boolean }) {
  const quote = testimonials.find((t) => t.id === study.testimonialId);
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className={cn('reveal lg:col-span-6', flip && 'lg:order-2')}>
        <DeviceStage study={study} />
      </div>
      <div className={cn('reveal grid content-center gap-5 lg:col-span-6 [--reveal-delay:120ms]', flip && 'lg:order-1')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="type-code text-ink">{String(n).padStart(2, '0')}</span>
          <SampleRibbon placeholder={study.placeholder} />
        </div>
        <h3 className="type-h3 text-ink">
          <Title text={study.title} />
        </h3>
        <p className="type-code text-ink-2">{study.context}</p>
        <p className="max-w-[54ch] type-body text-ink-2">
          <span className="text-ink">{study.outcome}</span> {study.body.built}
        </p>
        {quote && <p className="max-w-[54ch] type-small italic text-ink-2">&ldquo;{quote.quote}&rdquo; {quote.role}</p>}
        <p className="type-code text-ink-2">{study.stack.join('  ·  ')}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={caseStudyHref(study)}
            className="inline-flex min-h-11 items-center gap-2 rounded-control bg-cream px-5 type-ui text-on-cream transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:shadow-focus"
          >
            Read more
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">about {study.title}</span>
          </Link>
          {study.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="inline-flex min-h-11 items-center gap-2 rounded-control border border-rule-strong px-5 type-ui text-ink transition-colors duration-300 hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus"
            >
              {l.label === 'Live' ? 'Live site' : l.label}
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Work({ freelance, projects }: { freelance: CaseStudy[]; projects: CaseStudy[] }) {
  return (
    <Section id="work" label="Selected work" title="Projects">
      <div className="grid gap-10">
        <Label className="reveal">Client work</Label>
        <div className="grid gap-20 lg:gap-28">
          {freelance.map((s, i) => (
            <Row key={s.slug} study={s} n={i + 1} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
      <div className="grid gap-10 pt-8">
        <Label className="reveal">Personal and academic</Label>
        <div className="grid gap-20 lg:gap-28">
          {projects.map((s, i) => (
            <Row key={s.slug} study={s} n={freelance.length + i + 1} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </Section>
  );
}
