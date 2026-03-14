---
name: "astro-content-collections"
description: "Building type-safe, Markdown-driven content using Astro Content Collections with Zod schemas"
domain: "astro"
confidence: "high"
source: "leia-project-structure-review"
---

## Context

This project uses **Astro Content Collections** to manage Markdown-driven content (speakers, agenda events) with full TypeScript type safety via Zod schemas. This approach ensures:
- Type-safe frontmatter validation
- No runtime overhead parsing Markdown
- Easy editor experience (just edit .md files)
- Built-in relationship support (events reference speakers)

## Patterns

### 1. Collection Schema Definition

**File:** `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const speakersCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    photo: z.string(), // filename in public/speakers/
    linkedin: z.string().url(),
    github: z.string().url(),
  }),
});

const agendaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    time: z.string().datetime(),
    room: z.string(),
    speakers: z.array(z.string()), // speaker slugs
  }),
});

export const collections = {
  speakers: speakersCollection,
  agenda: agendaCollection,
};
```

### 2. Content Directory Structure

```
src/content/
├── config.ts              ← Collection schemas (above)
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
time: "2026-05-15T09:00:00Z"
room: "Ballroom A"
speakers: ["jane-doe", "john-smith"]
---

Optional session description here.
```

### 5. Dynamic Route Pattern

**File:** `src/pages/speakers/[slug].astro`

```typescript
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const speakers = await getCollection('speakers');
  return speakers.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
```

### 6. Listing Page Pattern

**File:** `src/pages/speakers/index.astro`

```typescript
import { getCollection } from 'astro:content';

const speakers = await getCollection('speakers');
const sortedSpeakers = speakers.sort((a, b) => 
  a.data.name.localeCompare(b.data.name)
);
```

## Anti-Patterns

- **Don't manually parse frontmatter** — Zod validation happens automatically
- **Don't store speaker photos in `src/assets/`** — Use `public/speakers/` so editors can drop files there easily
- **Don't hardcode speaker data** — Always query collections with `getCollection()`
- **Don't skip the schema validation** — Always include all required fields in frontmatter

## File Locations (Global Azure 2026)

| Item | Path |
|------|------|
| Collection schemas | `cbus-global-azure-2026/src/content/config.ts` |
| Speaker content | `cbus-global-azure-2026/src/content/speakers/*.md` |
| Agenda content | `cbus-global-azure-2026/src/content/agenda/*.md` |
| Speaker photos | `cbus-global-azure-2026/public/speakers/*.jpg` |
| Dynamic speaker route | `cbus-global-azure-2026/src/pages/speakers/[slug].astro` |
| Speaker listing | `cbus-global-azure-2026/src/pages/speakers/index.astro` |
| Agenda page | `cbus-global-azure-2026/src/pages/agenda/index.astro` |

## References

- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/)
- [Zod Validation](https://zod.dev/)
