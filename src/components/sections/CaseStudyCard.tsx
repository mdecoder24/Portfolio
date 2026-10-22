import Image from 'next/image';
import Link from 'next/link';
import { TagList } from '@/components/ui/Badge';
import { buttonClasses } from '@/components/ui/Button';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { caseStudyHref } from '@/content';
import type { CaseStudy } from '@/content/schema';
import { cn } from '@/lib/cn';

export function CaseStudyCard({ study, flip = false, priority = false }: { study: CaseStudy; flip?: boolean; priority?: boolean }) {
  const href = caseStudyHref(study);
  return (
    <article
      className={cn(
        'relative grid items-center gap-8 rounded-md bg-reef p-6 inset-shadow-lustre transition-colors duration-150 hover:bg-shoal focus-within:shadow-focus max-sm:p-4',
        'md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]',
        flip && 'md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]',
      )}
    >
      <div className={cn('overflow-hidden rounded-sm bg-shoal', flip && 'md:order-2')}>
        <Image
          src={study.media.src}
          alt={study.media.alt}
          width={1600}
          height={1000}
          sizes="(min-width: 1200px) 680px, (min-width: 768px) 56vw, 100vw"
          className="aspect-[16/10] h-auto w-full"
          priority={priority}
          unoptimized={study.media.src.endsWith('.svg')}
        />
      </div>
      <div className="grid content-center gap-4">
        <SampleRibbon placeholder={study.placeholder} />
        <p className="type-small text-mist">{study.context}</p>
        <h3 className="type-h3 text-pearl">
          <Link
            href={href}
            className="rounded-xs after:absolute after:inset-0 after:rounded-md focus-visible:outline-none hover:underline hover:decoration-line-strong underline-offset-4"
          >
            {study.title}
          </Link>
        </h3>
        <p className="type-lead text-pearl">{study.outcome}</p>
        <TagList items={study.stack} />
        {study.links.length > 0 && (
          <ul className="relative z-[1] flex flex-wrap gap-x-4" aria-label={`${study.title} links`}>
            {study.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={buttonClasses({ variant: 'quiet' })}>
                  {l.label === 'Live' ? 'Live site' : l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
