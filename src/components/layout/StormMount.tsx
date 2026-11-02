'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Storm = dynamic(() => import('@/scene/Storm'), { ssr: false });

function allowed() {
  const intro = document.getElementById('intro');
  if (!intro || getComputedStyle(intro).display === 'none') return false;
  if (/[?&](3d|tier)=off/.test(location.search)) return false;
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return false;
  try {
    if (localStorage.getItem('kr-3d-v2') === 'off') return false;
  } catch {
    // Storage unavailable (private mode): no saved choice, so 3D stays on
  }
  return !!document.createElement('canvas').getContext('webgl2');
}

/**
 * Mounts the intro's 3D storm over its flat fallback. The fallback plays from first paint, so a slow load still has a
 * storm to look at; the canvas fades in on top once it can draw.
 */
export function StormMount() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOk(allowed()));
    return () => cancelAnimationFrame(id);
  }, []);

  return ok ? <Storm onFail={() => setOk(false)} /> : null;
}
