import type { CSSProperties } from 'react';

// Where the clients are; India's pin sits on Hyderabad, the rest on each country's capital
const PINS = [
  { code: 'IN', lat: 17.4, lon: 78.5 },
  { code: 'US', lat: 38.9, lon: -77 },
  { code: 'AE', lat: 24.5, lon: 54.4 },
  { code: 'ES', lat: 40.4, lon: -3.7 },
  { code: 'UK', lat: 51.5, lon: -0.1 },
];
const MERIDIANS = [0, 30, 60, 90, 120, 150];
const PARALLELS = [-60, -30, 0, 30, 60];

/**
 * A wireframe globe built from CSS 3D rings, turning slowly with a pin on each client country and a plane on an
 * inclined orbit. CSS rather than three.js, since only the page's one scene may use three; it is a picture of the
 * sentence beside it, so assistive technology skips it. Under reduced motion it stands still (see .globe in globals.css).
 */
export function TravelGlobe({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="globe">
        <div className="globe-tilt">
          <div className="globe-spin">
            {MERIDIANS.map((deg) => (
              <span key={`m${deg}`} className="globe-ring" style={{ transform: `rotateY(${deg}deg)` }} />
            ))}
            {PARALLELS.map((lat) => {
              const rad = (lat * Math.PI) / 180;
              return (
                <span
                  key={`p${lat}`}
                  className="globe-ring"
                  // Lifted to its latitude, laid flat, then shrunk to that latitude's width; scale goes last so it
                  // doesn't shrink the lift as well
                  style={{
                    transform: `translateY(calc(var(--globe-r) * ${(-Math.sin(rad)).toFixed(3)})) rotateX(90deg) scale(${Math.cos(rad).toFixed(3)})`,
                  }}
                />
              );
            })}
            {PINS.map((p) => (
              <span
                key={p.code}
                className="globe-pin"
                style={
                  {
                    transform: `rotateY(${p.lon}deg) rotateX(${p.lat}deg) translateZ(var(--globe-r))`,
                  } as CSSProperties
                }
              >
                <span className="globe-dot" />
                <span className="type-code text-accent">{p.code}</span>
              </span>
            ))}
          </div>
          <div className="globe-orbit">
            <span className="globe-plane" />
          </div>
        </div>
      </div>
    </div>
  );
}
