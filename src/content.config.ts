import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const writing = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/writing" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        slug: z.string().optional(),
        draft: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
        author: z
          .union([
            z.string(),
            z.object({
              name: z.string(),
              url: z.string().optional(),
              note: z.string().optional(),
            }),
          ])
          .optional(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
      })
      .refine((data) => (data.cover ? !!data.coverAlt : true), {
        message: "coverAlt is required when cover is set",
      }),
});

export const collections = { writing };
