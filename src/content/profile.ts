import { Profile } from './schema.ts';

export const profile = Profile.parse({
  name: 'Kushwant KR',
  role: 'Software Engineer · Full-Stack & AI',
  nameLine: 'Kushwant KR, software engineer for full-stack and AI',
  headline: 'I build web products that think and move',
  subheadline:
    'Associate Software Engineer at Knowvation Learnings and a freelance developer in Hyderabad. Full-stack apps with a soft spot for AI and 3D.',
  employment: 'ASE at Knowvation Learnings',
  location: { city: 'Hyderabad', region: 'Telangana', country: 'India', timeZone: 'Asia/Kolkata' },
  bio: "I'm a software engineer from Hyderabad who likes turning fuzzy ideas into products people actually use. By day I'm an Associate Software Engineer at Knowvation Learnings, building learning platforms for students across Telangana. By night and on weekends I take on freelance projects for clinics, cafés, and startups, from booking chatbots to dashboards. I graduated in 2026 with a B.Tech in Computer Science, and I'm happiest where web development meets AI: LLM-powered tools, retrieval systems, and interactive 3D on the web. Currently learning: GLSL shaders and evaluation methods for AI agents.",
  facts: [
    { term: 'Based in', detail: 'Hyderabad' },
    { term: 'Degree', detail: 'B.Tech CSE, 2026' },
    { term: 'Day job', detail: 'ASE at Knowvation' },
    { term: 'Freelance', detail: '4 projects shipped' },
  ],
  interests: ['LLM apps and retrieval', 'Real-time 3D on the web', 'Developer tooling'],
  now: 'Building Pearl, learning GLSL shaders',
  placeholder: true,
});
