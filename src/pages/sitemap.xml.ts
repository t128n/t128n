import type { APIRoute } from "astro";
import { getCollection, render } from "astro:content";

import { meta } from "~/config";

function toW3CDate(date: Date): string {
	return date.toISOString().split("T")[0];
}

export const GET: APIRoute = async ({ site }) => {
	const base = (site ?? meta.siteUrl).toString().replace(/\/$/, "");

	const writings = await getCollection(
		"writings",
		({ data, id }) => data.draft !== true && id !== "index",
	);
	const writingsWithDates = await Promise.all(
		writings.map(async (entry) => {
			const { remarkPluginFrontmatter } = await render(entry);
			const lastmod =
				entry.data.updatedAt ??
				(remarkPluginFrontmatter.updatedAt
					? new Date(remarkPluginFrontmatter.updatedAt)
					: undefined) ??
				entry.data.pubDate ??
				entry.data.createdAt ??
				(remarkPluginFrontmatter.createdAt
					? new Date(remarkPluginFrontmatter.createdAt)
					: undefined);
			return { id: entry.id, lastmod };
		}),
	);

	const staticPages = ["", "/writing", "/bookmarks", "/blogroll", "/podroll"];

	const staticEntries = staticPages
		.map((path) => `  <url><loc>${base}${path}</loc></url>`)
		.join("\n");

	const writingEntries = writingsWithDates
		.map(({ id, lastmod }) => {
			const loc = `${base}/writing/${id}`;
			const lastmodTag = lastmod
				? `<lastmod>${toW3CDate(lastmod)}</lastmod>`
				: "";
			return `  <url><loc>${loc}</loc>${lastmodTag}</url>`;
		})
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${writingEntries}
</urlset>`;

	return new Response(xml, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
