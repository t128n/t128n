// @ts-check

import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Astro integrations
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// Markdown plugins
import remarkGfm from "remark-gfm";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [icon(), mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkGfm],
	},
});
