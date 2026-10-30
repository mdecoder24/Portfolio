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
  links: [
    { label: 'GitHub', href: 'https://github.com/mdeocder24/sensai' },
    { label: 'Live', href: 'https://ai-career-coach-mu.vercel.app/' },
  ],
  featured: true,
  media: {
    src: '/media/sensai/screen.jpg',
    screen: '/media/sensai/phone.jpg',
    alt: 'The SENSAI home page: the headline "Your AI Career Coach for Professional Success" over a dark grid, with a Get Started button',
  },
  // From the repository's README and package.json
  readme: {
    overview:
      'A full-stack AI career coach. Job seekers build résumés and cover letters and practise mock interviews, with help from the Gemini API.',
    features: [
      'An AI résumé and cover letter builder',
      'Mock interview practice with AI answers',
      'Sign-in and protected pages with Clerk',
      'Background jobs with Inngest',
    ],
    tech: ['Next.js', 'React 19', 'Tailwind CSS', 'shadcn/ui', 'Prisma', 'PostgreSQL', 'Clerk', 'Gemini API', 'Inngest'],
    run: ['npm install', 'npm run dev'],
    needs: 'a PostgreSQL database, plus Clerk and Gemini API keys in a .env file',
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
      },
      {
        title: 'Next.js and Node.js',
        detail: 'Next.js for the app, with a Node.js back end.',
      },
      {
        title: 'Prisma for the data',
        detail: 'Everything the app stores goes through Prisma.',
      },
    ],
    results: ['Evaluations 35% more precise'],
  },
});
