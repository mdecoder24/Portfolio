import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/Button';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import { caseStudyHref, testimonials } from '@/content';
import type { CaseStudy } from '@/content/schema';
import { cn } from '@/lib/cn';
import { DeviceStage } from './DeviceStage';

/** Everything about a project except its picture: shared by the large client rows and the compact personal cards */
function Details({ study, n, compact = false }: { study: CaseStudy; n: number; compact?: boolean }) {
  const quote = testimonials.find((t) => t.id === study.testimonialId);
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 type-code text-ink-2">
        <span className="text-ink">{String(n).padStart(2, '0')}</span>
        <span aria-hidden="true" className="h-px w-6 bg-rule-strong max-sm:hidden" />
        <span className="max-sm:basis-full">{study.context}</span>
      </div>
      <SampleRibbon placeholder={study.placeholder} />
      <h4 className="type-h3 text-ink">{study.title}</h4>
      <p className="max-w-[48ch] type-body text-ink-2">
        <span className="text-ink">{study.outcome}</span> {!compact && study.body.built}
      </p>
      {quote && (
        <figure className="grid max-w-[48ch] gap-1 border-l border-rule-strong pl-4 type-small">
          <blockquote className="text-ink">&ldquo;{quote.quote}&rdquo;</blockquote>
          <figcaption className="text-ink-2">{quote.role}</figcaption>
        </figure>
      )}
      <p className="type-code text-ink-2">{study.stack.join(', ')}</p>
      <div className="flex flex-wrap gap-3 pt-1">
        <Button href={caseStudyHref(study)}>
          Read the case study
          <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="sr-only">: {study.title}</span>
        </Button>
        {study.links.map((l) => (
          <Button key={l.href} href={l.href} variant="secondary">
            {l.label === 'Live' ? 'Live site' : l.label}
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Button>
        ))}
      </div>
    </>
  );
}

function Row({ study, n, flip }: { study: CaseStudy; n: number; flip: boolean }) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
      <div className={cn('reveal lg:col-span-7', flip && 'lg:order-2 lg:col-start-6')}>
        <DeviceStage study={study} />
      </div>
      <div
        className={cn(
          'reveal grid content-center gap-5 lg:col-span-5 lg:pl-6 [--reveal-delay:120ms]',
          flip && 'lg:order-1 lg:pl-0 lg:pr-6',
        )}
      >
        <Details study={study} n={n} />
      </div>
    </article>
  );
}

/** A personal project: picture on top, a shorter write-up below; two to a row so the section ends sooner */
function Card({ study, n, column }: { study: CaseStudy; n: number; column: number }) {
  return (
    <article className="reveal grid content-start gap-5" style={{ '--reveal-delay': `${column * 80}ms` } as CSSProperties}>
      <DeviceStage study={study} />
      <div className="grid content-start gap-4">
        <Details study={study} n={n} compact />
      </div>
    </article>
  );
}

function Group({
  title,
  studies,
  offset,
  compact = false,
}: {
  title: string;
  studies: CaseStudy[];
  offset: number;
  compact?: boolean;
}) {
  if (studies.length === 0) return null;
  return (
    <div className="grid gap-12">
      <h3 className="reveal flex items-baseline justify-between gap-4 border-b border-rule pb-4 type-h4 text-ink">
        {title}
        <span className="type-code text-ink-2">{studies.length} projects</span>
      </h3>
      {compact ? (
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-y-20">
          {studies.map((s, i) => (
            <Card key={s.slug} study={s} n={offset + i + 1} column={i % 2} />
          ))}
        </div>
      ) : (
        <div className="grid gap-20 lg:gap-28">
          {studies.map((s, i) => (
            <Row key={s.slug} study={s} n={offset + i + 1} flip={i % 2 === 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Work({ index, freelance, projects }: { index: number; freelance: CaseStudy[]; projects: CaseStudy[] }) {
  return (
    <Section
      id="work"
      index={index}
      label="Selected work"
      title="Things I've shipped"
      intro="Client projects first, then the personal and academic work where I try new ideas. Each one has a write-up of the problem, the decisions and the results."
    >
      <div className="grid gap-24 lg:gap-32">
        <Group title="Client work" studies={freelance} offset={0} />
        <Group title="Personal and academic" studies={projects} offset={freelance.length} compact />
      </div>
    </Section>
  );
}
