import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ type: ['display', 'h1', 'h2', 'h3', 'h4', 'lead', 'body', 'ui', 'small', 'caption', 'code'] }],
      z: [{ z: ['canvas', 'content', 'nav', 'launcher', 'chat', 'palette', 'toast', 'skip'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
