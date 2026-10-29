import { CaseStudy } from '../schema.ts';

export const documind = CaseStudy.parse({
  slug: 'documind',
  kind: 'academic',
  title: 'DocuMind',
  context: 'Final-year project, 2026',
  outcome: 'Chat with any PDF and get answers with page-level citations you can check.',
  role: 'Lead developer',
  team: 'Team of 3',
  start: '2025-08',
  end: '2026-04',
  stack: ['Next.js', 'FastAPI', 'pgvector', 'AI SDK', 'Python'],
  categories: ['ai-ml', 'full-stack'],
  featured: true,
  media: {
    src: '/media/documind/cover.svg',
    alt: 'Chat answer quoting a PDF with a highlighted citation on page 12',
  },
  links: [{ label: 'Code', href: 'https://github.com/kushwantkr/documind' }],
  body: {
    problem:
      'Students lose time searching long PDFs, and generic chatbots answer without saying where the answer came from.',
    built:
      'A retrieval system that splits PDFs by layout, embeds them in pgvector, and answers with citations that open the exact page.',
    decisions: [
      {
        title: 'Chunk by layout, not by length',
        detail: 'Headings and tables stay intact, so citations point at whole ideas.',
        at: { x: 27, y: 47 },
      },
      {
        title: 'Citations are required',
        detail: 'An answer without a source is rejected and retried.',
        at: { x: 66, y: 58 },
      },
      {
        title: 'pgvector over a vector service',
        detail: 'One PostgreSQL database kept the stack simple for a student team.',
        at: { x: 86, y: 21 },
      },
    ],
    results: ['Correct citation on 87% of a 120-question test set', 'Answers in about 2 seconds'],
    differently: 'I would build the evaluation set in week one, not week ten.',
  },
  placeholder: true,
});
