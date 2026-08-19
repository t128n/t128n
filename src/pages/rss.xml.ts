import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { isPublished, sortByDate, postUrl } from "@/lib/posts";
import { site } from "@/lib/site";

export async function GET(context: APIContext) {
  const posts = (await getCollection("writing")).filter(isPublished).sort(sortByDate);

  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  });
}
