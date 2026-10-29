import { CaseStudy } from '../schema.ts';

export const sensai = CaseStudy.parse({
  slug: 'sensai',
  kind: 'personal',
  title: 'SENSAI, AI career coach',
  context: 'AI app',
  outcome:
    'An AI coach that reviews résumés and gives personalised feedback on mock interviews. Its evaluations got 35% more precise.',
  role: 'Developer',
  stack: ['Next.js', 'Node.js', 'Prisma', 'Gemini API'],
  categories: ['ai-ml', 'full-stack'],
  featured: true,
  media: {
    src: '/media/sensai/cover.svg',
    alt: 'A résumé on the left and an interview-feedback panel on the right',
  },
  body: {
    problem:
      'Getting a résumé reviewed, or practising for an interview, usually means finding someone with the time to help.',
    built:
      'A full-stack generative AI career assistant. It analyses résumés and gives personalised feedback on mock interviews, driven by prompt engineering on the Gemini API. Next.js runs the app, Node.js sits behind it, and Prisma looks after the data.',
    decisions: [
      {
        title: 'Prompts do the heavy lifting',
        detail: 'The résumé analysis and interview feedback come from prompt engineering on the Gemini API.',
        at: { x: 60, y: 60 },
      },
      {
        title: 'Next.js and Node.js',
        detail: 'Next.js for the app, with a Node.js back end.',
        at: { x: 12, y: 15 },
      },
      {
        title: 'Prisma for the data',
        detail: 'Everything the app stores goes through Prisma.',
        at: { x: 27, y: 50 },
      },
    ],
    results: ['Evaluations 35% more precise'],
  },
});
