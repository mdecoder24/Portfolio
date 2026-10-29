'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, MathUtils, NormalBlending, ShaderMaterial, Vector2 } from 'three';
import type { Group } from 'three';
import { useScene } from '@/stores/scene';
import { useScroll } from '@/stores/scroll';
import { sceneColors, type SceneColors } from './colors';
import { CAMERA_Z, FOV } from './HeroField';
import { dust } from './mosaic';
import { QUALITY } from './quality';

const HALF_H = CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
// The still frame (reduced motion) shows the dust part-way through its drift, not bunched at its start angles
const STILL_TIME = 40;

// position holds each particle's orbit (radius 0–1, start angle, height -1–1), not a point: the shader turns it into
// one, so the dust circles the page's axis, passes in front of and behind the camera, and rises with the scroll.
const dustVert = /* glsl */ `
uniform float uTime, uScroll, uRadius, uHeight, uProjScale, uSize;
attribute float aSeed;
varying float vAlpha;
varying float vAccent;
void main() {
  float r = position.x * uRadius;
  // Inner orbits turn a little faster, like a slow vortex; each particle keeps its own pace
  float a = position.y + uTime * (0.018 + 0.03 * (1.0 - position.x)) * (0.7 + 0.6 * aSeed);
  vec3 p = vec3(cos(a) * r, 0.0, sin(a) * r);
  // Nearer dust travels further with the scroll, which reads as depth; heights wrap top to bottom
  float near = smoothstep(-uRadius, uRadius, p.z);
  float y = position.z * uHeight + uTime * 0.05 * (0.5 + aSeed) + uScroll * mix(0.25, 1.0, near);
  p.y = mod(y + uHeight, 2.0 * uHeight) - uHeight;
  // A slow wander so the orbits never read as perfect circles
  p += vec3(sin(uTime * 0.21 + aSeed * 31.0), cos(uTime * 0.17 + aSeed * 17.0), sin(uTime * 0.13 + aSeed * 23.0)) * 0.35;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  gl_PointSize = clamp(uSize * (0.6 + 1.4 * aSeed * aSeed) * uProjScale / max(depth, 0.1), 1.0, 32.0);
  // Fades out just in front of the lens and in the far distance, and twinkles softly
  float twinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aSeed * 1.4) + aSeed * 80.0);
  vAlpha = smoothstep(1.2, 4.0, depth) * smoothstep(26.0, 14.0, depth) * twinkle;
  vAccent = step(0.97, aSeed);
}
`;

const dustFrag = /* glsl */ `
uniform vec3 uInk, uAccent;
uniform float uOpacity;
varying float vAlpha;
varying float vAccent;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.6) * vAlpha * uOpacity;
  if (a < 0.01) discard;
  gl_FragColor = vec4(mix(uInk, uAccent, vAccent), a);
  #include <colorspace_fragment>
}
`;

function Dust({ colors, count, still }: { colors: SceneColors; count: number; still: boolean }) {
  const size = useThree((s) => s.size);
  const group = useRef<Group>(null);
  const pointer = useRef(new Vector2());
  const scroll = useRef(0);

  const geometry = useMemo(() => {
    const { orbits, seeds } = dust(count);
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(orbits, 3));
    g.setAttribute('aSeed', new BufferAttribute(seeds, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: dustVert,
        fragmentShader: dustFrag,
        transparent: true,
        depthWrite: false,
        blending: colors.light ? NormalBlending : AdditiveBlending,
        uniforms: {
          uTime: { value: still ? STILL_TIME : 0 },
          uScroll: { value: 0 },
          uRadius: { value: 10 },
          uHeight: { value: HALF_H * 2.2 },
          uProjScale: { value: 1 },
          uSize: { value: 0.022 },
          uInk: { value: colors.ink },
          uAccent: { value: colors.accent },
          uOpacity: { value: colors.light ? 0.45 : 0.7 },
        },
      }),
    [colors, still],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // The canvas takes no pointer events (content sits above it), so the tilt follows the window; mouse only, since a
  // tap's position is not a gesture worth answering with motion
  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, 1 - (e.clientY / window.innerHeight) * 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [still]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.uProjScale.value = (size.height * state.viewport.dpr) / (2 * Math.tan((FOV * Math.PI) / 360));
    // Wide enough to fill the frame's width, with orbits that reach past the camera
    u.uRadius.value = Math.max(11, HALF_H * (size.width / size.height) * 1.8);
    if (still) return;

    u.uTime.value += delta;
    // Half the page's speed, in world units at z = 0
    const target = useScroll.getState().y * ((2 * HALF_H) / size.height) * 0.5;
    scroll.current = MathUtils.damp(scroll.current, target, 4, delta);
    u.uScroll.value = scroll.current;
    const g = group.current;
    if (g) {
      g.rotation.x = MathUtils.damp(g.rotation.x, -pointer.current.y * 0.06, 2, delta);
      g.rotation.y = MathUtils.damp(g.rotation.y, pointer.current.x * 0.1, 2, delta);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

/** Dust drifting in depth behind the whole page: its own fixed canvas, under the content and above the paper. */
export default function Backdrop({ tier, still, onReady }: { tier: 1 | 2 | 3; still: boolean; onReady: () => void }) {
  const quality = QUALITY[tier];
  const setTier = useScene((s) => s.setTier);
  const [colors, setColors] = useState(sceneColors);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mo = new MutationObserver(() => setColors(sceneColors()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, Math.min(quality.dprCap, 1.5)]}
      frameloop={!visible ? 'never' : still ? 'demand' : 'always'}
      camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', () => setTier(0, 'context-lost'), { once: true });
        requestAnimationFrame(onReady);
      }}
    >
      <Dust colors={colors} count={quality.dust} still={still} />
    </Canvas>
  );
}
