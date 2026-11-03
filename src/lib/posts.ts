import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function isPublished(post: BlogPost, production = import.meta.env.PROD): boolean {
  return production ? !post.data.draft : true;
}

export function sortByPublishedAt(a: BlogPost, b: BlogPost): number {
  return b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
}

export function postUrl(post: BlogPost): string {
  return `/blog/${post.id}/`;
}

export function formatDate(date: Date, style: "long" | "medium" = "long"): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: style,
    timeZone: "UTC",
  }).format(date);
}
