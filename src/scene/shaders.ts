// Particle shaders, kept as strings so no bundler rule is needed. Blends five formations by scroll weight.
export const particlesVert = /* glsl */ `
uniform float uW[5];
uniform float uTime, uSize, uPixelRatio, uPointerStrength, uXScale;
uniform vec2 uPointer;      // pointer in normalised device coordinates
uniform vec3 uOrbitCentre;  // the pearl's hero position: the orbit is built relative to it
uniform float uOrbitScale;
attribute vec3 aLayers, aClusters, aField, aWave;
attribute float aSeed;
varying float vGlow;
varying float vFade;

void main() {
  vec3 orbit = uOrbitCentre + position * uOrbitScale;
  vec3 rest = aLayers * uW[1] + aClusters * uW[2] + aField * uW[3] + aWave * uW[4];
  rest.x *= uXScale;
  vec3 p = orbit * uW[0] + rest;
  // Idle drift, and the Wave's calm swell
  p += 0.04 * vec3(sin(uTime * 0.3 + aSeed * 40.0), cos(uTime * 0.25 + aSeed * 31.0), 0.0);
  p.y += sin(p.x * 0.6 + uTime * 0.4) * 0.15 * uW[4];

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  vec2 away = clip.xy / clip.w - uPointer;
  clip.xy += normalize(away + 1e-5) * 0.035 * uPointerStrength * (1.0 - smoothstep(0.0, 0.18, length(away))) * clip.w;
  gl_Position = clip;
  gl_PointSize = clamp(uSize * (1.5 + 2.0 * aSeed) * uPixelRatio * 6.0 / -mv.z, 1.0, 10.0);
  vGlow = step(0.85, aSeed);
  vFade = smoothstep(16.0, 6.0, -mv.z); // fog: distant particles dissolve into the page
}
`;

export const particlesFrag = /* glsl */ `
uniform vec3 uColor, uGlow;
uniform float uOpacity, uGlowBoost;
varying float vGlow;
varying float vFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.15, d);
  if (alpha < 0.01) discard;
  vec3 colour = mix(uColor, uGlow * (1.0 + uGlowBoost), vGlow);
  gl_FragColor = vec4(colour, alpha * uOpacity * vFade * (0.32 + 0.48 * vGlow));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
