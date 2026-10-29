# src/scene/AGENTS.md

Everything here is client-only three.js, and it is decoration: the page must work without it.

## Structure
- SceneRoot.tsx owns the only <Canvas>. Never add a second canvas, and never put page
  content in drei <Html>: content stays in the DOM.
- Visual values (colours, counts, sizes, timings) come from the design system through
  colors.ts and useQuality.ts. Never hard-code them in a component.
- colors.ts reads the scene-* CSS variables once at mount, and again only when data-theme
  changes. Never call getComputedStyle per frame.

## The frame loop
- Per-frame work lives in useFrame. Read stores with getState(); never subscribe a scene
  component to per-frame values, and never call setState or a store setter inside useFrame.
- No allocation inside useFrame: create Vector3, Color, and Matrix4 once and reuse them.
- Animate with delta so speed is the same at 60 and 120 Hz: MathUtils.damp, or maath easing.
- Mutate uniforms in place: material.uniforms.uTime.value += delta.
- In demand mode (reduced motion), call invalidate() after a change.

## Resources
- Geometries, materials, and textures made with new or in useMemo are disposed in an effect
  cleanup. Objects declared in JSX are disposed by Fiber.
- formations.ts builds every buffer once from the fixed seed. Never rebuild on resize or scroll.
- All particles are one Points draw call. High stays within 20 draw calls and 150,000 triangles.

## Shaders
- .glsl files import as strings (next.config.ts turbopack rule type 'raw'; a Vitest plugin
  does the same in tests; src/types/glsl.d.ts declares the module).
- A custom ShaderMaterial fragment shader ends with #include <tonemapping_fragment> and
  #include <colorspace_fragment>, or its colours will not match the rest of the scene.
- Colours enter shaders as THREE.Color uniforms, which three converts to linear space.
- Clamp gl_PointSize; particle materials use depthWrite: false and additive blending.

## Tiers and failure
- Every feature reads the tier from useQuality(). Low: no postprocessing, the simplified
  pearl, pixel ratio 1. Off: no canvas at all.
- EffectComposer gets multisampling={0} below High; the canvas antialias setting is ignored
  once postprocessing runs.
- On webglcontextlost, drop to tier 0 and show the poster.
- Reduced motion: one still frame; no opening, no morphing, no pointer effects.
- r3f-perf and leva load only behind ?perf and ?tune, through a dynamic import, in development.

## Testing
- Pure logic (formations, scroll weights, tier choice) gets Vitest tests with no WebGL.
- Playwright smoke tests use ?tier=low: headless Chromium renders WebGL in software.

## Notes for this repo
- Shaders live as strings in shaders.ts rather than .glsl files, so no turbopack raw rule is needed yet.
- rig.ts holds per-frame values shared between scene components (opening progress, damped weights).
- Exception to the one-canvas rule, approved by the owner: Backdrop.tsx is a second, fixed full-viewport canvas
  (z-canvas) of drifting dust behind the whole home page, mounted through src/components/layout/BackdropMount.tsx.
  It follows the tier SceneMount chooses. Smoke.tsx and Device.tsx also run their own canvases.
