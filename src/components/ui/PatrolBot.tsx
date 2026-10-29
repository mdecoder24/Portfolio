/**
 * A small pixel robot that patrols the hero's fact strip, standing on its top rule: it runs to one end, turns round
 * and runs back. Pure CSS (see .patrol in globals.css), so it needs no JavaScript and keeps running smoothly while the
 * 3D scene loads; reduced motion leaves it standing still. Drawn on an 11 × 13 pixel grid to match the mosaic.
 */
export function PatrolBot() {
  return (
    <span aria-hidden="true" className="patrol pointer-events-none absolute inset-x-0 bottom-full h-[39px]">
      <span className="patrol-run block w-[33px]">
        <svg
          className="patrol-face block text-ink-2"
          width="33"
          height="39"
          viewBox="0 0 11 13"
          shapeRendering="crispEdges"
        >
          <g className="patrol-bob">
            {/* Antenna with a lit tip */}
            <rect x="5" y="0" width="1" height="1" fill="var(--accent)" />
            <rect x="5" y="1" width="1" height="1" fill="currentColor" />
            {/* Head, eyes set forward so it reads as facing its direction of travel */}
            <rect x="1" y="2" width="9" height="5" fill="currentColor" />
            <rect x="5" y="4" width="1" height="1" fill="var(--accent)" />
            <rect x="8" y="4" width="1" height="1" fill="var(--accent)" />
            <rect x="4" y="7" width="3" height="1" fill="currentColor" />
            {/* Body, arms and a chest light */}
            <rect x="2" y="8" width="7" height="3" fill="currentColor" />
            <rect x="1" y="8" width="1" height="2" fill="currentColor" />
            <rect x="9" y="8" width="1" height="2" fill="currentColor" />
            <rect x="5" y="9" width="1" height="1" fill="var(--paper)" />
          </g>
          {/* Two leg poses, swapped in turn for the run cycle */}
          <g className="patrol-legs">
            <rect x="3" y="11" width="1" height="2" fill="currentColor" />
            <rect x="7" y="11" width="1" height="1" fill="currentColor" />
            <rect x="8" y="12" width="1" height="1" fill="currentColor" />
          </g>
          <g className="patrol-legs patrol-legs-alt">
            <rect x="2" y="12" width="1" height="1" fill="currentColor" />
            <rect x="3" y="11" width="1" height="1" fill="currentColor" />
            <rect x="7" y="11" width="1" height="2" fill="currentColor" />
          </g>
        </svg>
      </span>
    </span>
  );
}
