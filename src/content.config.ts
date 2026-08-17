import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/writing" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // The date this URI's content was issued. Per "Cool URIs don't
      // change", a creation date is the one exception to "leave it out of
      // the URL" — the essay's own examples prefix with it. The /YYYY/MM/
      // segment (see src/lib/posts.ts) is derived from this field, so
      // treat it the same as `slug`: freeze it at first publish and never
      // correct it afterward, or the URL breaks.
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // Stable, hand-picked identifier for this post's URL. Falls back
      // to the entry's filename-derived id, but set it explicitly and
      // never rename it once published — the file can move, get
      // retagged, or change status without breaking the link.
      slug: z.string().optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

export const collections = { writing };
