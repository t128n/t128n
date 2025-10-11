// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import remarkGfm from "remark-gfm";

// https://astro.build/config
export default defineConfig({
	site: "https://t128n.dev",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [icon(), mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkGfm],
	},
});
