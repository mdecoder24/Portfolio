# Kushwant KR Portfolio — PRD

Oct 22, 2026 · @Kushwant

## Overview

Kushwant KR's portfolio is one fast, 3D-enhanced website whose job is to turn a 60-second visit into an interview, a call, or a freelance enquiry. It is built with React (Next.js) and Three.js (React Three Fiber), and it ships with **Pearl**, an AI assistant that answers questions about Kushwant's work, checks his fit against a job description, and scopes freelance projects.

| Item | Detail |
| --- | --- |
| Product | Personal developer portfolio and freelance storefront |
| Owner | Kushwant KR, Associate Software Engineer (ASE), Knowvation Learnings Pvt Ltd |
| Version | v1.0, draft for review |
| Companion docs | Design System ("Nacre") · Architecture · AI Agents Guide |
| Priorities used | **P0** launch blocker · **P1** launch target · **P2** after launch |
| Target launch | Open question; the release plan assumes about 4 weeks of part-time work |

**What is real and what is placeholder.** Real today: the name Kushwant KR, 2026 graduate, ASE at Knowvation Learnings Pvt Ltd, a track record of freelance projects, based in Hyderabad. Everything else in this PRD (projects, clients, metrics, dates, testimonials) is invented sample content so the site can be built now and filled in later.

**Placeholder convention.** All content lives in typed files under `src/content/`. Every invented entry carries `placeholder: true`, and a `content:check` script lists them. Preview builds show a small "sample content" ribbon on placeholder entries; production builds fail while any remain, so nothing fake ever goes live by accident.

## Problem, goals & non-goals

The portfolio must prove, within one scroll, three things a fresher's résumé cannot: Kushwant ships real software at Knowvation, he delivers for paying clients, and he has the depth and taste to build something memorable (3D and AI).

**Problems to solve**

- Recruiters skim. A PDF résumé cannot show working software, code quality, or initiative.
- Freelance clients want proof of delivery (outcomes, testimonials, process) before they share a budget. Today that proof is scattered across chats and links.
- Template portfolios blur together. A fresher needs one signature moment that is memorable and also demonstrates skill.

**Goals** (targets are starting points to revisit 90 days after launch)

| Goal | How we measure it | Target |
| --- | --- | --- |
| G1. Land interviews | Résumé downloads, "job opportunity" contact submissions, call bookings | 10 qualified hiring contacts in 90 days |
| G2. Win freelance work | Project enquiries from the form or Pearl's project-scoping flow | 3 qualified enquiries a month |
| G3. Prove engineering quality | Lighthouse mobile scores, Core Web Vitals, axe audit | Performance 90+, Accessibility 100, SEO 100, zero axe violations |
| G4. Be memorable | Engaged time, Pearl usage, scroll depth | 60 s median engaged time, 20% of visitors open Pearl, 50% reach Projects |
| G5. Stay easy to update | Time to add a project or freelance case study | Under 15 minutes, one content file plus images, no component edits |

**Non-goals for v1**

- No CMS or admin panel. Content is typed files edited through Git.
- No blog at launch. The routing leaves room for one (P2).
- No accounts, comments, guestbook, or payments. Quotes and invoices for freelance work happen offline.
- No translated site copy. Pearl may answer in Hindi or Telugu, but the site is in English.
- No WebGPU-only effects. WebGL 2 is the baseline; WebGPU is a later enhancement.
- Pearl never speaks as Kushwant, never negotiates salary or rates, and never commits him to anything.

## Audiences & key journeys

Four audiences visit, and each must reach its next step within two moves from the hero. Recruiters and freelance clients are the priority; engineers and peers are served by the same content at more depth.

| Audience | The decision they are making | Time they give | Must find fast | Primary next step |
| --- | --- | --- | --- | --- |
| Recruiter (campus, talent acquisition) | Shortlist or not? | 30–90 s | Role, current employer, stack keywords, education, location, availability | Download résumé or email |
| Hiring engineer (tech lead, interviewer) | Is he as strong as the résumé says? | 3–10 min | Case studies with decisions and trade-offs, live demos, GitHub, how this site is built | Open a case study, then book a call |
| Freelance client (founder, small business, agency) | Can I trust him with my project and budget? | 2–5 min | Services, client outcomes, testimonials, process, reply time | Start a project (form or Pearl) |
| Peer developer or student | What can I learn or build with him? | 1–3 min | 3D and AI techniques, source code, socials | Follow, star the repo, connect |

&#91;embedded content: audience journeys · entry, first move, conversion\]

The hero carries name, role, employer, and availability, so a recruiter can decide before scrolling. The lists below set the requirements for each path.

**Recruiter, 60 seconds**

1. The first viewport shows name, role, current employer, and availability.
2. The résumé button sits in the navigation on every screen size.
3. Experience, education, and skills are scannable in under 10 seconds each.
4. Contact is one click: copy email, or open the form with "Job opportunity" preselected.

**Recruiter with a job description**

1. Opens Pearl and pastes the job description.
2. Pearl returns a fit summary: matched requirements with links to evidence, honest gaps, and a suggested next step.
3. One click to preview the résumé (with its download button), email, or book a call.

**Hiring engineer, 5 minutes**

1. Hero, then "View work".
2. A featured project opens its case study: problem, architecture, key decisions, results, code links.
3. "How this site is built" in the footer leads to engineering notes and the repo.
4. Asks Pearl a technical question, such as how the particle morph works, and gets an answer with links.

**Freelance client, 3 minutes**

1. "Hire me for a project" in the hero, or "Freelance" in the navigation.
2. The Freelance section shows services, 2–3 client case studies with outcomes and testimonials, and a 4-step process.
3. "Start a project" opens a short brief form or Pearl's scoping chat.
4. The confirmation states when to expect a reply (within 24 hours).

## Positioning & content strategy

Kushwant is positioned as a full-stack and AI engineer who already ships: a day job at Knowvation Learnings, paid freelance projects, and side projects that push into 3D and AI. The site itself is the strongest proof, so its craft is part of the message.

**Positioning statement.** For teams hiring early-career engineers and for small businesses that need software built, Kushwant KR is a full-stack and AI engineer who turns ideas into working products. Unlike template portfolios, every claim here links to shipped work.

**Headline options** (pick one; A/B later)

| Option | Headline | Sub-headline |
| --- | --- | --- |
| A (recommended) | I build web products that think and move. | Associate Software Engineer at Knowvation Learnings and freelance developer. Full-stack apps with a soft spot for AI and 3D. |
| B | Fresh graduate. Already shipping. | Full-stack and AI engineer from Hyderabad, building at Knowvation Learnings and for clients. |
| C | Full-stack and AI engineer, building from the City of Pearls. | I design, build, and ship web apps, chatbots, and interactive experiences. |

**Voice and tone**

- Site copy is first person ("I built…"); Pearl speaks in third person ("Kushwant built…").
- Confident, specific, warm. Short sentences, numbers in digits.
- Banned words: passionate, hard-working, ninja, rockstar, guru, "cutting-edge", "synergy".
- One spelling convention site-wide (British/Indian English recommended), enforced by a spell-check step.

**Content principles**

1. Evidence over adjectives: every claim links to a project, a metric, or a testimonial.
2. Outcome first: case studies open with the result, then the process.
3. Honest fresher framing: work, freelance, personal, and academic projects are labelled as such.
4. Confidentiality: Knowvation work is described only at the level the employer approves; client names appear only with permission, otherwise as "a Hyderabad clinic" or "an EdTech startup".
5. Scannable: each section opens with a one-line summary; bullets stay under two lines.
6. Fresh: a "Now" line and a "Last updated" date, refreshed monthly.

**Case study template** (projects and freelance share it): title, one-line outcome, role, timeline, team size, stack, problem, 3–5 key decisions, architecture diagram, results with numbers, what I would do differently, links (live, repo), and for freelance a client testimonial.

**Search terms to rank for**: "Kushwant KR", "Kushwant KR developer", "full-stack developer Hyderabad", "freelance web developer Hyderabad", "AI chatbot developer Hyderabad", "React Three.js developer".

## Information architecture & sitemap

One long home page carries the story in the order a recruiter reads it; case studies get their own URLs so they can be shared, indexed, and linked from Pearl.

&#91;embedded content: sitemap · home sections, case studies, standalone pages\]

Navigation, the Pearl launcher, the command palette (P1), and the 3D and motion toggles are on every page.

- Primary navigation: About, Experience, Freelance, Projects, Contact, plus Résumé and Ask Pearl.
- Case-study pages share one template for projects and freelance work: breadcrumb, previous/next links, and a link back to the section they came from.
- Slugs are lowercase kebab-case and permanent; a renamed slug gets a redirect, so shared links never break.

## Section requirements

The home page runs in order of credibility: employment, then paid client work, then personal projects. Order: Hero, About, Experience, Freelance, Projects, Skills, Education & Achievements, Contact, Footer. Every section is server-rendered HTML that works with 3D and JavaScript off.

### Navigation (P0)

- Sticky bar, transparent over the hero; gains a surface and blur after 80 px of scroll.
- Left: "KR" monogram (back to top). Links: About, Experience, Freelance, Projects, Contact. Right: Résumé (opens the preview page, which has the download) and "Ask Pearl".
- The active section is highlighted and marked `aria-current`.
- Mobile: menu button opens a full-screen sheet with links, résumé, Pearl, and socials. Focus is trapped; Esc closes.
- First focusable element is a "Skip to content" link.
- **Done when:** fully keyboard-operable, and the scroll state change causes no layout shift.

### Hero (P0)

- **Content:** name "Kushwant KR"; role line "Software Engineer · Full-Stack & AI"; headline and sub-headline (option A); two status pills, "ASE @ Knowvation Learnings" and freelance availability; CTAs "View my work" (primary), "Hire me for a project" (secondary), and a text link "Ask Pearl about me".
- **Visual:** the 3D pearl and particle field sit behind and beside the text (see The 3D experience).
- **Extras:** live local time, "Hyderabad · 8:08 PM IST" (P1); scroll cue that respects reduced motion.
- **Done when:** the headline is the LCP element (never the canvas); text renders before any 3D loads; the hero fits `100svh` on a 360 px wide phone; a 3D failure never blocks the text.

### About (P0)

- Bio of 80–120 words; quick facts row (Based in Hyderabad · B.Tech CSE 2026 · ASE at Knowvation · N freelance projects shipped).
- "What I'm into" chips (for example LLM apps and RAG, real-time 3D on the web, developer tooling) and a "Now" line updated monthly.
- Portrait with a duotone treatment (P1).
- **Done when:** facts also appear in Person structured data.

### Experience (P0)

- Vertical timeline, newest first: Knowvation Learnings Pvt Ltd, Associate Software Engineer, 2026–present, Hyderabad, then internships.
- Each entry: role, organisation, dates in `<time>`, location, 3–5 impact bullets, tech chips, optional logo.
- **Done when:** every entry has at least two outcome bullets, and logos lazy-load.

### Freelance (P0, its own section and nav item)

- **Header:** "Freelance & client work", an availability badge (Available / Limited / Booked, set by one config value), and typical reply time.
- **Services:** 3–4 cards, for example web apps and dashboards, AI chatbots and automation, landing pages, 3D and interactive experiences. Each lists a one-liner, typical stack, and typical timeline; "starting from" prices are optional and hidden by default.
- **Client case studies:** 2–4 cards with client (or an anonymised label), industry, problem, solution, outcome metric, stack, duration, testimonial, live link; each opens `/freelance/[slug]`.
- **Process strip:** Discovery call → Proposal and quote → Build with weekly demos → Launch and support.
- **CTA:** "Start a project" opens the contact form with "Freelance project" preselected, or "Scope it with Pearl".
- **Done when:** freelance work is never mixed into personal projects; trust numbers (projects shipped, industries) come from content data, not hand-typed copy.

### Projects (P0)

- 3–4 featured cards: preview image or muted looping video (desktop, in view only; poster on mobile), title, one-line outcome, tags, links (Case study, Live, Code).
- Filter chips All / AI & ML / Full-stack / 3D & Creative / Tools and a compact archive list (P1).
- Case study pages at `/projects/[slug]` for every featured project, with previous/next links and "Ask Pearl about this project" (P1).
- **Done when:** images ship as AVIF/WebP with alt text; each video is under 2 MB with a poster; cards have visible focus.

### Skills (P0)

- Grouped: Languages, Frontend, Backend, AI & ML, Data, Cloud & DevOps, Tools.
- Three honest tiers instead of percentages: Daily driver, Comfortable, Exploring. No progress bars.
- Each skill links to the work that used it; Pearl uses the same links as evidence.
- 3D "skill constellation" view (P2).
- **Done when:** every Daily-driver skill has at least one evidence link.

### Education & Achievements (P0)

- Degree, college, years, optional CGPA (config flag), relevant coursework, final-year project link.
- Certifications (issuer, date, credential link) and achievements (hackathons, awards, open source, workshops).
- **Done when:** every item carries a date, and a verification link where one exists.

### Contact (P0)

- Heading "Let's build something". Form: name, email, topic (Job opportunity / Freelance project / Collaboration / Just saying hi), message.
- Choosing "Freelance project" reveals project type, budget range in ₹ (including "Not sure yet"), and timeline.
- Alternatives: copy email, LinkedIn, GitHub, book a call (P1), WhatsApp click-to-chat (optional config).
- Spam defence: honeypot field, invisible Turnstile challenge, rate limit.
- **Done when:** the same schema validates on client and server; errors are announced to screen readers; the form submits without JavaScript; success states the expected reply time; the sender gets an auto-reply (P1).

### Footer (P0)

- Mini navigation, socials, "How this site is built" (colophon page, P1), view source, last-updated date, 3D and motion toggle, copyright year.

## The 3D experience

The 3D layer tells one story: Hyderabad is the City of Pearls, and a pearl grows layer by layer, the way an engineer does. An iridescent pearl sits at the heart of a field of particles ("signals") that reorganise as the visitor scrolls, and the pearl later becomes Pearl, the chat button. Everything is procedural (no downloaded 3D models in v1), decorative, and optional.

**Scene by section**

| Section | Particle formation | The pearl | Interaction | Reduced motion / Off |
| --- | --- | --- | --- | --- |
| Hero | Orbit: a tilted ring around the pearl | Large, centre-right, slow spin | Cursor pushes particles away; the pearl's highlight follows the cursor | Still SVG poster of the same frame |
| About, Experience | Layers: concentric shells, like nacre in cross-section | Drifts left, smaller | None | Static |
| Freelance | Clusters: one glowing cluster per service | Small, top-right | Hovering a service card brightens its cluster (P1) | Static |
| Projects, Skills, Education | Field: sparse dust at low opacity so text stays readable | Docks bottom-right and becomes the Pearl launcher (P1) | Skill hover lights a node in a constellation view (P2) | Static |
| Contact | Wave: a calm horizon plane | Launcher pulses once | None | Static |

**Signature moments**

- **The handoff (P1):** leaving the hero, the pearl shrinks and flies to the bottom-right corner, where it becomes the Pearl chat launcher. Without 3D, the launcher is a CSS pearl gradient.
- **Thinking pearl (P1):** while Pearl is answering, the pearl shimmers faster and nearby particles drift toward it, so the AI and the 3D feel like one system.
- **Monogram (P2):** an easter egg arranges the particles into "KR" for three seconds.

**Quality tiers** (chosen from a GPU check, then adjusted by live frame rate)

| Tier | Typical device | Particles | Pearl material | Post-processing | Pixel-ratio cap |
| --- | --- | --- | --- | --- | --- |
| High | Discrete GPU, Apple Silicon | 40,000 | Iridescent physical material, clearcoat, studio lighting | Soft bloom, film grain, vignette | 2 |
| Medium | Integrated-GPU laptop, flagship phone | 15,000 | Same material, lower lighting resolution | Film grain | 1.5 |
| Low | Budget phone, weak GPU | 5,000 | Simplified (matcap) | None | 1 |
| Off | No WebGL 2, Save-Data, user toggle | SVG poster | None | None | None |

**Rules**

- The canvas is decoration: hidden from assistive technology, and no information exists only in 3D.
- 3D loads after the hero text has painted; a lightweight inline-SVG poster holds its place, then cross-fades to the live scene.
- Native scrolling only. The 3D reacts to scroll; it never controls or hijacks it.
- Rendering pauses when the tab is hidden or the canvas is off-screen.
- With `prefers-reduced-motion`, the scene renders one still frame with no morphing or cursor effects; visitors can opt back in from the footer toggle.
- If the frame rate stays under 45 fps for 2 seconds, the tier steps down automatically.

**Done when**

- An integrated-GPU laptop holds 55+ fps in the hero at 1080p on Medium or above.
- A mid-range Android phone holds 45+ fps on Low or Medium.
- Turning 3D off removes the canvas and frees GPU memory.
- Lighthouse LCP is the same with 3D on and off, because the canvas mounts after LCP.

## AI chatbot: Pearl

Pearl is a site guide that answers only from Kushwant's own content and turns interest into action: a résumé download, a booked call, or a project brief. It lives in the pearl launcher at the bottom-right and behind every "Ask Pearl" button.

**Persona**

- Name: Pearl, tied to the City of Pearls concept (alternatives: KR Assistant, Kai, Echo).
- Speaks about Kushwant in the third person and never pretends to be him.
- Warm, concise, lightly witty; 2–4 sentences by default, with "Tell me more" for depth.
- Opening line: "Hi, I'm Pearl, Kushwant's AI guide. Ask about his work, check his fit for a role, or scope a project with him."

**What Pearl can do**

| Capability | Example prompt | What Pearl does | Priority |
| --- | --- | --- | --- |
| Answer about Kushwant | "Tell me about Kushwant in 30 seconds" | Elevator pitch with links to sections | P0 |
| Project deep-dive | "How did he build the booking chatbot?" | Problem, approach, stack, result, link to the case study | P0 |
| Skill check with evidence | "Has he used PostgreSQL?" | Yes, no, or "exploring", with links to the work that proves it | P0 |
| Navigate the site | "Show me his freelance work" | Scrolls to the section or opens the case study | P0 |
| Résumé and contact | "Can I get his résumé?" | Shows a résumé card with download and copy-email | P0 |
| Leave a message | "Tell him I'd like to talk" | Collects name, email, and message, shows exactly what will be sent, sends only after the visitor confirms | P0 |
| Job-description match | Visitor pastes a JD | Fit summary: matched requirements with evidence, honest gaps, suggested next step | P1 |
| Project scoping | "I need a website for my bakery" | Asks up to 5 questions (goal, features, timeline, budget range, contact) and drafts a brief to send | P1 |
| Book a call | "Can we talk this week?" | Opens the booking link | P1 |
| How this site works | "How do the particles move?" | Explains the build from the colophon notes, links the repo | P1 |
| Context-aware starters | Visitor is on the Freelance section | Starter chips change with the section in view | P1 |
| Any language | A question in Telugu or Hindi | Answers in the visitor's language | P1 |
| Rich cards | Any answer about a project or role | Project, role, and contact cards inside the chat | P1 |
| Site settings | "Turn off the animations" | Switches motion and 3D off | P2 |
| Voice input | Microphone button | Browser speech-to-text dictation | P2 |
| Fun facts | "Best biryani in Hyderabad?" | Answers from a fun-facts file if one exists, else a friendly redirect | P2 |
| Easter egg | "Show me something cool" | Triggers the KR particle monogram | P2 |

**What to put in Pearl's knowledge base** (Kushwant writes these; the site's typed content files supply projects, skills, and roles automatically)

- [ ] Pitch: a 30-second version, a 2-minute story, 1–3 year career goals, target roles.
- [ ] Knowvation: responsibilities, public-level projects, tech, wins, lessons; mark anything confidential.
- [ ] Freelance: per client the problem, solution, stack, timeline, outcome, testimonial, and naming permission; services offered, availability, process, how pricing is discussed, reply time.
- [ ] Personal and academic projects: motivation, architecture, hardest bug, trade-offs, results, links, what's next.
- [ ] Skills: tier, months used, evidence links, and a "currently learning" list.
- [ ] Education, certifications, hackathons, awards, workshops, open source.
- [ ] Work preferences: roles, locations (Hyderabad, remote, relocation), work mode, freelance hours a week.
- [ ] Contact: email, LinkedIn, GitHub, résumé link, booking link, optional WhatsApp.
- [ ] Personality: hobbies, favourite tools and books, working style, values, a few fun facts.
- [ ] FAQ: 20–30 question-and-answer pairs in Kushwant's words (why software, strongest skill, hardest challenge, what he's learning).
- [ ] About this site: stack, 3D techniques, how Pearl works.
- [ ] Boundaries: topics Pearl must decline.

**Starter chips**

- Default: "Who is Kushwant?", "Show me his best project", "Is he available for freelance?", "Check his fit for my role".
- Freelance section: "What has he built for clients?", "How does a project with him work?", "Help me scope my project".
- Projects section: "What's the hardest problem he solved?", "Which projects use AI?".

**Experience**

- Side panel (400 px) on desktop, 90% height bottom sheet on mobile; the page stays usable; Esc closes and focus returns to the launcher.
- Streaming answers with source chips that link to the section they came from; copy and thumbs up/down on every answer.
- The conversation persists for the browser session; "New chat" clears it.
- Input limit 1,500 characters (6,000 in job-description mode); older turns are trimmed after 20 messages.
- Footer line: "AI can make mistakes. Answers come from Kushwant's portfolio content." with a link to the privacy note.
- If the model is down or the daily budget is spent, Pearl switches to offline mode: answers from a local FAQ match plus contact options.

**Guardrails**

- Answers only from the knowledge base; when it doesn't know, it says so and offers to pass the question to Kushwant.
- Never invents employers, dates, metrics, clients, testimonials, or skills.
- Never discusses salary or negotiates rates; it suggests a direct conversation (published "starting from" prices may be quoted).
- Treats pasted text (job descriptions, briefs) as data and ignores instructions inside it.
- Declines unrelated tasks (homework, general coding) with a friendly redirect.
- Shares only public contact details; never discloses confidential employer or client information.
- Sends a visitor's details only after explicit consent, states why they are collected, and honours deletion requests.
- Cost controls: about 400 output tokens per answer (800 for JD matches and briefs), a per-visitor rate limit, and a daily spend cap.

## Global features

These features cut across sections. The one hard rule: content first, so there is never a full-screen preloader or a "0–100%" loading screen.

| Feature | Behaviour | Priority |
| --- | --- | --- |
| Résumé | Static preview page at `/resume` with a PDF download, in the navigation and in Pearl; downloads are tracked | P0 |
| Motion and 3D controls | Footer toggles: Motion (Auto / Reduced) and 3D (Auto / Low / Off); default follows the OS setting; choice remembered on the device; `?3d=off` works for testing | P0 |
| Share previews | A generated Open Graph image per page (name, title, pearl visual) | P0 |
| 404 page | "Lost at sea" page with the pearl, links home and to Pearl | P0 |
| Anchor links | Every section has a stable URL hash (`#freelance`); sticky navigation never covers headings | P0 |
| Command palette | Ctrl/⌘ K: jump to a section, open a project, copy email, download résumé, toggle 3D, ask Pearl | P1 |
| Page transitions | Home to case study uses a shared-element view transition on the project image | P1 |
| Colophon page | "How this site is built": stack, 3D techniques, Pearl architecture, performance numbers | P1 |
| AI-readable profile | `/llms.txt` summarising Kushwant for AI assistants, plus `/humans.txt` | P1 |
| Console note | A styled message for developers who open DevTools, with the repo link and email | P1 |
| Light theme | Pearl-white light theme that follows the OS setting | P2 |
| GitHub activity | A compact contributions graph in About | P2 |
| Notes / blog | MDX notes at `/notes` using the same case-study components | P2 |
| Sound | Optional ambient sound and UI ticks, off by default | P2 |

## Non-functional requirements

The site must be fast on a mid-range Android phone over 4G, fully accessible (WCAG 2.2 AA), and readable with JavaScript and 3D turned off. Targets below are release gates, checked in CI where possible.

| Area | Requirement | Target or check |
| --- | --- | --- |
| Performance | Core Web Vitals at the 75th percentile, mobile, field data | LCP ≤ 2.0 s, INP ≤ 200 ms, CLS ≤ 0.05 |
| Performance | Lighthouse mobile score | 90+ with 3D on Auto, 95+ with 3D off |
| Performance | JavaScript budgets (gzipped) | First load ≤ 180 KB; 3D chunk ≤ 350 KB, loaded after LCP; chat panel ≤ 60 KB, loaded on first open or hover |
| Performance | LCP element | The hero headline. The pre-3D poster is inline SVG, never a large raster image |
| Accessibility | Colour contrast | Text 4.5:1, large text and UI parts 3:1, verified for every token pair |
| Accessibility | Keyboard | Every control reachable; visible 2 px focus ring; focus never hidden under the sticky bar |
| Accessibility | Targets and reflow | Targets at least 24×24 px (primary actions 44×44); no horizontal scroll at 320 px or 200% zoom |
| Accessibility | Motion | `prefers-reduced-motion` honoured; nothing flashes more than 3 times a second |
| Accessibility | Screen readers | Landmarks, one H1 per page, logical headings, canvas hidden, chat replies announced politely, form errors announced |
| SEO | Indexable content | All text in server HTML; unique title, description, and canonical per route; `lang="en-IN"` |
| SEO | Structured data and discovery | Person and ProfilePage on home, CreativeWork per case study; sitemap, robots, Open Graph images |
| Security | Secrets and headers | No secrets in client bundles; HSTS, CSP, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'` |
| Security | Abuse protection | Schema validation on every endpoint; rate limits on chat and contact; invisible Turnstile; dependency audit in CI |
| Privacy | Data collection | Cookie-free analytics (no banner needed); contact and chat-lead data emailed, not stored in a database; a short `/privacy` page following the notice-and-consent principles of India's DPDP Act, 2023 |
| Privacy | Chat logs | Off by default. If enabled: anonymised, no IP addresses stored, deleted after 30 days, disclosed in the chat footer |
| Compatibility | Browsers and devices | Last two versions of Chrome, Edge, Firefox, Safari (macOS, iOS), Samsung Internet; layouts verified at 360, 768, 1024, 1440, 1920 px |
| Resilience | Degradation | No WebGL 2: SVG poster. Chat down: offline FAQ mode. Contact API down: `mailto:` fallback. No JavaScript: content and contact form still work |
| Maintainability | Code and content quality | TypeScript strict; content schemas validated at build; placeholder gate in production builds; adding a project needs no component changes |
| Cost | Running cost at launch traffic | Under US$5 a month, excluding the domain and any hosting-plan upgrade (see Risks) |

## Analytics & success metrics

Thirteen cookie-free events show whether the site is doing its job. None carries personal data or chat text; Pearl events record what happened, never what was said.

| Event | Fires when | Properties | Feeds |
| --- | --- | --- | --- |
| `resume_download` | Any résumé link is used | source (nav, hero, Pearl, palette) | G1 |
| `contact_submit` | Contact form succeeds | topic, budget band (freelance only) | G1, G2 |
| `call_booking_open` | Booking link opened | source | G1, G2 |
| `freelance_cta` | "Start a project" or "Scope it with Pearl" clicked | variant | G2 |
| `project_open` | A case study opens | slug, source (card, Pearl, palette) | G3, G4 |
| `pearl_open` | Chat panel opens | trigger (launcher, inline button, palette), section in view | G4 |
| `pearl_message` | Visitor sends a message | mode (general, JD match, scoping), message number | G4 |
| `pearl_action` | Pearl uses a tool | tool name | G1, G2, G4 |
| `pearl_lead_sent` | A message or brief is confirmed and sent | intent | G1, G2 |
| `pearl_feedback` | Thumbs up or down | rating | Answer quality |
| `section_view` | A section is at least 50% visible for 1 s (once per visit) | section | G4 |
| `quality_tier` | The 3D tier is chosen or changed | tier, reason (GPU check, frame rate, user, reduced motion) | G3 |
| `outbound_click` | GitHub, LinkedIn, or a live demo is opened | target | Engagement |

**Weekly dashboard**: visitors, median engaged time, share reaching Projects, résumé downloads, contact submissions by topic, Pearl open rate, Pearl-to-action conversion, thumbs-up rate (target 80%+), and Core Web Vitals at p75.

**Review rhythm**: weekly for the first 4 weeks after launch, then monthly. A low thumbs-up rate means the knowledge base needs work; a low freelance CTA rate means the services copy or headline needs testing.

## Release plan

Version 1.0 launches after four part-time weeks (about 15 hours a week); each week ends at a gate that must pass before the next begins. P1 follows in weeks 5–8, and P2 stays a backlog.

&#91;embedded content: release roadmap · 6 phases, 5 gates\]

The launch gate is the one that matters: nothing ships with sample content, and Core Web Vitals are checked on real devices, not only in Lighthouse.

**Launch checklist (v1.0 gate)**

- [ ] `content:check` passes with zero `placeholder: true` entries
- [ ] Lighthouse mobile: Performance 90+ (3D on Auto), Accessibility 100, SEO 100
- [ ] axe: zero violations on the home page, a case study, and the 404 page
- [ ] Device QA: iPhone (Safari), mid-range Android (Chrome), Windows laptop with integrated GPU (Edge), MacBook (Safari), Firefox desktop
- [ ] 3D: tiers verified; reduced motion shows the still frame; `?3d=off` works
- [ ] Pearl: eval suite at 90%+; rate limit and daily cap tested; offline mode tested
- [ ] Contact: works without JavaScript; email and instant notification arrive; spam checks on
- [ ] Share previews checked in LinkedIn, WhatsApp, and X
- [ ] Domain, HTTPS, `/resume` page, sitemap submitted to Google Search Console
- [ ] Privacy page live; analytics events firing; résumé PDF is the latest version

## Risks, assumptions & open questions

The two risks most likely to bite are 3D performance on budget phones and Pearl saying something untrue; both have release gates. Two non-technical items need answers before launch: employer policy on freelancing, and hosting terms.

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| 3D slows budget phones | High | Medium | Quality tiers, SVG poster, LCP gate in CI, automatic tier downgrade |
| Pearl states something untrue | Medium | High | Knowledge-base-only answers, never-invent rules, an eval suite in CI, thumbs-down review, disclosure line |
| Prompt injection through a pasted JD or chat | Medium | Medium | Pasted text treated as data, no secrets in the prompt, tools limited to safe actions, sending a message needs visitor confirmation |
| Chat abuse runs up the model bill | Medium | Medium | Per-visitor rate limit, daily spend cap at the AI gateway, Turnstile before the first message, output caps |
| Hosting terms: Vercel's free Hobby plan is for non-commercial use, and advertising services counts as commercial ([Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines)) | High | Medium | Use Vercel Pro (US$20 a month) or a host whose free plan allows commercial use; decide before launch (see Architecture) |
| Employer policy restricts freelancing or showing internal work | Medium | High | Check the employment agreement before publishing; one config flag hides the Freelance section; describe Knowvation work at an approved level |
| Client confidentiality and testimonial permission | Medium | Medium | Written permission per client; anonymised labels by default |
| Placeholder content ships | Low | High | Production builds fail on any `placeholder: true` entry |
| 3D polish eats the schedule | High | Medium | Strict P0/P1/P2; P1 3D items behind feature flags; time-boxed |
| Library churn (Next.js 16.x, AI SDK 7, React Three Fiber 9) | Medium | Low | Pinned versions, weekly dependency PRs, upgrades in a branch |

**Assumptions**

- Launch traffic under 5,000 visits and 1,000 chat messages a month.
- Kushwant edits content through Git and is comfortable with TypeScript.
- A custom domain will be bought; Kushwant supplies the résumé PDF and photos.

**Open questions**

- [ ] Which domain? (for example `kushwantkr.dev`; availability unchecked)
- [ ] Does the Knowvation agreement allow freelance work, and how much of the day job can be shown?
- [ ] Which 2–4 freelance projects can be named, and which clients will give testimonials?
- [ ] Show "starting from" prices or not?
- [ ] Hosting: Vercel Pro or a free commercial-friendly host?
- [ ] Make the site's repository public? (A public repo is a strong signal to engineers.)
- [ ] Keep the name "Pearl"?
- [ ] Add a booking link and WhatsApp click-to-chat?
- [ ] Turn on anonymised chat logs to improve Pearl?
- [ ] Include a photo?

## Appendix: placeholder content pack

Everything below is invented sample content for building and testing; replace it before launch. Organisations, clients, metrics, and testimonials marked *(sample)* are fictional, and every entry ships with `placeholder: true` until edited.

**Profile**

| Field | Sample value |
| --- | --- |
| Name | Kushwant KR |
| Role line | Software Engineer · Full-Stack & AI |
| Location | Hyderabad, Telangana, India (IST, UTC+05:30) |
| Email | hello@kushwantkr.dev *(sample)* |
| Availability | Full-time: not looking *(sample)* · Freelance: Limited, 1 slot in November *(sample)* |
| Bio (98 words) | I'm a software engineer from Hyderabad who likes turning fuzzy ideas into products people actually use. By day I'm an Associate Software Engineer at Knowvation Learnings, building learning platforms for students across Telangana. By night and on weekends I take on freelance projects for clinics, cafés, and startups, from booking chatbots to dashboards. I graduated in 2026 with a B.Tech in Computer Science, and I'm happiest where web development meets AI: LLM-powered tools, retrieval systems, and interactive 3D on the web. Currently learning: GLSL shaders and evaluation methods for AI agents. *(sample)* |

**Experience**

| Role | Organisation | Dates | Sample highlights |
| --- | --- | --- | --- |
| Associate Software Engineer | Knowvation Learnings Pvt Ltd | Jul 2026 – present *(sample dates)* | Built a cohort dashboard used by 1,200 learners; cut quiz-page load time by 48%; shipped an AI doubt-solver pilot *(sample)* |
| Software Engineering Intern | Nimbus Labs *(sample)* | Jan – Jun 2026 | Built REST APIs in Node.js and PostgreSQL; added end-to-end tests that caught 30+ regressions *(sample)* |

**Freelance** *(all sample)*

| Project | Client label | Problem → outcome | Stack | Duration |
| --- | --- | --- | --- | --- |
| Clinic booking assistant | A Hyderabad clinic | Phone-only bookings → a website chat that books consultations and pings the doctor to confirm; 60% of bookings now online | Next.js, Node.js, Llama via Groq, WhatsApp Cloud API | 4 weeks |
| Café QR ordering | A Gachibowli café | Paper menus → a QR menu that sends orders to the kitchen tablet; table turnover up 15% | React, Supabase, PWA | 3 weeks |
| Realty lead dashboard | A Kondapur real-estate agency | Leads lost in spreadsheets → one dashboard with WhatsApp follow-up reminders | Next.js, PostgreSQL, Resend | 5 weeks |
| 3D product launch page | A D2C skincare startup | Flat product photos → a 3D product viewer that lifted time on page 2.3× | React Three Fiber, Next.js | 2 weeks |

**Projects** *(all sample)*

| Project | Category | One-line outcome | Stack |
| --- | --- | --- | --- |
| DocuMind | AI & ML | Chat with any PDF; retrieval system that answers with page-level citations | Next.js, FastAPI, pgvector, AI SDK |
| Pulse | Full-stack | Real-time collaborative kanban for student teams, 300+ users | Next.js, WebSockets, PostgreSQL |
| Orbit | 3D & Creative | Explorable solar system with custom shaders, 60 fps on mid-range phones | React Three Fiber, GLSL |
| CodeLens | Tools | VS Code extension that explains a selected block of code with an LLM | TypeScript, VS Code API |

**Skills** *(sample tiers)*

| Tier | Skills |
| --- | --- |
| Daily driver | TypeScript, JavaScript, React, Next.js, Node.js, Python, Tailwind CSS, PostgreSQL, Git |
| Comfortable | Three.js / React Three Fiber, FastAPI, Docker, MongoDB, AI SDK, LangChain, REST and GraphQL, AWS basics |
| Exploring | GLSL shaders, Rust, Kubernetes, LLM fine-tuning, agent evaluation |

**Education & achievements** *(sample)*

- B.Tech, Computer Science and Engineering, an institute in Hyderabad, 2022–2026 (CGPA hidden by default).
- Winner, CodeSprint 2025 college hackathon; AWS Certified Cloud Practitioner (2025); ran a 2-day React workshop for 80 students.

**Testimonials** *(sample)*

- "Kushwant turned our messy booking process into a chat that just works." Clinic owner, Hyderabad.
- "Fast, clear, and he explained every trade-off before building." Founder, D2C skincare startup.
