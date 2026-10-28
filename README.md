# Kushwant KR — portfolio

Next.js 16 static site with a React Three Fiber scene behind native-scrolling HTML. Specs live in `docs/`
(PRD, architecture, agents guide, Nacre design system); agent rules in `AGENTS.md`.

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint && pnpm typecheck && pnpm test && pnpm content:check
pnpm test:e2e       # builds, serves on :3200, runs Playwright + axe
```

Content lives only in `src/content/`. Every invented entry has `placeholder: true`; replace them with real facts
before launch (`pnpm content:check --strict` fails while any remain). Testing overrides: `?3d=off`, `?tier=low|medium|high`.
