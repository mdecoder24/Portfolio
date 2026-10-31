import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  Briefcase,
  Cloud,
  Code2,
  Database,
  LifeBuoy,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Certification } from '@/content/schema';

const ICONS = {
  cloud: Cloud,
  support: LifeBuoy,
  frontend: Code2,
  backend: Server,
  ai: Sparkles,
  security: ShieldCheck,
  code: Terminal,
  business: Briefcase,
  database: Database,
  award: Award,
} as const;

function CertCard({ cert }: { cert: Certification }) {
  const Icon = ICONS[cert.icon];
  return (
    <a
      href={cert.href}
      target="_blank"
      rel="noopener noreferrer"
      className="cert-card group relative isolate grid h-full gap-6 overflow-hidden rounded-md border border-rule bg-paper-veil p-6 shadow-float backdrop-blur-md focus-visible:outline-none focus-visible:shadow-focus sm:p-7"
    >
      <SampleRibbon placeholder={cert.placeholder} />
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
          {cert.provider ? `${cert.provider}, ` : ''}
          {cert.issuer}
        </span>
        <span className="type-h4 text-ink">{cert.title}</span>
        <span className="type-small text-ink-2">{cert.subtitle}</span>
      </span>
      <span className="mt-auto flex items-center gap-1.5 border-t border-dashed border-rule-strong pt-4 type-ui text-ink-2 transition-colors duration-150 group-hover:text-ink">
        View certificate
        <ArrowUpRight
          className="size-4 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span className="sr-only">: {cert.title}, in a new tab</span>
      </span>
    </a>
  );
}

/**
 * The certificates beyond the main grid: a button under it opens a panel with the remaining cards, two to a row.
 * Built on the popover attribute like the MoreProjects panel, so it opens, closes on Escape or an outside click,
 * and works without JavaScript.
 */
function MoreCertifications({ certs }: { certs: Certification[] }) {
  if (certs.length === 0) return null;
  return (
    <div className="reveal flex justify-center">
      <button type="button" popoverTarget="more-certifications" className={buttonClasses({ variant: 'secondary' })}>
        View more certifications
        <span className="grid min-w-6 place-items-center rounded-pill bg-plate px-1.5 type-code text-ink-2">
          {certs.length}
        </span>
      </button>
      <div
        id="more-certifications"
        popover="auto"
        role="dialog"
        aria-labelledby="more-certifications-title"
        className="more-panel m-auto max-h-[88dvh] w-[min(72rem,calc(100%-2rem))] overflow-y-auto overscroll-contain rounded-lg border border-rule-strong bg-paper text-ink shadow-float backdrop:bg-paper-veil"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-rule bg-paper px-6 py-4 sm:px-10">
          <div className="grid gap-0.5">
            <p className="type-code text-ink-2">
              {certs.length} more {certs.length === 1 ? 'certification' : 'certifications'}
            </p>
            <h3 id="more-certifications-title" className="type-h3 text-ink">
              More certifications
            </h3>
          </div>
          <button
            type="button"
            popoverTarget="more-certifications"
            popoverTargetAction="hide"
            aria-label="Close"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-rule hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <ul className="grid gap-4 p-6 sm:grid-cols-2 sm:p-10">
          {certs.map((c) => (
            <li key={c.href}>
              <CertCard cert={c} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

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
  const featured = certifications.filter((c) => c.featured);
  const more = certifications.filter((c) => !c.featured);
  return (
    <Section id="certifications" index={index} label="Certifications" title="Certifications">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="grid gap-10 lg:col-span-9 lg:col-start-4">
          <ul className="grid gap-4 sm:grid-cols-2">
            {featured.map((c, i) => (
              <li
                key={c.href}
                className="reveal"
                style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties}
              >
                <CertCard cert={c} />
              </li>
            ))}
          </ul>
          <MoreCertifications certs={more} />
        </div>
      </div>
    </Section>
  );
}
