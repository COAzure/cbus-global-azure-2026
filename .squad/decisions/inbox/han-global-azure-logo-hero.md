# Decision: Global Azure 2026 Logo Placement in Hero

**Date:** 2026-03-14  
**Author:** Han  
**Status:** ✅ Implemented

## Context

Michael requested the `GlobalAzure2026.png` image be placed near the top of the homepage hero, with the tagline headline made visually subordinate to the logo.

## Decision

Place the `GlobalAzure2026.png` logo at the very top of the `.hero-copy` section — above the eyebrow date label and h1. The h1 headline ("Spend the day with Azure builders…") is visually shrunk to ~1.3–1.4rem while keeping its `<h1>` tag for accessibility and SEO.

**Final DOM order inside `.hero-copy`:**
1. `<img class="event-logo" src="/GlobalAzure2026.png">` — prominent event branding
2. `<p class="eyebrow">` — "Community conference · {date}" as secondary label
3. `<h1>` — tagline at small body-copy scale (not the dominant visual element)
4. Lede paragraph, actions, host card (unchanged)

## Rationale

- The logo is the primary brand signal on first load; everything else should support it, not compete.
- The eyebrow staying just below the logo provides date context without visual noise.
- Keeping `<h1>` semantics satisfies screen-reader users and search engines even though the visual size is reduced to ~22px (clamp 1.15–1.4rem).

## CSS Changes

- Added `.event-logo` class: `width: clamp(200px, 55%, 360px)`, responsive and left-aligned.
- Override `h1` to `font-size: clamp(1.15rem, 2vw, 1.4rem)`, `font-weight: 600`, `color: #35506b` (muted), `max-width: 40ch`.
- Removed the mobile `h1 { max-width: none }` override from `@media (max-width: 520px)` — no longer needed.

## Playwright Verification

- `img[src*="GlobalAzure2026"]` found in DOM with `src="/GlobalAzure2026.png"` ✅
- `#homepage-title` h1 text confirmed present ✅
- Computed `font-size` = `22.4px` (≈ 1.4rem) — correctly subordinate ✅
- Screenshot saved to `/tmp/homepage-check.png`

## Files Changed

- `src/components/Welcome.astro` — logo `<img>` added to hero-copy, h1 CSS overridden, event-logo style added
