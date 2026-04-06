import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import expressiveCode from "astro-expressive-code";
import { defineConfig, fontProviders } from "astro/config";
import UnoCSS from "unocss/astro";

import { meta } from "./src/config";
import { remarkModifiedTime } from "./src/lib/remark-modified-time";
import { xmlPlugin } from "./src/plugins/vite-plugin-xml";

export default defineConfig({
	site: meta.siteUrl,
	markdown: {
		remarkPlugins: [remarkModifiedTime],
	},
	build: {
		format: "file",
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Geist",
			cssVariable: "--font-sans",
			fallbacks: ["sans-serif"],
			weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
			styles: ["normal"],
		},
		{
			provider: fontProviders.fontsource(),
			name: "Geist Mono",
			cssVariable: "--font-mono",
			fallbacks: ["monospace"],
			weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
			styles: ["normal"],
		},
	],
	integrations: [
		UnoCSS({
			injectReset: true,
		}),
		expressiveCode(),
		mdx({
			remarkPlugins: [remarkModifiedTime],
		}),
		svelte(),
		sitemap(),
	],
	vite: {
		ssr: {
			external: ["satori", "sharp"],
		},
		plugins: [xmlPlugin()],
	},
});
