import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Achievement, Config, EducationItem } from '@/content/schema';
import { formatMonth } from '@/lib/format';

export function Education({
  education,
  achievements,
  config,
}: {
  education: EducationItem[];
  achievements: Achievement[];
  config: Config;
}) {
  return (
    <Section id="education" label="Education and achievements" title="Studies">
      <div className="grid gap-12 lg:grid-cols-12">
        {education.map((e) => (
          <div key={e.degree} className="reveal grid content-start gap-3 rounded-lg border border-rule bg-plate p-7 lg:col-span-5">
            <SampleRibbon placeholder={e.placeholder} />
            <p className="type-code text-ink-2">
              <time dateTime={String(e.start)}>{e.start}</time> – <time dateTime={String(e.end)}>{e.end}</time>
            </p>
            <h3 className="type-h4 text-ink">{e.degree}</h3>
            <p className="type-body text-ink-2">
              {e.institution}
              {config.flags.showCgpa && e.cgpa && `, CGPA ${e.cgpa}`}
            </p>
            {e.coursework.length > 0 && <p className="type-small text-ink-2">{e.coursework.join(' · ')}</p>}
            {e.finalProject && (
              <a href={e.finalProject.href} className="w-fit type-small font-semibold text-ink underline underline-offset-4 hover:text-accent">
                {e.finalProject.label}
              </a>
            )}
          </div>
        ))}
        <ul className="border-t border-rule lg:col-span-7">
          {achievements.map((a, i) => (
            <li
              key={a.title}
              className="reveal grid grid-cols-[5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-rule py-5"
              style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
            >
              <time dateTime={a.date} className="type-code text-ink-2">
                {formatMonth(a.date)}
              </time>
              <span className="type-h4 text-ink">
                {a.href ? (
                  <a href={a.href} className="underline underline-offset-4 hover:text-accent">
                    {a.title}
                  </a>
                ) : (
                  a.title
                )}
                {a.issuer && <span className="font-normal text-ink-2">, {a.issuer}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
