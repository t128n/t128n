import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import { site } from "@/lib/site";
import { isPublished, postUrl } from "@/lib/posts";

const writingEntries = await getCollection("writing");

const writingPages = Object.fromEntries(
  writingEntries.filter(isPublished).map((post) => [
    postUrl(post)
      .replace(/^\/|\/$/g, "")
      .replace(/\//g, "-"),
    {
      title: post.data.title,
      description: post.data.description,
    },
  ]),
);

const staticPages = {
  index: {
    title: site.title,
    description: site.description,
  },
  writing: {
    title: "Writing",
    description: "Essays and notes on software engineering, data systems, and architecture.",
  },
};

const pages = { ...staticPages, ...writingPages };

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[255, 255, 255]],
    border: {
      color: [0, 0, 0],
      width: 8,
      side: "inline-start",
    },
    font: {
      title: {
        color: [0, 0, 0],
        size: 64,
        weight: "Bold",
      },
      description: {
        color: [80, 80, 80],
        size: 32,
      },
    },
  }),
});
