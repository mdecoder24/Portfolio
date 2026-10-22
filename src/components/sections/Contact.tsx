import { ArrowUpRight, Mail } from 'lucide-react';
import { SmokeMount } from '@/components/layout/SmokeMount';
import { MetalTitle } from '@/components/ui/MetalTitle';
import { Label } from '@/components/ui/SectionHeader';
import type { Config, Profile } from '@/content/schema';
import { ContactForm } from './ContactForm';
import { CopyEmail, LocalTime } from './ContactAside';

export function Contact({ config, profile }: { config: Config; profile: Profile }) {
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
              className="inline-flex min-h-10 items-center gap-1.5 rounded-control border border-rule-strong px-4 type-small text-ink transition-colors duration-300 hover:bg-cream hover:text-on-cream"
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
      <div className="container-kit grid gap-16 py-(--section-pad)">
        <Label className="reveal">Contact</Label>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="grid content-start gap-7 lg:col-span-6">
            <span className="reveal inline-flex w-fit items-center gap-2 rounded-control border border-rule-strong bg-paper-veil px-3.5 py-1.5 type-code text-ink">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60 calm:animate-none" />
                <span className="relative size-2 rounded-full bg-ok" />
              </span>
              {availability.freelance === 'booked' ? 'Booked for now' : 'Available for work'}
            </span>
            <MetalTitle id="contact-title" text="Get in touch" className="type-display" />
            <p className="reveal max-w-[44ch] type-lead text-ink-2 [--reveal-delay:160ms]">
              Open for freelance work, full-time roles and collaborations. Tell me about a role, a project, or an idea. I
              reply {availability.replyTime}.
            </p>
            <div className="reveal flex flex-wrap gap-3 [--reveal-delay:220ms]">
              <a
                href={`mailto:${links.email}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-control bg-cream px-6 type-ui text-on-cream transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:shadow-focus"
              >
                Send an email
                <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </a>
              <a
                href="#contact-form"
                data-topic="freelance"
                className="inline-flex min-h-12 items-center gap-2 rounded-control border border-rule-strong bg-paper-veil px-6 type-ui text-ink transition-colors duration-300 hover:bg-plate-hover focus-visible:outline-none focus-visible:shadow-focus"
              >
                Start a project
                <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
          </div>
          <dl className="reveal overflow-hidden rounded-lg border border-rule bg-paper-veil backdrop-blur-md lg:col-span-6 [--reveal-delay:160ms]">
            {rows.map((r) => (
              <div key={r.label} className="grid gap-2 border-b border-rule px-6 py-5 last:border-b-0 sm:px-8">
                <dt className="type-code text-ink-2">{r.label}</dt>
                <dd className="type-lead text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div id="contact-form" className="reveal grid scroll-mt-(--nav-height) gap-8 rounded-lg border border-rule bg-paper-veil p-6 backdrop-blur-md sm:p-10 lg:grid-cols-12">
          <div className="grid content-start gap-3 lg:col-span-4">
            <h3 className="type-h4 text-ink">Or leave a message here</h3>
            <p className="type-small text-ink-2">It comes straight to my inbox. Choose “Freelance project” to add a budget and timeline.</p>
          </div>
          <div className="lg:col-span-8">
            <ContactForm email={links.email} />
          </div>
        </div>
      </div>
    </section>
  );
}
