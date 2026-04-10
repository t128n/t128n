import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import type { RSSFeedItem } from "@astrojs/rss";
import { experimental_AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getCollection, render } from "astro:content";

import { meta } from "~/config";

export { meta };

type WritingEntry = Awaited<ReturnType<typeof getWritingEntries>>[number];

async function getWritingEntries() {
	const entries = await getCollection(
		"writings",
		({ data, id }) => data.draft !== true && id !== "index",
	);
	entries.sort((a, b) => {
		const aDate = new Date(a.data.createdAt ?? 0).getTime();
		const bDate = new Date(b.data.createdAt ?? 0).getTime();
		return bDate - aDate;
	});
	return entries;
}

function getWritingUrl(entry: WritingEntry, site: URL) {
	return new URL(`/writing/${entry.id}`, site).href;
}

function getWritingDate(
	entry: WritingEntry,
	remarkPluginFrontmatter: { createdAt?: string },
) {
	const createdAt =
		entry.data.createdAt ??
		(remarkPluginFrontmatter.createdAt
			? new Date(remarkPluginFrontmatter.createdAt)
			: undefined);
	return createdAt ?? new Date(0);
}

export async function getWritingFeedItems(site: URL): Promise<RSSFeedItem[]> {
	const entries = await getWritingEntries();

	const renderers = await loadRenderers([getMDXRenderer()]);
	const container = await experimental_AstroContainer.create({ renderers });

	return Promise.all(
		entries.map(async (entry) => {
			const { Content, remarkPluginFrontmatter } = await render(entry);
			const content = await container.renderToString(Content);

			return {
				title: entry.data.title,
				link: getWritingUrl(entry, site),
				description: entry.data.description,
				content,
				pubDate: getWritingDate(entry, remarkPluginFrontmatter),
			};
		}),
	);
}
