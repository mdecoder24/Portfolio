import { Experience } from './schema.ts';

export const experience = Experience.array().parse([
  {
    id: 'knowvation',
    role: 'Associate Software Engineer',
    org: 'Knowvation Learnings Pvt Ltd',
    start: '2026-02',
    points: [
      'Build and maintain client websites and full-stack platforms, from the database up to the UI',
      'Cut API latency by 40% by indexing the database and restructuring the APIs',
      'Built reusable React components in TypeScript that brought UI consistency across client projects to 78%',
      'Added AI and LLM features to client products, which lifted engagement and retention by 30%',
      'Review code and mentor junior developers on clean code and Git. Named Best Intern',
    ],
    stack: ['React', 'TypeScript', 'JavaScript', 'SQL', 'LLM integration'],
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
      'Connected it to Supabase, with React Hook Form and Zod on the forms and Resend for email',
      'Kept it fast with image optimisation, lazy loading and code splitting, and watched Core Web Vitals in Vercel Analytics',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Zod'],
  },
]);
