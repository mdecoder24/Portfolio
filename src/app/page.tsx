import { SiteChrome } from '@/components/layout/SiteChrome';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { Freelance } from '@/components/sections/Freelance';
import { Hero } from '@/components/sections/Hero';
import { ProjectList } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import * as content from '@/content';
import { jsonLd, personLd } from '@/lib/seo';

export default function Home() {
  const { config, profile } = content;
  const testimonials = content.testimonials.filter((t) => content.freelance.some((f) => f.testimonialId === t.id));

  return (
    <SiteChrome onHome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personLd()) }} />
      <Hero profile={profile} config={config} />
      <About profile={profile} />
      <Experience
        entries={content.experience}
        summary="Shipping learning platforms at Knowvation since July 2026, after an internship building APIs."
      />
      {config.flags.showFreelance && (
        <Freelance
          config={config}
          services={content.services}
          steps={content.process}
          studies={content.freelance}
          testimonials={testimonials.slice(0, 2)}
        />
      )}
      <Section id="projects">
        <SectionHeader
          id="projects"
          title="Projects"
          summary={`${content.projects.length} projects I built to learn, from retrieval systems to shaders.`}
        />
        <ProjectList projects={content.projects} />
      </Section>
      <Skills skills={content.skills} tiers={content.tierCopy} />
      <Education education={content.education} achievements={content.achievements} config={config} />
      <Contact config={config} profile={profile} />
    </SiteChrome>
  );
}
