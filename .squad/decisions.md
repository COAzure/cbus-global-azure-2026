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

### 7. Speaker Content Schema Extensions: Blog Links, Null Safety, and Session IDs
**Date:** 2026-03-14  
**Author:** Michael S. Collier (direct implementation)  
**Reviewed by:** Leia  
**Status:** ✅ Accepted

**Context:** Michael implemented four related improvements to speaker content, favicon branding, and agenda deep-linking to support homepage session navigation.

#### 7a. Bug Fix: Speaker Body Content Null Safety

**File:** `src/pages/speakers/[slug].astro` line 18

**Change:**
```typescript
// Before
const hasAdditionalContent = speaker.body.trim().length > 0;

// After
const hasAdditionalContent = (speaker.body ?? '').trim().length > 0;
```

**Rationale:** Prevents TypeError when speaker entries have no body content (optional field). Nullish coalescing operator provides safe fallback.

**Decision:** ✅ Accepted as standard pattern for handling optional content body fields.

---

#### 7b. Feature: Optional Blog Link Support for Speakers

**Schema Change:** `src/content.config.ts`
```typescript
blog: z.url().optional(),
```

**Component Changes:**
- `SpeakerSocialLinks.astro`: Accepts optional `blog` prop, conditionally renders "Blog" link
- `SpeakerCard.astro`: Accepts and forwards `blog` prop to SpeakerSocialLinks
- `src/pages/speakers/[slug].astro`: Passes `speaker.data.blog` to SpeakerSocialLinks

**Content Example:**
```yaml
# src/content/speakers/shawn-wallace.md
blog: "https://www.shawnewallace.com/"
```

**Rationale:**
- Speakers often maintain personal blogs as primary content channels
- Optional field allows incremental adoption without requiring all speakers to have blogs
- URL validation in schema ensures link quality
- Conditional rendering using array spread is clean and efficient:
  ```typescript
  const links = [
    { href: linkedin, label: 'LinkedIn' },
    { href: github, label: 'GitHub' },
    ...(blog ? [{ href: blog, label: 'Blog' }] : []),
  ];
  ```

**Implementation Detail (Superseded by Decision 8):** Previously, homepage speaker cards in `Welcome.astro` intentionally did not pass the `blog` prop to maintain compact display (showing only LinkedIn/GitHub). This was reversed on 2026-03-14 per Michael S. Collier's request.

**Decision:** ✅ Accepted as standard pattern for speaker contact links. Blog field is optional in schema and conditionally rendered in components.

---

#### 7c. Feature: Favicon Redesign with Azure Branding

**Files Updated:**
- `public/favicon.svg`: Blue cloud + white "A" logo
- `public/favicon.ico`: Multi-resolution (16×16, 32×32, 48×48) ICO bundle

**SVG Design:**
- Cloud shape created via clipPath with 3 overlapping circles and rectangular base
- Brand blue (#2563eb) matches site accent color
- White "A" for "Azure" rendered as text element
- Clean, recognizable geometric design scales well at small sizes

**Rationale:**
- Default Astro favicon doesn't communicate conference theme
- Blue cloud immediately signals Azure ecosystem
- Simple design scales cleanly to favicon resolutions
- Text-based "A" ensures legibility across sizes

**Decision:** ✅ Accepted. Favicon effectively represents Global Azure Columbus brand and matches site color scheme.

---

#### 7d. Feature: Homepage Agenda Links to Full Agenda with Hash Anchors

**Component Changes:**
- `AgendaSessionCard.astro`: Added optional `id` prop, applied to `<article>` element
- `src/pages/agenda/index.astro`: Passes `id={session.id}` (`.md` stripped) to each AgendaSessionCard
- `src/pages/index.astro`: Added `id` field to AgendaSession interface
- `src/components/Welcome.astro`: Session titles in schedule table link to `/agenda/#session-id`; fixed rows (Doors Open, Lunch, End of Day) remain plain text

**Link Pattern:**
```astro
{!row.isFixed && row.id ? (
  <a class="row-title session-link" href={`${import.meta.env.BASE_URL}agenda/#${row.id}`}>
    {row.title}
  </a>
) : (
  <span class="row-title">{row.title}</span>
)}
```

**ID Derivation:**
- Session IDs derived from content collection entry filenames: `entry.id.replace(/\.md$/, '')`
- Example: `src/content/agenda/opening-keynote.md` → `id="opening-keynote"`
- Homepage link: `/agenda/#opening-keynote`

**Rationale:**
- Attendees viewing homepage schedule need to click session titles and jump to full descriptions on agenda page
- Hash anchors enable deep linking without additional routing infrastructure
- Fixed schedule rows (Doors Open, Lunch, End of Day) are not sessions and correctly remain unlinked
- ID derivation from filename maintains consistency across pages (same strategy used for speaker slugs)

**Decision:** ✅ Accepted as standard pattern for cross-page session references. Agenda sessions have stable IDs derived from filenames for reliable deep linking.

---

### 8. Blog Links Now Shown on Homepage Speaker Cards
**Date:** 2026-03-14  
**Author:** Han  
**Requested by:** Michael S. Collier  
**Status:** ✅ Implemented

**Context:** Decision 7b previously stated that homepage speaker cards intentionally did not pass the `blog` prop to `SpeakerSocialLinks`, maintaining compact display (LinkedIn/GitHub only) with comprehensive contact info reserved for detail pages. Michael has requested this be reversed.

**Decision:** Display blog links on homepage speaker cards when available.

**Implementation:**
- `FeaturedSpeaker` interface in `src/components/Welcome.astro` — added `blog?: string`
- `FeaturedSpeaker` interface in `src/pages/index.astro` — added `blog?: string`
- `SpeakerSocialLinks` call in `Welcome.astro` homepage speaker grid — added `blog={speaker.blog}`

**Rationale:** The `.map()` in `index.astro` already spreads `speaker.data`, so the `blog` field was present in data but not forwarded. Only interface typing and prop wiring were needed. `SpeakerSocialLinks` renders blog links conditionally, so speakers without a `blog` field remain unaffected (prop is optional).

**Outcome:** Blog links now appear on homepage speaker cards for any speaker whose content file includes a `blog:` field. Build clean: 8 pages.

**Supersedes:** Decision 7b's design rationale regarding homepage blog link omission.

---

## Build Verification

✅ Clean build: 8 pages generated successfully  
✅ Blog link renders for speakers with `blog:` field (Shawn Wallace)  
✅ No blog link for speakers without field (Chad Thomas)  
✅ Agenda session IDs render correctly (`id="opening-keynote"`, etc.)  
✅ Homepage schedule links to `/agenda/#session-id`  
✅ Favicon files valid (SVG and ICO)

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
