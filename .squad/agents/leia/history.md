# Project Context

- **Project:** global-azure-2026
- **Requested by:** Michael S. Collier
- **Stack:** Astro, Markdown, static content collections
- **Goal:** Build a conference homepage, agenda, and speaker pages for Columbus Global Azure.

## Core Context

Leia is the lead for planning, architecture, and review.

## Recent Updates

📌 Team hired on 2026-03-14

## Learnings

- The site should prioritize easy content editing through Markdown.
- Speaker pages need name, bio, picture, LinkedIn profile, and GitHub profile.

### 2026-03-14: Project Structure Review

**Current State:**
- Astro 6.0.4 + TypeScript strict mode configured correctly
- Project root: `/cbus-global-azure-2026/` (sensible location)
- Standard scaffold with Welcome component — ready for replacement
- NO content infrastructure yet: missing config.ts, collections, dynamic routes

**Critical Gaps:**
- No Content Collections (Zod schemas) for speakers/agenda
- No agenda page or dynamic speaker routes
- No speaker photo directory planned
- Homepage is generic Astro boilerplate

**Architecture Decision:**
- Use Astro Content Collections with Zod schemas (type-safe Markdown)
- Speaker data: `src/content/speakers/{name}.md` with frontmatter
- Event data: `src/content/agenda/{event-id}.md` with speaker references
- Photos: `public/speakers/{slug}.jpg` for easier editor maintenance
- Dynamic routes: `[slug].astro` for speaker pages, `/agenda` for event listing

**Key File Paths:**
- Astro config: `cbus-global-azure-2026/astro.config.mjs`
- Layout: `src/layouts/Layout.astro` (needs conference branding)
- Pages root: `src/pages/index.astro`
- Future collections: `src/content/config.ts` (new), `src/content/speakers/` (new), `src/content/agenda/` (new)

**Next Phase:**
- Phase 1: Set up content collections and schemas
- Phase 2: Refresh homepage with conference details
- Phase 3: Build speaker pages with dynamic routing
- Phase 4: Build agenda page

**Decision documented in:**
`.squad/decisions/inbox/leia-project-structure-review.md` (awaiting team consensus)
