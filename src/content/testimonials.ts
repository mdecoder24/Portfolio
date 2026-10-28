import { Testimonial } from './schema.ts';

export const testimonials = Testimonial.array().parse([
  {
    id: 'clinic-owner',
    quote: 'Kushwant turned our messy booking process into a chat that just works.',
    role: 'Clinic owner, Hyderabad',
    placeholder: true,
  },
  {
    id: 'skincare-founder',
    quote: 'Fast, clear, and he explained every trade-off before building.',
    role: 'Founder, D2C skincare startup',
    placeholder: true,
  },
]);
