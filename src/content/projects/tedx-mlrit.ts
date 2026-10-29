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
  featured: true,
  media: {
    src: '/media/tedx-mlrit/cover.svg',
    alt: 'An event website with a large title, the speaker line-up, and a register button',
  },
  body: {
    problem:
      'The event needed an official website that would hold up when a lot of people opened it at once.',
    built:
      'The official TEDx MLRIT website, written in TypeScript and JavaScript with a Supabase back end. Responsive, tuned for performance, and it reliably handled large-scale event traffic.',
    decisions: [
      { title: 'TypeScript first', detail: 'Written in TypeScript and JavaScript.', at: { x: 30, y: 30 } },
      { title: 'Supabase behind it', detail: "Supabase stores the site's data.", at: { x: 47, y: 74 } },
      {
        title: 'Built for traffic',
        detail: 'Optimised so it stayed fast under large-scale event traffic.',
        at: { x: 18, y: 55 },
      },
    ],
    results: ['Handled large-scale event traffic'],
  },
});
