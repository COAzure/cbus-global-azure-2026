# Project Context

- **Project:** global-azure-2026
- **Requested by:** Michael S. Collier
- **Stack:** Astro, Markdown, static pages
- **Goal:** Build an attendee-friendly conference site with reusable page templates.

## Core Context

Han owns Astro UI, layouts, and page templates.

## Recent Updates

📌 Team hired on 2026-03-14

## Learnings

- **SpeakerPortrait img gap fix (2026-03-14):** The `<img>` inside `.portrait` was sized with `height: 100%; width: 100%`, which doesn't resolve reliably when the parent's height comes from `aspect-ratio` alone inside a CSS grid column (`minmax(140px, 180px)`). This caused the image to be shorter than the container, exposing the `#f0f7ff` background behind the inset border. Fix: switched the `<img>` to `position: absolute; inset: 0; width: 100%; height: 100%` (`.portrait` was already `position: relative; overflow: hidden`). The placeholder `div` kept percentage sizing since it's a flex/grid child that fills correctly. This is the safe pattern any time an image must fill an `aspect-ratio`-sized container inside a grid.

- Blog links are now shown on homepage speaker cards. Added `blog?: string` to `FeaturedSpeaker` interface in both `Welcome.astro` and `index.astro`, and passed `blog={speaker.blog}` to `SpeakerSocialLinks` in the homepage speaker grid. The `.map()` in `index.astro` already spread `speaker.data` so no map change was needed — only the interface and prop wiring. Note: Decision 7b previously stated homepage cards intentionally omitted blog; this was reversed by Michael S. Collier's request.

- The homepage, agenda, and speaker pages are the primary user-facing flows.
- The site should be easy to maintain as conference content changes.
- Speaker pages live at `cbus-global-azure-2026/src/pages/speakers/index.astro` and `cbus-global-azure-2026/src/pages/speakers/[slug].astro`, both driven from `getCollection('speakers')`.
- For content-collection speaker routes, derive page params from `entry.id.replace(/\.md$/, '')` so static paths stay aligned with Markdown filenames.
- Reusable speaker UI now lives in `cbus-global-azure-2026/src/components/SpeakerCard.astro`, `SpeakerPortrait.astro`, and `SpeakerSocialLinks.astro`.
- Speaker photos are expected in `cbus-global-azure-2026/public/speakers/`; when a file is missing, the UI should show an inline initials placeholder instead of failing the page.
- Michael asked to keep the work tightly scoped to Phase 3 speaker pages and to reuse the existing layout structure rather than redesigning the site.
- The agenda page lives at `cbus-global-azure-2026/src/pages/agenda/index.astro` and uses `getCollection('agenda')` plus `getEntries(entry.data.speakers)` to resolve speaker references into linked speaker chips.
- Agenda presentation is split into day buckets and session cards, with reusable session styling in `cbus-global-azure-2026/src/components/AgendaSessionCard.astro`.
- Agenda times should be formatted in Eastern Time so schedule labels stay attendee-friendly during static builds.
- Refreshing the homepage is safest when `src/pages/index.astro` owns collection queries and passes attendee-facing data into `src/components/Welcome.astro`, so the starter shell is replaced in both files.
- Homepage refresh (Phase 2) integrated conference branding into the landing page by querying both speakers and agenda collections, replacing the Astro starter template while maintaining Layout structure consistency.

## Session Update (2026-03-14)

### Site Naming Update
- **Task:** Updated all user-facing site strings from "Columbus Global Azure" to "Global Azure Columbus"
- **Files Updated:** 6 (Layout, Welcome component, homepage, speakers pages, agenda page)
- **Total Occurrences:** 12 instances across metadata, page titles, descriptions, and header text
- **Approach:** Systematic find-replace across all target pages while preserving the year (2026)
- **Outcome:** All instances successfully updated; no "Columbus Global Azure" references remain
- **Note:** One instance in Welcome.astro body text was already using the correct "Global Azure Columbus" format
- Homepage hero can support partner-host messaging cleanly with a compact logo card beneath the primary CTAs, keeping sponsor/community attribution visible without disrupting the agenda and speaker preview flow.
- Azure Columbus host branding is now integrated into the homepage hero section, displaying the Azure Columbus logo with attribution text stating "Global Azure Columbus is hosted by Azure Columbus, the local Azure user group."


## Learnings

- When adding a prominent event logo to the hero, placing it above the eyebrow and h1 makes the brand hierarchy clear: logo → date label → tagline. The eyebrow stays visible but reads as secondary context to the logo.
- Shrinking the h1 visually (to ~1.3–1.4rem) while keeping the `<h1>` tag for accessibility is handled cleanly with a scoped CSS override — no wrapper element or class needed.
- Playwright's `chromium-headless-shell` executable must be referenced by explicit path when `playwright` is installed ad-hoc via npm (not via `npx playwright install` + global). The `executablePath` option bypasses the environment lookup.
- Dev server background processes in the bash tool need to run in the same shell session as Playwright so they share the same process group and the server is alive when the test runs.
- Removing the Featured Sessions card grid and replacing with a schedule table required cleaning up both the interface types (`FeaturedSession` → `AgendaSession` with `timeMs` added) in index.astro and the prop/template in Welcome.astro simultaneously.
- Fixed schedule rows (Doors Open, Lunch, End of Day) are defined as hardcoded `ScheduleRow` objects in Welcome.astro with ISO timestamp strings for 2026-05-15 EDT, then merged and sorted with the content-driven sessions by `timeMs` so the final order is always chronological.
- The `dayCount` calculation used a `Set` that could produce `0` when `agendaEntries` is empty — added `|| 1` fallback to keep the stat from showing "0 days".
- Speaker chips inside the table link to `/speakers/{slug}/` for content-driven session rows; fixed rows have no speaker chips, so the empty `speakers: []` array on those rows is never rendered.
- Table styling uses two row classes (`row-session`, `row-fixed`) to visually differentiate conference sessions from schedule anchors — fixed rows get muted gray text so they read as structural dividers rather than sessions.
- Logo placement inside the hero requires clear brand hierarchy: logo at top (primary signal) → eyebrow (secondary date context) → h1 (tagline at body-copy scale). The visual reduction works when paired with semantic `<h1>` retention.
- CSS border-radius on `.event-logo` aligns logo aesthetic with the card-based design system used elsewhere on the site; 24px radius matches existing card rounding.

- Added Discord link to the host card (Welcome.astro, line 111–113) with a 💬 emoji prefix for visual scannability. The link uses `rel="noopener noreferrer"` for security best practices and opens in a new tab. Placed as a second paragraph after the existing Meetup link to maintain consistent styling and card layout.

- Speaker photo fallback pattern: `SpeakerPortrait.astro` checks file existence with `existsSync()` at build time. When a speaker's photo file is missing from `public/speakers/`, the component renders initials (derived from speaker name) in a circular badge above the text "Photo coming soon". The placeholder uses a gradient background and soft blue styling consistent with site design. This keeps the page rendering cleanly even when photos are not yet uploaded.

## Learnings

- Applied 13 design improvements from Padmé's accessibility and visual polish review (2026-03-14):
  1. **Focus ring**: Added `a:focus-visible, button:focus-visible, .button:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px }` as a dedicated block in Welcome.astro scoped styles.
  2. **Host card contrast**: Darkened `.host-copy p:last-child` from `#35506b` → `#2d4156` for WCAG compliance.
  3. **Mobile Room column**: Added `.schedule-table .col-room, .schedule-table th:last-child { display: none }` inside `@media (max-width: 520px)`.
  4. **Gradient end color**: Shifted `.button.primary` gradient stop from `#38bdf8` (light cyan) → `#60a5fa` (blue-400) to keep white text legible.
  5. **h1 contrast**: Darkened `h1 { color }` from `#35506b` → `#16324f`.
  6. **Table row spacing**: Increased `td` padding from `0.9rem 1.1rem` → `1rem 1.25rem`.
  7. **Speaker bio clamp**: Added `.speaker-bio` class to bio `<p>` in speaker cards; applied 3-line `-webkit-line-clamp`.
  8. **Stats visual weight**: Bumped `.stats strong` font-size from `1.6rem` → `2rem` and added `color: #1d4ed8`.
  9. **Consistent link underlines**: Removed `.text-link` and `.panel-link` from the `text-decoration: none` group; gave them `text-decoration: underline; text-underline-offset: 4px` instead.
  10. **Portrait/card shadow**: Normalized `SpeakerPortrait.astro` `.portrait` shadow from `0 24px 50px rgba(15,23,42,0.12)` → `0 24px 48px rgba(0,0,0,0.12)`; added matching override on `.speaker-card` in Welcome.astro.
  11. **Empty Room cell**: Changed `{row.room}` → `{row.room || '—'}` so break rows show an em dash instead of a blank cell.
  12. **CTA panel alignment**: Added `.cta-panel .actions { align-self: start }` inside `@media (min-width: 720px)` so the buttons don't stretch/cluster right.
  13. **Discord SVG icon**: Replaced 💬 emoji with an inline SVG chat-bubble path (`aria-hidden="true"`) for consistent cross-platform rendering.
- CSS pattern: when sharing a `text-decoration: none` rule across many selectors, it's cleaner to split out selectors that later need underlines than to add an override — avoids specificity fights.
- Scoped Astro styles apply per-component; shadow overrides for `.speaker-card` defined in Welcome.astro correctly take precedence over the shared panel rule because the selector is more specific (matching the same specificity but declared later).
- Migrated the homepage, agenda, and speaker components to the global design token system, replacing hardcoded colors/shadows/radii/fonts with CSS variables and dropping local utility class definitions that are now global.

### 2026-03-14: CSS Token System Migration Implementation (Complete)

**Task:** Implement Padmé's CSS token system spec across all 8 component/page files; validate with build.

**Status:** ✅ All files migrated successfully  
- 8 target files: Welcome.astro, agenda/index.astro, speakers/index.astro, speakers/[slug].astro, AgendaSessionCard.astro, SpeakerCard.astro, SpeakerPortrait.astro, SpeakerSocialLinks.astro
- All hardcoded color/shadow/radius/font values replaced with `var(--token)` references
- 8 duplicate utility classes removed from component scopes: `.button`, `.button.primary`, `.button.secondary`, `.eyebrow`, `.panel-label`, `.breadcrumbs`, `.lede`, `.empty-state`
- Layout-specific classes retained and updated with token values
- Preserved unique SpeakerPortrait gradient (tokenized radius/shadow only)
- `.day-label` retained local (markup-dependent, out of scope for this pass)
- Build verification: `npm run build` passed (9 pages, 0 errors)

**Documentation:**
- Implementation summary written: `.squad/decisions/inbox/han-token-migration.md`
- Merged into `.squad/decisions.md` as Decision 13
- Orchestration log: `.squad/orchestration-log/2026-03-14T17:51:30Z-han.md`

**Outcomes:**
- All 60+ global tokens now in use across site
- Code duplication eliminated; single source of truth established
- Ready for commit; no regressions or breaking changes
