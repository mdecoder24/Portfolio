import { CaseStudy } from '../schema.ts';

export const skincare3dLaunch = CaseStudy.parse({
  slug: 'skincare-3d-launch',
  kind: 'freelance',
  title: '3D product launch page',
  context: 'Freelance, a D2C skincare startup, 2 weeks',
  outcome: 'Time on page up 2.3× after flat product photos became a 3D viewer.',
  client: { label: 'A D2C skincare startup', named: false, permission: false },
  role: 'Sole developer',
  start: '2026-02',
  end: '2026-02',
  stack: ['React Three Fiber', 'Next.js'],
  categories: ['3d-creative'],
  media: { src: '/media/skincare-3d-launch/cover.svg', alt: 'A 3D serum bottle on a launch page with ingredient callouts' },
  testimonialId: 'skincare-founder',
  body: {
    problem: 'The launch page showed flat photos, and visitors left in under 20 seconds.',
    built: 'A launch page with a 3D bottle you can turn, with ingredients that light up as you scroll.',
    decisions: [
      { title: 'One model, compressed hard', detail: 'Draco and KTX2 kept the bottle under 600 KB.' },
      { title: 'A poster first', detail: 'The page paints a still image instantly and swaps in 3D when ready.' },
      { title: 'Phones first', detail: 'Most traffic came from Instagram on phones, so the budget was set for them.' },
    ],
    results: ['Time on page up 2.3×', 'Holds 60 fps on mid-range phones'],
    differently: 'I would add an AR view; customers asked for it in the first week.',
  },
  placeholder: true,
});
