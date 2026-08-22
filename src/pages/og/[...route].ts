import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { isPublished, writingUrl } from "@/lib/posts";
import { renderOgImage } from "@/lib/og";

// Auto-discover all static .astro pages in src/pages (excluding dynamic routes)
const astroPages = import.meta.glob<{ title?: string; description?: string }>(
  "/src/pages/**/*.astro",
  { eager: true },
);

const staticPages: Record<string, { title: string; description?: string }> = {};

for (const [path, mod] of Object.entries(astroPages)) {
  if (mod.title) {
    const slug = path
      .replace(/^\/src\/pages\//, "")
      .replace(/\.astro$/, "")
      .replace(/\/index$/, "");
    staticPages[slug === "" ? "index" : slug] = {
      title: mod.title,
      description: mod.description,
    };
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const writingEntries = await getCollection("writing");
  const writingPages: Record<string, { title: string; description?: string }> = Object.fromEntries(
    writingEntries.filter(isPublished).map((writing) => [
      writingUrl(writing)
        .replace(/^\/|\/$/g, "")
        .replace(/\//g, "-"),
      {
        title: writing.data.title,
        description: writing.data.description,
      },
    ]),
  );

  const allPages = { ...staticPages, ...writingPages };

  return Object.entries(allPages).map(([slug, data]) => ({
    params: { route: `${slug}.jpg` },
    props: { data },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { data } = props as { data: { title: string; description?: string } };
  const imageBuffer = await renderOgImage(data);

  return new Response(Buffer.from(imageBuffer), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
