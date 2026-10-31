import { Achievement, EducationItem } from './schema.ts';

// Newest first, from graduation down to secondary school; set by Kushwant on 31 Oct 2026
export const education = EducationItem.array().parse([
  {
    level: 'Graduation',
    degree: 'B.Tech, Computer Science (AI & ML)',
    institution: 'MLR Institute of Technology, Hyderabad',
    start: 2022,
    end: 2026,
    score: { kind: 'cgpa', value: 7.64, outOf: 10 },
  },
  {
    level: 'Higher secondary',
    degree: 'High school, PCM',
    institution: 'Sri Chaitanya Jr College, Hyderabad',
    start: 2020,
    end: 2022,
    score: { kind: 'percent', value: 87.5, outOf: 100 },
  },
  {
    level: 'Secondary school',
    degree: 'Secondary school, CBSE',
    institution: 'Air Force School, Bidar',
    end: 2020,
    score: { kind: 'percent', value: 74.5, outOf: 100 },
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
