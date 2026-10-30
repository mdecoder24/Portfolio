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

// The GDG and Club Literati roles moved to Experience, under Volunteer experience
export const achievements = Achievement.array().parse([
  { title: 'Co-author, "Deep Learning-Driven Skin Disease Detection"', issuer: 'IEEE', date: '2026-05' },
  { title: 'Hackathon finalist 9 times, with national-level wins' },
  { title: 'Indian Air Force U-19 basketball team' },
  { title: 'AWS Cloud Solutions Architect', issuer: 'Coursera' },
  { title: 'AWS Cloud Support Associate', issuer: 'Coursera' },
  { title: 'Meta Front-End Developer', issuer: 'Coursera' },
  { title: 'Meta Back-End Developer', issuer: 'Coursera' },
]);
