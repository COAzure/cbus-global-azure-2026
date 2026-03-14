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
