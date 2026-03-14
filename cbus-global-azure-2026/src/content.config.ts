import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const speakers = defineCollection({
  loader: glob({ base: './src/content/speakers', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string().min(1),
    bio: z.string().min(1),
    photo: z
      .string()
      .min(1)
      .regex(/^[^/]+$/, 'Use a filename from public/speakers/'),
    linkedin: z.url(),
    github: z.url(),
  }),
});

const agenda = defineCollection({
  loader: glob({ base: './src/content/agenda', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    time: z.string().datetime({ offset: true }),
    room: z.string().min(1),
    speakers: z.array(reference('speakers')).min(1),
  }),
});

export const collections = {
  speakers,
  agenda,
};
