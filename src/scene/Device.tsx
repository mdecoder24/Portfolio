'use client';

import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { type Group, SRGBColorSpace } from 'three';

// A project's screenshot on a 3D device: a phone or a laptop built from rounded solids, lit by a procedural studio
// (no HDR download) with a soft contact shadow. The laptop lid opens once when it first appears; the device turns
// with the row's scroll position and leans towards the pointer.

export type DeviceKind = 'phone' | 'laptop';
type Motion = { scroll: { current: number }; pointer: { current: { x: number; y: number } } };

const BODY = { color: '#1b1c20', metalness: 0.75, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 } as const;
const ALUMINIUM = { color: '#a7abb3', metalness: 0.9, roughness: 0.32 } as const;
const OPEN = -0.22; // lid angle when open, radians back from upright
const CLOSED = Math.PI / 2 - 0.02;

function Screen({ src, width, height, z }: { src: string; width: number; height: number; z: number }) {
  const map = useTexture(src);
  map.colorSpace = SRGBColorSpace;
  map.anisotropy = 8;
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
}

function Phone({ src }: { src: string }) {
  return (
    <group>
      <RoundedBox args={[1.62, 3.3, 0.18]} radius={0.2} smoothness={6}>
        <meshPhysicalMaterial {...BODY} />
      </RoundedBox>
      <Screen src={src} width={1.48} height={3.16} z={0.0905} />
      <RoundedBox args={[0.42, 0.11, 0.01]} radius={0.05} position={[0, 1.43, 0.095]}>
        <meshBasicMaterial color="#050505" />
      </RoundedBox>
      {[0.75, 0.35].map((y) => (
        <RoundedBox key={y} args={[0.03, 0.28, 0.06]} radius={0.012} position={[-0.825, y, 0]}>
          <meshPhysicalMaterial {...BODY} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Laptop({ src, still }: { src: string; still: boolean }) {
  const lid = useRef<Group>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    if (!lid.current) return;
    if (still) {
      lid.current.rotation.x = OPEN;
      return;
    }
    // The lid opens over 1.6 s on an ease-out, starting a beat after the canvas appears
    t.current = Math.min(1, t.current + delta / 1.6);
    const k = Math.max(0, (t.current - 0.12) / 0.88);
    const e = 1 - Math.pow(1 - k, 4);
    lid.current.rotation.x = CLOSED + (OPEN - CLOSED) * e;
  });
  return (
    <group position={[0, -0.9, 0]}>
      <RoundedBox args={[3.7, 0.11, 2.5]} radius={0.05} smoothness={4}>
        <meshStandardMaterial {...ALUMINIUM} />
      </RoundedBox>
      <mesh position={[0, 0.056, -0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.3]} />
        <meshStandardMaterial color="#26282d" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.056, 0.78]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.25, 0.72]} />
        <meshStandardMaterial color="#8f949c" metalness={0.8} roughness={0.25} />
      </mesh>
      <group ref={lid} position={[0, 0.06, -1.24]} rotation={[still ? OPEN : CLOSED, 0, 0]}>
        <RoundedBox args={[3.7, 2.42, 0.07]} radius={0.04} smoothness={4} position={[0, 1.21, 0]}>
          <meshStandardMaterial {...ALUMINIUM} />
        </RoundedBox>
        <mesh position={[0, 1.21, 0.0355]}>
          <planeGeometry args={[3.6, 2.32]} />
          <meshBasicMaterial color="#060607" />
        </mesh>
        <group position={[0, 1.23, 0]}>
          <Screen src={src} width={3.44} height={2.15} z={0.037} />
        </group>
      </group>
    </group>
  );
}

function Rig({ kind, src, motion, still }: { kind: DeviceKind; src: string; motion: Motion; still: boolean }) {
  const group = useRef<Group>(null);
  const time = useRef(0);
  const base = kind === 'phone' ? 0.35 : -0.35;
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    if (still) {
      g.rotation.set(0.04, base * 0.6, 0);
      return;
    }
    time.current += delta;
    const k = 1 - Math.exp(-delta / 0.2);
    const { x, y } = motion.pointer.current;
    const targetY = base * 0.5 - motion.scroll.current * 0.55 + x * 0.25;
    const targetX = 0.05 + y * 0.12;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.position.y = Math.sin(time.current * 0.9) * 0.05;
  });
  return (
    <group ref={group}>
      {kind === 'phone' ? <Phone src={src} /> : <Laptop src={src} still={still} />}
    </group>
  );
}

export default function Device({
  kind,
  src,
  motion,
  still,
  dprCap,
  onReady,
}: {
  kind: DeviceKind;
  src: string;
  motion: Motion;
  still: boolean;
  dprCap: number;
  onReady: () => void;
}) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, dprCap]}
      frameloop={still ? 'demand' : 'always'}
      camera={kind === 'phone' ? { fov: 26, position: [0, 0.1, 8.6] } : { fov: 28, position: [0, 1.5, 8.2] }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => {
        camera.lookAt(0, kind === 'phone' ? 0 : -0.1, 0);
        requestAnimationFrame(() => requestAnimationFrame(onReady));
      }}
    >
      <ambientLight intensity={0.25} />
      <spotLight position={[0, 7, 3]} angle={0.5} penumbra={0.8} intensity={60} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 4]} scale={[8, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 1]} scale={[3, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={1.6} position={[5, 2, -3]} scale={3} target={[0, 0, 0]} />
      </Environment>
      <Suspense fallback={null}>
        <Rig kind={kind} src={src} motion={motion} still={still} />
      </Suspense>
      <ContactShadows
        position={[0, kind === 'phone' ? -1.95 : -1.0, 0]}
        opacity={0.65}
        scale={10}
        blur={2.6}
        far={4}
        resolution={512}
        frames={still ? 1 : Infinity}
      />
    </Canvas>
  );
}
