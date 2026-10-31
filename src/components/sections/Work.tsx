import { ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { Button, buttonClasses } from '@/components/ui/Button';
import { CountUp } from '@/components/ui/CountUp';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import { caseStudyHref } from '@/content';
import type { CaseStudy } from '@/content/schema';
import { cn } from '@/lib/cn';
import { DeviceStage } from './DeviceStage';
import { ProjectReadme } from './ProjectReadme';
import { BRAND_PATHS } from './stack-logos';

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
      <path d={BRAND_PATHS.GitHub} />
    </svg>
  );
}

/** One way out of a project card; until its link is added to the content it shows, unavailable, in the same place */
function ProjectLink({
  href,
  label,
  title,
  icon,
  variant,
}: {
  href?: string;
  label: string;
  title: string;
  icon?: ReactNode;
  variant: 'primary' | 'secondary';
}) {
  if (!href)
    return (
      <Button variant={variant} icon={icon} disabled aria-disabled="true">
        {label}
        <span className="sr-only">: link coming soon</span>
      </Button>
    );
  return (
    <Button href={href} variant={variant} icon={icon} target="_blank" rel="noopener noreferrer">
      {label}
      <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only">: {title}</span>
    </Button>
  );
}

/** Everything about a project except its picture: shared by the large client rows and the compact personal cards */
function Details({ study, n, compact = false }: { study: CaseStudy; n: number; compact?: boolean }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 type-code text-ink-2">
        <span className="text-ink">{String(n).padStart(2, '0')}</span>
        <span aria-hidden="true" className="h-px w-6 bg-rule-strong max-sm:hidden" />
        <span className="max-sm:basis-full">{study.context}</span>
      </div>
      <SampleRibbon placeholder={study.placeholder} />
      <h4 className="type-h3 text-ink">
        {/* The title opens the write-up, now that the buttons lead out to the code and the live site */}
        <Link
          href={caseStudyHref(study)}
          className="rounded-xs underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline-none focus-visible:shadow-focus"
        >
          {study.title}
        </Link>
      </h4>
      <p className="max-w-[48ch] type-body text-ink-2">
        <span className="text-ink">
          <CountUp text={study.outcome} />
        </span>{' '}
        {!compact && study.body.built}
      </p>
      <p className="type-code text-ink-2">{study.stack.join(', ')}</p>
      <div className="flex flex-wrap gap-3 pt-1">
        <ProjectLink
          href={study.links.find((l) => l.label === 'GitHub')?.href}
          label="GitHub"
          title={study.title}
          icon={<GitHubMark />}
          variant="primary"
        />
        <ProjectLink
          href={study.links.find((l) => l.label === 'Live')?.href}
          label="Live site"
          title={study.title}
          variant="secondary"
        />
        <ProjectReadme study={study} />
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

/**
 * A personal project: picture on top, a shorter write-up below; two to a row so the section ends sooner. In the
 * more-projects panel it skips the scroll reveal, since the panel's own entrance already brings it in.
 */
function Card({
  study,
  n,
  column,
  inPanel = false,
}: {
  study: CaseStudy;
  n: number;
  column: number;
  inPanel?: boolean;
}) {
  return (
    <article
      className={cn('grid content-start gap-5', !inPanel && 'reveal')}
      style={{ '--reveal-delay': `${column * 80}ms` } as CSSProperties}
    >
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

/**
 * The projects beyond the main grid: a button under it opens a panel with the same cards, two to a row. Built on the
 * popover attribute like the README panel, so it opens, closes on Escape or an outside click, and works without
 * JavaScript; a card's own README opens on top of it. New projects only need featured: false in their content file.
 */
function MoreProjects({ studies, offset }: { studies: CaseStudy[]; offset: number }) {
  if (studies.length === 0) return null;
  return (
    <div className="reveal flex justify-center">
      <button type="button" popoverTarget="more-projects" className={buttonClasses({ variant: 'secondary' })}>
        View more projects
        <span className="grid min-w-6 place-items-center rounded-pill bg-plate px-1.5 type-code text-ink-2">
          {studies.length}
        </span>
      </button>
      <div
        id="more-projects"
        popover="auto"
        role="dialog"
        aria-labelledby="more-projects-title"
        className="more-panel m-auto max-h-[88dvh] w-[min(72rem,calc(100%-2rem))] overflow-y-auto overscroll-contain rounded-lg border border-rule-strong bg-paper text-ink shadow-float backdrop:bg-paper-veil"
      >
        {/* The heading and close button stay in reach while the cards scroll beneath them */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-rule bg-paper px-6 py-4 sm:px-10">
          <div className="grid gap-0.5">
            <p className="type-code text-ink-2">
              {studies.length} more {studies.length === 1 ? 'project' : 'projects'}
            </p>
            <h3 id="more-projects-title" className="type-h3 text-ink">
              More things I&rsquo;ve built
            </h3>
          </div>
          <button
            type="button"
            popoverTarget="more-projects"
            popoverTargetAction="hide"
            aria-label="Close"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-rule hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-x-8 gap-y-16 p-6 sm:p-10 md:grid-cols-2">
          {studies.map((s, i) => (
            <Card key={s.slug} study={s} n={offset + i + 1} column={i % 2} inPanel />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Work({ index, projects }: { index: number; projects: CaseStudy[] }) {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);
  return (
    <Section
      id="work"
      index={index}
      label="My projects"
      title="Things I've built"
      intro="Each one opens into a short write-up."
    >
      <div className="grid gap-24 lg:gap-32">
        <Group title="My projects" studies={featured} offset={0} compact />
        <MoreProjects studies={more} offset={featured.length} />
      </div>
    </Section>
  );
}
