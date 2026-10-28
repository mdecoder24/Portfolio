import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTs,
  {
    // three.js objects (materials, uniforms) are mutable by design and are mutated inside useFrame,
    // never during render (src/scene/AGENTS.md "The frame loop")
    files: ['src/scene/**/*.tsx'],
    rules: { 'react-hooks/immutability': 'off' },
  },
  { ignores: ['.next/**', 'node_modules/**', 'Guide/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**'] },
];

export default config;
