import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Label, Section } from '@/components/ui/SectionHeader';
import type { Config, Service } from '@/content/schema';
import { formatRupees } from '@/lib/format';

/** Services as numbered rows that fill cream on hover and open to the details. */
export function Services({
  config,
  services,
  steps,
}: {
  config: Config;
  services: Service[];
  steps: { name: string; description: string }[];
}) {
  return (
    <Section
      id="services"
      label="Freelance services"
      align="right"
      title={"What I\ncan build"}
      aside={
        <div className="reveal grid max-w-sm gap-3 self-end">
          <Badge tone={config.availability.freelance}>{config.availability.freelanceLabel}</Badge>
          <p className="type-small text-ink-2">
            For clinics, cafés, agencies and startups. I reply {config.availability.replyTime}.
          </p>
        </div>
      }
    >
      <ol className="border-t border-rule">
        {services.map((s, i) => (
          <li key={s.id} className="reveal border-b border-rule" style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}>
            <details className="group">
              <summary className="grid cursor-pointer list-none grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 px-2 py-6 transition-colors duration-300 hover:bg-cream hover:text-on-cream focus-visible:outline-none focus-visible:shadow-focus sm:px-6 sm:py-7 [&::-webkit-details-marker]:hidden">
                <span className="text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-light tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[clamp(1.125rem,0.95rem+0.9vw,1.75rem)] font-extrabold uppercase tracking-[-0.02em]">
                  {s.name}
                </span>
                <ArrowDownRight
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="size-6 transition-transform duration-300 ease-out-quint group-open:-rotate-90"
                />
              </summary>
              <div className="grid gap-3 px-2 pb-8 pt-1 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:px-6">
                <div className="grid gap-3 sm:col-start-2">
                  <p className="max-w-[52ch] type-lead text-ink">{s.description}</p>
                  <p className="type-code text-ink-2">
                    {s.timeline} · {s.stack}
                    {config.flags.showPrices && s.startingFrom && ` · from ${formatRupees(s.startingFrom)}`}
                  </p>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>

      <div className="grid gap-6">
        <Label className="reveal">How a project works</Label>
        <ol className="grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.name}
              className="reveal grid content-start gap-3 bg-paper p-6"
              style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
            >
              <span className="type-code text-accent">Step {i + 1}</span>
              <h3 className="type-h4 text-ink">{s.name}</h3>
              <p className="type-small text-ink-2">{s.description}</p>
            </li>
          ))}
        </ol>
        <div className="reveal flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            data-topic="freelance"
            className="inline-flex min-h-12 items-center gap-2 rounded-control bg-cream px-6 type-ui text-on-cream transition-[opacity,translate] duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:shadow-focus"
          >
            Start a project
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </a>
          <p className="type-small text-ink-2">A written scope and quote within 2 days.</p>
        </div>
      </div>
    </Section>
  );
}
