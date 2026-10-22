import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
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
    <Section id="education">
      <SectionHeader
        id="education"
        title="Education and achievements"
        summary="A computer science degree, a certification, and a hackathon win along the way."
      />
      <div className="grid gap-12 md:grid-cols-2 md:gap-8">
        <div className="grid content-start gap-8">
          {education.map((e) => (
            <div key={e.degree} className="grid gap-2">
              <SampleRibbon placeholder={e.placeholder} />
              <h3 className="type-h4 text-pearl">{e.degree}</h3>
              <p className="type-body text-mist tabular">
                {e.institution},{' '}
                <time dateTime={String(e.start)}>{e.start}</time>–<time dateTime={String(e.end)}>{e.end}</time>
                {config.flags.showCgpa && e.cgpa && `, CGPA ${e.cgpa}`}
              </p>
              {e.coursework.length > 0 && (
                <p className="type-small text-mist">Coursework: {e.coursework.join(', ')}</p>
              )}
              {e.finalProject && (
                <a
                  href={e.finalProject.href}
                  className="w-fit rounded-xs type-body text-rose underline underline-offset-4 hover:text-rose-hover focus-visible:outline-none focus-visible:shadow-focus"
                >
                  {e.finalProject.label}
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="grid content-start gap-4">
          <h3 className="type-h4 text-pearl">Certifications and achievements</h3>
          <ul className="grid">
            {achievements.map((a) => (
              <li key={a.title} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 border-t border-line py-3">
                <time dateTime={a.date} className="type-small tabular text-mist">
                  {formatMonth(a.date).split(' ')[1]}
                </time>
                <span className="type-body text-pearl">
                  {a.href ? (
                    <a href={a.href} className="underline decoration-line-strong underline-offset-4 hover:text-rose">
                      {a.title}
                    </a>
                  ) : (
                    a.title
                  )}
                  {a.issuer && <span className="text-mist">, {a.issuer}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
