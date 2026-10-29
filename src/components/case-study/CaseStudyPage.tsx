import Image from 'next/image';
import Link from 'next/link';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { buttonClasses } from '@/components/ui/Button';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { caseStudyHref } from '@/content';
import type { CaseStudy } from '@/content/schema';
import { formatRange } from '@/lib/format';
import { caseStudyLd, jsonLd } from '@/lib/seo';

export function CaseStudyPage({ study, list }: { study: CaseStudy; list: CaseStudy[] }) {
  const i = list.findIndex((s) => s.slug === study.slug);
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  const section = { label: 'Projects', hash: 'work' };
  const facts = [
    ['Role', study.role],
    ...(study.start ? [['Timeline', formatRange(study.start, study.end)] as const] : []),
    ...(study.team ? [['Team', study.team] as const] : []),
    ['Stack', study.stack.join(', ')],
  ] as const;
  const h2 = 'type-h3 text-ink';

  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(caseStudyLd(study)) }} />
      <article className="container-kit grid gap-12 py-(--section-pad)">
        <header className="grid gap-6 lg:mx-[calc(2/12*100%)]">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap gap-2 type-small text-ink-2">
              <li>
                <Link href={`/#${section.hash}`} className="rounded-xs underline underline-offset-4 hover:text-ink">
                  {section.label}
                </Link>
                <span aria-hidden="true"> /</span>
              </li>
              <li aria-current="page">{study.title}</li>
            </ol>
          </nav>
          <SampleRibbon placeholder={study.placeholder} />
          <p className="type-code text-ink-2">{study.context}</p>
          <h1 className="type-h1 text-ink">{study.title}</h1>
          <p className="type-lead max-w-[60ch] text-ink-2">{study.outcome}</p>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k} className="grid content-start gap-0.5 border-t border-rule pt-3">
                <dt className="type-code text-ink-2">{k}</dt>
                <dd className="type-body tabular text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          {study.links.length > 0 && (
            <ul className="-ml-2 flex flex-wrap gap-x-4">
              {study.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={buttonClasses({ variant: 'quiet' })}>
                    {l.label === 'Live' ? 'Live site' : l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="overflow-hidden rounded-md border border-rule bg-plate">
          <Image
            src={study.media.src}
            alt={study.media.alt}
            width={1600}
            height={1000}
            sizes="(min-width: 1296px) 1200px, 100vw"
            priority
            unoptimized={study.media.src.endsWith('.svg')}
            className="aspect-[16/10] h-auto w-full"
          />
        </div>

        <div className="grid gap-12 lg:mx-[calc(2/12*100%)] [&_p]:max-w-(--measure)">
          <section className="grid gap-4">
            <h2 className={h2}>The problem</h2>
            <p className="type-body">{study.body.problem}</p>
          </section>
          <section className="grid gap-4">
            <h2 className={h2}>What I built</h2>
            <p className="type-body">{study.body.built}</p>
          </section>
          <section className="grid gap-4">
            <h2 className={h2}>Key decisions</h2>
            <ul className="grid gap-6">
              {study.body.decisions.map((d) => (
                <li key={d.title} className="grid gap-1 border-t border-rule pt-4">
                  <h3 className="type-h4 text-ink">{d.title}</h3>
                  <p className="type-body text-ink-2">{d.detail}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="grid gap-4">
            <h2 className={h2}>Results</h2>
            <ul className="grid list-disc gap-1.5 pl-5 type-body marker:text-accent">
              {study.body.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
          {study.body.differently && (
            <section className="grid gap-4">
              <h2 className={h2}>What I&apos;d do differently</h2>
              <p className="type-body">{study.body.differently}</p>
            </section>
          )}

          <nav aria-label="More case studies" className="grid gap-4 border-t border-rule pt-8 sm:grid-cols-2">
            <Link href={caseStudyHref(prev)} className="group grid gap-1 rounded-sm p-4 -m-4 hover:bg-plate focus-visible:outline-none focus-visible:shadow-focus">
              <span className="type-small text-ink-2">Previous</span>
              <span className="type-h4 text-ink">{prev.title}</span>
            </Link>
            <Link href={caseStudyHref(next)} className="group grid gap-1 rounded-sm p-4 -m-4 hover:bg-plate focus-visible:outline-none focus-visible:shadow-focus sm:text-right">
              <span className="type-small text-ink-2">Next</span>
              <span className="type-h4 text-ink">{next.title}</span>
            </Link>
          </nav>
        </div>
      </article>
    </SiteChrome>
  );
}
