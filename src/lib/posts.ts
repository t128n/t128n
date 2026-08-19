import type { CollectionEntry } from "astro:content";

export function isPublished(post: CollectionEntry<"writing">): boolean {
  return import.meta.env.PROD ? !post.data.draft : true;
}

export function sortByDate(a: CollectionEntry<"writing">, b: CollectionEntry<"writing">): number {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

export function postUrlParams(post: CollectionEntry<"writing">) {
  const { pubDate } = post.data;
  return {
    year: String(pubDate.getUTCFullYear()),
    month: String(pubDate.getUTCMonth() + 1).padStart(2, "0"),
    slug: post.data.slug ?? post.id,
  };
}

export function postUrl(post: CollectionEntry<"writing">) {
  const { year, month, slug } = postUrlParams(post);
  return `/${year}/${month}/${slug}/`;
}
