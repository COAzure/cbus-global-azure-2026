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

## Anti-Patterns

- **Don't use `src/content/config.ts` on Astro 6** — Astro treats it as a legacy config path and fails the build.
- **Don't omit collection loaders** — every collection needs a loader in Astro 6.
- **Don't store speaker photos in `src/assets/`** — use `public/speakers/` so editors can drop files there easily.
- **Don't hardcode speaker data** — always query collections with `getCollection()`.

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
