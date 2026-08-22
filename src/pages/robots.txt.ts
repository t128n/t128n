import type { APIContext } from "astro";
import { Liquid } from "liquidjs";
import { site } from "@/lib/site";
import template from "@/assets/robots.txt?raw";

const liquid = new Liquid();

export async function GET(context: APIContext) {
  const sitemapUrl = new URL("sitemap-index.xml", context.site ?? site.url);

  const robots = await liquid.parseAndRender(template, {
    sitemap_url: sitemapUrl.href,
  });

  return new Response(robots, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
