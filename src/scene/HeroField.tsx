'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, NormalBlending, ShaderMaterial, Vector2 } from 'three';
import type { SceneColors } from './colors';
import { maskToCells, mulberry32, scatter, starfield } from './mosaic';

export const FOV = 35;
export const CAMERA_Z = 10;
const HALF_H = CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
const ASSEMBLE_SECONDS = 2.4;

const mosaicVert = /* glsl */ `
uniform float uProgress, uTime, uPush, uProjScale, uCell;
uniform vec2 uPointer;
attribute vec3 aStart;
attribute float aSeed;
varying float vShade;
varying float vAccent;
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
}
`;

const mosaicFrag = /* glsl */ `
uniform vec3 uInk, uAccent;
uniform float uOpacity;
varying float vShade;
varying float vAccent;
void main() {
  vec3 colour = mix(uInk * clamp(vShade, 0.15, 1.0), uAccent, vAccent);
  gl_FragColor = vec4(colour, uOpacity);
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
  const phone = size.width / size.height < 0.8;

  const mosaic = useMemo(() => {
    const { alpha, width, height } = sampleMonogram();
    const cells = maskToCells(alpha, width, height, step, 1);
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(cells.positions, 3));
    g.setAttribute('aStart', new BufferAttribute(scatter(cells.count), 3));
    const rand = mulberry32(3);
    g.setAttribute('aSeed', new BufferAttribute(Float32Array.from({ length: cells.count }, rand), 1));
    return { geometry: g, cell: cells.cell };
  }, [step]);

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

  useEffect(
    () => () => {
      mosaic.geometry.dispose();
      field.dispose();
      materials.mosaic.dispose();
      materials.stars.dispose();
    },
    [mosaic, field, materials],
  );

  // The monogram is `width` world units wide. It sits as a mark in the top-right corner, clear of the name, which runs
  // across the left and middle of the hero; on phones it shrinks into the corner above the availability badge.
  const halfAspect = HALF_H * (size.width / size.height);
  // The glyphs fill about two thirds of the mask's width, so 0.34 × width puts their right edge on the page gutter.
  const width = phone ? 1.6 : Math.min(3.6, halfAspect * 0.7);
  const x = halfAspect * 0.92 - width * 0.34;
  const y = HALF_H * (phone ? 0.7 : 0.55);

  useFrame((state, delta) => {
    const m = materials.mosaic.uniforms;
    const dpr = state.viewport.dpr;
    m.uProjScale.value = (size.height * dpr) / (2 * Math.tan((FOV * Math.PI) / 360));
    m.uCell.value = mosaic.cell * width;
    materials.stars.uniforms.uPixelRatio.value = dpr;
    if (still) return;

    m.uTime.value += delta;
    materials.stars.uniforms.uTime.value += delta;
    if (m.uTime.value > delay) m.uProgress.value = Math.min(1, m.uProgress.value + delta / ASSEMBLE_SECONDS);
    // Pointer in the monogram's local space: world units at z = 0, then undo its position and scale
    const target = 1 - Math.exp(-delta / 0.12);
    m.uPointer.value.x += ((state.pointer.x * halfAspect - x) / width - m.uPointer.value.x) * target;
    m.uPointer.value.y += ((state.pointer.y * HALF_H - y) / width - m.uPointer.value.y) * target;
    const fine = state.pointer.x !== 0 || state.pointer.y !== 0;
    m.uPush.value += ((fine ? 1 : 0) - m.uPush.value) * target;
  });

  return (
    <>
      <points geometry={field} material={materials.stars} frustumCulled={false} />
      <points geometry={mosaic.geometry} material={materials.mosaic} position={[x, y, 0]} scale={width} frustumCulled={false} />
    </>
  );
}
