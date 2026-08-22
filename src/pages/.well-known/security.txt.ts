import type { APIContext } from "astro";
import { Liquid } from "liquidjs";
import { site } from "@/lib/site";
import template from "@/assets/security.txt?raw";

const liquid = new Liquid();

export async function GET(context: APIContext) {
  const siteUrl = context.site ?? site.url;
  const canonicalUrl = new URL(".well-known/security.txt", siteUrl);

  const expiresDate = new Date();
  expiresDate.setFullYear(expiresDate.getFullYear() + 1);

  const security = await liquid.parseAndRender(template, {
    contact: `${site.social.github}/t128n/security/advisories/new`,
    policy: `${site.social.github}/t128n/blob/main/SECURITY.md`,
    preferred_languages: "en",
    canonical: canonicalUrl.href,
    expires: expiresDate.toISOString(),
  });

  return new Response(security, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
