import { describe, expect, it } from "bun:test";
import type { CollectionEntry } from "astro:content";
import {
  isPublished,
  postUrl,
  postUrlParams,
  sortByDate,
  writingUrl,
  writingUrlParams,
} from "./posts";

function createMockEntry(
  id: string,
  pubDate: Date,
  draft = false,
  slug?: string,
): CollectionEntry<"writing"> {
  return {
    id,
    collection: "writing",
    data: {
      title: `Title for ${id}`,
      description: `Description for ${id}`,
      pubDate,
      draft,
      tags: [],
      ...(slug ? { slug } : {}),
    },
  } as unknown as CollectionEntry<"writing">;
}

describe("posts utilities", () => {
  it("computes URL params using UTC year, month, and slug/id", () => {
    const entry = createMockEntry("my-first-post", new Date("2026-08-22T00:00:00Z"));
    const params = writingUrlParams(entry);

    expect(params).toEqual({
      year: "2026",
      month: "08",
      slug: "my-first-post",
    });
  });

  it("uses custom slug when provided", () => {
    const entry = createMockEntry(
      "2026-08-22-some-file",
      new Date("2026-01-05T00:00:00Z"),
      false,
      "custom-slug",
    );
    const params = writingUrlParams(entry);

    expect(params).toEqual({
      year: "2026",
      month: "01",
      slug: "custom-slug",
    });
  });

  it("generates correct writingUrl", () => {
    const entry = createMockEntry("hello-world", new Date("2025-12-31T00:00:00Z"));
    expect(writingUrl(entry)).toBe("/2025/12/hello-world/");
    expect(postUrl(entry)).toBe("/2025/12/hello-world/");
    expect(postUrlParams(entry)).toEqual(writingUrlParams(entry));
  });

  it("sorts entries in descending order by pubDate", () => {
    const older = createMockEntry("older", new Date("2025-01-01T00:00:00Z"));
    const newer = createMockEntry("newer", new Date("2026-01-01T00:00:00Z"));

    const sorted = [older, newer].toSorted(sortByDate);
    expect(sorted[0].id).toBe("newer");
    expect(sorted[1].id).toBe("older");
  });

  it("determines publication status", () => {
    const draft = createMockEntry("draft-post", new Date(), true);
    const published = createMockEntry("live-post", new Date(), false);

    expect(isPublished(published)).toBe(true);
    // In non-PROD mode (test environment), isPublished returns true
    expect(isPublished(draft)).toBe(true);
  });
});
