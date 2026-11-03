import { describe, expect, it } from "bun:test";
import type { CollectionEntry } from "astro:content";
import { formatDate, isPublished, postUrl, sortByPublishedAt } from "./posts";

function createMockEntry(id: string, publishedAt: Date, draft = false): CollectionEntry<"blog"> {
  return {
    id,
    collection: "blog",
    data: {
      title: `Title for ${id}`,
      publishedAt,
      draft,
    },
  } as unknown as CollectionEntry<"blog">;
}

describe("blog utilities", () => {
  it("builds the article URL from the collection id", () => {
    const entry = createMockEntry("hello-world", new Date("2025-12-31T00:00:00Z"));
    expect(postUrl(entry)).toBe("/blog/hello-world/");
  });

  it("sorts entries newest first by publication date", () => {
    const older = createMockEntry("older", new Date("2025-01-01T00:00:00Z"));
    const newer = createMockEntry("newer", new Date("2026-01-01T00:00:00Z"));

    const sorted = [older, newer].toSorted(sortByPublishedAt);
    expect(sorted[0].id).toBe("newer");
    expect(sorted[1].id).toBe("older");
  });

  it("formats dates in UTC without a local timezone shift", () => {
    const date = new Date("2026-08-22T23:30:00Z");
    expect(formatDate(date, "medium")).toBe("Aug 22, 2026");
  });

  it("keeps drafts visible outside a production build", () => {
    const draft = createMockEntry("draft-post", new Date(), true);
    const published = createMockEntry("live-post", new Date(), false);

    expect(isPublished(published, false)).toBe(true);
    expect(isPublished(draft, false)).toBe(true);
  });

  it("excludes drafts from a production build", () => {
    const draft = createMockEntry("draft-post", new Date(), true);
    const published = createMockEntry("live-post", new Date(), false);

    expect(isPublished(published, true)).toBe(true);
    expect(isPublished(draft, true)).toBe(false);
  });
});
