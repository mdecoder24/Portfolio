import { SiteChrome } from '@/components/layout/SiteChrome';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
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
  const n = (i: number) => (showFreelance || i < 3 ? i : i - 1);
  return (
    <SiteChrome onHome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personLd()) }} />
      <Hero profile={profile} config={config} />
      <About profile={profile} skills={content.skills} />
      <Experience entries={content.experience} />
      {showFreelance && <Services index={3} config={config} services={content.services} steps={content.process} />}
      <Work index={n(4)} freelance={showFreelance ? content.freelance : []} projects={content.projects} />
      <Education index={n(5)} education={content.education} achievements={content.achievements} config={config} />
      <Contact index={n(6)} config={config} profile={profile} />
    </SiteChrome>
  );
}
