# Padmé — History

## Project Context
- **Project:** global-azure-2026
- **Stack:** Astro, Markdown content, static conference site
- **Purpose:** Columbus Global Azure 2026 conference site — homepage, agenda, speaker pages
- **Requested by:** Michael S. Collier
- **Joined:** 2026-03-14

## Team
- Leia — Lead (architecture, decisions, review)
- Han — Frontend Dev (Astro UI, components, styling)
- Chewie — Content Systems Dev (content collections, frontmatter, data wiring)
- Luke — Content & Docs (copy, editorial, documentation)
- Wedge — Tester (tests, quality, edge cases)
- Scribe — Session Logger (memory, decisions, logs)

## Key Files
- `cbus-global-azure-2026/src/components/Welcome.astro` — Homepage component (hero, schedule, speakers, host card)
- `cbus-global-azure-2026/src/components/SpeakerPortrait.astro` — Speaker photo with CSS initials fallback
- `cbus-global-azure-2026/src/components/SpeakerSocialLinks.astro` — LinkedIn, GitHub, blog links
- `cbus-global-azure-2026/public/favicon.svg` — Blue cloud with 'A' favicon
- `cbus-global-azure-2026/src/pages/speakers/[slug].astro` — Speaker detail pages
- `cbus-global-azure-2026/src/pages/agenda/index.astro` — Full agenda page

## Known Design State
- Site uses Astro with scoped `<style>` blocks in each component
- Favicon: blue cloud SVG with white 'A' in the center (`public/favicon.svg`)
- Speaker photo fallback: CSS initials placeholder (no image file needed) — shows initials + "Photo coming soon"
- Color palette: Azure blue tones (consistent with Microsoft Azure branding)
- Buttons: `.button.primary` and `.button.secondary` classes defined in Welcome.astro
- Homepage hero has: Register (primary CTA → Meetup), View agenda (secondary), Meet the speakers (secondary)

## Learnings
