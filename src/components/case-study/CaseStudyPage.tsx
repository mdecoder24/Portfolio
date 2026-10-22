import Image from 'next/image';
import Link from 'next/link';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { buttonClasses } from '@/components/ui/Button';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { caseStudyHref, testimonials } from '@/content';
import type { CaseStudy } from '@/content/schema';
import { formatRange } from '@/lib/format';
import { caseStudyLd, jsonLd } from '@/lib/seo';

export function CaseStudyPage({ study, list }: { study: CaseStudy; list: CaseStudy[] }) {
  const i = list.findIndex((s) => s.slug === study.slug);
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  const section = study.kind === 'freelance' ? { label: 'Freelance', hash: 'freelance' } : { label: 'Projects', hash: 'projects' };
  const quote = testimonials.find((t) => t.id === study.testimonialId);
  const facts = [
    ['Role', study.role],
    ['Timeline', formatRange(study.start, study.end)],
    ['Team', study.team],
    ['Stack', study.stack.join(', ')],
  ] as const;
  const h2 = 'type-h3 text-pearl';

  return (
    <SiteChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(caseStudyLd(study)) }} />
      <article className="container-nacre grid gap-12 py-(--section-pad)">
        <header className="grid gap-6 lg:mx-[calc(2/12*100%)]">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap gap-2 type-small text-mist">
              <li>
                <Link href={`/#${section.hash}`} className="rounded-xs underline underline-offset-4 hover:text-pearl">
                  {section.label}
                </Link>
                <span aria-hidden="true"> /</span>
              </li>
              <li aria-current="page">{study.title}</li>
            </ol>
          </nav>
          <SampleRibbon placeholder={study.placeholder} />
          <p className="type-small text-mist">{study.context}</p>
          <h1 className="type-h1 text-pearl">{study.title}</h1>
          <p className="type-lead max-w-[60ch] text-pearl">{study.outcome}</p>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k} className="grid gap-0.5">
                <dt className="type-small text-mist">{k}</dt>
                <dd className="type-body tabular text-pearl">{v}</dd>
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

        <div className="overflow-hidden rounded-sm bg-shoal">
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
                <li key={d.title} className="grid gap-1 border-t border-line pt-4">
                  <h3 className="type-h4 text-pearl">{d.title}</h3>
                  <p className="type-body text-mist">{d.detail}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="grid gap-4">
            <h2 className={h2}>Results</h2>
            <ul className="grid list-disc gap-1.5 pl-5 type-body marker:text-rose">
              {study.body.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
          {quote && (
            <figure className="grid gap-3">
              <blockquote className="type-lead max-w-[56ch] font-medium text-pearl">
                <p>&ldquo;{quote.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="type-small text-mist">
                {quote.name && <span className="font-semibold text-pearl">{quote.name}, </span>}
                {quote.role}
              </figcaption>
            </figure>
          )}
          <section className="grid gap-4">
            <h2 className={h2}>What I&apos;d do differently</h2>
            <p className="type-body">{study.body.differently}</p>
          </section>

          <nav aria-label="More case studies" className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            <Link href={caseStudyHref(prev)} className="group grid gap-1 rounded-md p-4 -m-4 hover:bg-reef focus-visible:outline-none focus-visible:shadow-focus">
              <span className="type-small text-mist">Previous</span>
              <span className="type-h4 text-pearl">{prev.title}</span>
            </Link>
            <Link href={caseStudyHref(next)} className="group grid gap-1 rounded-md p-4 -m-4 hover:bg-reef focus-visible:outline-none focus-visible:shadow-focus sm:text-right">
              <span className="type-small text-mist">Next</span>
              <span className="type-h4 text-pearl">{next.title}</span>
            </Link>
          </nav>
        </div>
      </article>
    </SiteChrome>
  );
}
