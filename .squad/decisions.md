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

### 4. Homepage Host Logo Placement
**Date:** 2026-03-14  
**Reviewed by:** Han  
**Status:** ✅ Implemented (Homepage Host Branding Complete)

**Decision:** Place the Azure Columbus logo and host attribution inside the homepage hero, directly beneath the primary call-to-action buttons.

**Rationale:**
- Keeps the host relationship visible immediately on first load
- Uses the provided public logo asset without adding a new page section
- Preserves the existing homepage structure and keeps the session/speaker preview content higher on the page

**Implementation:**
- Added host card component to `src/components/Welcome.astro` beneath hero CTAs
- Logo: `public/azure-cbus-smaller.png`
- Copy: "Global Azure Columbus is hosted by Azure Columbus, the local Azure user group."
- Maintains layout consistency and spacing with rest of homepage

**Files Updated:**
- `src/components/Welcome.astro` — Added host card

---

### 5. Homepage Agenda Table Design
**Date:** 2026-03-14  
**Author:** Han  
**Status:** ✅ Implemented

**Context:** Michael requested removing the Featured Sessions card grid from the homepage and replacing it with a schedule table showing the full conference day, including fixed rows (Doors Open, Lunch, End of Day) alongside content-driven sessions.

**Decision:** Replace the session card grid with a `<table>` rendered inside a scrollable `.schedule-wrap` panel. Fixed schedule anchors (Doors Open at 9:30 AM, Lunch at 12:00 PM, End of Day at 4:00 PM) are defined directly in `Welcome.astro` as hardcoded `ScheduleRow` objects with ISO 8601 timestamps for 2026-05-15 EDT. They are merged with the content-driven sessions and sorted by `timeMs` before render so the table is always chronologically ordered.

**Rationale:**
- A table is the clearest, most accessible structure for a multi-column schedule (Time / Session / Room)
- Merging and sorting at render time means adding future sessions to the content collection automatically places them in the right row order without touching the component
- Fixed rows use a `row-fixed` CSS class to visually differentiate them from sessions (muted gray text) so attendees can immediately tell what's a session vs. a schedule anchor
- Speaker names inside session rows link to their speaker pages for quick navigation

**Prop Changes:**
- `featuredSessions: FeaturedSession[]` removed from `Welcome.astro` and `index.astro`
- Replaced with `agendaSessions: AgendaSession[]` (adds `timeMs: number` field for sort key)
- `FeaturedSession` interface (including `description` field) removed entirely since the table doesn't need session body text

**Files Changed:**
- `src/components/Welcome.astro` — Replaced Featured Sessions section; added schedule table markup and styles; updated interfaces and frontmatter
- `src/pages/index.astro` — Renamed interface and prop; added `timeMs` computation; updated `<Welcome>` prop

### 6. Global Azure 2026 Logo Placement in Hero
**Date:** 2026-03-14  
**Author:** Han  
**Status:** ✅ Implemented

**Context:** Michael requested the `GlobalAzure2026.png` image be placed near the top of the homepage hero, with the tagline headline made visually subordinate to the logo.

**Decision:** Place the `GlobalAzure2026.png` logo at the very top of the `.hero-copy` section — above the eyebrow date label and h1. The h1 headline ("Spend the day with Azure builders…") is visually shrunk to ~1.3–1.4rem while keeping its `<h1>` tag for accessibility and SEO. Add `border-radius: 24px` to `.event-logo` to align with site card design aesthetic.

**Rationale:**
- The logo is the primary brand signal on first load; everything else should support it, not compete
- The eyebrow staying just below the logo provides date context without visual noise
- Keeping `<h1>` semantics satisfies screen-reader users and search engines even though visual size is reduced to ~22px
- Border-radius matches card design patterns throughout the site

**DOM Order (inside `.hero-copy`):**
1. `<img class="event-logo" src="/GlobalAzure2026.png">` — prominent event branding
2. `<p class="eyebrow">` — date label as secondary context
3. `<h1>` — tagline at small body-copy scale
4. Lede paragraph, actions, host card (unchanged)

**CSS Changes:**
- `.event-logo`: `width: clamp(200px, 55%, 360px)`, `border-radius: 24px`
- `h1`: `font-size: clamp(1.15rem, 2vw, 1.4rem)`, `font-weight: 600`, `color: #35506b`

**Verification:**
- GlobalAzure2026.png found in DOM with correct src ✅
- h1 text confirmed present ✅
- Computed font-size: 22.4px (≈ 1.4rem) ✅
- Build clean across 8 pages ✅

**Files Updated:**
- `src/components/Welcome.astro` — Logo placement, h1 override, event-logo styling with border-radius

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
