import { Freelance } from './schema.ts';

// Built only from facts on the site (the day job, 14+ freelance projects, the work listed below); no invented clients or numbers
export const freelance = Freelance.parse({
  bio: [
    'Outside my day job at Knowvation Learnings, I build websites and web apps for businesses. I have shipped 14+ freelance projects so far, from company websites with full product catalogues to custom web apps.',
    'I take a project from the first conversation to launch: working out what the business needs, building it in Next.js and React, and putting it live. I aim for sites that load fast and work just as well on a phone as on a desktop.',
  ],
  work: [
    {
      title: 'Kemplast Process Solutions website',
      client: 'an industrial instrumentation dealer since 1986',
      summary:
        'The company website: a product catalogue by category, a page for each brand they deal in, calibration services, the team, and quote requests, in light and dark themes.',
      stack: ['Next.js', 'Tailwind CSS', 'Vercel'],
      href: 'https://www.kemplast.in/',
    },
  ],
});
