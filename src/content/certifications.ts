import { Certification } from './schema.ts';

// From the résumé, in its order; each link is the certificate it points to there
export const certifications = Certification.array().parse([
  {
    title: 'AWS Cloud Solutions Architect',
    issuer: 'Coursera',
    provider: 'AWS',
    icon: 'cloud',
    href: 'https://drive.google.com/file/d/1yke9b8EFH1ZPGIDtIS9gLN8YElCfSQbW/view?usp=drive_link',
  },
  {
    title: 'AWS Cloud Support Associate',
    issuer: 'Coursera',
    provider: 'AWS',
    icon: 'support',
    href: 'https://drive.google.com/file/d/1zHVOrlQLDMJrFoWcOYUJMSy3i9vGuXHY/view?usp=sharing',
  },
  {
    title: 'Meta Front-End Developer',
    issuer: 'Coursera',
    provider: 'Meta',
    icon: 'frontend',
    href: 'https://drive.google.com/file/d/1JuxGt9WbaJs-pcjq8UktE1u81wXVx1EY/view?usp=sharing',
  },
  {
    title: 'Meta Back-End Developer',
    issuer: 'Coursera',
    provider: 'Meta',
    icon: 'backend',
    href: 'https://drive.google.com/file/d/1hab2CxijwjI9r5yDxG5WO6NajfBDV8fQ/view?usp=sharing',
  },
]);
