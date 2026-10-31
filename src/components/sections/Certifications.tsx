import { ArrowUpRight, BadgeCheck, Cloud, Code2, LifeBuoy, Server } from 'lucide-react';
import type { CSSProperties } from 'react';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Certification } from '@/content/schema';

const ICONS = { cloud: Cloud, support: LifeBuoy, frontend: Code2, backend: Server } as const;

/**
 * The résumé's certificates as certificate cards, two to a row: a framed card with a mark for the subject, a seal that
 * stamps on as the card scrolls in, and the title. Each card opens the certificate itself in a new tab; on hover it
 * lifts a little and a sheen crosses it (see .cert-card in globals.css).
 */
export function Certifications({
  index,
  certifications,
}: {
  index: number;
  certifications: Certification[];
}) {
  return (
    <Section id="certifications" index={index} label="Certifications" title="Certifications">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-9 lg:col-start-4">
          {certifications.map((c, i) => {
            const Icon = ICONS[c.icon];
            return (
              <li
                key={c.href}
                className="reveal"
                style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties}
              >
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-card group relative isolate grid h-full gap-6 overflow-hidden rounded-md border border-rule bg-paper-veil p-6 shadow-float backdrop-blur-md focus-visible:outline-none focus-visible:shadow-focus sm:p-7"
                >
                  <SampleRibbon placeholder={c.placeholder} />
                  <span className="flex items-start justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-sm border border-rule bg-plate text-accent">
                      <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {/* The seal repeats that the certificate is real, so it's decoration */}
                    <span
                      aria-hidden="true"
                      className="cert-seal grid size-12 place-items-center rounded-full border border-accent text-accent"
                    >
                      <BadgeCheck className="size-6" strokeWidth={1.75} />
                    </span>
                  </span>
                  <span className="grid gap-1.5">
                    <span className="type-code text-ink-2">
                      {c.provider ? `${c.provider}, ` : ''}
                      {c.issuer}
                    </span>
                    <span className="type-h4 text-ink">{c.title}</span>
                    <span className="type-small text-ink-2">Professional certificate</span>
                  </span>
                  <span className="mt-auto flex items-center gap-1.5 border-t border-dashed border-rule-strong pt-4 type-ui text-ink-2 transition-colors duration-150 group-hover:text-ink">
                    View certificate
                    <ArrowUpRight
                      className="size-4 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span className="sr-only">: {c.title}, in a new tab</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
