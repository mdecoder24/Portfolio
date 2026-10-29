import { CaseStudy } from '../schema.ts';

export const orbit = CaseStudy.parse({
  slug: 'orbit',
  kind: 'personal',
  title: 'Orbit',
  context: 'Personal project, 2025',
  outcome: 'An explorable solar system with custom shaders at 60 fps on mid-range phones.',
  role: 'Solo developer',
  start: '2025-05',
  end: '2025-07',
  stack: ['React Three Fiber', 'GLSL', 'TypeScript'],
  categories: ['3d-creative'],
  featured: true,
  media: { src: '/media/orbit/cover.svg', alt: 'Planets on glowing orbit lines around a bright sun' },
  links: [{ label: 'Code', href: 'https://github.com/kushwantkr/orbit' }],
  body: {
    problem: 'I wanted to learn shaders on something I could show, and most 3D demos ran badly on phones.',
    built: 'A solar system you can fly through, with atmosphere and ring shaders written by hand.',
    decisions: [
      {
        title: 'Shaders over textures',
        detail: 'Procedural surfaces kept the download under 1 MB.',
        at: { x: 50, y: 43 },
      },
      {
        title: 'Quality tiers',
        detail: 'The scene measures frame rate and steps down detail on weak GPUs.',
        at: { x: 67, y: 20 },
      },
      { title: 'Instanced asteroids', detail: '10,000 asteroids in one draw call.', at: { x: 25, y: 50 } },
    ],
    results: ['60 fps on a mid-range Android phone', 'Under 1 MB first load'],
    differently: 'I would profile on a real phone from day one rather than a laptop.',
  },
  placeholder: true,
});
