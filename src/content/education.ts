import { Achievement, EducationItem } from './schema.ts';

export const education = EducationItem.array().parse([
  {
    degree: 'B.Tech, Computer Science and Engineering',
    institution: 'An institute in Hyderabad',
    start: 2022,
    end: 2026,
    coursework: ['Data structures', 'Operating systems', 'Machine learning', 'Computer graphics'],
    finalProject: { label: 'Final-year project: DocuMind', href: '/projects/documind' },
    placeholder: true,
  },
]);

export const achievements = Achievement.array().parse([
  { title: 'Winner, CodeSprint college hackathon', date: '2025-03', placeholder: true },
  { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025-08', placeholder: true },
  { title: 'Ran a 2-day React workshop for 80 students', date: '2025-11', placeholder: true },
]);
