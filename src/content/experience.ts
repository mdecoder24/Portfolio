import { Experience } from './schema.ts';

export const experience = Experience.array().parse([
  {
    id: 'knowvation',
    role: 'Associate Software Engineer',
    org: 'Knowvation Learnings Pvt Ltd',
    location: 'Hyderabad',
    start: '2026-07',
    points: [
      'Built a cohort dashboard used by 1,200 learners across 14 colleges',
      'Cut quiz-page load time by 48% by moving question banks to static generation',
      'Shipped an AI doubt-solver pilot that answered 3,000 student questions in its first month',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Node.js'],
    current: true,
    placeholder: true,
  },
  {
    id: 'nimbus-labs',
    role: 'Software Engineering Intern',
    org: 'Nimbus Labs',
    location: 'Hyderabad',
    start: '2026-01',
    end: '2026-06',
    points: [
      'Built 12 REST endpoints in Node.js and PostgreSQL for an inventory product',
      'Added end-to-end tests that caught 30+ regressions before release',
    ],
    stack: ['Node.js', 'PostgreSQL', 'Playwright'],
    placeholder: true,
  },
]);
