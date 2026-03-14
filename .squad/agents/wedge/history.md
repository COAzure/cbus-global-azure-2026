# Project Context

- **Project:** global-azure-2026
- **Requested by:** Michael S. Collier
- **Stack:** Astro, Markdown content, static-site validation
- **Goal:** Keep the conference site reliable as content is added and changed.

## Core Context

Wedge owns testing, validation, and quality checks.

## Recent Updates

📌 Team hired on 2026-03-14

## Learnings

- Speaker profile links and images are likely validation hot spots.
- Markdown-driven sites need checks for missing frontmatter and broken references.
- `cbus-global-azure-2026/src/content.config.ts` currently hard-requires speaker `photo`, `linkedin`, and `github`, even though the UI already tolerates missing photo files via `src/components/SpeakerPortrait.astro`.
- Current site validation is limited to `npm run build`; `npm run astro -- check` cannot run without installing `@astrojs/check`, so broken external profiles and missing headshots are not automatically caught.
- Key audited page paths: `src/pages/index.astro`, `src/pages/agenda/index.astro`, `src/pages/speakers/index.astro`, and `src/pages/speakers/[slug].astro`; current speaker assets are expected under `public/speakers/`.
- Homepage session cards always render a description node from `entry.body.trim()` in `src/pages/index.astro`, so agenda entries with empty Markdown bodies would surface a blank paragraph on the homepage.
