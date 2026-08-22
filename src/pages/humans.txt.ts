import { execSync } from "node:child_process";
import type { APIContext } from "astro";
import { Liquid } from "liquidjs";
import { site } from "@/lib/site";
import template from "@/assets/humans.txt?raw";

const liquid = new Liquid();

const lastUpdate = (() => {
  try {
    return execSync('git log -1 --format="%cs"').toString().trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
})();

export async function GET(context: APIContext) {
  const host = context.site?.hostname ?? "t128n.dev";

  const humans = await liquid.parseAndRender(template, {
    author: site.author,
    host,
    bluesky: site.social.bluesky,
    github: site.social.github,
    last_update: lastUpdate,
  });

  return new Response(humans, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
