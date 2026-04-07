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
			name: "iA Writer Duo",
			cssVariable: "--font-ia-writer-duo",
			fallbacks: ["sans-serif"],
			weights: [400, 700],
			styles: ["normal", "italic"],
		},
		{
			provider: fontProviders.fontsource(),
			name: "iA Writer Mono",
			cssVariable: "--font-ia-writer-mono",
			fallbacks: ["monospace"],
			weights: [400, 700],
			styles: ["normal", "italic"],
		},
	],
	integrations: [
		UnoCSS({
			injectReset: true,
		}),
		expressiveCode({
			styleOverrides: {
				frames: {
					editorBackground: "var(--color-background)",
					terminalBackground: "var(--color-background)",
					editorTabBarBackground: "var(--color-foreground)",
					terminalTitlebarBackground: "var(--color-foreground)",
					editorTabBarBorderColor: "var(--color-foreground)",
					editorTabBarBorderBottomColor: "var(--color-foreground)",
					editorActiveTabBackground: "var(--color-foreground)",
					editorActiveTabBorderColor: "var(--color-foreground)",
					editorActiveTabForeground: "var(--color-background)",
					editorActiveTabIndicatorTopColor: "var(--color-foreground)",
					editorActiveTabIndicatorBottomColor:
						"var(--color-foreground)",
					terminalTitlebarBorderBottomColor:
						"var(--color-foreground)",
					terminalTitlebarForeground: "var(--color-background)",
					terminalTitlebarDotsForeground: "var(--color-background)",
					frameBoxShadowCssValue: "none",
					editorTabBorderRadius: "0",
					editorTabsMarginBlockStart: "0",
					editorTabsMarginInlineStart: "0",
				},
			},
		}),
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
