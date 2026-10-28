import { ArrowUpRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/SectionHeader';
import type { Config, Service } from '@/content/schema';
import { formatRupees } from '@/lib/format';

/** Services as numbered rows that open to the details, then the four steps of a project. */
export function Services({
  index,
  config,
  services,
  steps,
}: {
  index: number;
  config: Config;
  services: Service[];
  steps: { name: string; description: string }[];
}) {
  return (
    <Section
      id="services"
      index={index}
      label="Freelance"
      title="What I can build"
      intro={<>For clinics, cafés, agencies and startups. I reply {config.availability.replyTime}.</>}
    >
      <ol className="border-t border-rule">
        {services.map((s, i) => (
          <li key={s.id} className="reveal border-b border-rule" style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}>
            <details className="group">
              <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 py-6 transition-colors duration-200 hover:text-ink-hover focus-visible:outline-none focus-visible:shadow-focus lg:grid-cols-12 lg:gap-x-8 [&::-webkit-details-marker]:hidden">
                <span className="type-code text-ink-2 lg:col-span-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="type-h3 text-ink lg:col-span-8">{s.name}</span>
                <span className="grid size-10 place-items-center rounded-full border border-rule text-ink-2 transition-[rotate,border-color,color] duration-200 ease-out group-hover:border-rule-strong group-hover:text-ink group-open:rotate-45 lg:col-span-1 lg:justify-self-end">
                  <Plus aria-hidden="true" strokeWidth={1.75} className="size-4" />
                </span>
              </summary>
              <div className="grid pb-8 lg:grid-cols-12 lg:gap-x-8">
                <div className="grid gap-3 max-lg:pl-14 lg:col-span-8 lg:col-start-4">
                  <p className="max-w-[52ch] type-lead text-ink-2">{s.description}</p>
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

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <h3 className="reveal type-h4 text-ink lg:col-span-3">How a project works</h3>
        <div className="grid gap-8 lg:col-span-9">
          <ol className="grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-2">
            {steps.map((s, i) => (
              <li
                key={s.name}
                className="reveal grid content-start gap-2 bg-paper p-6"
                style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
              >
                <span className="type-code text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="type-h4 text-ink">{s.name}</h4>
                <p className="type-small text-ink-2">{s.description}</p>
              </li>
            ))}
          </ol>
          <div className="reveal flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button href="#contact" data-topic="freelance">
              Start a project
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Button>
            <p className="type-small text-ink-2">A written scope and quote within 2 days.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
