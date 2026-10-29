import { SiteChrome } from '@/components/layout/SiteChrome';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Decisions } from '@/components/sections/Decisions';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import * as content from '@/content';
import { jsonLd, personLd } from '@/lib/seo';

export default function Home() {
  const { config, profile } = content;
  // Sections are numbered in reading order, so hiding freelance services never leaves a gap in the count
  const showFreelance = config.flags.showFreelance;
  const freelance = showFreelance ? content.freelance : [];
  let count = 2; // About and Experience number themselves
  const next = () => ++count;
  return (
    <SiteChrome onHome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personLd()) }} />
      <Hero profile={profile} config={config} />
      <About profile={profile} skills={content.skills} />
      <Experience entries={content.experience} />
      {showFreelance && (
        <Services index={next()} config={config} services={content.services} steps={content.process} />
      )}
      <Work index={next()} freelance={freelance} projects={content.projects} />
      <Decisions index={next()} studies={[...freelance, ...content.projects]} />
      <Education
        index={next()}
        education={content.education}
        achievements={content.achievements}
        config={config}
      />
      <Contact index={next()} config={config} profile={profile} />
    </SiteChrome>
  );
}
