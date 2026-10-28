---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/components/sections"]
---

# Home page

Scope: `/` plus the shared chrome (nav, footer) and case-study pages that inherit it. Mode: Experience (portfolio); the work leads.

Audience and job: recruiters (60-second scan to résumé), hiring engineers (case studies), freelance clients (services, proof, contact). Constraints: light theme by default with a dark toggle, subtle colour, sections clearly divided, one quiet 3D moment in the hero only.

## Direction contract

THESIS: Hiring Kushwant is a kit you assemble: the page is an instruction manual with a parts table, numbered pages and exploded diagrams. It refuses the split-hero-and-card-grid developer portfolio and the dark glowing tech look.

OWN-WORLD: Cool matte instruction-sheet paper (not cream), white plates, black line ink at 1.5–2 px, grey rules, and one signal-orange used only for callout dots, step numbers, links and focus. Archivo at wide widths for headings, Archivo for text, tabular figures for codes. Square corners, ruled tables, numbered step circles, "Fig." plates with captions ruled beneath. No shadows, no gradients, no rounded cards.

STORY: The visitor sees what the kit contains (role, employer, projects shipped, freelance slot), sees the parts explode apart, follows lettered callouts to sections, and reaches the final step (contact) or the résumé.

FIRST VIEWPORT: Top-left, a cover strip reading "KR-2026 · Build kit · Hyderabad". The headline is in Archivo wide 800 across columns 1–7, with the subheadline under it and then "View my work" (ink fill) and "Hire me for a project" (outline). At right, columns 8–12: a live 3D line drawing of four parts (interface, server, model, scene) that explodes apart on load, with orange lettered callouts A–D listed in a legend linking to sections. Below the headline: the "In this kit" table.

FORM: Assembly manual, position 4 of my ordered list (assigned by the roll after two re-rolls and a steer toward techy, warm, clean and light). seed:d446694cbda5a967

Signature interaction: the exploded view. Parts separate along the assembly axis on first load; hovering a legend row or callout lifts that part and turns it orange. Every section opens with a numbered page header (circle number, title, page code), so the division between sections is structural.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
