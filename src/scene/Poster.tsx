import { buildFormations, PEARL_PLACEMENT, projectToNdc } from './formations';

// The inline-SVG stand-in for the 3D scene: rendered on the server, about 3 KB, drawn from the same seed as the
// first WebGL frame so the cross-fade reads as the scene waking up. Also the whole visual at tier 0.

const POINTS = 120;
const orbit = buildFormations(POINTS).orbit;

function Composition({
  w,
  h,
  placement,
  id,
}: {
  w: number;
  h: number;
  placement: { x: number; y: number; scale: number };
  id: string;
}) {
  const aspect = w / h;
  const toPx = (x: number, y: number, z: number) => {
    const [nx, ny, depth] = projectToNdc(x, y, z, aspect);
    return { cx: ((nx + 1) / 2) * w, cy: ((1 - ny) / 2) * h, depth };
  };
  const centre = toPx(placement.x, placement.y, 0);
  const radius = (placement.scale / (8 * Math.tan((35 * Math.PI) / 360))) * (h / 2);

  const dots = [];
  for (let i = 0; i < POINTS; i++) {
    const p = toPx(
      placement.x + orbit[i * 3] * placement.scale,
      placement.y + orbit[i * 3 + 1] * placement.scale,
      orbit[i * 3 + 2] * placement.scale,
    );
    // Particles behind the pearl are hidden by it in 3D; skip them here too
    const behind = orbit[i * 3 + 2] < 0 && Math.hypot(p.cx - centre.cx, p.cy - centre.cy) < radius;
    if (behind) continue;
    const r = (1.2 + ((i * 7919) % 100) / 60) * (8 / p.depth);
    dots.push(
      <circle
        key={i}
        cx={p.cx.toFixed(1)}
        cy={p.cy.toFixed(1)}
        r={r.toFixed(2)}
        fill={i % 7 === 0 ? 'var(--scene-particle-glow)' : 'var(--scene-particle)'}
        opacity={(0.35 + (i % 5) * 0.12).toFixed(2)}
      />,
    );
  }

  return (
    <>
      {dots}
      <circle cx={centre.cx} cy={centre.cy} r={radius} fill={`url(#${id}-body)`} />
      <circle cx={centre.cx} cy={centre.cy} r={radius} fill={`url(#${id}-rose)`} />
      <circle cx={centre.cx} cy={centre.cy} r={radius} fill={`url(#${id}-aqua)`} />
      <circle cx={centre.cx} cy={centre.cy} r={radius} fill={`url(#${id}-hi)`} />
    </>
  );
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-body`} cx="50%" cy="46%" r="55%">
        <stop offset="55%" stopColor="var(--scene-pearl)" />
        <stop offset="100%" stopColor="#b7c2c6" />
      </radialGradient>
      <radialGradient id={`${id}-rose`} cx="22%" cy="74%" r="46%">
        <stop offset="5%" stopColor="var(--scene-sheen-rose)" stopOpacity="0.9" />
        <stop offset="100%" stopColor="var(--scene-sheen-rose)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-aqua`} cx="72%" cy="78%" r="48%">
        <stop offset="6%" stopColor="var(--scene-sheen-aqua)" stopOpacity="0.9" />
        <stop offset="100%" stopColor="var(--scene-sheen-aqua)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-hi`} cx="34%" cy="28%" r="32%">
        <stop offset="9%" stopColor="#fff" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function Poster({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <svg className="hidden size-full sm:block" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <Defs id="poster-d" />
        <Composition id="poster-d" w={1600} h={1000} placement={PEARL_PLACEMENT.desktop} />
      </svg>
      <svg className="size-full sm:hidden" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <Defs id="poster-m" />
        <Composition id="poster-m" w={400} h={800} placement={PEARL_PLACEMENT.phone} />
      </svg>
    </div>
  );
}
