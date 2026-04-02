import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const writings = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writings" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		blueskyUrl: z.url().optional(),
		cover: z
			.union([
				z.string(),
				z.object({
					href: z.string(),
					caption: z.string(),
				}),
			])
			.optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		draft: z.boolean().optional().default(false),
		icon: z.string().optional(),
	}),
});

export const collections = { writings };
