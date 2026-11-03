// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://t128n.dev",
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/404/"),
    }),
    mdx(),
  ],
  redirects: {
    "/writing": "/blog/",
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: false,
    },
  },
});
