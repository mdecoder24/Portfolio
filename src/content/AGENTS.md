# src/content/AGENTS.md

- Content is typed TypeScript plus MDX bodies; every file must pass src/content/schema.ts.
- Run pnpm content:check after every edit.
- Invented or sample content always has placeholder: true. Replace placeholders only with
  facts Kushwant gave you in this task; never improve a fact (dates, numbers, clients).
- Client names appear only when client.permission is true; otherwise use the label
  ("a Hyderabad clinic").
- Anything Pearl must never say goes in the entry's confidential array; anything only
  Pearl needs goes in pearlNotes or src/content/pearl/*.md.
- Slugs are permanent. Renaming one needs a redirect in next.config.ts.
- Alt text describes what the image shows, at least 10 characters.
- Write outcomes first, with a number where one exists: "60% of bookings now online".
