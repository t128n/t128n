import type { CollectionEntry } from "astro:content";

// Shared by the post-detail route and the archive listing so the URL shape
// (/YYYY/MM/slug/) is computed in exactly one place.

export function postUrlParams(post: CollectionEntry<"writing">) {
  const { pubDate } = post.data;
  return {
    // UTC, not local time: pubDate is a date-only value (e.g. "2026-08-17")
    // coerced to midnight UTC, and reading it back with local getters could
    // roll over to the wrong day/month on a server west of UTC.
    year: String(pubDate.getUTCFullYear()),
    month: String(pubDate.getUTCMonth() + 1).padStart(2, "0"),
    slug: post.data.slug ?? post.id,
  };
}

export function postUrl(post: CollectionEntry<"writing">) {
  const { year, month, slug } = postUrlParams(post);
  return `/${year}/${month}/${slug}/`;
}
