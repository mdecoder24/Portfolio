// The single content entry point: pages import from here and pass typed props down.
import { sensai } from './projects/sensai.ts';
import { signLanguageRecognition } from './projects/sign-language-recognition.ts';
import { tedxMlrit } from './projects/tedx-mlrit.ts';
import type { CaseStudy } from './schema.ts';

export { config } from './config.ts';
export { profile } from './profile.ts';
export { experience } from './experience.ts';
export { skills } from './skills.ts';
export { education, achievements } from './education.ts';

export const projects: CaseStudy[] = [sensai, signLanguageRecognition, tedxMlrit];

export const caseStudyHref = (c: CaseStudy) => `/projects/${c.slug}`;
