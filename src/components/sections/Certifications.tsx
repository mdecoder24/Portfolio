import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Certification } from '@/content/schema';

/** The résumé's certificates, each opening the certificate itself in a new tab. */
export function Certifications({ index, certifications }: { index: number; certifications: Certification[] }) {
  return (
    <Section id="certifications" index={index} label="Certifications" title="Certifications">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <ul className="grid border-t border-rule sm:grid-cols-2 lg:col-span-9 lg:col-start-4">
          {certifications.map((c, i) => (
            <li
              key={c.href}
              className="reveal border-b border-rule"
              style={{ '--reveal-delay': `${i * 60}ms` } as CSSProperties}
            >
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-1 rounded-xs py-5 focus-visible:outline-none focus-visible:shadow-focus sm:pr-6"
              >
                <SampleRibbon placeholder={c.placeholder} />
                <span className="flex items-start justify-between gap-4 type-h4 text-ink">
                  <span className="underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 group-hover:decoration-ink">
                    {c.title}
                  </span>
                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0 text-ink-2 transition-colors duration-150 group-hover:text-ink"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <span className="type-small text-ink-2">
                  {c.issuer}
                  <span className="sr-only">, view the certificate</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
