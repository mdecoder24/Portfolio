import { Config } from './schema.ts';

export const config = Config.parse({
  availability: {
    freelance: 'limited',
    openToRoles: false,
    replyTime: 'within 24 hours',
  },
  flags: { showFreelance: true, showPrices: false, pearl: false, threeD: true, showCgpa: false },
  links: {
    email: 'hello@kushwantkr.dev',
    linkedin: 'https://www.linkedin.com/in/kushwantkr',
    github: 'https://github.com/kushwantkr',
  },
  site: { url: 'https://kushwantkr.dev', lastUpdated: '2026-10-22' },
  placeholder: true,
});
