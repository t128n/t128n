// @ts-check

import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Astro integrations
import icon from "astro-icon";

// Markdown plugins
import remarkGfm from "remark-gfm";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [icon(), mdx()],
	markdown: {
		remarkPlugins: [remarkGfm],
	},
});
