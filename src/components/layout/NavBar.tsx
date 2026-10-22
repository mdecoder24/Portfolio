'use client';

import { Download, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useUi } from '@/stores/ui';
import { Monogram } from './Monogram';
import { NAV_ITEMS, RESUME_HREF } from './navItems';

export function NavBar({ socials, onHome }: { socials: { label: string; href: string }[]; onHome: boolean }) {
  const active = useUi((s) => s.activeSection);
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hash = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const close = () => dialog.current?.close();

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-[env(safe-area-inset-top)] z-nav h-(--nav-height) border-b border-transparent transition-[background-color,border-color] duration-200 data-[scrolled=true]:border-line data-[scrolled=true]:bg-lagoon-veil data-[scrolled=true]:backdrop-blur-md"
    >
      <nav aria-label="Main" className="container-nacre flex h-full items-center gap-8">
        <Monogram />
        <ul className="ml-auto hidden items-center gap-1 min-[860px]:flex">
          {NAV_ITEMS.map((item) => {
            const current = onHome && active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={hash(item.id)}
                  aria-current={current ? 'location' : undefined}
                  className={cn(
                    'relative inline-flex min-h-11 items-center rounded-xs px-3 type-ui font-[560] text-mist transition-colors duration-150 hover:text-pearl focus-visible:outline-none focus-visible:shadow-focus',
                    'after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-rose after:opacity-0 after:transition-opacity aria-[current=location]:text-pearl aria-[current=location]:after:opacity-100',
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="ml-auto flex items-center gap-2 min-[860px]:ml-0">
          <Button href={RESUME_HREF} download="Kushwant-KR-Resume.pdf" variant="secondary" size="sm" icon={<Download className="size-4" strokeWidth={1.75} aria-hidden="true" />}>
            Résumé
          </Button>
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => dialog.current?.showModal()}
            className="inline-flex size-11 items-center justify-center rounded-pill text-pearl hover:bg-shoal focus-visible:outline-none focus-visible:shadow-focus min-[860px]:hidden"
          >
            <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </nav>

      <dialog
        ref={dialog}
        aria-label="Menu"
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-md rounded-l-lg bg-reef p-0 text-pearl inset-shadow-lustre backdrop:bg-lagoon-veil backdrop:backdrop-blur-sm open:flex open:flex-col"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="flex h-(--nav-height) items-center justify-between px-4">
          <span className="type-ui text-mist">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="inline-flex size-11 items-center justify-center rounded-pill hover:bg-shoal focus-visible:outline-none focus-visible:shadow-focus"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <ul className="grid gap-1 px-4 pt-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={hash(item.id)}
                onClick={close}
                className="flex min-h-14 items-center rounded-sm px-2 type-h3 hover:bg-shoal focus-visible:outline-none focus-visible:shadow-focus"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto grid gap-4 border-t border-line p-6 pb-[max(24px,env(safe-area-inset-bottom))]">
          <Button href={RESUME_HREF} download="Kushwant-KR-Resume.pdf" variant="secondary" icon={<Download className="size-5" strokeWidth={1.75} aria-hidden="true" />}>
            Résumé
          </Button>
          <ul className="flex flex-wrap gap-4">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="type-ui text-rose underline underline-offset-4 hover:text-rose-hover">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </header>
  );
}
