import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Config, EducationItem } from '@/content/schema';

export function Education({
  index,
  education,
  config,
}: {
  index: number;
  education: EducationItem[];
  config: Config;
}) {
  return (
    <Section id="education" index={index} label="Education" title="Education">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="grid content-start gap-8 lg:col-span-9 lg:col-start-4">
          {education.map((e) => (
            <div key={e.degree} className="reveal grid content-start gap-2">
              <SampleRibbon placeholder={e.placeholder} />
              <p className="type-code text-ink-2">
                <time dateTime={String(e.start)}>{e.start}</time> –{' '}
                <time dateTime={String(e.end)}>{e.end}</time>
              </p>
              <h3 className="type-h3 text-ink">{e.degree}</h3>
              <p className="type-body text-ink-2">
                {e.institution}
                {config.flags.showCgpa && e.cgpa && `, CGPA ${e.cgpa}`}
              </p>
              {e.coursework.length > 0 && (
                <p className="max-w-(--measure) type-small text-ink-2">{e.coursework.join(', ')}</p>
              )}
              {e.finalProject && (
                <a
                  href={e.finalProject.href}
                  className="mt-1 w-fit rounded-xs type-ui text-ink underline decoration-rule-strong underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline-none focus-visible:shadow-focus"
                >
                  {e.finalProject.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
