import { Profile } from './schema.ts';

export const profile = Profile.parse({
  name: 'Kushwant Kumar Reddy',
  role: 'Software Engineer · Full-Stack & AI',
  nameLine: 'Kushwant Kumar Reddy, software engineer for full-stack and AI',
  headline: 'I build web products that think and move',
  subheadline:
    'Software engineer at Knowvation Learnings in Hyderabad. I build full-stack apps in React, TypeScript and Node.js, often with an LLM in the loop.',
  employment: 'ASE at Knowvation Learnings',
  location: { city: 'Hyderabad', region: 'Telangana', country: 'India', timeZone: 'Asia/Kolkata' },
  bio: 'I build products across the whole stack: the React front end, the API and database behind it, and more and more often a language model doing part of the work. At Knowvation Learnings I run the company website and its client platforms end to end, and help decide what we build next through product research. I do the other kind of research too: my paper on detecting skin disease with deep learning is published with IEEE. Nine hackathon finals taught me to ship fast, and computer vision is where I go for the harder problems.',
  facts: [
    { term: 'Based in', detail: 'Hyderabad, India' },
    { term: 'Degree', detail: 'B.Tech CSE (AI & ML), 2026' },
    { term: 'Working as', detail: 'ASE at Knowvation Learnings' },
    { term: 'Freelance', detail: '4+ projects shipped' },
  ],
  interests: ['LLM apps and RAG', 'Full-stack web', 'Computer vision'],
  now: 'Running the Knowvation Learnings website',
  portrait: '/media/portrait.png',
});
