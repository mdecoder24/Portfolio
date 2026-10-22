import { CaseStudy } from '../schema.ts';

export const cafeQrOrdering = CaseStudy.parse({
  slug: 'cafe-qr-ordering',
  kind: 'freelance',
  title: 'Café QR ordering',
  context: 'Freelance, a Gachibowli café, 3 weeks',
  outcome: 'Table turnover up 15% after paper menus gave way to QR ordering.',
  client: { label: 'A Gachibowli café', named: false, permission: false },
  role: 'Sole developer',
  start: '2025-06',
  end: '2025-07',
  stack: ['React', 'Supabase', 'PWA'],
  categories: ['full-stack'],
  featured: true,
  media: { src: '/media/cafe-qr-ordering/cover.svg', alt: 'Phone menu with dishes and a kitchen tablet showing incoming orders' },
  body: {
    problem: 'Orders were taken on paper and walked to the kitchen, so busy hours meant long waits and lost tickets.',
    built: 'A QR menu per table that sends orders straight to a kitchen tablet, with live status back to the guest.',
    decisions: [
      { title: 'A PWA, not an app', detail: 'Guests scan and order without installing anything.' },
      { title: 'Supabase realtime for the kitchen', detail: 'Orders appear on the tablet within a second, with no server to run.' },
      { title: 'Works on weak Wi-Fi', detail: 'The menu is cached offline; only the order itself needs the network.' },
    ],
    results: ['Table turnover up 15%', 'No lost paper tickets since launch'],
    differently: 'I would design the kitchen view with the staff on day one; their first feedback reshaped it.',
  },
  placeholder: true,
});
