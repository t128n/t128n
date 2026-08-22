import type { CollectionEntry } from "astro:content";

export function isPublished(writing: CollectionEntry<"writing">): boolean {
  return import.meta.env.PROD ? !writing.data.draft : true;
}

export function sortByDate(a: CollectionEntry<"writing">, b: CollectionEntry<"writing">): number {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

export function writingUrlParams(writing: CollectionEntry<"writing">) {
  const { pubDate } = writing.data;
  return {
    year: String(pubDate.getUTCFullYear()),
    month: String(pubDate.getUTCMonth() + 1).padStart(2, "0"),
    slug: writing.data.slug ?? writing.id,
  };
}

export function writingUrl(writing: CollectionEntry<"writing">) {
  const { year, month, slug } = writingUrlParams(writing);
  return `/${year}/${month}/${slug}/`;
}

export const postUrl = writingUrl;
export const postUrlParams = writingUrlParams;
