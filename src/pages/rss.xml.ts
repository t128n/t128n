import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { postUrl } from "@/lib/posts";

export async function GET(context: APIContext) {
  const posts = (await getCollection("writing", ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  })).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: "t128n.dev",
    description:
      "Essays and notes on software engineering, data systems, and architecture from Torben Haack.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  });
}
