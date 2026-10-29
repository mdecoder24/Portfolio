import { Achievement, EducationItem } from './schema.ts';

export const education = EducationItem.array().parse([
  {
    degree: 'B.Tech, Computer Science (AI & ML)',
    institution: 'MLR Institute of Technology, Hyderabad',
    start: 2022,
    end: 2026,
    cgpa: '7.64/10',
  },
]);

export const achievements = Achievement.array().parse([
  { title: 'Co-author, "Deep Learning-Driven Skin Disease Detection"', issuer: 'IEEE', date: '2026-05' },
  { title: 'Lead, Google Developer Groups on Campus', issuer: 'MLRIT, a 35-person team and 600+ members' },
  { title: 'Hackathon finalist 9 times, with national-level wins' },
  { title: 'Organising team, Agentathon', issuer: 'a Guinness World Record hackathon by GDG Hyderabad' },
  { title: 'Technical Head, Club Literati', issuer: 'MLRIT, 4 event websites' },
  { title: 'Indian Air Force U-19 basketball team' },
  { title: 'AWS Cloud Solutions Architect', issuer: 'Coursera' },
  { title: 'AWS Cloud Support Associate', issuer: 'Coursera' },
  { title: 'Meta Front-End Developer', issuer: 'Coursera' },
  { title: 'Meta Back-End Developer', issuer: 'Coursera' },
]);
