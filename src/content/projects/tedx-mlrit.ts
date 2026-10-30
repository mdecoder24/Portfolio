import { CaseStudy } from '../schema.ts';

export const tedxMlrit = CaseStudy.parse({
  slug: 'tedx-mlrit',
  kind: 'personal',
  title: 'TEDx MLRIT website',
  context: 'Event website',
  outcome: 'The official TEDx MLRIT website, built to stay quick under heavy event traffic.',
  role: 'Developer',
  stack: ['TypeScript', 'JavaScript', 'Supabase'],
  categories: ['full-stack'],
  links: [
    { label: 'GitHub', href: 'https://github.com/mdecoder24/TEDx-MLRIT' },
    { label: 'Live', href: 'https://tedxmlrit.vercel.app/' },
  ],
  featured: true,
  media: {
    src: '/media/tedx-mlrit/screen.jpg',
    screen: '/media/tedx-mlrit/phone.jpg',
    alt: 'The TEDx MLRIT home page: the line "The future is merely the past, echoed forward" over a dark auditorium, with a red ticket button',
  },
  // From the repository's README and package.json
  readme: {
    overview:
      'The public site for TEDx MLRIT, hosted by MLR Institute of Technology: event information, past editions, speakers, sponsors, the organising team and a blog.',
    features: [
      'Ticket registration, speaker nomination and sponsorship forms',
      'Pages for speakers, sponsors, the team and the blog',
      'Content kept in TypeScript data files and bundled at build time',
      'Served by Vercel as a single-page app',
    ],
    tech: ['React 19', 'TypeScript', 'Vite 6', 'React Router 7', 'Tailwind CSS 4', 'Radix UI'],
    run: ['npm install', 'npm run dev'],
  },
  body: {
    problem:
      'The event needed an official website that would hold up when a lot of people opened it at once.',
    built:
      'The official TEDx MLRIT website, written in TypeScript and JavaScript with a Supabase back end. Responsive, tuned for performance, and it reliably handled large-scale event traffic.',
    decisions: [
      { title: 'TypeScript first', detail: 'Written in TypeScript and JavaScript.' },
      { title: 'Supabase behind it', detail: "Supabase stores the site's data." },
      {
        title: 'Built for traffic',
        detail: 'Optimised so it stayed fast under large-scale event traffic.',
      },
    ],
    results: ['Handled large-scale event traffic'],
  },
});
