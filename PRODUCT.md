# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Recruiters (campus, talent acquisition) give it 30–90 s to decide whether to shortlist. They need role, employer, stack, education, location and availability at a glance, then the résumé.
- Hiring engineers spend 3–10 min judging depth through case studies, decisions, trade-offs and code.
- Freelance clients (founders, small businesses in Hyderabad) spend 2–5 min judging trust through services, outcomes, process and reply time.
- Peer developers and students look for techniques, source code and socials.

## Product Purpose
Kushwant KR's personal portfolio and freelance storefront. It turns a 60-second visit into an interview, a call, or a freelance enquiry. Success means résumé downloads, hiring contacts and freelance enquiries (PRD goals G1–G5).

## Positioning
A 2026 graduate who already ships: Associate Software Engineer at Knowvation Learnings, paid freelance projects for local businesses, and side projects in AI and real-time 3D. Every claim links to shipped work. The site's own craft is part of the proof.

## Operating Context
Visitors are mostly in India on mid-range Android phones over 4G, plus recruiters worldwide on laptops. Content lives in typed files in `src/content/`, edited through Git by one person.

## Capabilities and Constraints
- Next.js 16 static pages, one optional React Three Fiber scene, and a contact form that works without JavaScript.
- A future AI guide called "Pearl" (week 3; the name is kept).
- WCAG 2.2 AA, LCP ≤ 2.0 s, and everything readable with 3D and JavaScript off.
- Dark theme by default with a light toggle. The look is inspired by a reference portfolio the user chose (demo.codeandchill.store/portfolio), rebuilt originally without copying its code or assets (user decision, 2026-10-23, superseding the earlier light-default request).
- 3D in the hero (starfield and a KR pixel mosaic) plus a smoke shader behind Contact; nothing behind body text elsewhere.
- The visual identity (Nacre palette, Anek Latin, pearl motif) is open to replacement (user decision, 2026-10-23). The docs in `Guide/` remain authoritative for content, structure and behaviour.

## Brand Commitments
- First-person site copy; Pearl speaks in the third person.
- Sentence case, no emoji, no exclamation marks, British/Indian spelling, rupees with Indian grouping.
- Banned words: passionate, hard-working, ninja, rockstar, guru, cutting-edge, synergy.

## Evidence on Hand
- All projects, clients, metrics and testimonials are sample content (`placeholder: true`) from the PRD appendix.
- Real facts: the name Kushwant KR, 2026 graduate, ASE at Knowvation Learnings Pvt Ltd, freelance track record, based in Hyderabad.
- No real screenshots, portrait or résumé PDF yet. Never fabricate claims beyond the labelled sample pack.

## Product Principles
1. Evidence over adjectives: every claim links to a project, a metric, or a testimonial.
2. Outcome first: lead with the result, then the process.
3. Honest fresher framing: work, freelance, personal and academic projects are labelled as such.
4. Content first: text before any decoration, and nothing blocks reading.

## Accessibility & Inclusion
WCAG 2.2 AA; honour prefers-reduced-motion; reflow at 320 px; visible focus; the canvas is decorative and hidden from assistive tech.
