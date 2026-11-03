import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { isPublished, postUrl, sortByPublishedAt } from "@/lib/posts";
import { site } from "@/lib/site";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog"))
    .filter((post) => isPublished(post))
    .toSorted(sortByPublishedAt);

  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      ...(post.data.description ? { description: post.data.description } : {}),
      pubDate: post.data.publishedAt,
      link: postUrl(post),
    })),
  });
}
