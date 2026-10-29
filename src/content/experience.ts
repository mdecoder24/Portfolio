import { Experience } from './schema.ts';

export const experience = Experience.array().parse([
  {
    id: 'knowvation',
    role: 'Associate Software Engineer',
    org: 'Knowvation Learnings Pvt Ltd',
    start: '2026-02',
    points: [
      'Run the Knowvation Learnings website and its client-facing platforms end to end, from the database up to the UI',
      'Cut API latency by 40% by indexing the database and restructuring the APIs',
      'Own the UI and UX design, and built reusable React and TypeScript components that brought UI consistency to 78%',
      'Double as a product researcher: user research and competitive analysis that shape the product roadmap',
      'Review code and mentor junior developers on clean code and Git. Named Best Intern',
    ],
    stack: ['React', 'TypeScript', 'SQL', 'UI/UX design'],
    current: true,
  },
  {
    id: 'kemplast',
    role: 'Software Development Engineer',
    org: 'Kemplast Inc',
    start: '2025-09',
    end: '2026-02',
    points: [
      'Rebuilt the company website in Next.js (App Router), React 19 and TypeScript, and shipped it to production',
      'Connected it to Supabase across a 3-tier client, server and database setup, with React Hook Form and Zod on the forms and Resend for email',
      'Kept it fast with image optimisation, lazy loading and code splitting, and tracked all 3 Core Web Vitals (LCP, INP, CLS) in Vercel Analytics',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Zod'],
  },
]);
