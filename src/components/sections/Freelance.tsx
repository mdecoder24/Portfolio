import { Badge } from '@/components/ui/Badge';
import { buttonClasses } from '@/components/ui/Button';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import type { CaseStudy, Config, Service, Testimonial } from '@/content/schema';
import { formatRupees } from '@/lib/format';
import { CaseStudyCard } from './CaseStudyCard';

export function Freelance({
  config,
  services,
  steps,
  studies,
  testimonials,
}: {
  config: Config;
  services: Service[];
  steps: { name: string; description: string }[];
  studies: CaseStudy[];
  testimonials: Testimonial[];
}) {
  const { availability } = config;
  const since = Math.min(...studies.map((s) => Number(s.start.slice(0, 4))));
  return (
    <Section id="freelance">
      <SectionHeader
        id="freelance"
        title="Freelance and client work"
        summary={`${studies.length} client projects since ${since}, from clinics to cafés. I reply ${availability.replyTime}.`}
        aside={<Badge tone={availability.freelance}>{availability.freelanceLabel}</Badge>}
      />

      <div className="grid gap-6">
        <h3 className="type-h4 text-pearl">What I build</h3>
        <ul className="grid gap-x-8 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.id} className="grid content-start gap-2 border-t border-line py-6">
              <h4 className="type-h4 text-pearl">{s.name}</h4>
              <p className="type-body max-w-[46ch] text-pearl">{s.description}</p>
              <p className="type-small text-mist">
                {s.timeline}. {s.stack}.
                {config.flags.showPrices && s.startingFrom && ` From ${formatRupees(s.startingFrom)}.`}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6">
        <h3 className="type-h4 text-pearl">Client case studies</h3>
        <div className="grid gap-16 max-sm:gap-8">
          {studies.map((s, i) => (
            <CaseStudyCard key={s.slug} study={s} flip={i % 2 === 1} />
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        <h3 className="type-h4 text-pearl">How a project works</h3>
        <ol className="grid grid-cols-4 gap-6 [counter-reset:step] max-[860px]:grid-cols-2 max-[480px]:grid-cols-1">
          {steps.map((s) => (
            <li
              key={s.name}
              className="grid content-start gap-2 border-t-2 border-line pt-4 [counter-increment:step] before:type-small before:tabular before:font-[640] before:text-rose before:content-[counter(step)]"
            >
              <h4 className="type-h4 text-pearl">{s.name}</h4>
              <p className="type-small text-mist">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>

      {testimonials.length > 0 && (
        <div className="grid gap-10 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.id} className="grid content-start gap-3">
              <SampleRibbon placeholder={t.placeholder} />
              <blockquote className="type-lead max-w-[56ch] font-medium text-pearl">
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="type-small text-mist">
                {t.name && <span className="font-semibold text-pearl">{t.name}, </span>}
                {t.role}
                {t.org && `, ${t.org}`}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <a href="#contact" data-topic="freelance" className={buttonClasses({})}>
          Start a project
        </a>
      </div>
    </Section>
  );
}
