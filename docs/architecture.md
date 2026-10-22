# Kushwant KR Portfolio — Architecture

Oct 22, 2026 · @Kushwant

## Overview, scope & quality goals

The portfolio is a statically generated Next.js 16 site with one client-side WebGL layer and two server endpoints, Pearl's chat route and the contact action. Everything a visitor reads is HTML from the CDN; everything optional (the 3D scene, Pearl) loads after it and can fail without breaking the page.

**Quality goals, in priority order**

| # | Goal | What it means in practice |
| --- | --- | --- |
| 1 | Content first | Text and CSS arrive prerendered from the CDN; the headline is the LCP element; the 3D chunk loads only after LCP |
| 2 | Accessible and resilient | WCAG 2.2 AA; the page reads and the contact form submits with JavaScript, WebGL, or the model unavailable |
| 3 | Trustworthy AI | Pearl answers only from typed content, cannot act without visitor confirmation, and has hard cost caps |
| 4 | Easy for one person and coding agents to maintain | One typed content source for the site and Pearl; tokens from the design system; tests and these docs live in the repo |
| 5 | Cheap and portable | Free tiers for every service except hosting; no host-specific APIs in core code |

**In scope**: the home page and case-study pages, the 3D scene, Pearl, the contact pipeline, SEO, analytics, CI.

**Out of scope for v1**: a CMS, user accounts, a database, payments, a blog (P2), translated site copy.

**Constraints**: one developer working part-time; launch within about four weeks; running cost close to zero apart from hosting; visitors mostly in India plus recruiters worldwide, so pages must stay light on mid-range Android phones over 4G.

Companion documents: the PRD (what and why), the Design System "Nacre" (how it looks: tokens, components, 3D parameters), and the AI Agents Guide (how coding agents build it, and how Pearl behaves).

## Tech stack

Versions are the latest stable releases on npm as of 22 October 2026; pin them in `package.json` and let a weekly dependency PR move them.

| Layer | Choice | Version | Why this one |
| --- | --- | --- | --- |
| Runtime | Node.js LTS | 24.x | AI SDK 7 requires Node 22 or later; Next.js 16 requires 20.9 or later |
| Package manager | pnpm | 12.x | Fast, strict dependency resolution |
| Framework | Next.js (App Router, Turbopack) | 16.4.2 | Static generation, server actions, route handlers, metadata and OG image APIs in one project; Cache Components are on by default in new 16.4 apps ([release notes](https://nextjs.org/blog/next-16-4)) |
| UI library | React | 19.3.1 | Stable View Transitions and Fragment refs ([React 19.3](https://react.dev/blog/2026/09/09/react-19-3)) |
| Language | TypeScript | 6.0.3 | TypeScript 7 builds faster, but typescript-eslint 8.72 supports TypeScript below 6.1 only; move to 7.1 when the lint tooling does ([TS 7 notes](https://infoq.com/news/2026/08/typescript-7-released/)) |
| Styling | Tailwind CSS | 4.3.3 | CSS-first theme variables; the Nacre token setup was compiled against this version |
| 3D engine | three | 0.186.1 | WebGL 2 baseline, physical materials with iridescence, AgX tone mapping |
| 3D in React | @react-three/fiber | 9.8.2 | React 19 renderer for three (supports React up to 19.3) |
| 3D helpers | @react-three/drei, @react-three/postprocessing, maath | 10.7.9, 3.2.2, 0.10.8 | Environment light panels, performance monitoring, bloom and grain, damping maths |
| GPU tiering | detect-gpu | 5.0.70 | Picks the starting quality tier from GPU benchmarks |
| DOM motion | motion | 14.6.0 | Springs and transitions for the chat panel, menus, toasts |
| Client state | zustand | 5.0.16 | Small stores that the 3D frame loop can read without re-rendering React |
| AI | ai, @ai-sdk/react | 7.0.148, 4.0.152 | Streaming chat, typed tool calls, tool approval, UI message parts ([chat tool docs](https://ai-sdk.dev/v7/docs/ai-sdk-ui/chatbot-tool-usage)) |
| Model access | Vercel AI Gateway | managed | One key, spend budgets, swap models by changing a string; no markup on tokens ([pricing](https://vercel.com/docs/ai-gateway/pricing)) |
| Default model | Claude Haiku 5.5 | `anthropic/claude-haiku-5.5` | US$0.10 input and US$0.50 output per million tokens for prompts under 100k tokens ([pricing](https://platform.claude.com/docs/en/about-claude/pricing)) |
| Validation | zod | 4.6.7 | One schema for content, forms, API bodies, and tool inputs |
| Email | resend, @react-email/components | 6.34.1, 1.0.12 | Contact email and auto-reply; free tier 3,000 emails a month |
| Rate limiting | @upstash/ratelimit, @upstash/redis | 2.2.0, 1.39.0 | Serverless sliding-window limits; free tier 500,000 commands a month |
| Bot check | Cloudflare Turnstile, @marsidev/react-turnstile | 1.6.3 | Invisible challenge before the first chat message and on the contact form |
| Icons | lucide-react | 1.61.0 | The Nacre icon set |
| Command palette (P1) | cmdk | 1.1.1 | Accessible ⌘K menu |
| Long-form content | @next/mdx | 16.4.2 | Case-study bodies in MDX next to typed metadata |
| Unit and component tests | vitest | 5.0.5 | Fast, Vite-native |
| End-to-end tests | @playwright/test, @axe-core/playwright | 1.64.1, 4.14.0 | Browser flows and accessibility audits |
| Performance CI | @lhci/cli | 0.15.1 | Lighthouse budgets on every preview |
| Lint and format | eslint, eslint-config-next, typescript-eslint, prettier | 10.13.0, 16.4.2, 8.72.0, 3.9.10 | Flat config; Next.js 16 no longer ships `next lint` |
| Analytics | @vercel/analytics, @vercel/speed-insights | 2.0.1, 2.0.0 | Cookie-free page views and Core Web Vitals; custom events need the Pro plan ([docs](https://docs.vercel.com/docs/analytics/custom-events)) |
| Hosting | Vercel Pro, or Cloudflare Workers via @opennextjs/cloudflare | 1.20.13 (adapter) | See ADR-09 |

**Deliberately not in the stack**: Lenis or any smooth-scroll library, GSAP, a CSS-in-JS library, a vector database, a CMS, a state library beyond zustand.

## Architecture decisions

Eleven decisions shape the build. Each records what was chosen, why, and what it costs; change one only by writing a new decision that replaces it.

**ADR-01. Next.js with fully static pages, not a Vite single-page app.**

- Why: search engines and link previews get real HTML; one project holds pages, the chat route, the contact action, OG images, and the sitemap; coding agents know it well.
- How: the root layout exports `ensureStatic = 'navigation'`, so the build fails if any page accidentally renders per request ([Next.js 16.4](https://nextjs.org/blog/next-16-4)).
- Cost: a heavier framework, and the 3D layer must be kept strictly client-side.

**ADR-02. React Three Fiber, not hand-written three.js.**

- Why: the scene shares state with the UI (chat status, section in view, quality tier) through React and zustand; drei supplies environment lighting and performance monitoring.
- Cost: the frame loop must never trigger React renders; per-frame work lives in `useFrame` and reads stores with `getState()`.

**ADR-03. One fixed full-screen canvas behind native-scrolling HTML.**

- Why: content stays ordinary, accessible, indexable HTML; the scene follows scroll progress instead of owning the scrollbar. No drei `ScrollControls`, no scroll hijacking.
- Cost: anything in 3D that must line up with the page (the pearl at the headline's full stop, the launcher corner) is positioned from DOM measurements.

**ADR-04. No smooth-scroll library and no GSAP in v1.**

- Why: damping inside the 3D layer gives smooth motion without taking over the wheel or breaking keyboard and assistive scrolling; Motion alone handles DOM animation.
- Cost: wheel scrolling feels native rather than "buttery"; revisit after launch with real feedback.

**ADR-05. Content as typed files in the repo, not a CMS.**

- Why: free, versioned, reviewable; one source feeds both the pages and Pearl's knowledge base; zod validates it at build time and blocks placeholders in production.
- Cost: every content edit is a commit and a deploy, which suits a single owner.

**ADR-06. Pearl reads the whole knowledge base, with no vector database.**

- Why: the corpus is about 10,000 to 15,000 tokens, which fits easily in context; whole-context answers are more accurate than retrieval for a corpus this small and have no extra infrastructure.
- Cost: every message pays for the knowledge base as input tokens (about US$0.0015 per message on Claude Haiku 5.5). Add retrieval only if the corpus passes about 50,000 tokens.

**ADR-07. Models through Vercel AI Gateway, chosen by an environment variable.**

- Why: one key, spend budgets, provider fallbacks, and a model swap without a code change (`PEARL_MODEL`). Default Claude Haiku 5.5: fast, cheap, good at following grounding rules.
- Cost: one more dependency; switching to a provider SDK directly is a one-line change in `lib/pearl/model.ts`.

**ADR-08. Contact through a server action, Resend, and a Telegram notification; no database.**

- Why: the form works without JavaScript, nothing personal is stored at rest, and every service has a free tier.
- Cost: the email inbox is the only record of messages.

**ADR-09. Host on Vercel Pro; keep the code portable to Cloudflare Workers.**

- Why: Vercel's free Hobby plan is for non-commercial use, and advertising freelance services counts as commercial ([fair use](https://vercel.com/docs/limits/fair-use-guidelines)). Pro (US$20 a month) also unlocks custom analytics events.
- Alternative: Cloudflare Workers through the OpenNext adapter, whose free plan allows commercial use but caps the compressed Worker at 3 MiB and CPU time at 10 ms per request ([OpenNext](https://opennext.js.org/cloudflare)); the paid Workers plan raises the size cap to 10 MiB.
- Rule: no Vercel-only APIs in core code; analytics sits behind a small `track()` adapter.

**ADR-10. TypeScript 6.0 now, 7.1 later.**

- Why: Next.js 16 type-checks by running the project's own `tsc`, so TypeScript 7 builds fine ([docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/useTypeScriptCli)), but typescript-eslint needs the compiler API that TypeScript 7.0 does not have yet.
- Cost: slower type checks until the upgrade.

**ADR-11. WebGL 2 is the baseline; WebGPU comes later.**

- Why: WebGL 2 runs on every target device today; the scene is simple enough that WebGPU would not change what visitors see.
- Cost: no compute-shader particles in v1; the particle morph runs in a vertex shader instead.

## System context & request flows

The CDN serves every page; only two endpoints run code per request, and both pass the same abuse checks before calling anything that costs money.

&#91;embedded content: system context · browser, hosting, services\]

Pearl's leave-message tool reuses the contact action's notify step after the visitor confirms; analytics beacons go to Vercel's same-origin endpoints and are left out of the picture.

**A page load**

1. The CDN returns prerendered HTML with inlined critical CSS, the inline SVG poster, and the launcher button; Anek Latin preloads.
2. The headline paints (the LCP element) and React hydrates the interactive leaves.
3. After an idle callback, `SceneMount` checks WebGL 2, Save-Data, reduced motion, and the GPU tier, then imports the scene chunk, or stays on the poster at tier 0.
4. The canvas renders its first frame and cross-fades over the poster; the opening sequence plays once per session.
5. Pearl's chunk prefetches when the visitor hovers, focuses, or touches the launcher, and mounts on click.

A chat message and a contact submission follow the flows in Chatbot architecture and Contact & notification pipeline.

## Repository structure

One Next.js app, organised by what changes together: content in `src/content`, everything three.js in `src/scene`, Pearl's server logic in `src/lib/pearl`, and its UI in `src/components/pearl`.

```text
kushwant-portfolio/
├─ AGENTS.md                      rules every coding agent reads first (see the AI Agents Guide)
├─ CLAUDE.md                      optional: imports @AGENTS.md, adds Claude-specific notes
├─ docs/                          PRD, architecture, agents guide exported as Markdown; design-system notes
├─ design/tokens.json             copied from the Nacre design system; never edited here
├─ scripts/
│  ├─ tokens.ts                   design/tokens.json → src/styles/tokens.css
│  ├─ content-check.ts            validates content; --strict fails on placeholder: true
│  ├─ static-files.ts             writes public/llms.txt and public/humans.txt from content
│  └─ knowledge.ts                content and MDX → Pearl's knowledge base (src/lib/pearl/knowledge.generated.ts)
├─ public/
│  ├─ resume/Kushwant-KR-Resume.pdf
│  ├─ media/<slug>/               case-study screenshots (AVIF) and clips (MP4, under 2 MB)
│  └─ gpu-benchmarks/             detect-gpu data, self-hosted so tiering works offline and under CSP
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               fonts, metadata, providers, ensureStatic = 'navigation'
│  │  ├─ page.tsx                 home: sections in order
│  │  ├─ globals.css, fonts.ts
│  │  ├─ projects/[slug]/page.tsx case studies, generateStaticParams from content
│  │  ├─ freelance/[slug]/page.tsx
│  │  ├─ colophon/page.tsx        P1: how this site is built
│  │  ├─ privacy/page.tsx, not-found.tsx
│  │  ├─ opengraph-image.tsx      plus one per case-study route
│  │  ├─ sitemap.ts, robots.ts
│  │  └─ api/chat/route.ts        Pearl's streaming endpoint
│  ├─ actions/contact.ts          'use server' contact action
│  ├─ components/
│  │  ├─ ui/                      Nacre components: Button, Chip, Badge, FormField, Toast, CodeBlock…
│  │  ├─ sections/                Hero, About, Experience, Freelance, Projects, Skills, Education, Contact, Footer
│  │  ├─ layout/                  NavBar, MobileMenu, SkipLink, CommandPalette (P1), SceneMount
│  │  └─ pearl/                   PearlLauncher, ChatPanel, parts/, usePearl.ts
│  ├─ scene/                      client-only three.js code
│  │  ├─ SceneRoot.tsx            <Canvas>, quality tier, frame loop control
│  │  ├─ Pearl.tsx, Particles.tsx, Lighting.tsx, Effects.tsx
│  │  ├─ formations.ts            builds the five formation buffers
│  │  ├─ shaders/particles.vert.glsl, particles.frag.glsl
│  │  ├─ Poster.tsx               the inline-SVG fallback, also rendered on the server
│  │  └─ useQuality.ts, useDomAnchor.ts, colors.ts
│  ├─ content/                    the single source for the site and Pearl
│  │  ├─ schema.ts                zod schemas and types
│  │  ├─ config.ts                availability, feature flags, links
│  │  ├─ profile.ts, experience.ts, skills.ts, education.ts, services.ts, testimonials.ts
│  │  ├─ projects/<slug>.ts + <slug>.mdx
│  │  ├─ freelance/<slug>.ts + <slug>.mdx
│  │  └─ pearl/                   knowledge Pearl needs but the page doesn't show: faq.md, preferences.md, fun-facts.md, boundaries.md
│  ├─ lib/
│  │  ├─ pearl/                   model.ts, instructions.ts, knowledge.ts, tools.ts, guard.ts, offline-faq.ts
│  │  ├─ ratelimit.ts, notify.ts, turnstile.ts, analytics.ts, seo.ts, motion.ts
│  ├─ stores/                     zustand: ui.ts, scroll.ts, scene.ts
│  └─ styles/tokens.css           generated by scripts/tokens.ts
├─ tests/
│  ├─ unit/, e2e/, a11y/, visual/
│  └─ evals/pearl.eval.ts, cases.json
├─ .github/workflows/ci.yml
├─ next.config.ts, eslint.config.mjs, vitest.config.ts, playwright.config.ts, lighthouserc.json
└─ package.json
```

**Boundary rules**

- Nothing outside `src/scene` imports `three` or `@react-three/*`; the scene is mounted only through `components/layout/SceneMount.tsx`.
- Nothing outside `src/lib/pearl` and `app/api/chat` imports `ai` server functions; the client uses `@ai-sdk/react` only in `components/pearl`.
- Server-only modules (`lib/pearl`, `lib/notify`, `lib/ratelimit`, `actions/`) start with `import 'server-only'`.
- Components never read content files directly; pages pass typed props down.

## Rendering, routing & content model

Every page is prerendered at build time from typed content; only Pearl's route and the contact action run per request. Cache Components are on (the 16.4 default), but no page reads request data, so everything prerenders, and `ensureStatic = 'navigation'` in the root layout turns any accidental dynamic access into a build error.

| Route | Rendering | Source | Notes |
| --- | --- | --- | --- |
| `/` | Static | `src/content/*` | Sections in PRD order |
| `/projects/[slug]` | Static, one page per project | `content/projects` | `generateStaticParams` must return at least one slug under Cache Components ([docs](https://nextjs.org/docs/messages/empty-generate-static-params)); unknown slugs 404 |
| `/freelance/[slug]` | Static | `content/freelance` | Same template as projects |
| `/colophon` (P1), `/privacy` | Static | MDX |  |
| 404 | Static | `not-found.tsx` | "Lost at sea" |
| OG images | Static at build | `opengraph-image.tsx` per route | `ImageResponse` from `next/og`, 1200 × 630, Anek Latin loaded as a font file |
| `/sitemap.xml`, `/robots.txt` | Static | `sitemap.ts`, `robots.ts` |  |
| `/llms.txt`, `/humans.txt` | Files in `public/` | `scripts/static-files.ts` (prebuild) | Regenerated on every build |
| `/resume` | Redirect | `next.config.ts` | To `/resume/Kushwant-KR-Resume.pdf` |
| `POST /api/chat` | Per request, Node runtime, streaming | `lib/pearl` | Rate-limited; see Chatbot architecture |
| Contact | Server action | `actions/contact.ts` | Works without JavaScript |

**Client-only islands.** The canvas and Pearl's panel are client components loaded with `next/dynamic(..., { ssr: false })` inside small client wrappers (`SceneMount`, `PearlMount`), so their code never ships in the first-load bundle. The SVG poster and the launcher button render on the server, so the layout never shifts when the islands arrive.

**Content model.** Every content file is a typed object validated by zod at build time; long case-study bodies are MDX next to their metadata.

```ts
// src/content/schema.ts (excerpt)
import { z } from 'zod';

const month = z.string().regex(/^\d{4}-\d{2}$/); // "2026-07"

export const CaseStudy = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  kind: z.enum(['work', 'freelance', 'personal', 'academic']),
  title: z.string().max(60),
  context: z.string(), // "Freelance, a Hyderabad clinic, 4 weeks"
  outcome: z.string().max(140), // leads with the result and its number
  client: z.object({ label: z.string(), named: z.boolean(), permission: z.boolean() }).optional(),
  role: z.string(),
  start: month,
  end: month.optional(),
  stack: z.array(z.string()).min(1).max(12),
  categories: z.array(z.enum(['ai-ml', 'full-stack', '3d-creative', 'tools'])).min(1),
  featured: z.boolean().default(false),
  media: z.object({ src: z.string(), alt: z.string().min(10), video: z.string().optional(), poster: z.string().optional() }),
  links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
  testimonialId: z.string().optional(),
  pearlNotes: z.string().optional(), // facts Pearl may use that the page doesn't show
  confidential: z.array(z.string()).default([]), // facts Pearl must never reveal
  placeholder: z.boolean().default(false),
});

export const Config = z.object({
  availability: z.object({
    freelance: z.enum(['available', 'limited', 'booked']),
    freelanceLabel: z.string(), // "Freelance: 1 slot open in November"
    openToRoles: z.boolean(),
  }),
  flags: z.object({ showFreelance: z.boolean(), showPrices: z.boolean(), pearl: z.boolean(), threeD: z.boolean() }),
  links: z.object({ email: z.email(), linkedin: z.url(), github: z.url(), booking: z.url().optional() }),
});
```

The other schemas follow the same pattern: `Profile`, `Experience` (role, org, location, start, end, points, stack, current), `Skill` (name, tier, evidence links), `Service`, `Testimonial` (quote, role, name, permission date), `EducationItem`, and `Achievement`.

**The content check** (`pnpm content:check`, run in CI) validates every file, checks that every Daily-driver skill has evidence, that testimonials have permission, that there is at least one featured project and one freelance case study, and that media files exist. With `--strict` (production builds) it also fails on any `placeholder: true` entry.

## 3D architecture

The scene is one fixed `<Canvas>` behind the page. Signals land in three stores; every frame reads them with `getState()` and writes positions and shader uniforms, so scrolling, pointer movement, and time never re-render React.

&#91;embedded content: 3D data flow · signals, stores, frame loop\]

At tier 0 there is no canvas at all, only the server-rendered SVG poster. Every visual value (colours, material settings, formation shapes) lives in the design system's Motion and 3D section; this section covers how the code is put together.

**Mounting.** `SceneMount` (a client component) waits for hydration and an idle callback, then decides the tier: no WebGL 2, Save-Data, or the Off toggle means tier 0; reduced motion means a single still frame; otherwise `detect-gpu` (with `benchmarksURL: '/gpu-benchmarks'`) sets the starting tier, capped by the visitor's Low toggle. Only then does it import `SceneRoot` with `next/dynamic(..., { ssr: false })` and cross-fade the canvas over the poster in 400 ms.

```tsx
// src/scene/SceneRoot.tsx (excerpt)
<Canvas
  style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
  eventSource={document.body} // the pointer is tracked through the HTML above the canvas
  eventPrefix="client"
  dpr={[1, quality.dprCap]}
  frameloop={hidden ? 'never' : reducedMotion ? 'demand' : 'always'}
  camera={{ fov: 35, position: [0, 0, 8], near: 0.1, far: 50 }}
  gl={{ antialias: quality.tier >= 2, alpha: false, powerPreference: 'high-performance' }}
  onCreated={({ gl }) => { gl.toneMapping = AgXToneMapping; }}
>
  <color attach="background" args={[colors.fog]} />
  <fog attach="fog" args={[colors.fog, 6, 16]} />
  <PerformanceMonitor onDecline={stepDownOneTier} onFallback={() => setTier(1)} />
  <Lighting />   {/* drei <Environment resolution={256} frames={1}> with three Lightformers */}
  <Pearl />
  <Particles count={quality.particles} />
  {quality.tier >= 2 && <Effects tier={quality.tier} />}
</Canvas>
```

**Quality tiers.** `useQuality()` returns one config object per tier (particle count, sphere segments, pixel-ratio cap, material, effects). `PerformanceMonitor` only ever steps down, one tier per decline, never below Low; a visitor's toggle always wins. Forcing a tier for testing: `?tier=high|medium|low|off`.

**Particles.** `formations.ts` builds the five formations once, with a seeded random generator so the SVG poster and the first WebGL frame agree. Orbit goes in the `position` attribute; Layers, Clusters, Field, and Wave go in `aLayers`, `aClusters`, `aField`, `aWave`; `aSeed` drives size and the 15% glow. That is six attributes, well under WebGL 2's guaranteed 16. Each frame, the CPU turns scroll progress into five weights (smoothstep over each section's first 35%, then `easing.damp` from maath) and the vertex shader blends:

```glsl
// src/scene/shaders/particles.vert.glsl (excerpt)
uniform float uW[5];
uniform float uTime, uSize, uPixelRatio, uThinking;
uniform vec2 uPointer; // pointer in normalised device coordinates
uniform vec3 uPearl;   // pearl position in world space
attribute vec3 aLayers, aClusters, aField, aWave;
attribute float aSeed;
varying float vGlow;

void main() {
  vec3 p = position * uW[0] + aLayers * uW[1] + aClusters * uW[2] + aField * uW[3] + aWave * uW[4];
  p.y += sin(p.x * 0.6 + uTime * 0.4) * 0.15 * uW[4];          // the Wave swell
  float d = length(uPearl - p);
  p += normalize(uPearl - p) * uThinking * 0.04 * d * step(d, 3.0); // drift toward the pearl while Pearl answers
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  vec2 away = clip.xy / clip.w - uPointer;
  clip.xy += normalize(away + 1e-5) * 0.035 * (1.0 - smoothstep(0.0, 0.18, length(away))) * clip.w;
  gl_Position = clip;
  gl_PointSize = uSize * (1.5 + 2.0 * aSeed) * uPixelRatio / -mv.z;
  vGlow = step(0.85, aSeed);
}
```

**The pearl and DOM anchors.** `useDomAnchor(ref)` measures an element (the headline's full stop, the launcher) and stores its rectangle. The scene converts a rectangle's centre to normalised device coordinates, unprojects it onto the z = 0 plane, and converts its pixel size to world units with `2 · distance · tan(fov / 2) / innerHeight`. The opening sequence and the handoff (P1) are both damped moves (`easing.damp3`) between such anchor positions and the hero position.

**Lifecycle.** Geometry and materials built in `useMemo` are disposed in effect cleanups; turning 3D off unmounts the canvas, and Fiber disposes the renderer. A `webglcontextlost` listener drops to tier 0 and the poster. `?perf` mounts `r3f-perf`, and `?tune` opens a development-only `leva` panel for tuning formations; neither ships in production bundles.

## Chatbot architecture

Pearl is one streaming route handler and one client panel. A message clears the cheap checks first; only then does the route call the model, with Pearl's instructions and the whole knowledge base as one cached prefix. Tools let Pearl show cards and move around the page, and, once the visitor approves, leave Kushwant a message.

&#91;embedded content: chat request flow · guard, model, browser tools, approval\]

**The guard** (`lib/pearl/guard.ts`) runs these checks in order and stops at the first failure, so a rejected request never reaches the model.

1. **Request**: a same-origin `POST`, a body of at most 32 KB, and a valid `ChatBody` (messages, the section in view, the mode, and a Turnstile token on the first request). The messages also pass the AI SDK's `safeValidateUIMessages` against the tool schemas, and the newest visitor message must be at most 1,500 characters (6,000 in job-description mode). Failures return 400, 403, or 413 with a short code and no detail.
2. **Session**: a valid signed cookie, or a Turnstile token that passes siteverify, after which the response sets the one-hour cookie. With neither, the route returns 401 `verify`; the panel gets a fresh token and retries once with `regenerate()`.
3. **Per-visitor limits**, keyed by the hashed IP: 20 requests per 10 minutes and 80 per day. Automatic follow-ups (a browser tool's output, an approval) count too, so they cannot be used to dodge the limit; a question normally costs one or two requests. Over the limit, the route returns 429 with `retryAt`.
4. **Daily cap and health**: past `PEARL_DAILY_MESSAGE_CAP` model calls, or for five minutes after a model error, the route answers in quick answers mode instead of calling the model.

**Generation.** Each request that passes makes one `streamText` call:

```ts
// src/app/api/chat/route.ts (excerpt)
import { convertToModelMessages, createUIMessageStreamResponse, isStepCount, streamText, toUIMessageStream } from 'ai';
import { guard, markDegraded } from '@/lib/pearl/guard';
import { instructions } from '@/lib/pearl/instructions';
import { gatewayOptions, pearlModel } from '@/lib/pearl/model';
import { quickAnswer } from '@/lib/pearl/offline-faq';
import { tools } from '@/lib/pearl/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
  const g = await guard(req); // request, session, limits, daily cap
  if (g.type === 'reject') return g.response; // 400, 401, 403, 413 or 429 with a short JSON code
  if (g.type === 'quick') return quickAnswer(g.messages, g.headers);

  const result = streamText({
    model: pearlModel(), // PEARL_MODEL through the AI Gateway, or the mock model when PEARL_MOCK=1
    instructions: instructions({ section: g.section, mode: g.mode }),
    messages: await convertToModelMessages(g.messages, { tools }),
    tools,
    toolApproval: { leaveMessage: 'user-approval' },
    experimental_toolApprovalSecret: process.env.PEARL_APPROVAL_SECRET,
    stopWhen: isStepCount(4),
    maxOutputTokens: g.mode === 'general' ? 400 : 800,
    temperature: 0.3,
    abortSignal: req.signal,
    providerOptions: gatewayOptions(), // fallback model, zero data retention, 'pearl' tag
  });

  return createUIMessageStreamResponse({
    headers: g.headers, // sets the session cookie after a Turnstile check
    stream: toUIMessageStream({
      stream: result.stream,
      tools,
      originalMessages: g.messages,
      onError: (error) => {
        void markDegraded(error); // a model or gateway error starts five minutes of quick answers mode
        return 'Pearl could not answer.';
      },
    }),
  });
}
```

- `instructions` are three system messages: Pearl's persona and rules (`lib/pearl/instructions.ts`; the full text is in the AI Agents Guide), the knowledge base, and one line of context (section in view, mode, today's date in IST). A cache breakpoint after the knowledge base (`providerOptions.anthropic.cacheControl` on that message) lets every message within five minutes of the last one read the prefix from Anthropic's prompt cache at a tenth of the input price.
- `isStepCount(4)` caps a turn at four model steps; showing a card and then answering takes two.
- `abortSignal: req.signal` ends generation when the visitor presses Stop or closes the panel, so no tokens are spent on an answer nobody reads.
- `gatewayOptions()` sets a fallback model for provider outages, `zeroDataRetention: true`, and a `pearl` tag for spend reports.

**Knowledge base.** `scripts/knowledge.ts` builds it before `next build` from every typed content file, the MDX case-study bodies as plain text (components and code dropped), and `content/pearl/*.md`, minus every fact listed in a `confidential` array. It writes `src/lib/pearl/knowledge.generated.ts` (git-ignored): the knowledge base text, a map from section ids to titles and URLs, and a token estimate. Each section opens with its id, for example `[freelance/clinic-booking]`. The script warns above 20,000 tokens and fails above 50,000, the point at which ADR-06 says to add retrieval.

**Sources.** Pearl ends each factual answer with a line such as `Sources: freelance/clinic-booking, experience/knowvation`. The panel hides that line and renders one source chip per id it finds in the section map; unknown ids are dropped, so an invented source can never become a link.

**Tools.** Server tools read content and return the data for a card; browser tools act on the page and report back.

| Tool | Runs | What it does | Priority |
| --- | --- | --- | --- |
| `showProject` | Server, read-only | Returns card data for one project or freelance case study (title, outcome, stack, duration, link, image); the panel renders a project card | P0 |
| `showContactCard` | Server, read-only | Résumé download, copy email, and the booking link when one exists; `focus` picks the primary button | P0 |
| `leaveMessage` | Server, after approval | Sends name, email, topic, and message, plus a project brief when scoping, through the contact pipeline's notify step | P0 |
| `navigate` | Browser | Scrolls to a home-page section | P0 |
| `openCaseStudy` | Browser | Opens a case-study page | P0 |
| `showFitCard` | Server, read-only | Checks that every claimed match cites real content, then returns the fit card: matches with evidence, gaps, a next step | P1 |
| `setMotion` | Browser | Changes the motion and 3D preferences | P2 |
| `showMonogram` | Browser | Plays the KR particle monogram | P2 |

Tools for P1 and P2 features join the tool set only when those features ship, so the model never sees a tool it cannot use.

**The panel.** `usePearl()` wraps `useChat`:

```tsx
// src/components/pearl/usePearl.ts (excerpt)
const { messages, sendMessage, regenerate, stop, status, addToolOutput, addToolApprovalResponse } = useChat<PearlMessage>({
  id: 'pearl',
  messages: readSession(), // the conversation lives in sessionStorage for the browser session
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest: ({ messages }) => ({
      body: {
        messages: lastTurns(messages, { max: 20, maxBytes: 28_000 }), // always starts at a visitor message
        section: ui.getState().activeSection,
        mode: modeOf(messages), // 'general' | 'jd' | 'scoping'
        turnstile: takeTurnstileToken(), // only until the session cookie is set
      },
    }),
  }),
  sendAutomaticallyWhen: (options) =>
    lastAssistantMessageIsCompleteWithToolCalls(options) || lastAssistantMessageIsCompleteWithApprovalResponses(options),
  onToolCall: ({ toolCall }) => {
    if (toolCall.dynamic || !isBrowserTool(toolCall.toolName)) return;
    addToolOutput({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output: runBrowserTool(toolCall) });
  },
  onError: (error) => ui.getState().setChatError(parseChatError(error)), // verify, rate-limited, or error
});
```

Parts render by type: text as sanitised Markdown, with the `Sources:` line turned into chips; `tool-showProject` and `tool-showContactCard` as cards once their state is `output-available`; `tool-leaveMessage` in the `approval-requested` state as the confirm card. Its "Send message" button calls `addToolApprovalResponse({ id: part.approval.id, approved: true })`; "Edit" answers `approved: false` with the reason "The visitor wants to change the message", and Pearl asks what to change. `status` feeds `ui.chat.status`, which drives the launcher shimmer and the scene's `uThinking`.

**Approvals cannot be forged.** The client sends the whole conversation with every request, so the route treats it as untrusted input. With `experimental_toolApprovalSecret` set, the AI SDK signs each approval request and refuses an approval whose signature does not match, so a hand-crafted request cannot make `leaveMessage` run. The tool also shares the contact form's limit of 5 messages an hour. The option is experimental in AI SDK 7.0, so re-check it at every SDK upgrade.

**When something fails**

| Situation | What the visitor sees | How |
| --- | --- | --- |
| Daily cap reached, or a model error in the last 5 minutes | The subline changes to "Quick answers mode"; answers come from the FAQ, each with contact options | The route skips the model: `lib/pearl/offline-faq.ts` matches the question against `content/pearl/faq.md` and streams the answer with `createUIMessageStream` plus a `data-notice` part; status `offline` |
| The primary model provider is down | No difference | The AI Gateway retries on the fallback model |
| Rate limited | "You've asked a lot of questions in a few minutes. Pearl can answer again at 8:40 PM." plus Copy email | 429 with `retryAt`; status `rate-limited` |
| The session cookie expired | No difference | 401 `verify`, a fresh Turnstile token, one retry |
| Any other failure | "Pearl couldn't answer that. Try again." with a Retry button | `onError`; status `error`; Retry calls `regenerate()` |

**Cost.** The persona, rules, and knowledge base come to about 12,000 tokens. On Claude Haiku 5.5 an uncached message costs about US$0.0015 (12,000 input tokens at US$0.10 per million plus 400 output tokens at US$0.50 per million) and a cached one about US$0.0004, because cache reads cost US$0.01 per million. A thousand messages a month cost under US$1.50, and the production daily cap of 300 model calls bounds the worst case at about US$0.45 a day.

**Logging.** Off by default. With `PEARL_LOGGING=on`, the `onEnd` callback of `streamText` stores each transcript without contact details, together with the mode, the tools used, and the token counts, in Redis with a 30-day expiry, as the Security section requires.

## Contact & notification pipeline

A contact submission becomes an email to Kushwant and an instant phone notification within seconds, and nothing is stored anywhere else. Pearl's "leave a message" tool calls the same pipeline after the visitor confirms.

1. **Form** (`components/sections/Contact.tsx`): a real `<form action={contact}>` so it posts without JavaScript; with JavaScript, `useActionState` shows pending and field errors inline. Fields as in the PRD, plus a hidden honeypot field and the Turnstile token.
2. **Validate** (`actions/contact.ts`, `'use server'`): parse `FormData` with the shared `ContactInput` zod schema (name 2–80 characters, a valid email, message 10–4,000 characters, topic from the enum, budget and timeline only when the topic is freelance). A filled honeypot returns a fake success and stops.
3. **Verify** the Turnstile token against Cloudflare's siteverify endpoint with `TURNSTILE_SECRET_KEY`; on failure, return "Please try again" with no detail.
4. **Rate limit**: 5 submissions per hour per IP hash (Upstash sliding window, prefix `contact`).
5. **Send** with Resend from `hello@<domain>` (domain verified with SPF and DKIM) to `CONTACT_TO_EMAIL`, `replyTo` set to the visitor, subject "\[Freelance\] Ananya Rao: booking chatbot". The body is a React Email template. Auto-reply to the visitor (P1).
6. **Notify** through `lib/notify.ts`: a Telegram bot message ("New freelance enquiry from Ananya Rao, budget ₹40,000–₹1,00,000") via the Bot API with `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. WhatsApp Cloud API is a drop-in alternative if it is already set up. Notification failures are logged and never fail the submission.
7. **Respond**: the action returns `{ ok: true }` or field errors; the client shows the "Message sent" toast and fires `contact_submit`. If sending fails, the form shows the error toast and a selectable email address as the fallback.

**Limits that matter**: Resend's free tier allows 3,000 emails a month and 100 a day; Upstash's free tier allows 500,000 commands a month. Both are far above expected volume.

**Privacy**: submissions exist only in the email inbox and the Telegram chat; the server logs the outcome (sent, failed, rate-limited) without names or messages.

## Client state & interaction architecture

Three small zustand stores connect the page, the 3D scene, and Pearl. The rule that keeps it fast: anything that changes every frame or every scroll event is read with `getState()` inside `useFrame` and never subscribed to by a React component.

```ts
// src/stores/ui.ts: React subscribes to this
type UiState = {
  chat: { open: boolean; status: 'ready' | 'streaming' | 'error' | 'offline' | 'rate-limited'; unread: boolean };
  activeSection: SectionId;
  paletteOpen: boolean;
  motionPref: 'auto' | 'reduced';      // footer toggle, saved to localStorage
  qualityPref: 'auto' | 'low' | 'off'; // footer toggle, saved to localStorage
  openChat: (prompt?: string) => void; // "Ask Pearl about this" passes a prompt
};

// src/stores/scroll.ts: transient, written on scroll, read in useFrame
type ScrollState = { y: number; viewportH: number; sections: Record<SectionId, { top: number; height: number }> };

// src/stores/scene.ts
type SceneState = {
  tier: 0 | 1 | 2 | 3; // off, low, medium, high
  reason: 'gpu' | 'fps' | 'user' | 'reduced-motion' | 'no-webgl2' | 'save-data' | 'context-lost';
  ready: boolean;
  anchors: { heroDot?: DOMRect; launcher?: DOMRect };
};
```

| Signal | Produced by | Consumed by | Mechanism |
| --- | --- | --- | --- |
| Scroll position | One passive `scroll` listener | Formation weights, the pearl's handoff | `scroll` store, read per frame |
| Section in view | `IntersectionObserver` at 50% | Nav `aria-current`, Pearl's starters, `section_view` event | `ui.activeSection` |
| Layout sizes | `ResizeObserver` on sections and anchors, re-run after `document.fonts.ready` | Section offsets, 3D anchors | `scroll` and `scene` stores |
| Nav scrolled state | The scroll listener, past 80 px | NavBar | A `data-scrolled` attribute, toggled only when it changes |
| Pearl streaming | `useChat` status | Launcher shimmer, the pearl's `uThinking` uniform, particle pulse | `ui.chat.status` |
| Pearl client tools | `onToolCall` (navigate, openCaseStudy, setMotion) | Router, `scrollIntoView`, motion preference | `ui` actions, then `addToolOutput` |
| Motion and 3D toggles | Footer controls, or Pearl's `setMotion` | `MotionConfig`, `SceneRoot` | `ui` preferences |
| Frame-rate decline | drei `PerformanceMonitor` `onDecline` | Quality tier | `scene.tier` steps down once per decline |
| WebGL context lost | `webglcontextlost` on the canvas | `SceneMount` | `scene.tier = 0`; the SVG poster returns |

**Why stores and not React context**: context updates re-render every consumer; the scroll and scene stores update dozens of times a second, and the canvas must not re-render React to read them.

**Persisted preferences** use `localStorage` inside try/catch and default to the OS settings when storage is unavailable. Nothing else is persisted on the client, apart from the current Pearl conversation in `sessionStorage`.

## Styling & theming implementation

The Nacre design system's `tokens.json` is the only place a colour, radius, or shadow value is written; the code reaches it through generated CSS variables and Tailwind utilities named after the tokens. The design system's Implementation section has the full, compiled setup; this is the summary.

- **Pipeline**: `design/tokens.json` → `pnpm tokens` (`scripts/tokens.ts`) → `src/styles/tokens.css` (theme variables, `@theme` mapping, z-index utilities) → imported by `globals.css` after `@import "tailwindcss"`.
- **Utilities**: `bg-lagoon`, `text-mist`, `border-line-strong`, `rounded-pill`, `inset-shadow-lustre`, `shadow-float`, `shadow-focus`, `type-display` … `type-caption`, `z-nav`, and `pearl`. Tailwind's default radii are cleared, so only Nacre radii exist.
- **Guardrail**: Tailwind's default palette still compiles (`text-rose-400` builds silently), so CI greps for default palette classes and fails the build if it finds one.
- **Fonts**: `next/font/google` loads Anek Latin (latin and latin-ext, with the width axis) as the only preloaded font; Anek Telugu and Martian Mono load on first use. Variables `--font-anek`, `--font-anek-telugu`, `--font-martian` feed `font-sans`, `font-telugu`, `font-mono`.
- **Themes**: `<html data-theme="dark">` ships at launch. The light Pearl theme (P2) is already in the tokens; turning it on means adding `next-themes` with `attribute="data-theme"` and re-reading the scene colours when the attribute changes.
- **Class composition**: a `cn()` helper with `clsx` and `tailwind-merge`, configured with the custom `type-*` and `z-*` class groups so merges never drop them.
- **Motion**: the `motion` package with `LazyMotion` and `m` components (only the DOM animation features load), wrapped in `<MotionConfig reducedMotion="user">`. No scroll-triggered entrance animations anywhere.
- **Page transitions (P1)**: React 19.3's `<ViewTransition>` on the project image, with Next.js's `experimental.viewTransition` flag. The Next.js integration is still marked experimental and not recommended for production ([docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)), so it ships behind `config.flags` and stays off if anything misbehaves.
- **React Compiler**: `reactCompiler: true` in `next.config.ts` removes most manual memoisation. Scene components that mutate three.js objects in `useFrame` stay correct because they mutate refs, not props or state; if one misbehaves, opt it out with the `'use no memo'` directive.

```ts
// next.config.ts (excerpt)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: { viewTransition: false }, // flip on for P1 page transitions
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [{ source: '/resume', destination: '/resume/Kushwant-KR-Resume.pdf', permanent: false }];
  },
};

export default nextConfig;
```

## SEO, metadata & discoverability

Search engines, link previews, and AI assistants all read the same prerendered HTML, so discoverability is mostly a matter of complete metadata and structured data generated from the content files.

- **Metadata API**: the root layout sets `metadataBase` from `NEXT_PUBLIC_SITE_URL`, a title template `%s – Kushwant KR`, the default title "Kushwant KR – Full-stack and AI engineer in Hyderabad", a 150-character description, Open Graph and `summary_large_image` Twitter cards. Each case study's `generateMetadata` sets its own title, description (the outcome sentence), and canonical URL.
- **Structured data**: JSON-LD rendered in a `<script type="application/ld+json">` (with `<` escaped) from `lib/seo.ts`: `ProfilePage` whose `mainEntity` is a `Person` (name, job title, `worksFor` Knowvation Learnings, Hyderabad address locality, `sameAs` LinkedIn and GitHub, `knowsAbout` from Daily-driver skills) on the home page; `CreativeWork` with `author` and a `BreadcrumbList` on every case study.
- **Open Graph images**: `opengraph-image.tsx` per route renders lagoon, the name or project title in Anek Latin, and the pearl, at 1,200 × 630. The OG renderer (Satori) reads TTF, OTF, or WOFF but not WOFF2 or variable axes, so the repo keeps one static TTF instance of Anek Latin (weight 760, width 114) for it.
- **Sitemap and robots**: `sitemap.ts` lists the home page and every case study with `lastModified` from content; `robots.ts` allows everything and points to the sitemap. AI crawlers are allowed on purpose: being described accurately by assistants is a goal.
- **`/llms.txt`**: a plain summary for AI assistants (who Kushwant is, roles, three best projects, freelance services, availability, contact) generated from content at build time.
- **Semantics**: one `<h1>` per page, sections with headings, `<time datetime>` for every date, descriptive alt text enforced by the content schema (minimum 10 characters).
- **After launch**: verify the domain in Google Search Console and Bing Webmaster Tools, submit the sitemap, and check previews in LinkedIn's Post Inspector and WhatsApp.

## Performance budgets & optimisation

The budget is simple: the page must be fast as if the 3D scene did not exist, and the scene must hold its frame rate or step down. Budgets are checked in CI where a tool can measure them.

| Metric | Budget | Enforced by |
| --- | --- | --- |
| LCP, mobile, p75 field | ≤ 2.0 s | Speed Insights; Lighthouse CI on previews |
| INP, p75 field | ≤ 200 ms | Speed Insights |
| CLS | ≤ 0.05 | Lighthouse CI; reserved boxes for media and the canvas |
| First-load JavaScript, home | ≤ 180 KB gzipped | Bundle analyzer snapshot compared in CI |
| 3D chunk | ≤ 350 KB gzipped, loaded after LCP | Same |
| Chat chunk | ≤ 60 KB gzipped, loaded on intent | Same |
| Hero frame rate | 55+ fps integrated-GPU laptop, 45+ mid-range Android | Device matrix before launch; `quality_tier` events after |
| Draw calls, triangles (High) | ≤ 20 calls, ≤ 150,000 triangles | `r3f-perf` overlay behind `?perf` in development |
| First-visit transfer, excluding video | ≤ 1.2 MB | Lighthouse |

**Techniques**

1. Prerendered HTML with Next's inlined critical CSS; Anek Latin is the only preloaded font.
2. No preloader. The inline SVG poster (about 3 KB) holds the scene's place, so the headline stays the LCP element.
3. The scene mounts after hydration and an idle callback (2 s timeout), and never at tier 0 (Off).
4. The starting tier comes from `detect-gpu` with its benchmark files self-hosted in `public/gpu-benchmarks`; drei's `PerformanceMonitor` steps it down if the frame rate stays low; each tier caps the pixel ratio.
5. Particles are one `Points` draw call. The five formation buffers (40,000 × 5 positions on High) are built once into typed arrays; move the build into a Web Worker only if profiling shows a long task.
6. The frame loop stops while the tab is hidden; under reduced motion it renders one frame on demand.
7. Pearl's chunk is prefetched on launcher hover, focus, or touch start and mounted on click; Turnstile loads only when the chat or the contact form first opens.
8. Images use `next/image` with `sizes` and AVIF; videos use `preload="none"`, a poster, and play only in view on desktop.
9. Sections are Server Components; only interactive leaves are client components. `LazyMotion` loads only DOM animation features.
10. The Turbopack bundle analyzer and Next.js 16.4's `next-bundle-optimizer` agent skill catch regressions before they ship ([release notes](https://nextjs.org/blog/next-16-4)).

## Security & privacy

The attack surface is two endpoints and one AI model, so the controls concentrate there: validate everything, limit everything, let the model act only with the visitor's click, and store nothing personal.

**Secrets and boundaries**

- All keys live in environment variables without the `NEXT_PUBLIC_` prefix; server modules import `server-only` so a mistaken client import fails the build.
- `/api/chat` accepts only `POST` from the site's own origin (the `Origin` header must equal `NEXT_PUBLIC_SITE_URL`), bodies up to 32 KB, and zod-validated messages (at most 20, each at most 1,500 characters, or 6,000 in job-description mode).

**Abuse limits, from first to last line of defence**

1. Turnstile verification before the first chat message; a signed, httpOnly, one-hour cookie then marks the session as verified.
2. Per-visitor limits keyed by a SHA-256 hash of IP plus a daily salt (raw IPs are never stored): 20 chat requests per 10 minutes and 80 per day; 5 contact submissions per hour.
3. A global daily message cap (`PEARL_DAILY_MESSAGE_CAP`, default 300). Past it, Pearl switches to quick answers mode.
4. A monthly spend budget on the AI Gateway as the final backstop.

**AI-specific controls**

- Pearl's instructions treat everything a visitor pastes as data, never as instructions.
- Tools are read-only, except `leaveMessage`, which needs the visitor's approval in the UI (`toolApproval: { leaveMessage: 'user-approval' }`) and can only send to Kushwant's fixed address.
- Tool inputs are validated with zod; output is rendered as sanitised Markdown with no raw HTML, and links only to the site itself, LinkedIn, GitHub, or the booking domain.
- No secrets, keys, or private notes in the prompt; confidential facts are removed when the knowledge base is built.

**Headers** (set in `next.config.ts`; run the policy as `Content-Security-Policy-Report-Only` for a week, then enforce):

```ts
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
].join('; ');
// plus: Strict-Transport-Security max-age=63072000; includeSubDomains; preload
//       X-Content-Type-Options nosniff · Referrer-Policy strict-origin-when-cross-origin
//       Permissions-Policy camera=(), microphone=(self), geolocation=(), payment=()
```

`'unsafe-inline'` stays in `script-src` because nonces need per-request rendering, which these static pages avoid. Vercel Analytics and Speed Insights load from the site's own origin; `next/font` self-hosts the fonts; `microphone=(self)` exists only for P2 voice input.

**Privacy**

- `/privacy` states what is collected and why: contact details (emailed, not stored), chat messages (sent to the model provider through the AI Gateway to generate answers), and cookie-free analytics.
- Turn on the AI Gateway's per-request zero data retention, which costs nothing extra on the Pro plan ([pricing](https://vercel.com/docs/ai-gateway/pricing)).
- Chat transcripts are not logged by default. If logging is enabled for quality, transcripts are stored without IPs or contact details and expire after 30 days.
- Requests to delete data go to the contact email and are honoured within 7 days, in line with the notice-and-consent principles of India's DPDP Act, 2023.
- Dependencies update weekly through Renovate; CI runs `pnpm audit`; Next.js's `experimental.agentUpgrade: 'security'` setting flags releases that fix vulnerabilities.

## Observability & analytics

Four signals tell Kushwant whether the site works: visitor behaviour, real-user performance, Pearl's health and spend, and errors. Each has one home.

| Signal | Tool | What to watch |
| --- | --- | --- |
| Behaviour | Vercel Web Analytics through `lib/analytics.ts` | The PRD's 13 events, page views, referrers; custom events need the Pro plan |
| Real-user performance | Vercel Speed Insights | LCP, INP, CLS at p75 by page and device |
| Pearl health and spend | AI Gateway dashboard and budgets | Requests, latency, errors, daily spend; `pearl_feedback` thumbs-down rate |
| Errors | Sentry (optional; free tier) or Vercel runtime logs | Chat route failures, WebGL context loss, shader compile errors, contact send failures |

- **One adapter**: components call `track('resume_download', { source: 'nav' })` from `lib/analytics.ts`. It forwards to `@vercel/analytics` on Vercel and is a no-op elsewhere, so moving hosts (or switching to cookieless Umami or PostHog) changes one file.
- **No personal data** in any event: no chat text, no names, no emails, no IPs. The adapter type only accepts the event names and property shapes listed in the PRD.
- **3D telemetry**: `quality_tier` (tier and reason) shows how many visitors actually see High, Medium, Low, or Off, which decides whether the effects are worth their cost.
- **Alerts**: AI Gateway budget alerts at 50% and 90% of the monthly cap; a weekly glance at Speed Insights and the thumbs-down list for the first month, then monthly.

## Testing strategy

Tests guard the things that break silently: content that stops validating, a form that stops sending, a page that stops being accessible or fast, and Pearl starting to say things that aren't true.

| Layer | Tool | What it covers | When it runs |
| --- | --- | --- | --- |
| Content | `pnpm content:check` (zod) | Every content file valid; evidence links exist; at least one featured project and freelance case study; no placeholders in production | Every PR; `--strict` on main |
| Unit | Vitest | Knowledge-base builder (confidential facts removed), formation generators (counts, bounds), link sanitiser, rate-limit wrapper, contact schema | Every PR |
| Component | Vitest + Testing Library | Form validation messages, chat parts rendering (sources, cards, confirm card), nav `aria-current` | Every PR |
| End to end | Playwright | Anchor navigation, case-study pages, contact submit with email and Telegram stubbed, Pearl conversation with a mock model, `?3d=off` path | Every PR, against a production build |
| Accessibility | @axe-core/playwright plus keyboard-only scripts | Zero violations on home, a case study, 404, the open chat panel; full keyboard path through nav, form, and Pearl | Every PR |
| Visual | Playwright screenshots with `?3d=off` | Home and one case study at 360, 768, 1440 px | Every PR, reviewed when they change |
| Performance | Lighthouse CI | Budgets from the Performance section on the preview URL, mobile profile | Every preview deploy |
| 3D smoke | Playwright (headless Chromium uses a software GPU) | The canvas mounts, no WebGL or shader errors in the console, the tier falls back cleanly when WebGL is disabled | Every PR |
| 3D on devices | Manual matrix | Five devices from the PRD's launch checklist, frame rate per tier | Before launch and after scene changes |
| Pearl evals | `pnpm eval` (Vitest runner, real model) | 40+ cases: grounding, unknowns, refusals, salary deflection, prompt injection, tool choice, Telugu answers | On demand, nightly, and before any prompt or model change; must pass 90% |

**Mocking the model**: with `PEARL_MOCK=1`, `lib/pearl/model.ts` returns the AI SDK's mock language model from `ai/test`, streaming canned answers and tool calls, so end-to-end tests are deterministic and free.

**How evals grade**: each case in `tests/evals/cases.json` has rule checks (must mention, must not mention, must call or not call a tool, must refuse) plus a groundedness score from a stronger judge model that sees the knowledge base. The AI Agents Guide lists the starter cases.

## CI/CD, environments & configuration

Every pull request gets a full check and its own preview URL; `main` deploys to production only when the strict content check passes.

**Environments**

| Environment | Trigger | Model | Content rule |
| --- | --- | --- | --- |
| Local | `pnpm dev` | Mock by default (`PEARL_MOCK=1`) | Placeholders allowed, ribbon shown |
| Preview | Every pull request (Vercel preview) | Real model, daily cap 50 | Placeholders allowed, ribbon shown |
| Production | Merge to `main` | Real model, daily cap 300 | `content:check --strict`: any placeholder fails the deploy |

**Pipeline** (`.github/workflows/ci.yml`)

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`: ESLint (flat config with `eslint-config-next` core-web-vitals and TypeScript presets) plus the default-palette grep
3. `pnpm typecheck`: `tsc --noEmit`
4. `pnpm content:check` (`--strict` on `main`)
5. `pnpm test`: Vitest unit and component tests
6. `pnpm build`: generates tokens, static files, and Pearl's knowledge base, then `next build`
7. `pnpm test:e2e`: Playwright against `next start`, including axe, visual, and 3D smoke tests
8. Preview deploy, then Lighthouse CI against the preview URL
9. Nightly on `main`: `pnpm eval` against the real model and a Playwright smoke test against production

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "node scripts/tokens.ts && node scripts/static-files.ts && node scripts/knowledge.ts && next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "tokens": "node scripts/tokens.ts",
    "content:check": "node scripts/content-check.ts",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "eval": "vitest run --config vitest.evals.config.ts"
  }
}
```

Scripts run with plain Node (22.18 and later strip TypeScript types), so content files use relative imports rather than the `@/` alias.

**Environment variables**

| Name | Needed in | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | All | Canonical URLs, OG images, the chat route's origin check |
| `AI_GATEWAY_API_KEY` | Local, preview, production (on Vercel, OIDC can replace it) | Model access through the AI Gateway |
| `PEARL_MODEL` | All | Model id, default `anthropic/claude-haiku-5.5` (confirm the exact id in the Gateway's model list) |
| `PEARL_MOCK` | Local, CI | `1` swaps in the mock model |
| `PEARL_DAILY_MESSAGE_CAP` | Preview, production | Global daily message cap (50 and 300) |
| `PEARL_LOGGING` | Optional | `on` stores anonymised transcripts for 30 days |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Preview, production | Rate limits and the daily counter |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Preview, production | Contact email |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Production | Instant notification |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | All (Cloudflare's published test keys locally) | Bot check |
| `COOKIE_SECRET`, `IP_HASH_SALT` | Preview, production | Signing the verified-session cookie; hashing IPs |
| `PEARL_APPROVAL_SECRET` | Preview, production | Signing Pearl's tool approval requests (see Chatbot architecture) |
| `SENTRY_DSN` | Optional | Error reporting |

**Dependency updates**: Renovate opens one grouped pull request a week for minor and patch updates and a separate one per major version; Next.js majors go through `npx next@canary upgrade --agent` on a branch.

## Risks & future evolution

Most technical risk sits in fast-moving libraries and in model behaviour; both are contained behind one module each (`src/scene`, `src/lib/pearl`) so a change touches one place.

| Risk | Early signal | Response |
| --- | --- | --- |
| React Three Fiber 9.8 supports React below 19.4 only | Peer warning on install | Pin React 19.3 until Fiber supports the next minor |
| AI SDK API churn (v7 already renamed `system`, `stepCountIs`, `onFinish`) | Deprecation warnings | All AI SDK calls live in `lib/pearl` and `components/pearl`; upgrade with the SDK's migration guide |
| Model behaviour shifts after a provider update | Eval pass rate drops below 90% | Run evals before any model change; pin the model id in `PEARL_MODEL` |
| WebGL bugs on specific Android GPUs | `quality_tier` events with reason `context-lost` | Add the GPU to a Low or Off list in `useQuality.ts` |
| Chat abuse or a cost spike | Gateway budget alert | Caps already degrade to quick answers mode; tighten limits |
| Hosting plan or price changes | Vercel notices | Portable to Cloudflare Workers through OpenNext |
| Experimental Next.js features | Build warnings | View transitions stay behind a flag; nothing else experimental ships on by default |

**After launch**

- **P1**: the pearl-to-launcher handoff, job-description match, project scoping, the command palette, page transitions, the colophon page.
- **P2**: the light Pearl theme, MDX notes, the skill constellation, voice input, optional sound.
- **Platform**: TypeScript 7.1 once typescript-eslint supports it; three's WebGPU renderer behind a tier flag; retrieval for Pearl only if the knowledge base grows past about 50,000 tokens.

## Sources

Versions come from the npm registry on 22 October 2026. Pages opened while writing this document:

- [Next.js 16.4 release post](https://nextjs.org/blog/next-16-4)
- [Next.js: useTypeScriptCli](https://nextjs.org/docs/app/api-reference/config/next-config-js/useTypeScriptCli)
- [Next.js: viewTransition](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)
- [Next.js: empty generateStaticParams with Cache Components](https://nextjs.org/docs/messages/empty-generate-static-params)
- [React 19.3 announcement](https://react.dev/blog/2026/09/09/react-19-3)
- [TypeScript 7 release coverage (InfoQ)](https://infoq.com/news/2026/08/typescript-7-released/)
- [AI SDK 7: chatbot tool usage](https://ai-sdk.dev/v7/docs/ai-sdk-ui/chatbot-tool-usage)
- [AI SDK 6 to 7 migration checklist](https://mcpservers.org/agent-skills/vercel/ai/migrate-ai-sdk-v6-to-v7)
- [AI SDK: prompt caching recipe](https://ai-sdk.dev/cookbook/node/dynamic-prompt-caching)
- [Vercel AI Gateway pricing](https://vercel.com/docs/ai-gateway/pricing)
- [Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
- [Vercel Web Analytics custom events](https://docs.vercel.com/docs/analytics/custom-events)
- [Claude API pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- [Tailwind CSS: font size and theme variables](https://Tailwindcss.com/docs/font-size)
- [Resend free tier summary](https://automationatlas.io/answers/resend-free-tier-explained-2026/)
- [Upstash Redis pricing](https://upstash.com/blog/redis-pricing-comparison-every-major-provider-in-2026-with-numbers)
