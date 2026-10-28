import { CaseStudy } from '../schema.ts';

export const realtyLeadDashboard = CaseStudy.parse({
  slug: 'realty-lead-dashboard',
  kind: 'freelance',
  title: 'Realty lead dashboard',
  context: 'Freelance, a Kondapur real-estate agency, 5 weeks',
  outcome: 'Every lead in one dashboard, with WhatsApp follow-up reminders so none go cold.',
  client: { label: 'A Kondapur real-estate agency', named: false, permission: false },
  role: 'Sole developer',
  start: '2025-11',
  end: '2025-12',
  stack: ['Next.js', 'PostgreSQL', 'Resend'],
  categories: ['full-stack'],
  media: { src: '/media/realty-lead-dashboard/cover.svg', alt: 'Dashboard listing property leads with follow-up dates' },
  body: {
    problem: 'Leads lived in five spreadsheets, and agents forgot follow-ups.',
    built: 'One dashboard that imports leads from forms and portals, assigns them, and reminds agents to follow up.',
    decisions: [
      { title: 'Import, do not re-type', detail: 'Leads arrive from web forms and portal emails automatically.' },
      { title: 'Reminders where agents look', detail: 'Daily email and WhatsApp digests instead of a notification nobody opens.' },
      { title: 'PostgreSQL over a no-code tool', detail: 'Reports the owner wanted needed real queries.' },
    ],
    results: ['5 spreadsheets replaced by 1 dashboard', 'Follow-ups tracked for every lead'],
    differently: 'I would ship the reports first; the owner valued them more than the lead list.',
  },
  placeholder: true,
});
