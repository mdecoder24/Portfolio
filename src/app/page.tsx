import { BackdropMount } from '@/components/layout/BackdropMount';
import { RevealObserver } from '@/components/layout/RevealObserver';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { StickyIntro } from '@/components/layout/StickyIntro';
import { About } from '@/components/sections/About';
import { Certifications } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { Freelance } from '@/components/sections/Freelance';
import { Hero } from '@/components/sections/Hero';
import { Work } from '@/components/sections/Work';
import * as content from '@/content';
import { jsonLd, personLd } from '@/lib/seo';

export default function Home() {
  const { config, profile } = content;
  // Sections are numbered in reading order
  let count = 2; // About and Experience number themselves
  const next = () => ++count;
  return (
    <>
      <StickyIntro profile={profile} />
      <BackdropMount />
      <SiteChrome onHome>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personLd()) }} />
        <Hero profile={profile} config={config} />
        <About profile={profile} skills={content.skills} />
        <Experience entries={content.experience} />
        <Work index={next()} projects={content.projects} />
        <Freelance index={next()} freelance={content.freelance} config={config} />
        <Education
          index={next()}
          education={content.education}
          achievements={content.achievements}
          config={config}
        />
        <Certifications index={next()} certifications={content.certifications} />
        <Contact index={next()} config={config} profile={profile} />
        <RevealObserver />
      </SiteChrome>
    </>
  );
}
