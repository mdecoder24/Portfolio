import { Experience } from './schema.ts';

// Follows the résumé point for point (Oct 2026 version in public/resume)
export const experience = Experience.array().parse([
  {
    id: 'knowvation',
    role: 'Associate Software Engineer',
    org: 'Knowvation Learnings Pvt Ltd',
    // Set by Kushwant on 31 Oct 2026; the résumé gives a later start
    start: '2023-08',
    points: [
      'Managed the Knowvation Learnings website and its client-facing web platforms end to end as a full-stack developer',
      'Cut API latency by 40% through relational database indexing and better-structured APIs',
      'Owned UI/UX design and built reusable React and TypeScript components, reaching 78% UI consistency',
      'Served as Product Researcher, using user research and competitive analysis to shape the product roadmap',
      'Worked in Agile sprints with cross-functional product and engineering teams, reviewed code, and mentored junior developers on clean code and Git workflows. Recognised as Best Intern',
    ],
    stack: ['React', 'TypeScript', 'SQL', 'UI/UX design', 'Agile'],
    current: true,
  },
  {
    id: 'kemplast',
    role: 'Software Development Engineer',
    org: 'Kemplast Inc',
    start: '2025-09',
    end: '2026-02',
    points: [
      'Rebuilt and shipped the production website end to end in Next.js (App Router), React 19 and TypeScript, with a responsive UI across devices and browsers',
      'Integrated a Supabase (PostgreSQL) backend across a 3-tier client, server and database architecture, with React Hook Form and Zod validation and transactional email through Resend',
      'Improved front-end performance with image optimisation, lazy loading and code splitting',
      'Tracked all 3 Core Web Vitals (LCP, INP, CLS) in Vercel Analytics, and fixed production defects through root-cause analysis',
    ],
    stack: ['Next.js', 'React 19', 'TypeScript', 'Supabase', 'Vercel'],
  },
  // Volunteer roles, from the résumé's achievements; no dates until Kushwant gives them
  {
    id: 'gdg-on-campus',
    kind: 'volunteer',
    role: 'Lead',
    org: 'Google Developer Groups on Campus, MLRIT',
    points: ['Led a team of 35', 'A community of 600+ members'],
  },
  {
    id: 'gdg-hyderabad',
    kind: 'volunteer',
    role: 'Volunteer',
    org: 'GDG Hyderabad',
    points: [
      'Volunteered at 2 DevFest Hyderabad events',
      'On the organising team of Agentathon, a Guinness World Record hackathon',
    ],
  },
  {
    id: 'club-literati',
    kind: 'volunteer',
    role: 'Technical Head',
    org: 'Club Literati, MLRIT',
    points: ['Built 4 event websites for the club'],
  },
]);
