import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SITE } from '@/site.config';

export const BLOG_PATH = 'src/content/writing/blogs';
export const SHORT_READS_PATH = 'src/content/writing/short-reads';

const coreSchema = z.object({
  title: z.string(),
  author: z.string().default(SITE.author),
  pubDatetime: z.date(),
  modDatetime: z.date().optional().nullable(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  slug: z.string().optional(),
  canonicalURL: z.string().optional(),
  hideEditPost: z.boolean().default(false),
  timezone: z.string().optional(),
});

const blogs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    coreSchema.extend({
      description: z.string(),
      tags: z.array(z.string()).default(['others']),
      ogImage: image().or(z.string()).optional(),
    }),
});

const short_reads = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: `./${SHORT_READS_PATH}` }),
  schema: coreSchema,
});

export const collections = { blogs, short_reads };
