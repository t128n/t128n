import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const site = context.site ?? "https://t128n.dev";
  const sitemap = new URL("sitemap-index.xml", site);

  const robots = `User-agent: *
Allow: /

Sitemap: ${sitemap.href}
`;

  return new Response(robots, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
