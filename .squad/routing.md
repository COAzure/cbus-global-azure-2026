# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Site architecture and implementation planning | Leia | Page structure, content model decisions, reviews, trade-offs |
| Astro UI and page implementation | Han | Homepage, agenda layout, speaker page templates, styling |
| Markdown collections and content wiring | Chewie | Content collections, frontmatter schema, image paths, speaker data loading |
| Written content and editorial structure | Luke | Bio copy, agenda copy, markdown authoring patterns, contributor docs |
| Code review | Leia | Review PRs, check quality, suggest improvements |
| Testing | Wedge | Write tests, find edge cases, verify fixes |
| Visual design, UX, color, typography, accessibility | Padmé | Design direction, layout critique, visual specs, favicon/icon work |
| Scope & priorities | Leia | What to build next, trade-offs, decisions |
| Session logging | Scribe | Automatic — never needs routing |

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign the correct `squad:{member}` label | Leia |
| `squad:leia` | Pick up architectural, planning, or review work | Leia |
| `squad:han` | Pick up Astro UI and page implementation work | Han |
| `squad:chewie` | Pick up content model and Markdown pipeline work | Chewie |
| `squad:luke` | Pick up editorial content and docs work | Luke |
| `squad:wedge` | Pick up testing and verification work | Wedge |
| `squad:padme` | Pick up visual design and UX work | Padmé |

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.**
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a feature is being built, Wedge can write test cases from requirements in parallel.
