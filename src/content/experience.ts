import { Experience } from './schema.ts';

// Follows the résumé point for point (Nov 2026 version in public/resume). Points it doesn't cover come from
// Kushwant's LinkedIn posts and roles, krudex.in, and his GitHub repositories (read 31 Oct 2026)
export const experience = Experience.array().parse([
  {
    id: 'krudex',
    role: 'Founder',
    org: 'Krudex Technologies',
    logo: '/media/logos/krudex.png',
    start: '2025-09',
    current: true,
    // From krudex.in and the company's LinkedIn page
    points: [
      'Founded Krudex Technologies, a remote-first studio in Hyderabad that builds SaaS products, web and mobile apps, and AI features',
      'Run each build through one process: a scoping call, an architecture document and statement of work, a senior-led build, then launch with a 30-day warranty',
      'Hand clients 100% of the source code and IP at the end of every project',
      'Also offer Google Ads and digital marketing, and student training with NovaSkill Hub',
    ],
  },
  {
    id: 'knowvation',
    role: 'Associate Software Engineer',
    org: 'Knowvation Learnings Pvt Ltd',
    logo: '/media/logos/knowvation.png',
    // Set by Kushwant on 31 Oct 2026
    start: '2023-08',
    points: [
      'Managed the Knowvation Learnings website and its client-facing web platforms end to end as a full-stack developer',
      'Cut API latency by 40% through relational database indexing and better-structured APIs',
      'Owned UI/UX design and built reusable React and TypeScript components, reaching 78% UI consistency',
      'Served as Product Researcher, using user research and competitive analysis to shape the product roadmap',
      'Worked in Agile sprints with cross-functional product and engineering teams, reviewed code, and mentored junior developers on clean code and Git workflows',
      // From LinkedIn posts
      'Helped organise TechKnow 1.0 at T-Hub, a tech summit for 400+ attendees, and TechKnow 2.0, and mentored 40+ teams at a 24-hour national hackathon at Draper Startup House',
      'Named Best Intern at TechKnow 1.0, then Best Employee at TechKnow 2.0',
    ],
    stack: ['React', 'TypeScript', 'SQL', 'UI/UX design', 'Agile'],
    current: true,
  },
  {
    id: 'kemplast',
    role: 'Software Development Engineer',
    org: 'Kemplast Inc',
    logo: '/media/logos/kemplast.png',
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
  // From LinkedIn (31 Oct 2026), which lists these roles without detail
  {
    id: 'cisco-thingqbator',
    role: 'UI/UX Designer',
    org: 'Cisco ThingQbator RVCE',
    logo: '/media/logos/cisco-thingqbator.png',
    start: '2023-10',
    end: '2024-01',
    // From his LinkedIn post on finishing the internship
    points: [
      'Designed the interfaces for "Where is my Bus?", a project that gives riders transit information',
      'Worked with the project team through a 10-week internship, focused on making the app easy to use',
    ],
  },
  // Volunteer roles: the résumé's achievements, with dates and the roles it leaves out from LinkedIn (31 Oct 2026)
  {
    id: 'gdg-hyderabad',
    kind: 'volunteer',
    role: 'Volunteer',
    org: 'GDG Hyderabad',
    // The chapter's own mark on gdg.community.dev; it has no LinkedIn page
    logo: '/media/logos/gdg-hyderabad.png',
    // Set by Kushwant on 31 Oct 2026
    start: '2024-05',
    current: true,
    points: [
      'I volunteered at 2 editions of DevFest Hyderabad, the annual developer conference run by GDG Hyderabad.',
      'I was part of the organising team for Agentathon, a hackathon that set a Guinness World Record.',
    ],
  },
  {
    id: 'club-literati',
    kind: 'volunteer',
    role: 'Technical Head',
    org: 'Club Literati, MLRIT',
    logo: '/media/logos/club-literati.png',
    // LinkedIn calls this role Technical Lead. The dates cover the Web Developer and Senior Web Developer years
    // before it, which Kushwant folded into this role on 31 Oct 2026
    start: '2023-08',
    end: '2026-04',
    points: [
      "Led the tech for MLRIT's literary club, which runs TEDxMLRIT, Model United Nations conferences and the annual literary festival",
      'Built 4 event websites for the club events which includes admin portals, registration and ticketing',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Vercel'],
  },
  {
    id: 'gdg-on-campus',
    kind: 'volunteer',
    role: 'Lead',
    org: 'Google Developer Groups on Campus, MLRIT',
    logo: '/media/logos/gdg-mlrit.png',
    // Set by Kushwant on 31 Oct 2026, covering the co-lead year LinkedIn lists separately
    start: '2024-09',
    end: '2026-10',
    // The rest from his LinkedIn post on becoming Lead
    points: [
      'Led a team of 35, for a campus community of 600+ members',
      'Co-Lead in 2024–25, as Google Developer Student Clubs became Google Developer Groups on Campus, then Lead',
      'Organised workshops and community events that took students from their first steps in tech to their first projects',
    ],
  },
  {
    id: 'gdsc-wow-hyderabad',
    kind: 'volunteer',
    role: 'Operations Team Member',
    org: 'GDSC WoW Hyderabad',
    logo: '/media/logos/gdsc-wow-hyderabad.png',
    start: '2024-03',
    end: '2024-04',
    points: [
      'On the operations team for GDSC WoW Hyderabad 2024, hosted at MLR Institute of Technology',
      'The event brought together 500+ student developers',
    ],
  },
]);
