import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import { SampleRibbon } from '@/components/ui/SampleRibbon';
import type { Profile } from '@/content/schema';

export function About({ profile }: { profile: Profile }) {
  return (
    <Section id="about">
      <SectionHeader id="about" title="About" summary="Who I am, what I work on, and what I'm learning now." />
      <div className="grid max-w-(--measure) gap-8">
        <SampleRibbon placeholder={profile.placeholder} />
        <p className="type-body text-pearl">{profile.bio}</p>
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {profile.facts.map((f) => (
            <div key={f.term} className="grid gap-0.5">
              <dt className="type-small text-mist">{f.term}</dt>
              <dd className="type-ui text-pearl">{f.detail}</dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-2">
          <p className="type-body">
            <span className="text-mist">What I&apos;m into: </span>
            {profile.interests.join(', ')}
          </p>
          <p className="type-body">
            <span className="text-mist">Now: </span>
            {profile.now}
          </p>
        </div>
      </div>
    </Section>
  );
}
