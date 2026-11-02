'use client';

import { useEffect, useRef } from 'react';

// The home intro's storm, ray traced: lit clouds, branching lightning with real bloom, and glass spheres carrying the
// logos, on one full-screen triangle with no three.js, so it arrives in time for a 3 second opening. It lives only
// while the intro does, then gives its GPU context back. The bubbles' places and logos are read from the 2D fallback
// in the DOM, so nothing is sent twice.

const COUNT = 10;
const CAMERA_Z = 3;

// Seconds after navigation. Each strike lights the sky once, and any one second holds at most 2: WCAG 2.3.1 allows 3.
// Only the thin bolt itself restrikes, which is too small an area to count as a flash
const STRIKES = [
  { at: 0.35, x: 0.17 },
  { at: 1.55, x: 0.82 },
  { at: 2.6, x: 0.1 },
];
const LEADER = 0.09; // the bolt feels its way down, dim, before the bright return stroke
const LIFETIME = 5; // past the intro's end, whatever happens to it

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uS[${COUNT}];
uniform float uSpin[${COUNT}];
uniform vec3 uTint[${COUNT}];
uniform vec3 uSkyC;
uniform vec3 uBoltC;
uniform vec3 uGlowC;
uniform sampler2D uLogos;
uniform sampler2D uBolts;
uniform vec3 uBolt;
uniform vec3 uReveal;
uniform float uFlash;
uniform vec3 uFlashPos;
uniform vec2 uCam;
uniform vec3 uInk;
uniform vec3 uPaper;
out vec4 o;

const vec3 KEY = normalize(vec3(-0.45, 0.8, 0.55));

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}

// Clouds on a far plane, lit from the strike's side: thick cloud catches the flash, thin cloud lets it through
vec3 sky(vec3 ro, vec3 rd) {
  vec2 q = ro.xy + rd.xy * ((ro.z + 4.0) / max(-rd.z, 0.25));
  float warp = fbm(q * 0.5 + vec2(uTime * 0.04, 0.0));
  float d = smoothstep(0.32, 0.8, fbm(q * 0.6 + warp * 1.6 - vec2(uTime * 0.02, 0.0)));
  float near = exp(-dot(q - uFlashPos.xy, q - uFlashPos.xy) * 0.1);
  // Indigo high up, falling to the page's own near-black, so the sheet lifts off into the site without a hard change
  vec3 c = mix(uPaper, uSkyC, smoothstep(-2.5, 3.0, q.y) * 0.85);
  c += uSkyC * d * 0.55 + uGlowC * d * d * 0.05;
  return c + mix(uBoltC, uGlowC, 0.35) * uFlash * near * (0.14 + d * 0.72);
}

// The bolts hang on a plane behind the spheres; blurrier mip levels of the same drawing are their glow in the air
vec3 bolts(vec3 ro, vec3 rd) {
  float aspect = uRes.x / uRes.y;
  vec2 q = ro.xy + rd.xy * ((ro.z + 2.0) / max(-rd.z, 0.25));
  vec2 uv = q / (vec2(aspect, 1.0) * (CAMERA_Z_PLUS / CAMERA_Z_F)) * 0.5 + 0.5;
  // Down from the top as the leader descends
  vec3 shown = smoothstep(1.0 - uv.y - 0.03, 1.0 - uv.y + 0.03, uReveal);
  // White-hot at the core, ice blue close by, violet out in the air
  float core = dot(texture(uBolts, uv).rgb * shown, uBolt) * 1.5;
  float halo = dot(textureLod(uBolts, uv, 2.0).rgb * shown, uBolt) * 2.6;
  float air = dot(textureLod(uBolts, uv, 4.0).rgb * shown, uBolt) * 4.5;
  return uInk * core + uBoltC * halo + uGlowC * air;
}

// Rain in two sheets at different speeds and sizes, for depth. Faint until a flash catches it
vec3 rain(vec2 uv) {
  float total = 0.0;
  for (int i = 0; i < 2; i++) {
    float scale = i == 0 ? 90.0 : 170.0;
    vec2 p = vec2((uv.x + uv.y * 0.1) * scale, uv.y * (i == 0 ? 1.6 : 2.6) + uTime * (i == 0 ? 3.4 : 2.3));
    vec2 cell = floor(p);
    float seed = hash(vec2(cell.x, float(i)));
    float y = fract(p.y + seed * 7.0);
    total += step(0.72, seed) * smoothstep(0.82, 1.0, y) * smoothstep(0.16, 0.04, abs(fract(p.x) - 0.5));
  }
  return uBoltC * total * (0.05 + uFlash * 0.14);
}

vec3 sphere(vec3 ro, vec3 rd, vec3 p, vec3 c, float r, int i) {
  vec3 n = normalize(p - c);
  vec3 v = -rd;
  float ndv = max(dot(n, v), 0.0);
  float fresnel = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
  vec3 toBolt = normalize(uFlashPos - p);

  // Glass: what lies behind bends through it, and the sky mirrors off its edge
  vec3 body = (sky(ro, refract(rd, n, 0.8)) + bolts(ro, refract(rd, n, 0.9)) * 0.5) * 0.8 + uTint[i] * 0.07;
  vec3 col = body + sky(p, reflect(rd, n)) * fresnel * 1.6;
  col += mix(uTint[i], uInk, 0.25) * pow(1.0 - ndv, 2.5) * (0.42 + uFlash * 0.9);
  col += uInk * pow(max(dot(n, normalize(KEY + v)), 0.0), 140.0) * 0.9;
  // Light gathers at the far side of a ball of glass, in the colour of what it holds
  col += uTint[i] * pow(max(dot(n, -KEY), 0.0), 2.0) * 0.32;
  col += uInk * pow(max(dot(n, normalize(toBolt + v)), 0.0), 70.0) * uFlash * 3.0;

  // The logo floats just inside, turning a little with the sphere, so the curve of the glass reads against it
  // Measured from the line to the camera, so it faces the viewer wherever on screen the sphere sits
  vec3 w = normalize(ro - c);
  vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), w));
  vec3 up = cross(w, side);
  vec3 f = vec3(dot(n, side), dot(n, up), dot(n, w));
  float s = sin(uSpin[i]), k = cos(uSpin[i]);
  vec3 m = vec3(k * f.x + s * f.z, f.y, -s * f.x + k * f.z);
  vec2 cell = m.xy / 0.55 * 0.5 + 0.5;
  if (m.z > 0.0 && all(greaterThan(cell, vec2(0.0))) && all(lessThan(cell, vec2(1.0)))) {
    // The second row of logos sits lower in the drawing, which the upload's flip turns into the lower half of the texture
    vec2 atlas = (vec2(mod(float(i), 5.0), 1.0 - floor(float(i) / 5.0)) + cell) / vec2(5.0, 2.0);
    // The blur level from the logo's size on screen: automatic levels jump at the cell's edge and draw a faint box
    float onScreen = r * 0.55 * uRes.y * ${CAMERA_Z.toFixed(1)} / length(ro - c);
    float mark = textureLod(uLogos, atlas, log2(256.0 / max(onScreen, 1.0))).r * smoothstep(0.1, 0.45, m.z);
    vec3 lit = uTint[i] * (0.8 + 0.3 * max(dot(n, KEY), 0.0) + uFlash * 1.1 * max(dot(n, toBolt), 0.0));
    col = mix(col, lit, mark);
  }
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / (0.5 * uRes.y);
  vec3 ro = vec3(uCam, ${CAMERA_Z.toFixed(1)});
  vec3 rd = normalize(vec3(uv - uCam, -${CAMERA_Z.toFixed(1)}));
  vec3 col = sky(ro, rd) + bolts(ro, rd) + rain(uv);
  // Quieter behind the greeting and at the corners, which keeps the words readable through a flash
  float away = length(uv / vec2(max(uRes.x / uRes.y, 1.0), 1.0));
  col *= mix(0.62, 1.0, smoothstep(0.1, 0.75, away)) * mix(1.0, 0.72, smoothstep(0.9, 1.7, away));

  float best = 1e9;
  int hit = -1;
  float cover = 0.0;
  vec3 halo = vec3(0.0);
  for (int i = 0; i < ${COUNT}; i++) {
    float r = uS[i].w;
    if (r <= 0.0) continue;
    vec3 oc = ro - uS[i].xyz;
    float b = dot(oc, rd);
    float miss = sqrt(max(dot(oc, oc) - b * b, 0.0)) - r;
    float px = 2.0 * -b / (uRes.y * ${CAMERA_Z.toFixed(1)}) * 1.5;
    // Each sphere lights the air around it in its own colour
    halo += uTint[i] * exp(-max(miss, 0.0) * 13.0) * (0.2 + uFlash * 0.25);
    if (miss < px && -b < best) {
      best = -b;
      hit = i;
      cover = smoothstep(px, -px, miss);
    }
  }
  col += halo;
  if (hit >= 0) {
    vec3 c = uS[hit].xyz;
    float r = uS[hit].w;
    vec3 oc = ro - c;
    float b = dot(oc, rd);
    // Clamped at the very rim, where anti-aliasing draws slightly outside the true sphere
    float h = sqrt(max(b * b - dot(oc, oc) + r * r, 0.0));
    col = mix(col, sphere(ro, rd, ro + rd * (-b - h), c, r, hit), cover);
  }
  // A touch of noise, or the dark gradients band on 8-bit screens
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
  o = vec4(col, 1.0);
}`.replace(/CAMERA_Z_PLUS \/ CAMERA_Z_F/, `${(CAMERA_Z + 2).toFixed(1)} / ${CAMERA_Z.toFixed(1)}`);

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

// A token as 0-1 channels, by way of the browser's own colour parsing
function channels(color: string): [number, number, number] {
  const [r = 255, g = 255, b = 255] = color.match(/[\d.]+/g)?.map(Number) ?? [];
  return [r / 255, g / 255, b / 255];
}
function token(name: string) {
  const probe = document.createElement('span');
  probe.style.color = `var(--${name})`;
  document.body.appendChild(probe);
  const rgb = channels(getComputedStyle(probe).color);
  probe.remove();
  return rgb;
}

type Point = [number, number];

// Midpoint displacement: each halving nudges the middle sideways, which is what gives lightning its jagged, self-similar line
function jag(from: Point, to: Point, rough: number): Point[] {
  let line = [from, to];
  for (let level = 0, spread = rough; level < 7; level++, spread *= 0.55) {
    const next: Point[] = [line[0]];
    for (let i = 1; i < line.length; i++) {
      const [ax, ay] = line[i - 1];
      const [bx, by] = line[i];
      next.push([(ax + bx) / 2 + (Math.random() - 0.5) * spread, (ay + by) / 2 + (Math.random() - 0.5) * spread * 0.25], line[i]);
    }
    line = next;
  }
  return line;
}

function stroke(ctx: CanvasRenderingContext2D, line: Point[], width: number, shade: number, channel: number) {
  const value = Math.round(255 * shade);
  ctx.strokeStyle = `rgb(${channel === 0 ? value : 0},${channel === 1 ? value : 0},${channel === 2 ? value : 0})`;
  ctx.lineWidth = width;
  ctx.beginPath();
  line.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
}

// All three strikes in one texture, one colour channel each, so the shader can fire them separately
function drawBolts(aspect: number, roomy: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = aspect >= 1 ? 1024 : Math.round(1024 * aspect);
  canvas.height = aspect >= 1 ? Math.round(1024 / aspect) : 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const { width: W, height: H } = canvas;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // Stops above the greeting unless the screen has the room for the bolts to pass beside it
  const reach = roomy ? 0.78 : 0.3;
  const unit = Math.max(W, H) / 1024;
  STRIKES.forEach(({ x }, channel) => {
    const main = jag([x * W, 0], [(x + (Math.random() - 0.5) * 0.14) * W, reach * H], 0.16 * H);
    stroke(ctx, main, 4.5 * unit, 0.35, channel);
    stroke(ctx, main, 1.8 * unit, 1, channel);
    for (let b = 0; b < 5; b++) {
      const start = main[Math.floor(main.length * (0.15 + Math.random() * 0.65))];
      const side = start[0] < W / 2 === b % 3 > 0 ? 1 : -1;
      const fork = jag(start, [start[0] + side * (0.05 + Math.random() * 0.14) * Math.max(W, H), start[1] + (0.08 + Math.random() * 0.18) * H], 0.07 * H);
      stroke(ctx, fork, 1.1 * unit, 0.55, channel);
      const twig = fork[Math.floor(fork.length * 0.5)];
      stroke(ctx, jag(twig, [twig[0] + side * 0.05 * W, twig[1] + 0.07 * H], 0.03 * H), 0.8 * unit, 0.3, channel);
    }
  });
  return canvas;
}

function drawLogos(paths: string[]) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size * 5;
  canvas.height = size * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  paths.forEach((d, i) => {
    // A margin in each cell, or a blurred mip level bleeds the neighbouring logo in along the edge
    const mark = size * 0.86;
    const margin = (size - mark) / 2;
    ctx.setTransform(mark / 24, 0, 0, mark / 24, (i % 5) * size + margin, Math.floor(i / 5) * size + margin);
    ctx.fill(new Path2D(d));
  });
  return canvas;
}

function upload(gl: WebGL2RenderingContext, unit: number, source: HTMLCanvasElement) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

const easeOutBack = (x: number) => 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2;

export default function Storm({ onFail }: { onFail: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const intro = document.getElementById('intro');
    const gl = el?.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'high-performance' });
    if (!el || !intro || !gl) return onFail();

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs) return onFail();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return onFail();
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u('uRes');
    const uTime = u('uTime');
    const uS = u('uS');
    const uSpin = u('uSpin');
    const uBolt = u('uBolt');
    const uReveal = u('uReveal');
    const uFlash = u('uFlash');
    const uFlashPos = u('uFlashPos');
    const uCam = u('uCam');
    gl.uniform3fv(u('uInk'), token('scene-ink'));
    gl.uniform3fv(u('uSkyC'), token('storm-sky'));
    gl.uniform3fv(u('uBoltC'), token('storm-bolt'));
    gl.uniform3fv(u('uGlowC'), token('storm-glow'));
    gl.uniform3fv(u('uPaper'), token('paper'));
    gl.uniform1i(u('uLogos'), 0);
    gl.uniform1i(u('uBolts'), 1);

    // Places and logos from the fallback bubbles; the ones the narrowest screens hide stay hidden here too
    const nodes = [...intro.querySelectorAll<HTMLElement>('.intro-bubble')];
    const paths = nodes.map((n) => n.querySelector('path')?.getAttribute('d') ?? '');
    const shown = nodes.map((n) => getComputedStyle(n).display !== 'none');
    const places = nodes.map((n) => [parseFloat(n.style.left) / 100, parseFloat(n.style.top) / 100]);
    const depth = nodes.map((_, i) => Math.sin(i * 2.4) * 0.65);
    gl.uniform3fv(u('uTint'), nodes.flatMap((n) => channels(getComputedStyle(n.querySelector('.intro-glass') ?? n).color)));

    const logos = drawLogos(paths);
    if (!logos) return onFail();
    upload(gl, 0, logos);

    let aspect = 1;
    let radius = 0.1;
    let sharpness = 1;
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      // Keeps the per-pixel work bounded: a storm has few hard edges, so it can spare the very sharpest pixels
      const scale = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1_800_000 / Math.max(1, w * h))) * sharpness;
      el.width = Math.max(1, Math.floor(w * scale));
      el.height = Math.max(1, Math.floor(h * scale));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uRes, el.width, el.height);
      aspect = w / Math.max(1, h);
      radius = Math.max(0.14 * Math.min(aspect, 1), 24 / (Math.max(1, h) / 2));
    };
    resize();
    const bolts = drawBolts(aspect, aspect >= 1.3 && el.clientHeight >= 600);
    if (!bolts) return onFail();
    upload(gl, 1, bolts);
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const spheres = new Float32Array(COUNT * 4);
    const spin = new Float32Array(COUNT);
    const bolt = new Float32Array(3);
    const reveal = new Float32Array(3);
    let raf = 0;
    let stopped = false;
    let drawn = false;
    let slow = 0;
    let last = 0;

    const release = () => {
      stopped = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      if (stopped) return;
      delete document.documentElement.dataset.introGl;
      onFail();
    };
    el.addEventListener('webglcontextlost', onLost);

    const frame = () => {
      // Both clocks run from the navigation, so the storm stays in step with the CSS sheet however late this loaded
      const t = performance.now() / 1000;
      if (intro.hidden || t > LIFETIME) return release();
      // A phone that can't keep up trades sharpness for smoothness, once
      if (sharpness === 1 && last && t - last > 0.04 && ++slow > 8) {
        sharpness = 0.6;
        resize();
      }
      last = t;

      let flash = 0;
      let flashX = 0;
      let thunder = 0;
      STRIKES.forEach(({ at, x }, i) => {
        const age = t - at;
        reveal[i] = age > 0 ? Math.min(1, age / LEADER) : 0;
        if (age <= 0) return (bolt[i] = 0);
        if (age < LEADER) return (bolt[i] = 0.45);
        const after = age - LEADER;
        bolt[i] = 1.5 * Math.exp(-after * 8) + (after > 0.11 ? 0.8 * Math.exp(-(after - 0.11) * 14) : 0);
        const sky = Math.exp(-after * 6);
        if (sky > flash) {
          flash = sky;
          flashX = x;
        }
        // The rumble lands a moment after the light, as thunder does
        if (age > 0.25) thunder += Math.exp(-(age - 0.25) * 4) * Math.sin((age - 0.25) * 38);
      });

      for (let i = 0; i < COUNT; i++) {
        const j = i * 4;
        const pop = Math.min(1, Math.max(0, (t - 0.25 - i * 0.07) / 0.5));
        if (!shown[i] || !places[i]) {
          spheres[j + 3] = 0;
          continue;
        }
        const z = depth[i] + Math.sin(t * 0.5 + i * 2) * 0.1;
        const toWorld = (CAMERA_Z - z) / CAMERA_Z;
        spheres[j] = ((places[i][0] * 2 - 1) * aspect + Math.cos(t * 0.6 + i) * 0.02) * toWorld;
        spheres[j + 1] = ((1 - places[i][1] * 2) + Math.sin(t * 0.9 + i * 1.7) * 0.03 + thunder * 0.006) * toWorld;
        spheres[j + 2] = z;
        spheres[j + 3] = radius * easeOutBack(pop) * (pop > 0 ? 1 : 0);
        spin[i] = Math.sin(t * 0.7 + i * 1.3) * 0.25;
      }

      gl.uniform1f(uTime, t);
      gl.uniform4fv(uS, spheres);
      gl.uniform1fv(uSpin, spin);
      gl.uniform3fv(uBolt, bolt);
      gl.uniform3fv(uReveal, reveal);
      gl.uniform1f(uFlash, flash);
      gl.uniform3f(uFlashPos, (flashX * 2 - 1) * aspect * ((CAMERA_Z + 2) / CAMERA_Z), 0.7, -2);
      gl.uniform2f(uCam, thunder * 0.012, thunder * 0.008);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!drawn) {
        drawn = true;
        el.dataset.ready = '';
        // The flat layers go at once: left under the fade, their bubbles would show as doubles of the spheres
        document.documentElement.dataset.introGl = '';
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      el.removeEventListener('webglcontextlost', onLost);
      if (!stopped) release();
    };
  }, [onFail]);

  return <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full opacity-0 transition-opacity duration-200 data-ready:opacity-100" />;
}
