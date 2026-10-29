import { Config } from './schema.ts';

export const config = Config.parse({
  availability: {
    freelance: 'limited',
    openToRoles: false,
    replyTime: 'within 24 hours',
  },
  flags: { pearl: false, threeD: true, showCgpa: true },
  links: {
    email: 'kushwant.work@gmail.com',
    linkedin: 'https://www.linkedin.com/in/kushwant-kr',
    github: 'https://github.com/mdecoder24',
  },
  site: { url: 'https://kushwantkr.dev', lastUpdated: '2026-10-30' },
  placeholder: true,
});
