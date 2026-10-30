import { Freelance } from './schema.ts';

// Stand-in until Kushwant writes his own: the bio below is a sample; the work list is real
export const freelance = Freelance.parse({
  bio: [
    'Alongside my day job I take on freelance projects. This is a sample paragraph: my own words about the work I do for clients go here.',
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
  placeholder: true,
});
