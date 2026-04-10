import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { experimental_AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getCollection, render } from "astro:content";
import { Feed } from "feed";

import { meta } from "~/config";

const site = new URL(meta.siteUrl);

type WritingEntry = Awaited<ReturnType<typeof getWritingEntries>>[number];

async function getWritingEntries() {
	const entries = await getCollection(
		"writings",
		({ data, id }) => data.draft !== true && id !== "index",
	);
	entries.sort((a, b) => {
		const aDate = new Date(
			a.data.updatedAt ?? a.data.createdAt ?? 0,
		).getTime();
		const bDate = new Date(
			b.data.updatedAt ?? b.data.createdAt ?? 0,
		).getTime();
		return bDate - aDate;
	});
	return entries;
}

function getWritingUrl(entry: WritingEntry) {
	return new URL(`/writing/${entry.id}`, site).href;
}

function getWritingDate(entry: WritingEntry) {
	return entry.data.updatedAt ?? entry.data.createdAt ?? new Date(0);
}

export async function createWritingsFeed() {
	const entries = await getWritingEntries();
	const latestDate = entries[0] ? getWritingDate(entries[0]) : new Date();
	const feed = new Feed({
		title: meta.title,
		description: meta.description,
		id: site.href,
		link: new URL("/writing/", site).href,
		language: "en",
		updated: latestDate,
		feedLinks: {
			json: new URL("/feed.json", site).href,
			atom: new URL("/atom.xml", site).href,
			rss: new URL("/feed.xml", site).href,
		},
	});

	const renderers = await loadRenderers([getMDXRenderer()]);
	const container = await experimental_AstroContainer.create({ renderers });

	for (const entry of entries) {
		const { Content } = await render(entry);
		const html = await container.renderToString(Content);

		feed.addItem({
			title: entry.data.title,
			id: getWritingUrl(entry),
			link: getWritingUrl(entry),
			description: entry.data.description,
			content: html,
			date: getWritingDate(entry),
		});
	}

	return feed;
}
