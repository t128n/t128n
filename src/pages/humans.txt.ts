import { execSync } from "node:child_process";
import type { APIContext } from "astro";

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

Name: Torben Haack
Site: ${host}
Bluesky: https://bsky.app/profile/t128n.dev
GitHub: https://github.com/t128n

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
