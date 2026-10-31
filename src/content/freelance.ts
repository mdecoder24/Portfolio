import { Freelance } from './schema.ts';

// Years, project count and client countries set by Kushwant on 31 Oct 2026; the client list is left off by his choice
export const freelance = Freelance.parse({
  // ==phrase== marks the words the highlighter sweeps over
  bio: [
    "For ==3 years== I've freelanced alongside my day job, building websites and web apps for clients in ==India, USA, UAE, Spain and UK==. I've shipped ==14+ projects== so far, from company websites with full product catalogues to custom web apps.",
    'I take each project from the ==first conversation to launch==: working out what the business needs, building it in Next.js and React, and putting it live. Every site I hand over loads fast and works just as well on a phone as on a desktop.',
  ],
  stats: [
    { value: '3', label: 'Years freelancing', stamps: ['Since 2023'] },
    { value: '14+', label: 'Projects shipped', stamps: ['Shipped'] },
    {
      value: '5',
      label: 'Countries',
      detail: 'India, USA, UAE, Spain and UK',
      stamps: ['IN', 'US', 'AE', 'ES', 'UK'],
    },
  ],
  // New builds go through Kushwant's studio (31 Oct 2026), so the button leaves the site rather than opening Contact
  cta: {
    text: 'Want something built? I take on new projects through my studio, Krudex Technologies.',
    label: 'Start a project',
    href: 'https://krudex.in/',
  },
});
