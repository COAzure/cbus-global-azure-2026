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
