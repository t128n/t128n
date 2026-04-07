import { getCollection } from "astro:content";

import { getBlogrollEntries, getPodrollEntries } from "~/lib/rolls";
import type { SearchDocument } from "~/lib/search";

const DATA_ICONS: Record<string, string> = {
	blogroll: "i-gg:readme",
	bookmarks: "i-gg:bookmark",
	podroll: "i-gg:media-podcast",
	verify: "i-gg:play-list-check",
	go: "i-gg:corner-double-up-right",
};

type PageModule = {
	meta?: { title: string; description: string; icon?: string };
	url?: string;
};

export async function buildSearchIndex(): Promise<SearchDocument[]> {
	const rawPageEntries = Object.entries(
		import.meta.glob("../pages/**/*.{md,astro,mdx}", { eager: true }),
	) as [string, PageModule][];

	const pageDocsWithSourcePath: SearchDocument[] = rawPageEntries
		.filter(([, page]) => page.meta?.title)
		.map(([filePath, page], i) => ({
			id: `page-${i}`,
			type: "page" as const,
			category: "pages",
			title: page.meta!.title,
			description: page.meta?.description ?? "",
			url: page.url || "/",
			icon: page.meta?.icon,
			sourcePath: filePath,
		}));

	const writings = await getCollection(
		"writings",
		({ data, id }) => data.draft !== true && id !== "index",
	);

	const writingDocs: SearchDocument[] = writings.map((writing) => ({
		id: `writing-${writing.id}`,
		type: "writing" as const,
		category: "writings",
		title: writing.data.title,
		description: writing.data.description ?? "",
		url: `/writing/${writing.id}`,
		icon: writing.data.icon,
		body: writing.body,
	}));

	const rawData = Object.entries(
		import.meta.glob("~/content/data/*.{json,opml}", { eager: true }),
	) as [string, { default: unknown }][];

	const dataDocs: SearchDocument[] = rawData.flatMap(([filePath, mod]) => {
		const value = mod.default;
		const fileSlug =
			filePath
				.split("/")
				.pop()
				?.replace(/\.[^.]+$/, "") ?? filePath;
		const icon = DATA_ICONS[fileSlug];

		if (fileSlug === "podroll" || fileSlug === "blogroll") {
			return [];
		}

		if (
			value &&
			typeof value === "object" &&
			!Array.isArray(value) &&
			"opml" in (value as Record<string, unknown>)
		) {
			const opml = (
				value as {
					opml: {
						body: {
							outline: Array<{
								"@_title": string;
								"@_description": string;
								"@_htmlUrl": string;
							}>;
						};
					};
				}
			).opml;
			return opml.body.outline.map((entry, i) => ({
				id: `data-${fileSlug}-${i}`,
				type: "data" as const,
				category: fileSlug,
				title: entry["@_title"],
				description: entry["@_description"] ?? "",
				url: entry["@_htmlUrl"] ?? "",
				icon,
			}));
		}

		if (Array.isArray(value)) {
			return value.flatMap((item, i) => {
				if (typeof item === "string") {
					return [
						{
							id: `data-${fileSlug}-${i}`,
							type: "data" as const,
							category: fileSlug,
							title: item,
							description: "",
							url: item,
							icon,
						},
					];
				}
				if (typeof item === "object" && item !== null) {
					const obj = item as Record<string, string>;
					return [
						{
							id: `data-${fileSlug}-${i}`,
							type: "data" as const,
							category: fileSlug,
							title:
								obj.title ??
								obj.label ??
								obj.slug ??
								obj.href ??
								`${fileSlug}-${i}`,
							description: obj.description ?? "",
							url: obj.href ?? obj.value ?? "",
							icon,
						},
					];
				}
				return [];
			});
		}

		return [];
	});

	const [podrollEntries, blogrollEntries] = await Promise.all([
		getPodrollEntries(),
		getBlogrollEntries(),
	]);

	const rollDocs: SearchDocument[] = [
		...podrollEntries.map((podcast, i) => ({
			id: `podroll-${i}`,
			type: "data" as const,
			category: "podroll",
			title: podcast.title,
			description: podcast.description,
			url: podcast.url,
			icon: DATA_ICONS.podroll,
		})),
		...blogrollEntries.map((blog, i) => ({
			id: `blogroll-${i}`,
			type: "data" as const,
			category: "blogroll",
			title: blog.title,
			description: blog.description,
			url: blog.htmlUrl,
			icon: DATA_ICONS.blogroll,
		})),
	];

	return [
		...pageDocsWithSourcePath,
		...writingDocs,
		...dataDocs,
		...rollDocs,
	];
}
