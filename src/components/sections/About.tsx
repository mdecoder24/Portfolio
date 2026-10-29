import { ArrowUpRight } from 'lucide-react';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import { Section } from '@/components/ui/SectionHeader';
import type { Profile, Skill } from '@/content/schema';
import { highlight } from '@/lib/highlight';

// Three stresses at most: the paragraph is a lead, and when every other phrase is bright none of them stand out
const STRESS = ['Associate Software Engineer', 'freelance projects', 'B.Tech in Computer Science'];

const TIERS: { tier: Skill['tier']; label: string }[] = [
  { tier: 'daily', label: 'Daily drivers' },
  { tier: 'comfortable', label: 'Shipped with' },
  { tier: 'exploring', label: 'Learning now' },
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
    <Section id="about" index={1} label="About" title="I turn fuzzy ideas into products people actually use.">
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
          <div className="grid gap-px overflow-hidden rounded-md border border-rule bg-rule md:grid-cols-3">
            {TIERS.map(({ tier, label }, i) => (
              <div
                key={tier}
                className="reveal grid content-start gap-4 bg-paper p-6"
                style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
              >
                <p className="type-code text-ink-2">{label}</p>
                <ul className="grid gap-2 type-body" aria-label={label}>
                  {skills
                    .filter((s) => s.tier === tier)
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
