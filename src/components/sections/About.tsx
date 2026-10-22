import { Label, Section } from '@/components/ui/SectionHeader';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import type { Profile, Skill } from '@/content/schema';
import { highlight } from '@/lib/highlight';
import { cn } from '@/lib/cn';

const STRESS = ['Associate Software Engineer', 'Knowvation Learnings', 'freelance projects', 'B.Tech in Computer Science', 'AI'];

function Chip({ skill }: { skill: Skill }) {
  const cls =
    'inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-control border border-rule bg-plate px-4 type-small text-ink transition-colors duration-200';
  const dot = <span aria-hidden="true" className="size-1 rounded-full bg-ink-2" />;
  const href = skill.evidence[0];
  return href ? (
    <a href={href.startsWith('#') ? `/${href}` : href} className={cn(cls, 'hover:border-ink hover:bg-cream hover:text-on-cream')}>
      {dot}
      {skill.name}
    </a>
  ) : (
    <span className={cls}>
      {dot}
      {skill.name}
    </span>
  );
}

/** One endless row of chips. The list is doubled so the -50% loop is seamless; the copy is hidden from readers. */
function Marquee({ skills, reverse, duration }: { skills: Skill[]; reverse?: boolean; duration: string }) {
  return (
    <div className="group/marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        style={{ '--marquee-duration': duration } as React.CSSProperties}
        className={cn(
          'flex w-max gap-3 group-hover/marquee:[animation-play-state:paused] calm:animate-none',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
      >
        <ul className="flex gap-3">
          {skills.map((s) => (
            <li key={s.name}>
              <Chip skill={s} />
            </li>
          ))}
        </ul>
        <ul className="flex gap-3" aria-hidden="true">
          {skills.map((s) => (
            <li key={s.name} className="[&_a]:pointer-events-none" inert>
              <Chip skill={s} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function About({ profile, skills }: { profile: Profile; skills: Skill[] }) {
  const tier = (t: Skill['tier']) => skills.filter((s) => s.tier === t);
  return (
    <Section id="about" label="About me" title="Intro">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="reveal grid content-start gap-6 lg:col-span-5">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-rule bg-rule">
            {profile.facts.map((f) => (
              <div key={f.term} className="grid gap-1 bg-paper p-5">
                <dt className="type-code text-ink-2">{f.term}</dt>
                <dd className="type-h4 text-ink">{f.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="type-small text-ink-2">
            Now: <span className="text-ink">{profile.now}</span>
          </p>
        </div>
        <div className="reveal grid content-start gap-5 rounded-lg border border-rule bg-plate p-7 sm:p-10 lg:col-span-7 [--reveal-delay:120ms]">
          <SampleRibbon placeholder={profile.placeholder} />
          <p className="type-lead text-ink-2">{highlight(profile.bio, STRESS)}</p>
          <p className="type-small text-ink-2">
            Into: <span className="text-ink">{profile.interests.join(' · ')}</span>
          </p>
        </div>
      </div>

      <div className="grid min-w-0 gap-5">
        <Label className="reveal">The stack</Label>
        <div className="reveal grid min-w-0 gap-3 [--reveal-delay:100ms] [&>*]:min-w-0">
          <Marquee skills={tier('daily')} duration="48s" />
          <Marquee skills={tier('comfortable')} duration="56s" reverse />
          <Marquee skills={tier('exploring')} duration="40s" />
        </div>
        <p className="type-caption text-ink-2">
          Top row: daily drivers. Middle: shipped with at least once. Bottom: learning now. Each links to the work that
          proves it.
        </p>
      </div>
    </Section>
  );
}
