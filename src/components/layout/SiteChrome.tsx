import { Footer } from '@/components/sections/Footer';
import { config, profile } from '@/content';
import { NavBar } from './NavBar';

const socials = [
  { label: 'LinkedIn', href: config.links.linkedin },
  { label: 'GitHub', href: config.links.github },
];

/** Navigation, main landmark, and footer shared by every page. */
export function SiteChrome({ children, onHome = false }: { children: React.ReactNode; onHome?: boolean }) {
  return (
    <>
      <NavBar socials={socials} onHome={onHome} />
      <main id="main" tabIndex={-1} className="relative z-content focus:outline-none">
        {children}
      </main>
      <Footer config={config} name={profile.name} />
    </>
  );
}
