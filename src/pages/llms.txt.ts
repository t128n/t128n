import type { APIContext } from "astro";
import { Liquid } from "liquidjs";
import { getCollection } from "astro:content";
import { isPublished } from "@/lib/posts";
import { site } from "@/lib/site";
import template from "@/assets/llms.txt?raw";

const liquid = new Liquid();

export async function GET(_context: APIContext) {
  const posts = (await getCollection("blog")).filter((post) => isPublished(post));

  const llms = await liquid.parseAndRender(template, {
    title: site.title,
    description: site.description,
    author: site.author,
    bluesky: site.social.bluesky,
    github: site.social.github,
    url: site.url,
    post_count: posts.length,
  });

  return new Response(llms, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
