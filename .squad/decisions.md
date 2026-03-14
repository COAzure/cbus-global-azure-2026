# Squad Decisions

## Active Decisions

### 1. Astro Content Collections Architecture
**Date:** 2026-03-14  
**Reviewed by:** Leia  
**Status:** ✅ Implemented (Phase 1 Complete)

**Decision:** Use Astro's built-in Content Collections (Zod-validated) instead of custom data fetching.

**Rationale:**
- Type-safe Markdown parsing without runtime overhead
- Frontmatter validation ensures data quality
- Built-in support for relationships (speaker refs in agenda)
- Aligns with "Markdown-friendly" requirement

**Implementation:**
- Speakers: `src/content/speakers/{name}.md` with frontmatter (name, bio, photo, LinkedIn, GitHub)
- Agenda: `src/content/agenda/{event-id}.md` with frontmatter (title, time, speakers array, room)

**Directory Structure:**
```
src/
├── content/
│   ├── config.ts              ← Zod schemas for collections
│   ├── speakers/              ← Speaker .md files
│   └── agenda/                ← Event .md files
├── pages/
│   ├── index.astro            ← Homepage
│   ├── agenda/
│   │   └── index.astro        ← Agenda page
│   └── speakers/
│       ├── index.astro        ← Speaker listing
│       └── [slug].astro       ← Dynamic speaker detail
```

**Content Location:**
- Speaker photos: `public/speakers/{speaker-slug}.jpg`

**Implementation Plan (4 phases):**
1. **Phase 1:** ✅ Content collections infrastructure + schemas (Astro 6 config at `src/content.config.ts`)
2. **Phase 2:** Homepage refresh with conference branding
3. **Phase 3:** Dynamic speaker pages
4. **Phase 4:** Agenda page

**Astro 6 Adaptation (2026-03-14):**
- Config file location: `src/content.config.ts` (not `src/content/config.ts`)
- Collections use explicit `glob()` loaders for file discovery
- Zod schemas defined in single config file
- Speaker and agenda Markdown live in `src/content/` subdirectories as planned

**Conference Content Fields:**

Speaker schema:
```yaml
name: string
bio: string
photo: string (filename)
linkedin: url
github: url
```

Event schema:
```yaml
title: string
time: ISO 8601 timestamp
room: string
speakers: string[] (speaker slugs)
```

### 2. Speaker Route Derivation Strategy
**Date:** 2026-03-14  
**Reviewed by:** Han  
**Status:** ✅ Implemented (Phase 3 Complete)

**Decision:** Speaker routes are generated from content collection entry IDs with the Markdown extension removed (`entry.id.replace(/\.md$/, '')`) instead of relying on a `slug` property.

**Rationale:**
- Keeps page URLs stable as long as content filenames remain stable
- No need to maintain parallel slug fields in frontmatter
- Direct mapping between filesystem and URL structure
- Simpler content maintenance

**Implementation:**
- Speaker pages: `[slug].astro` derives params from `entry.id.replace(/\.md$/, '')`
- Photo fallback: Missing photos show initials-based placeholder instead of failing

### 3. Conference Naming Convention: "Global Azure Columbus"
**Date:** 2026-03-14  
**Reviewed by:** Han  
**Status:** ✅ Implemented (Branding Complete)

**Decision:** All user-facing site content standardizes to "Global Azure Columbus" (not "Columbus Global Azure").

**Rationale:**
- Consistent conference naming across all public-facing interfaces
- Clarity for event recognition and attendee communication
- Matches official event branding standards

**Implementation:**
- Updated 12 occurrences across 6 core files:
  - Page titles and meta descriptions in layouts, pages, and components
  - Homepage branding and lede text
  - Agenda and speaker page headers
- Year (2026) preserved in all contexts where present
- No functional or routing changes

**Files Updated:**
- `src/layouts/Layout.astro` — Page title/meta defaults
- `src/components/Welcome.astro` — Brand messaging
- `src/pages/index.astro` — Homepage
- `src/pages/speakers/index.astro` — Speaker listing
- `src/pages/speakers/[slug].astro` — Speaker detail template
- `src/pages/agenda/index.astro` — Agenda page

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
