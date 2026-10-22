import { CaseStudy } from '../schema.ts';

export const codelens = CaseStudy.parse({
  slug: 'codelens',
  kind: 'personal',
  title: 'CodeLens',
  context: 'Personal project, 2025',
  outcome: 'A VS Code extension that explains a selected block of code in plain words.',
  role: 'Solo developer',
  start: '2025-10',
  end: '2025-11',
  stack: ['TypeScript', 'VS Code API'],
  categories: ['tools', 'ai-ml'],
  media: { src: '/media/codelens/cover.svg', alt: 'Editor with a selected function and an explanation panel beside it' },
  links: [{ label: 'Code', href: 'https://github.com/kushwantkr/codelens' }],
  body: {
    problem: 'Juniors reading an unfamiliar codebase copy code into a chatbot and lose the context around it.',
    built: 'An extension that sends the selection plus nearby definitions to an LLM and shows the explanation inline.',
    decisions: [
      { title: 'Send context, not the file', detail: 'Only the selection and the symbols it uses, to stay fast and cheap.' },
      { title: 'Bring your own key', detail: 'No server of mine sees anyone’s code.' },
      { title: 'Plain words first', detail: 'Explanations start with one sentence, then details on demand.' },
    ],
    results: ['Explains a 40-line function in about 3 seconds'],
    differently: 'I would cache explanations per commit so repeat questions are instant.',
  },
  placeholder: true,
});
