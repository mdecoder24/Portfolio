# AGENTS.md: Kushwant KR portfolio

A Next.js 16 portfolio: static pages, one React Three Fiber scene behind native-scrolling
HTML, and an AI guide called Pearl. Read this whole file before your first change in a session.

## Sources of truth
- docs/prd.md: scope, priorities (P0 ships at launch; P1 and P2 stay behind flags), behaviour
- docs/architecture.md: stack, versions, structure, security, performance budgets
- docs/design-system/ and design/tokens.json: every colour, size, radius, shadow, motion
  value, component, and interface string
- docs/agents-guide.md: process, Pearl's prompt, tools, and evals
- Next.js docs for the installed version: node_modules/next/dist/docs/ (read before
  writing Next.js code; see the managed block at the end of this file)
- Nested AGENTS.md files in src/scene, src/content, and src/lib/pearl add rules for those folders
- When sources disagree, stop and ask. Never edit a doc to match your code.

## Commands (pnpm only)
- pnpm dev: dev server on :3000; Pearl uses the mock model (PEARL_MOCK=1 in .env.local)
- pnpm build: tokens, static files, knowledge base, then next build
- pnpm lint / pnpm typecheck / pnpm test / pnpm test:e2e
- pnpm content:check (add --strict to fail on placeholders, as production does)
- pnpm tokens: regenerate src/styles/tokens.css from design/tokens.json
- pnpm eval: Pearl evals against the real model. Costs money: run only when asked.

## Repository map
- src/app: routes; api/chat/route.ts is Pearl's endpoint
- src/actions/contact.ts: the contact server action
- src/components/ui | sections | layout | pearl: Nacre components, page sections,
  layout pieces, Pearl's panel
- src/scene: everything three.js
- src/content: the only place content lives
- src/lib/pearl: Pearl's server logic; src/lib: rate limits, notify, Turnstile, analytics, SEO
- src/stores: zustand stores (ui, scroll, scene)
- scripts: tokens, content check, static files, knowledge base
- tests: unit, e2e, a11y, visual, evals

## Hard rules
1. Versions are pinned: Next.js 16.4, React 19.3, TypeScript 6.0, Tailwind 4.3,
   three 0.186, @react-three/fiber 9.8, AI SDK 7. Never add, remove, or upgrade a
   dependency without asking.
2. Only src/scene imports three or @react-three/*. The scene mounts only through
   src/components/layout/SceneMount.tsx.
3. Server-only modules (src/lib/pearl, src/lib/notify.ts, src/lib/ratelimit.ts,
   src/actions) start with import 'server-only'. Secrets never get a NEXT_PUBLIC_ prefix.
4. Pages stay static: no cookies(), headers(), or searchParams in pages or layouts.
   ensureStatic = 'navigation' in the root layout turns a mistake into a build error:
   fix the cause, never remove the export.
5. Style with Nacre tokens only (bg-lagoon, text-mist, border-line-strong, rounded-pill,
   type-body, shadow-focus). No Tailwind default palette classes, no hex or rgb() in
   components or the scene, no arbitrary values that duplicate a token. Never edit
   src/styles/tokens.css by hand.
6. Content changes happen only in src/content. Anything you invent carries
   placeholder: true. Never present an invented fact about Kushwant as real.
7. Native scrolling only: no Lenis, GSAP, ScrollControls, or scroll hijacking.
   No full-screen preloader.
8. Everything works without 3D and without JavaScript: content is server-rendered
   HTML and the contact form posts without JavaScript.
9. Accessibility is a release gate: WCAG 2.2 AA, visible focus, labels on icon-only
   buttons, prefers-reduced-motion honoured, the canvas aria-hidden.
10. Pearl never acts on its own: leaveMessage keeps toolApproval 'user-approval'.
    Never weaken the guard, the rate limits, or the caps.
11. Do not change Pearl's instructions, tool descriptions, or knowledge-base builder
    without asking; the evals must pass after the change.
12. Never commit .env files, keys, or visitor data. Tests never call paid APIs.

## Code conventions
- TypeScript strict. No any; a non-null assertion needs a comment saying why.
- Server Components by default; 'use client' only on interactive leaves. Client islands
  load with next/dynamic(..., { ssr: false }) inside a small client wrapper.
- Named exports; one component per file; PascalCase components; hooks start with use;
  kebab-case route segments and content slugs.
- Validate every input with zod: forms, route bodies, tool inputs, content.
  Share each schema between client and server.
- The React Compiler is on: no useMemo or useCallback by reflex; never mutate props
  or state.
- Imports use the @/ alias inside src; scripts and content files use relative imports.
- Comments explain why, not what.

## Writing in the interface
- Sentence case; no all-caps labels, no emoji, no exclamation marks.
- British/Indian English spelling (colour, organise); numbers in digits; rupees with
  Indian grouping (₹1,50,000).
- Site copy is first person ("I built"); Pearl speaks about Kushwant in the third person.
- Buttons, errors, and toasts use the exact strings in docs/design-system/guide/4-writing.md.

## How to work
1. Read the task, this file, and the doc sections the task touches. If anything is
   ambiguous or conflicts with a doc, ask before writing code.
2. Write a short plan: the files you will touch and how you will verify. Wait for
   approval when the plan touches more than 10 files, src/lib/pearl, security headers,
   or dependencies.
3. Make the smallest change that does the task. No drive-by refactors.
4. Verify (below), then report: what changed, how you verified it, what is left open.

## Before you say "done"
- pnpm typecheck, pnpm lint, pnpm test, and pnpm content:check pass.
- UI work: the Next.js MCP server reports no errors; the page is checked at 360 px and
  1440 px, with 3D on and with ?3d=off; the keyboard path works.
- src/scene work: no console or shader errors; ?tier=low and ?tier=off work; the
  High tier stays within 20 draw calls (?perf in development).
- Pearl work: tests pass on the mock model; ask before running pnpm eval.
- New behaviour has a test. Put command output or screenshots in the PR description.

## Stop and ask when
- The task, a doc, and the code disagree.
- You need a new dependency, environment variable, external service, or header change.
- A visual value you need is not in the design system.
- A test fails for a reason you cannot explain, or you want to skip, delete, or loosen one.
- You would have to invent a fact about Kushwant, a client, or a metric.

## Git
- Work directly on main: no feature branches or pull requests (the owner's choice, 29 Oct 2026).
- Conventional Commits: feat:, fix:, chore:, content:, docs:, test:
- One logical change per commit; aim for diffs under about 400 lines.
- CI runs on every push to main, so run the checks in "Before you say done" before pushing.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
