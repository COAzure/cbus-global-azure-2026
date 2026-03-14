# Project Context

- **Project:** global-azure-2026
- **Requested by:** Michael S. Collier
- **Stack:** Astro content collections, Markdown, static assets
- **Goal:** Enable easy editing of conference content through Markdown-backed structures.

## Core Context

Chewie owns content models, collection schemas, and content wiring.

## Recent Updates

✅ **2026-03-14 Phase 1 Complete:** Implemented Astro content collections with Astro 6-compatible config structure. Discovered that `src/content.config.ts` (root-level) is required, not `src/content/config.ts`. Schemas for speakers and agenda created; sample content provided. Build passing.

📌 Team hired on 2026-03-14

## Learnings

- Astro 6.0.4 requires content collections to be declared in `cbus-global-azure-2026/src/content.config.ts` with explicit loaders; `src/content/config.ts` now fails the build as a legacy path.
- Phase 1 content editing now lives in `cbus-global-azure-2026/src/content/speakers/` and `cbus-global-azure-2026/src/content/agenda/`, with speaker images expected in `cbus-global-azure-2026/public/speakers/`.
- Agenda entries can reference speaker slugs through Astro collection references, keeping Markdown authoring simple while preserving validation.
- Michael asked to keep this change focused on content collections infrastructure only, not page implementation.

- Speaker content needs structured metadata plus image and profile links.
- Markdown should be the primary authoring format for maintainability.
