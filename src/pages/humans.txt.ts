import { execSync } from "node:child_process";
import type { APIContext } from "astro";
import { site } from "@/lib/site";

const lastUpdate = (() => {
  try {
    return execSync('git log -1 --format="%cs"').toString().trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
})();

export async function GET(context: APIContext) {
  const host = context.site?.hostname ?? "t128n.dev";

  const humans = `/* TEAM */

Name: ${site.author}
Site: ${host}
Bluesky: ${site.social.bluesky}
GitHub: ${site.social.github}

/* SITE */

Last update: ${lastUpdate}
Language: English
Doctype: HTML5
Built with: Astro
`;

  return new Response(humans, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
