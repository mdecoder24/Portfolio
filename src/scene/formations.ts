// Builds the five particle formations once, from a seeded generator, so the SVG poster and the first WebGL frame agree.
// Pure maths with no three.js import: the server-rendered poster uses it too. Values from Nacre "Formations".

export const FORMATIONS = ['orbit', 'layers', 'clusters', 'field', 'wave'] as const;
export type Formation = (typeof FORMATIONS)[number];

/** Per-formation opacity, in FORMATIONS order. */
// Tuned by eye from the Nacre starting values (1, 0.8, 0.8, 0.35, 0.6) so text over Clusters stays readable
export const FORMATION_OPACITY = [1, 0.8, 0.5, 0.35, 0.6] as const;

/** Where the pearl sits in the hero, in world units (camera at z 8, fov 35). */
export const PEARL_PLACEMENT = {
  desktop: { x: 1.9, y: 0.2, scale: 1 },
  phone: { x: 1.1, y: 1.6, scale: 0.75 },
} as const;

export const SEED = 0x6b72; // "kr"

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

const TILT = (20 * Math.PI) / 180;

/** Orbit, relative to the pearl: a tilted ring of radius 2.6 with a 15% halo at radius 4–6. */
function orbitPoint(rand: () => number, out: number[]) {
  const theta = rand() * Math.PI * 2;
  let x: number, y: number, z: number;
  if (rand() < 0.15) {
    const r = 4 + rand() * 2;
    const phi = Math.acos(2 * rand() - 1);
    x = r * Math.sin(phi) * Math.cos(theta);
    y = r * Math.cos(phi) * 0.55;
    z = r * Math.sin(phi) * Math.sin(theta);
  } else {
    const r = 2.6 + gaussian(rand) * 0.35;
    x = r * Math.cos(theta);
    y = gaussian(rand) * 0.35 * 0.5;
    z = r * Math.sin(theta);
  }
  // Tilt the ring 20° towards the camera around the x axis, then 20° around z for a diagonal read
  const y1 = y * Math.cos(TILT) - z * Math.sin(TILT);
  const z1 = y * Math.sin(TILT) + z * Math.cos(TILT);
  out.push(x * Math.cos(TILT) - y1 * Math.sin(TILT), x * Math.sin(TILT) + y1 * Math.cos(TILT), z1);
}

const SHELLS = [1.3, 1.7, 2.1, 2.5, 2.9];
export const LAYERS_CENTRE_X = 2.6;
const LAYERS_CENTRE = [LAYERS_CENTRE_X, -0.2, -0.5];

function layersPoint(rand: () => number, out: number[]) {
  const r = SHELLS[Math.floor(rand() * SHELLS.length)] + gaussian(rand) * 0.03;
  const theta = rand() * Math.PI * 2;
  const phi = Math.acos(2 * rand() - 1);
  // Flatten in z so the shells read as a cross-section of nacre
  out.push(
    LAYERS_CENTRE[0] + r * Math.sin(phi) * Math.cos(theta),
    LAYERS_CENTRE[1] + r * Math.cos(phi),
    LAYERS_CENTRE[2] + r * Math.sin(phi) * Math.sin(theta) * 0.35,
  );
}

const CLUSTER_COUNT = 4;

function clustersPoint(rand: () => number, i: number, out: number[]) {
  const c = i % CLUSTER_COUNT;
  const t = c / (CLUSTER_COUNT - 1);
  const cx = -3 + 6 * t;
  const cy = 1.2 + Math.sin(t * Math.PI) * 0.9; // an arc across the top of the screen
  out.push(cx + gaussian(rand) * 0.45, cy + gaussian(rand) * 0.45, -1 + gaussian(rand) * 0.45);
}

function fieldPoint(rand: () => number, out: number[]) {
  out.push((rand() - 0.5) * 14, (rand() - 0.5) * 8, (rand() - 0.5) * 6 - 1);
}

function wavePoint(rand: () => number, out: number[]) {
  out.push((rand() - 0.5) * 14, -1.6, (rand() - 0.5) * 6 - 1);
}

export type FormationBuffers = {
  count: number;
  orbit: Float32Array;
  layers: Float32Array;
  clusters: Float32Array;
  field: Float32Array;
  wave: Float32Array;
  seed: Float32Array;
};

export function buildFormations(count: number, seed = SEED): FormationBuffers {
  const rand = mulberry32(seed);
  const o: number[] = [];
  const l: number[] = [];
  const c: number[] = [];
  const f: number[] = [];
  const w: number[] = [];
  const s = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // Each particle draws from every formation in the same order, so a prefix of N particles is stable across tiers
    orbitPoint(rand, o);
    layersPoint(rand, l);
    clustersPoint(rand, i, c);
    fieldPoint(rand, f);
    wavePoint(rand, w);
    s[i] = rand();
  }
  return {
    count,
    orbit: new Float32Array(o),
    layers: new Float32Array(l),
    clusters: new Float32Array(c),
    field: new Float32Array(f),
    wave: new Float32Array(w),
    seed: s,
  };
}

/** Projects a world point through the scene camera (fov 35°, z 8) to normalised device coordinates. */
export function projectToNdc(x: number, y: number, z: number, aspect: number): [number, number, number] {
  const f = 1 / Math.tan((35 * Math.PI) / 360);
  const depth = 8 - z;
  return [(x * f) / (depth * aspect), (y * f) / depth, depth];
}
