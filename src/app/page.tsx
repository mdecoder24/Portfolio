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
  return (
    <SiteChrome onHome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personLd()) }} />
      <Hero profile={profile} config={config} />
      <About profile={profile} skills={content.skills} />
      <Experience entries={content.experience} />
      {config.flags.showFreelance && <Services config={config} services={content.services} steps={content.process} />}
      <Work freelance={config.flags.showFreelance ? content.freelance : []} projects={content.projects} />
      <Education education={content.education} achievements={content.achievements} config={config} />
      <Contact config={config} profile={profile} />
    </SiteChrome>
  );
}
