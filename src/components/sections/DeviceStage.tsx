'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { CaseStudy } from '@/content/schema';
import { cn } from '@/lib/cn';
import { useScene } from '@/stores/scene';
import { prefersReducedMotion, useUi } from '@/stores/ui';

const Device = dynamic(() => import('@/scene/Device'), { ssr: false });

const DPR: Record<number, number> = { 1: 1, 2: 1.5, 3: 2 };

/**
 * The 3D device for one project row. The flat screenshot renders first (and stays when 3D is off); the WebGL device
 * mounts only while the row is near the viewport, so at most a couple of these canvases exist at once.
 */
export function DeviceStage({ study, priority = false }: { study: CaseStudy; priority?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const tier = useScene((s) => s.tier);
  useUi((s) => s.motionPref); // re-render when the visitor changes motion, so `still` follows it
  const still = typeof window !== 'undefined' && prefersReducedMotion();
  const on = near && tier > 0;
  // A laptop project with a phone screenshot shows both devices, flat and in 3D
  const pair = study.media.device === 'laptop' ? study.media.screen : undefined;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '300px 0px' });
    io.observe(el);
    // Scroll position of the row: -1 entering at the bottom, 0 centred, 1 leaving at the top
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      scroll.current = Math.max(-1, Math.min(1, (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight));
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.current = { x: (e.clientX / innerWidth) * 2 - 1, y: -((e.clientY / innerHeight) * 2 - 1) };
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div
      ref={host}
      // Lifts a touch under the pointer, so the project reads as something you can pick up and open
      className="relative aspect-[16/11] overflow-hidden rounded-lg border border-rule transition-[translate,border-color] duration-240 ease-out-quint hover:-translate-y-1 hover:border-rule-strong bg-[radial-gradient(ellipse_at_50%_20%,var(--plate-hover),var(--paper)_70%)]"
    >
      {/* A pool of light on the floor under the device, like a studio shot */}
      <span
        aria-hidden="true"
        className="absolute inset-x-[10%] bottom-[6%] h-1/3 rounded-[50%] bg-[radial-gradient(closest-side,var(--rule-strong),transparent)] opacity-60 blur-xl"
      />
      <Image
        src={study.media.src}
        alt={study.media.alt}
        width={1600}
        height={1000}
        sizes="(min-width: 1024px) 640px, 100vw"
        priority={priority}
        loading="eager"
        unoptimized={study.media.src.endsWith('.svg')}
        className={cn(
          'absolute inset-[9%] h-[82%] w-[82%] rounded-sm object-contain transition-opacity duration-700',
          ready && on && 'opacity-0',
        )}
      />
      {pair && (
        <div
          className={cn(
            'absolute right-[5%] bottom-[7%] w-[17%] rounded-lg border border-rule-strong bg-paper p-1 shadow-float transition-opacity duration-700',
            ready && on && 'opacity-0',
          )}
        >
          <Image
            src={pair}
            alt=""
            width={390}
            height={833}
            sizes="(min-width: 1024px) 120px, 20vw"
            loading="eager"
            className="aspect-[390/833] w-full rounded-md object-cover object-top"
          />
        </div>
      )}
      {on && (
        <div className={cn('absolute inset-0 opacity-0 transition-opacity duration-700', ready && 'opacity-100')}>
          <Device
            kind={study.media.device}
            src={study.media.device === 'phone' ? (study.media.screen ?? study.media.src) : study.media.src}
            screen={pair}
            motion={{ scroll, pointer }}
            still={still}
            dprCap={DPR[tier] ?? 1.5}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  );
}
