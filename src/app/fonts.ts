import { Geist, Geist_Mono } from 'next/font/google';

// Geist carries display and text (one family, many weights, so hierarchy comes from size and weight alone);
// Geist Mono sets dates, numbers and small metadata.
export const geist = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist',
  display: 'swap',
});
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
});
