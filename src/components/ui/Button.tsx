import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'quiet';

type Common = {
  variant?: Variant;
  size?: 'md' | 'sm';
  icon?: ReactNode;
  busy?: boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string; download?: boolean | string } & Omit<ComponentProps<'a'>, 'href' | 'children'>;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<'button'>, 'children'>;

export function buttonClasses({ variant = 'primary', size = 'md' }: { variant?: Variant; size?: 'md' | 'sm' }) {
  return cn(
    'inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-pill px-6 type-ui',
    'transition-[background-color,color,transform] duration-150 ease-nacre-out focus-visible:outline-none focus-visible:shadow-focus active:translate-y-px',
    'aria-disabled:opacity-45 aria-disabled:pointer-events-none',
    variant === 'primary' && 'bg-rose text-on-rose hover:bg-rose-hover',
    variant === 'secondary' && 'border-[1.5px] border-line-strong text-pearl hover:bg-shoal',
    variant === 'quiet' && 'min-h-11 px-2 text-rose hover:text-rose-hover hover:underline underline-offset-4',
    size === 'sm' && variant !== 'quiet' && 'min-h-10 px-4 text-sm',
  );
}

function Spinner() {
  return (
    <svg className="size-5 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Button(props: AsLink | AsButton) {
  const { variant, size, icon, busy, className, children, ...rest } = props;
  const classes = cn(buttonClasses({ variant, size }), className);
  const content = (
    <>
      {busy ? <Spinner /> : icon}
      {children}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchor } = rest as AsLink;
    const external = /^https?:/.test(href) || href.startsWith('mailto:') || 'download' in anchor;
    if (external) {
      return (
        <a href={href} className={classes} {...anchor}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {content}
      </Link>
    );
  }
  const { type = 'button', ...button } = rest as AsButton;
  return (
    <button type={type} className={classes} aria-busy={busy || undefined} {...button}>
      {content}
    </button>
  );
}
