import { CaseStudy } from '../schema.ts';

export const munWebsite = CaseStudy.parse({
  slug: 'mun-website',
  kind: 'personal',
  title: 'MLRIT MUN 2025 website',
  context: 'Event website',
  outcome: 'The website for MLRIT Model United Nations 2025: committees, the organising team, sponsors and registration in one place.',
  role: 'Developer',
  stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Vercel'],
  categories: ['full-stack'],
  links: [
    { label: 'GitHub', href: 'https://github.com/mdecoder24/mun-website' },
    { label: 'Live', href: 'https://mlritmun.vercel.app/' },
  ],
  featured: true,
  media: {
    src: '/media/mun-website/screen.jpg',
    screen: '/media/mun-website/phone.jpg',
    alt: 'The MLRIT MUN 2025 home page: the dates October 24–26, 2025 above a conference countdown and the title "MLRIT Model United Nations 2025" in white and gold',
  },
  body: {
    problem:
      'The 2025 conference, run by Club Literati, needed one place where delegates could find the dates, pick a committee, meet the organising team and register.',
    built:
      'A Next.js and TypeScript site with pages for the conference, the club, its committees, the core team and sponsors. The home page counts down to the conference, and every committee lists its agenda alongside its background guide.',
    decisions: [
      { title: 'Next.js and TypeScript', detail: 'Built on the Next.js App Router, written in TypeScript.' },
      {
        title: 'shadcn/ui on Tailwind CSS',
        detail: 'Buttons, cards and badges come from shadcn/ui, styled with Tailwind CSS.',
      },
      { title: 'Hosted on Vercel', detail: 'Deployed on Vercel, with Vercel Analytics on the pages.' },
    ],
    results: ['Live for the October 2025 conference'],
  },
});
