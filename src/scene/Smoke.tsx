'use client';

import { useEffect, useRef } from 'react';

// Slow domain-warped smoke behind Contact: one full-screen triangle and a fragment shader, no three.js. Draws at
// half resolution, only while on screen, and never under reduced motion (the mount checks that).

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uInk;
uniform float uStrength;
out vec4 o;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float t = uTime * 0.035;
  vec2 q = vec2(fbm(uv * 1.6 + t), fbm(uv * 1.6 - t + 4.0));
  vec2 r = vec2(fbm(uv * 1.6 + 3.5 * q + vec2(1.7, 9.2) + t * 1.4), fbm(uv * 1.6 + 3.5 * q + vec2(8.3, 2.8) - t));
  float f = fbm(uv * 1.6 + 3.0 * r);
  float swirl = smoothstep(0.45, 0.95, f * f * 1.8 + 0.25 * length(q));
  o = vec4(uInk, swirl * uStrength);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export default function Smoke() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const gl = el?.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!el || !gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uInk = gl.getUniformLocation(prog, 'uInk');
    const uStrength = gl.getUniformLocation(prog, 'uStrength');

    const setInk = () => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--ink)';
      document.body.appendChild(probe);
      const [r, g, b] = getComputedStyle(probe).color.match(/\d+/g)?.map(Number) ?? [240, 240, 240];
      probe.remove();
      gl.uniform3f(uInk, r / 255, g / 255, b / 255);
      gl.uniform1f(uStrength, document.documentElement.dataset.theme === 'light' ? 0.1 : 0.16);
    };
    setInk();
    const mo = new MutationObserver(setInk);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const resize = () => {
      const scale = 0.5; // half resolution: smoke has no edges to lose
      el.width = Math.max(1, Math.floor(el.clientWidth * scale));
      el.height = Math.max(1, Math.floor(el.clientHeight * scale));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uRes, el.width, el.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    let visible = false;
    const start = performance.now();
    const frame = () => {
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />;
}
