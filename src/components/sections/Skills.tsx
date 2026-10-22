import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import type { Skill } from '@/content/schema';

type TierCopy = Record<Skill['tier'], { name: string; note: string }>;

export function Skills({ skills, tiers }: { skills: Skill[]; tiers: TierCopy }) {
  const order: Skill['tier'][] = ['daily', 'comfortable', 'exploring'];
  return (
    <Section id="skills">
      <SectionHeader id="skills" title="Skills" summary="Three honest tiers. Each skill links to the work that proves it." />
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {order.map((tier) => (
          <div key={tier} className="grid content-start gap-3">
            <h3 className="type-h4 text-pearl">{tiers[tier].name}</h3>
            <p className="type-small text-mist">{tiers[tier].note}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 type-body">
              {skills
                .filter((s) => s.tier === tier)
                .map((s) => (
                  <li key={s.name}>
                    {s.evidence[0] ? (
                      <a
                        href={s.evidence[0].startsWith('#') ? `/${s.evidence[0]}` : s.evidence[0]}
                        className="rounded-xs text-pearl underline decoration-line-strong decoration-1 underline-offset-4 transition-colors duration-150 hover:text-rose hover:decoration-rose focus-visible:outline-none focus-visible:shadow-focus"
                      >
                        {s.name}
                      </a>
                    ) : (
                      <span className="text-pearl">{s.name}</span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
