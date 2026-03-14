---
name: "astro-content-collections"
description: "Building type-safe, Markdown-driven content using Astro Content Collections with Zod schemas"
domain: "astro"
confidence: "high"
source: "leia-project-structure-review"
---

## Context

This project uses **Astro Content Collections** to manage Markdown-driven content (speakers, agenda events) with full TypeScript type safety via Zod schemas. On Astro 6, collection definitions live in `src/content.config.ts` and each collection must declare a loader.

## Patterns

### 1. Astro 6 Collection Schema Definition

**File:** `src/content.config.ts`

```typescript
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const speakers = defineCollection({
  loader: glob({ base: './src/content/speakers', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    photo: z.string(), // filename in public/speakers/
    linkedin: z.url(),
    github: z.url(),
  }),
});

const agenda = defineCollection({
  loader: glob({ base: './src/content/agenda', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    time: z.string().datetime({ offset: true }),
    room: z.string(),
    speakers: z.array(reference('speakers')),
  }),
});

export const collections = { speakers, agenda };
```

### 2. Content Directory Structure

```
src/
├── content.config.ts         ← Astro 6 collection config
└── content/
    ├── speakers/
    │   ├── jane-doe.md
    │   └── john-smith.md
    └── agenda/
        ├── keynote-morning.md
        └── workshop-afternoon.md
```

### 3. Speaker Markdown Template

**File:** `src/content/speakers/jane-doe.md`

```markdown
---
name: "Jane Doe"
bio: "Microsoft architect with 10 years cloud experience"
photo: "jane-doe.jpg"
linkedin: "https://linkedin.com/in/janedoe"
github: "https://github.com/janedoe"
---

Optional additional bio content here (not currently used but extensible).
```

### 4. Agenda/Event Markdown Template

**File:** `src/content/agenda/keynote-morning.md`

```markdown
---
title: "Keynote: Cloud Native Architecture"
time: "2026-05-15T09:00:00-04:00"
room: "Ballroom A"
speakers:
  - "jane-doe"
  - "john-smith"
---

Optional session description here.
```


### 5. Collection-Driven Speaker Pages

**Files:** `src/pages/speakers/index.astro`, `src/pages/speakers/[slug].astro`, `src/components/SpeakerPortrait.astro`

- Build speaker listing/detail pages from `getCollection('speakers')` rather than duplicating data in page files.
- For dynamic routes, derive the URL segment from `entry.id.replace(/\.md$/, '')` so the route matches the Markdown filename without the extension.
- When speaker photos are stored in `public/speakers/`, you can check for file existence at build time inside an Astro component and render a lightweight initials placeholder if the asset has not been added yet.

```astro
---
const speakers = (await getCollection('speakers')).map((entry) => ({
  ...entry,
  pageSlug: entry.id.replace(/\.md$/, ''),
}));
---

{speakers.map((speaker) => <SpeakerCard slug={speaker.pageSlug} {...speaker.data} />)}
```

### 6. Resolving Referenced Entries for Agenda Pages

**Files:** `src/pages/agenda/index.astro`, `src/components/AgendaSessionCard.astro`

- When an agenda collection stores `speakers` as `reference('speakers')[]`, resolve the related speaker entries with `getEntries(entry.data.speakers)`.
- Map each resolved speaker to a UI-friendly shape that includes `name` and a page slug derived from `speaker.id.replace(/\.md$/, '')`.
- For schedule pages rendered at build time, format event times with an explicit conference timezone so static output does not depend on the build machine timezone.

```astro
---
import { getCollection, getEntries } from 'astro:content';

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/New_York',
});

const sessions = await Promise.all(
  (await getCollection('agenda')).map(async (entry) => {
    const speakers = await getEntries(entry.data.speakers);

    return {
      title: entry.data.title,
      timeLabel: timeFormatter.format(new Date(entry.data.time)),
      speakers: speakers.map((speaker) => ({
        name: speaker.data.name,
        slug: speaker.id.replace(/\.md$/, ''),
      })),
    };
  }),
);
---
```

### 7. Collection-Driven Homepage Highlights

**Files:** `src/pages/index.astro`, `src/components/Welcome.astro`

- Use the homepage to query `getCollection('agenda')` and `getCollection('speakers')` so landing-page highlights stay synchronized with the real schedule and lineup.
- Resolve agenda speaker references with `getEntries()` before rendering homepage session spotlights, then pass a small, UI-friendly prop shape into the homepage component.
- Keep homepage calls to action pointed at the agenda and speakers pages so attendees can move directly into deeper planning flows.

```astro
---
const sessions = await Promise.all(
  (await getCollection('agenda')).map(async (entry) => ({
    title: entry.data.title,
    speakers: (await getEntries(entry.data.speakers)).map((speaker) => ({
      name: speaker.data.name,
      slug: speaker.id.replace(/\.md$/, ''),
    })),
  })),
);
---
```

## Anti-Patterns

- **Don't use `src/content/config.ts` on Astro 6** — Astro treats it as a legacy config path and fails the build.
- **Don't omit collection loaders** — every collection needs a loader in Astro 6.
- **Don't store speaker photos in `src/assets/`** — use `public/speakers/` so editors can drop files there easily.
- **Don't hardcode speaker data** — always query collections with `getCollection()`.
- **Don't format conference schedule times with the server default timezone** — static builds may run in UTC and show the wrong local session times.

## File Locations (Global Azure 2026)

| Item | Path |
|------|------|
| Collection schemas | `cbus-global-azure-2026/src/content.config.ts` |
| Speaker content | `cbus-global-azure-2026/src/content/speakers/*.md` |
| Agenda content | `cbus-global-azure-2026/src/content/agenda/*.md` |
| Speaker photos | `cbus-global-azure-2026/public/speakers/*.jpg` |

## References

- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/)
- [Astro 6 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Zod Validation](https://zod.dev/)
