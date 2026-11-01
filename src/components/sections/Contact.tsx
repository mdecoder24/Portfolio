import { ArrowUpRight, Mail } from 'lucide-react';
import { SmokeMount } from '@/components/layout/SmokeMount';
import { Button } from '@/components/ui/Button';
import type { Config, Profile } from '@/content/schema';
import { CopyEmail, LocalTime } from './ContactAside';

export function Contact({
  index,
  config,
  profile,
  projectHref,
}: {
  index: number;
  config: Config;
  profile: Profile;
  projectHref?: string;
}) {
  const { links, availability } = config;
  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: 'Email',
      value: (
        <span className="flex flex-wrap items-center gap-x-4">
          <a href={`mailto:${links.email}`} className="hover:underline">
            {links.email}
          </a>
          <CopyEmail email={links.email} />
        </span>
      ),
    },
    { label: 'Based in', value: `${profile.location.city}, ${profile.location.region}, ${profile.location.country}` },
    { label: 'Local time', value: <LocalTime city={profile.location.city} timeZone={profile.location.timeZone} /> },
    {
      label: 'Elsewhere',
      value: (
        <span className="flex gap-3">
          {[
            ['LinkedIn', links.linkedin],
            ['GitHub', links.github],
          ].map(([name, href]) => (
            <a
              key={name}
              href={href}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-control border border-rule-strong px-4 type-small text-ink transition-[border-color,background-color] duration-150 hover:border-ink-2 hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus"
            >
              {name}
              <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            </a>
          ))}
        </span>
      ),
    },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-rule">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_30%,var(--tint),var(--paper)_75%)]">
        <SmokeMount />
      </div>
      <div className="container-kit grid gap-12 py-(--section-pad) sm:gap-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Matches the section name in SectionHeader: heading-sized, in the accent, level with the title */}
          <p className="reveal flex items-baseline gap-3 type-h4 text-ink lg:col-span-3">
            <span data-section-number className="font-mono text-accent tabular-nums">
              {String(index).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="h-px w-6 translate-y-[-0.3em] bg-accent" />
            Contact
          </p>
          <div className="grid content-start gap-7 lg:col-span-9">
            <span className="reveal inline-flex w-fit items-center gap-2 type-code text-ink">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60 calm:animate-none" />
                <span className="relative size-2 rounded-full bg-ok" />
              </span>
              {availability.freelance === 'booked' ? 'Booked for now' : 'Available for work'}
            </span>
            <h2 id="contact-title" className="reveal max-w-[14ch] type-h1 text-ink">
              Let&apos;s build something good.
            </h2>
            <p className="reveal max-w-[48ch] type-lead text-ink-2 [--reveal-delay:120ms]">
              Open for freelance work, full-time roles and collaborations. Tell me about a role, a project, or an idea. I
              reply {availability.replyTime}.
            </p>
            <div className="reveal flex flex-wrap gap-3 [--reveal-delay:180ms]">
              <Button href={`mailto:${links.email}`}>
                Send an email
                <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Button>
              {projectHref && (
                <Button href={projectHref} variant="secondary" className="bg-paper-veil">
                  Start a project
                  <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <dl className="reveal self-start overflow-hidden rounded-md border border-rule bg-paper-veil backdrop-blur-md lg:col-span-9 lg:col-start-4">
            {rows.map((r) => (
              <div key={r.label} className="grid gap-1.5 border-b border-rule px-6 py-5 last:border-b-0">
                <dt className="type-code text-ink-2">{r.label}</dt>
                <dd className="type-body text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
