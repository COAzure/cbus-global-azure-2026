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

### 9. Default Speaker Image: SVG Fallback
**Date:** 2026-03-14  
**Author:** Han  
**Status:** ✅ Implemented

**Decision:** Replaced CSS initials placeholder in `SpeakerPortrait.astro` with a real SVG default image (`public/speakers/default-speaker.svg`).

**Design:**
- Format: Inline SVG (static file, no JS, renders instantly)
- Dimensions: `viewBox="0 0 400 500"` matching 4:5 portrait aspect ratio
- Background gradient: `#dbeafe → #bfdbfe → #93c5fd` (Tailwind blue-100 to blue-300)
- Silhouette: Circle (head) + narrow rect (neck) + ellipse (shoulders/torso) with gradient fill `#60a5fa → #3b82f6`
- No text: Purely visual, works in any locale

**Rationale:** SVG fallback is polished, conference-appropriate, zero-weight (< 1 KB), accessible, and consistent with site's blue palette.

**Component Impact:**
- `SpeakerPortrait.astro` always renders `<img>` tag; src switches based on `hasPhoto`
- Removed: initials derivation, `.placeholder` div, `.missing` class, placeholder CSS rules
- Retained: `.portrait` gradient background

**Files Updated:**
- `public/speakers/default-speaker.svg` — New SVG fallback
- `src/components/SpeakerPortrait.astro` — Img-only rendering

---

### 10. Discord Link: Host Card Community Connection
**Date:** 2026-03-14  
**Author:** Han  
**Requested by:** Michael S. Collier  
**Status:** ✅ Implemented

**Decision:** Add a Discord link to the host card in the Welcome component alongside the existing Meetup link.

**Implementation:** New paragraph in `src/components/Welcome.astro` (lines 111–113):
```astro
<p>
  💬 Join the <a href="https://discord.gg/HjkFNJUG" target="_blank" rel="noopener noreferrer">Azure Columbus community on Discord</a>.
</p>
```

**Design Rationale:**
- 💬 emoji prefix provides visual scannability without UI complexity
- Placed as second paragraph maintains consistent styling with Meetup link
- `rel="noopener noreferrer"` and `target="_blank"` follow security best practices
- Concise wording mirrors Meetup link tone

**Files Updated:**
- `src/components/Welcome.astro` — Added Discord link paragraph

---

### 11. History Audit Report: All 6 Agents Verified
**Date:** 2026-03-14  
**Author:** Leia (Lead)  
**Status:** ✅ Complete

**Summary:** Audited all 6 agent history.md files against current project state. Found 1 inaccuracy (Han), fixed; 5 verified accurate.

**Audit Results:**

| Agent | Result | Finding |
|-------|--------|---------|
| Leia | ✅ Accurate | Excellent documentation of decisions and build verification |
| Han | ⚠️ Updated | Speaker photo fallback: claimed SVG file didn't exist; fixed to reflect initials + "Photo coming soon" pattern |
| Chewie | ✅ Accurate | Correctly identifies Astro 6 location and content structure |
| Luke | ✅ Accurate | Appropriately minimal for editorial role; markdown insights sound |
| Wedge | ✅ Accurate | Strong validation-focused coverage; correctly notes photo hard-required in schema |
| Scribe | ✅ Accurate | Appropriately scoped for orchestration role |

**Han's Correction:** Speaker photo fallback is `SpeakerPortrait.astro` runtime initials-based placeholder (lines 28–33), not SVG file. `existsSync()` used at build time, not runtime. Default shows initials in gradient badge + "Photo coming soon" text.

**Root Cause:** Documented from incomplete information or intended-but-not-implemented feature.

**Project Ground Truth Verified:**
- Stack: Astro 6.0.4, TypeScript strict, Markdown content collections
- 5 speaker content files, 6 agenda sessions (2 placeholders)
- All implemented features align with decisions.md
- No stale decisions or superseded patterns (except speaker photo, now corrected)

**Files Updated:**
- `.squad/agents/han/history.md` — Fixed speaker photo fallback description

---

### 12. Design Improvements — Homepage Accessibility & Polish
**Date:** 2026-03-14  
**Reviewed by:** Padmé (Designer), Han (Frontend Dev)  
**Approved by:** Michael S. Collier  
**Status:** ✅ Implemented

**Context:** Padmé conducted comprehensive design audit of homepage and identified 13 actionable improvements across accessibility, visual hierarchy, spacing, and consistency. Michael approved full batch; Han implemented all changes.

**Improvements Implemented:**

#### 🔴 High Priority (Accessibility)

1. **Focus ring visibility** — Added `a:focus-visible, button:focus-visible, .button:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px }` in Welcome.astro scoped styles.

2. **Host card body text contrast** — `.host-copy p:last-child` color darkened from `#35506b` → `#2d4156` for WCAG AA compliance.

3. **Schedule table mobile readability** — Room `<th>` and `.col-room` `<td>` hidden via media query `@media (max-width: 520px)` for improved mobile layout.

#### 🟡 Medium Priority (Polish)

4. **Primary CTA gradient end stop** — `.button.primary` gradient changed from `#38bdf8` → `#60a5fa`, maintaining white text contrast.

5. **Hero h1 color** — `h1 { color }` darkened from `#35506b` → `#16324f` for stronger visual hierarchy.

6. **Schedule table row spacing** — `td` padding increased from `0.9rem 1.1rem` → `1rem 1.25rem`.

7. **Speaker bio 3-line clamp** — Applied `class="speaker-bio"` with `-webkit-line-clamp: 3` and `overflow: hidden`.

8. **Stats visual weight** — `.stats strong` font-size increased `1.6rem` → `2rem`; added `color: #1d4ed8`.

#### 🟢 Low Priority (Consistency)

9. **Consistent link underlines** — `.text-link` and `.panel-link` receive `text-decoration: underline; text-underline-offset: 4px`.

10. **Speaker portrait shadow** — Updated from `0 24px 50px rgba(15,23,42,0.12)` → `0 24px 48px rgba(0,0,0,0.12)`.

11. **Break rows empty Room cell** — `{row.room}` changed to `{row.room || '—'}` for em-dash fallback.

12. **CTA panel button alignment** — Added `.cta-panel .actions { align-self: start }` in `@media (min-width: 720px)`.

13. **Discord emoji → inline SVG** — Replaced 💬 with inline SVG for reliable cross-platform rendering (`aria-hidden="true"`, `vertical-align: middle`).

**Files Changed:**
- `src/components/Welcome.astro` — 12 changes
- `src/components/SpeakerPortrait.astro` — 1 change (shadow)

**Build Verification:** ✅ `npm run build` passed (9 pages, 0 errors)

**Decision:** ✅ All 13 improvements approved and implemented. Design audit complete.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
