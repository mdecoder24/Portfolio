import { Geist_Mono, Instrument_Serif, Inter_Tight } from 'next/font/google';

// Inter Tight carries display and text (tight, heavy cuts for the big words); Instrument Serif italic is the one
// accent word in a title; Geist Mono sets the small labels.
export const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter-tight',
  display: 'swap',
});
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic'],
  variable: '--font-instrument',
  display: 'swap',
});
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
});
