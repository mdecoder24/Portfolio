import { ArrowUpRight } from 'lucide-react';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Profile, Skill } from '@/content/schema';
import { highlight } from '@/lib/highlight';

// Three stresses at most: the paragraph is a lead, and when every other phrase is bright none of them stand out
const STRESS = ['the whole stack', 'Knowvation Learnings', 'computer vision'];

const GROUPS: { group: Skill['group']; label: string }[] = [
  { group: 'languages', label: 'Languages' },
  { group: 'frontend', label: 'Frontend' },
  { group: 'backend', label: 'Backend and databases' },
  { group: 'ai-ml', label: 'AI and ML' },
  { group: 'cloud', label: 'Cloud and DevOps' },
];

function SkillItem({ skill }: { skill: Skill }) {
  const href = skill.evidence[0];
  if (!href) return <span className="text-ink-2">{skill.name}</span>;
  return (
    <a
      href={href.startsWith('#') ? `/${href}` : href}
      // No resting underline: across twenty items it read as noise. Brighter text and the arrow mark a link; the
      // underline arrives on hover
      className="group/skill inline-flex items-center gap-1 rounded-xs text-ink underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline-none focus-visible:shadow-focus"
    >
      {skill.name}
      <ArrowUpRight
        className="size-3.5 text-ink-2 transition-colors duration-150 group-hover/skill:text-ink"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </a>
  );
}

export function About({ profile, skills }: { profile: Profile; skills: Skill[] }) {
  return (
    <Section id="about" index={1} label="About" title="I write the front end, the back end, and the prompt in between.">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="reveal grid content-start gap-6 lg:col-span-9 lg:col-start-4">
          <SampleRibbon placeholder={profile.placeholder} />
          <p className="max-w-[60ch] type-lead text-ink-2 [&_strong]:font-medium">{highlight(profile.bio, STRESS)}</p>
          <dl className="grid gap-x-8 gap-y-4 border-t border-rule pt-6 sm:grid-cols-2">
            <div className="grid content-start gap-1">
              <dt className="type-code text-ink-2">Now</dt>
              <dd className="type-body text-ink">{profile.now}</dd>
            </div>
            <div className="grid content-start gap-1">
              <dt className="type-code text-ink-2">Into</dt>
              <dd className="type-body text-ink">{profile.interests.join(', ')}</dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-6 lg:col-span-9 lg:col-start-4">
          <h3 className="reveal type-h4 text-ink">The stack</h3>
          {/* One row per group, as the résumé lists them: five groups never split evenly into columns */}
          <div className="border-t border-rule">
            {GROUPS.map(({ group, label }, i) => (
              <div
                key={group}
                className="reveal grid gap-3 border-b border-rule py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6"
                style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
              >
                <p className="type-code text-ink-2 sm:pt-0.5">{label}</p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 type-body" aria-label={label}>
                  {skills
                    .filter((s) => s.group === group)
                    .map((s) => (
                      <li key={s.name}>
                        <SkillItem skill={s} />
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="type-small text-ink-2">Linked skills open the work that proves them.</p>
        </div>
      </div>
    </Section>
  );
}
