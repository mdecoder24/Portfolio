import type { Metadata, Viewport } from 'next';
import { PageObserver } from '@/components/layout/PageObserver';
import { SkipLink } from '@/components/layout/SkipLink';
import { config, profile } from '@/content';
import tokens from '../../design/tokens.json';
import { Intro } from '@/components/layout/Intro';
import { geistMono, instrumentSerif, interTight } from './fonts';
import './globals.css';

export const ensureStatic = 'navigation';

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title: { default: 'Kushwant KR – Full-stack and AI engineer in Hyderabad', template: '%s – Kushwant KR' },
  description:
    'Kushwant KR builds web products that think and move: full-stack apps, AI chatbots, and 3D on the web. Associate Software Engineer and freelance developer in Hyderabad.',
  authors: [{ name: profile.name, url: config.site.url }],
  alternates: { canonical: '/' },
  openGraph: { type: 'profile', siteName: 'Kushwant KR', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
};

// Theme colours for the browser chrome, read from the tokens rather than repeated here
const paper = tokens.color.tokens.find((t) => t.name === 'paper')?.value ?? { light: '', dark: '' };
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: paper.dark },
    { media: '(prefers-color-scheme: light)', color: paper.light },
  ],
  viewportFit: 'cover',
};

// Applies saved theme and motion preferences before first paint, so neither flashes
const prefScript = `try{var d=document.documentElement,t=localStorage.getItem('kr-theme');if(t==='dark'||t==='light')d.dataset.theme=t;var m=localStorage.getItem('kr-motion');if(m)d.dataset.motion=m}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-theme="dark"
      className={`${interTight.variable} ${instrumentSerif.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefScript }} />
      </head>
      <body id="top">
        <SkipLink />
        <Intro />
        <PageObserver />
        {children}
      </body>
    </html>
  );
}
