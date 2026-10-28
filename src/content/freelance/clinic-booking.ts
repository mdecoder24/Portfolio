import { CaseStudy } from '../schema.ts';

export const clinicBooking = CaseStudy.parse({
  slug: 'clinic-booking',
  kind: 'freelance',
  title: 'Clinic booking assistant',
  context: 'Freelance, a Hyderabad clinic, 4 weeks',
  outcome: '60% of bookings now happen online, without a phone call.',
  client: { label: 'A Hyderabad clinic', named: false, permission: false },
  role: 'Sole developer',
  start: '2025-09',
  end: '2025-10',
  stack: ['Next.js', 'Node.js', 'Llama via Groq', 'WhatsApp Cloud API'],
  categories: ['ai-ml', 'full-stack'],
  featured: true,
  media: { device: 'phone', screen: '/media/clinic-booking/screen-phone.svg', src: '/media/clinic-booking/cover.svg', alt: 'Website chat booking a consultation slot for the next morning' },
  testimonialId: 'clinic-owner',
  body: {
    problem:
      'Every booking came through one phone line. Patients waited on hold during clinic hours, and calls after 8 PM went unanswered.',
    built:
      'A chat on the clinic website that answers common questions, offers open slots, and books a consultation. The doctor gets a WhatsApp message and confirms with one tap.',
    decisions: [
      { title: 'Slots come from the calendar, never the model', detail: 'The LLM only extracts intent and dates; a plain function checks availability, so it cannot double-book.' },
      { title: 'WhatsApp for the doctor, not a dashboard', detail: 'The doctor already lived in WhatsApp, so confirmations happen there with quick-reply buttons.' },
      { title: 'A fast, cheap model', detail: 'Llama via Groq answers in under a second, which matters more here than depth.' },
    ],
    results: ['60% of bookings now online', 'After-hours enquiries answered instantly', 'Phone time at the front desk down by about 2 hours a day'],
    differently: 'I would add reminders the day before from the start; no-shows were the next problem the clinic asked about.',
  },
  placeholder: true,
});
