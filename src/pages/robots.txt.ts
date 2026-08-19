import type { APIContext } from "astro";
import { site } from "@/lib/site";

export async function GET(context: APIContext) {
  const sitemapUrl = new URL("sitemap-index.xml", context.site ?? site.url);

  const robots = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl.href}
`;

  return new Response(robots, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
