'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, NormalBlending, ShaderMaterial, Vector2 } from 'three';
import type { SceneColors } from './colors';
import { imageToCells, maskToCells, mulberry32, scatter, starfield } from './mosaic';

export const FOV = 35;
export const CAMERA_Z = 10;
const HALF_H = CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
const ASSEMBLE_SECONDS = 2.4;
// The KR glyphs span about two thirds of the sampled mask's width; the monogram fills this share of the frame's width
const GLYPH_SHARE = 0.66;
const MONOGRAM_FILL = 0.74;
// Photo cells per row for a given tier step (5, 6, 8 → 72, 60, 45 columns)
const PHOTO_COLS_PER_STEP = 360;
const PORTRAIT_ASPECT = 5 / 4;

type Anchor = { x: number; y: number; width: number; src: string | null; frame: HTMLElement | null };
type Cells = { geometry: BufferGeometry; cell: number; photo: boolean };

/**
 * Where the hero's portrait frame (#hero-portrait) sits, in world units at z = 0 relative to the canvas centre, and
 * which photo it holds (data-src). Measured on mount, on resize and once fonts settle; never per frame.
 */
function useFrameAnchor(): Anchor | null {
  const canvas = useThree((s) => s.gl.domElement);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  useEffect(() => {
    const frame = document.getElementById('hero-portrait');
    if (!frame) return;
    const measure = () => {
      const f = frame.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      if (c.height === 0) return;
      const unit = (2 * HALF_H) / c.height;
      setAnchor({
        x: (f.left + f.width / 2 - (c.left + c.width / 2)) * unit,
        y: (c.top + c.height / 2 - (f.top + f.height / 2)) * unit,
        width: f.width * unit,
        src: frame.dataset.src ?? null,
        frame,
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    ro.observe(canvas);
    void document.fonts.ready.then(measure);
    measure();
    return () => ro.disconnect();
  }, [canvas]);

  return anchor;
}

const mosaicVert = /* glsl */ `
uniform float uProgress, uTime, uPush, uProjScale, uCell;
uniform vec2 uPointer;
attribute vec3 aStart;
attribute float aSeed;
attribute float aTone;
varying float vShade;
varying float vAccent;
varying float vTone;
void main() {
  float t = clamp(uProgress * 1.35 - aSeed * 0.35, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 5.0);
  vec3 p = mix(aStart, position, e);
  vec2 d = p.xy - uPointer;
  float r = length(d);
  p.xy += normalize(d + 1e-5) * (1.0 - smoothstep(0.0, 0.16, r)) * 0.07 * uPush * e;
  p.z += sin(uTime * 0.6 + aSeed * 40.0) * 0.006;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uCell * uProjScale / -mv.z * 0.82;
  vShade = 0.35 + 0.65 * fract(aSeed * 91.7) + 0.12 * sin(uTime * 2.4 + aSeed * 210.0);
  vAccent = step(0.988, aSeed);
  vTone = aTone;
}
`;

// The monogram shades each cell from the ink colour; the photo uses each cell's own luminance with a slight flicker.
// Both keep the scattering of accent cells.
const mosaicFrag = /* glsl */ `
uniform vec3 uInk, uAccent;
uniform float uOpacity, uPhoto;
varying float vShade;
varying float vAccent;
varying float vTone;
void main() {
  vec3 monogram = uInk * clamp(vShade, 0.15, 1.0);
  // A gentle S-curve lifts the photo's contrast so it still reads through the gaps between cells; photo cells are
  // opaque so the page colour behind never washes them out
  float tone = smoothstep(0.0, 1.0, pow(vTone, 0.9));
  vec3 photo = vec3(tone) * (0.9 + 0.2 * fract(vShade * 7.0));
  vec3 colour = mix(mix(monogram, photo, uPhoto), uAccent, vAccent);
  gl_FragColor = vec4(colour, mix(uOpacity, 1.0, uPhoto));
  #include <colorspace_fragment>
}
`;

const starVert = /* glsl */ `
uniform float uTime, uPixelRatio;
attribute float aSeed;
varying float vAlpha;
void main() {
  vec3 p = position;
  p.z = mod(p.z + uTime * 0.35 + 10.0, 16.0) - 10.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.0 + 2.2 * aSeed) * uPixelRatio * 7.0 / -mv.z;
  vAlpha = (0.35 + 0.65 * aSeed) * (0.6 + 0.4 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 50.0)) * smoothstep(-10.0, -6.0, p.z) * smoothstep(6.0, 3.0, p.z);
}
`;

const starFrag = /* glsl */ `
uniform vec3 uInk;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.1, d) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uInk, a);
  #include <colorspace_fragment>
}
`;

/** Samples "KR" in the page's display face into an alpha mask, in the browser. */
function sampleMonogram(): { alpha: Uint8ClampedArray; width: number; height: number } {
  const width = 640;
  const height = 360;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { alpha: new Uint8ClampedArray(width * height), width, height };
  const family = getComputedStyle(document.body).fontFamily;
  ctx.font = `900 330px ${family}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText('KR', width / 2, height / 2 + 16);
  const data = ctx.getImageData(0, 0, width, height).data;
  const alpha = new Uint8ClampedArray(width * height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];
  return { alpha, width, height };
}

/** Loads the portrait and scales it, cover-cropped to 4:5, to one pixel per mosaic cell. */
async function samplePhoto(src: string, cols: number) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();
  const rows = Math.round(cols * PORTRAIT_ASPECT);
  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  const target = cols / rows;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (sw / sh > target) sw = sh * target;
  else sh = sw / target;
  ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
  return imageToCells(ctx.getImageData(0, 0, cols, rows).data, cols, rows);
}

function cellsGeometry(positions: Float32Array, count: number, tones?: Float32Array) {
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(positions, 3));
  g.setAttribute('aStart', new BufferAttribute(scatter(count), 3));
  const rand = mulberry32(3);
  g.setAttribute('aSeed', new BufferAttribute(Float32Array.from({ length: count }, rand), 1));
  g.setAttribute('aTone', new BufferAttribute(tones ?? new Float32Array(count), 1));
  return g;
}

/**
 * The frame's mosaic: the portrait's pixels when the frame names a photo, otherwise the KR monogram. The photo loads
 * asynchronously; once its cells exist the frame is marked data-mosaic="on" so the flat photo underneath can fade out.
 */
function useMosaic(src: string | null | undefined, frame: HTMLElement | null, step: number): Cells | null {
  const [cells, setCells] = useState<Cells | null>(null);

  useEffect(() => {
    if (src === undefined) return;
    let cancelled = false;
    let made: Cells | null = null;
    const build = async () => {
      if (src) {
        const photo = await samplePhoto(src, Math.round(PHOTO_COLS_PER_STEP / step)).catch(() => null);
        if (cancelled || !photo) return;
        made = { geometry: cellsGeometry(photo.positions, photo.count, photo.tones), cell: photo.cell, photo: true };
      } else {
        const { alpha, width, height } = sampleMonogram();
        const mask = maskToCells(alpha, width, height, step, 1);
        made = { geometry: cellsGeometry(mask.positions, mask.count), cell: mask.cell, photo: false };
      }
      setCells(made);
      if (frame) frame.dataset.mosaic = 'on';
    };
    void build();
    return () => {
      cancelled = true;
      made?.geometry.dispose();
      if (frame) delete frame.dataset.mosaic;
    };
  }, [src, frame, step]);

  return cells;
}

export function HeroField({
  colors,
  stars,
  step,
  still,
  delay,
}: {
  colors: SceneColors;
  stars: number;
  step: number;
  still: boolean;
  delay: number;
}) {
  const size = useThree((s) => s.size);
  const anchor = useFrameAnchor();
  const mosaic = useMosaic(anchor ? anchor.src : undefined, anchor?.frame ?? null, step);

  const field = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(starfield(stars), 3));
    const rand = mulberry32(5);
    g.setAttribute('aSeed', new BufferAttribute(Float32Array.from({ length: stars }, rand), 1));
    return g;
  }, [stars]);

  const materials = useMemo(
    () => ({
      mosaic: new ShaderMaterial({
        vertexShader: mosaicVert,
        fragmentShader: mosaicFrag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uProgress: { value: still ? 1 : 0 },
          uTime: { value: 0 },
          uPush: { value: 0 },
          uPointer: { value: new Vector2(99, 99) },
          uProjScale: { value: 1 },
          uCell: { value: 1 },
          uPhoto: { value: 0 },
          uInk: { value: colors.ink },
          uAccent: { value: colors.accent },
          uOpacity: { value: colors.light ? 0.9 : 0.95 },
        },
      }),
      stars: new ShaderMaterial({
        vertexShader: starVert,
        fragmentShader: starFrag,
        transparent: true,
        depthWrite: false,
        blending: colors.light ? NormalBlending : AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uInk: { value: colors.ink } },
      }),
    }),
    [colors, still],
  );

  // A new set of cells (the photo arriving after its download) assembles from the start
  useEffect(() => {
    if (!mosaic) return;
    const m = materials.mosaic.uniforms;
    m.uPhoto.value = mosaic.photo ? 1 : 0;
    m.uProgress.value = still ? 1 : 0;
  }, [mosaic, materials, still]);

  useEffect(
    () => () => {
      field.dispose();
      materials.mosaic.dispose();
      materials.stars.dispose();
    },
    [field, materials],
  );

  // The mosaic is `width` world units wide, centred in the portrait frame: the photo fills the frame, the monogram
  // sits inside it with a margin
  const halfAspect = HALF_H * (size.width / size.height);
  const x = anchor?.x ?? 0;
  const y = anchor?.y ?? 0;
  const width = anchor ? (mosaic?.photo ? anchor.width * 0.96 : (anchor.width * MONOGRAM_FILL) / GLYPH_SHARE) : 1;

  useFrame((state, delta) => {
    if (!mosaic) return;
    const m = materials.mosaic.uniforms;
    const dpr = state.viewport.dpr;
    m.uProjScale.value = (size.height * dpr) / (2 * Math.tan((FOV * Math.PI) / 360));
    m.uCell.value = mosaic.cell * width;
    materials.stars.uniforms.uPixelRatio.value = dpr;
    if (still) return;

    m.uTime.value += delta;
    materials.stars.uniforms.uTime.value += delta;
    if (m.uTime.value > delay) m.uProgress.value = Math.min(1, m.uProgress.value + delta / ASSEMBLE_SECONDS);
    // Pointer in the mosaic's local space: world units at z = 0, then undo its position and scale
    const target = 1 - Math.exp(-delta / 0.12);
    m.uPointer.value.x += ((state.pointer.x * halfAspect - x) / width - m.uPointer.value.x) * target;
    m.uPointer.value.y += ((state.pointer.y * HALF_H - y) / width - m.uPointer.value.y) * target;
    const fine = state.pointer.x !== 0 || state.pointer.y !== 0;
    m.uPush.value += ((fine ? 1 : 0) - m.uPush.value) * target;
  });

  return (
    <>
      <points geometry={field} material={materials.stars} frustumCulled={false} />
      {mosaic && (
        <points
          geometry={mosaic.geometry}
          material={materials.mosaic}
          position={[x, y, 0]}
          scale={width}
          frustumCulled={false}
        />
      )}
    </>
  );
}
