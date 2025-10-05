import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { generateSlug } from "~/utils/slug";

const writings = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./content/writings" }),
	schema: z
		.object({
			title: z.string(),
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			slug: z.string().optional(),
			tags: z.array(z.string()).optional(),
		})
		.transform((data) => ({
			...data,
			slug: data.slug || generateSlug(data.title, data.pubDate),
		})),
});

export const collections = { writings };
