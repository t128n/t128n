import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { isPublished, sortByDate, writingUrl } from "@/lib/posts";
import { site } from "@/lib/site";

export async function GET(context: APIContext) {
  const writings = (await getCollection("writing")).filter(isPublished).toSorted(sortByDate);

  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: writings.map((writing) => ({
      title: writing.data.title,
      description: writing.data.description,
      pubDate: writing.data.pubDate,
      link: writingUrl(writing),
    })),
  });
}
