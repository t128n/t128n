import Fuse from "fuse.js";

export interface SearchDocument {
	id: string;
	type: "page" | "writing" | "data";
	category: string;
	title: string;
	description: string;
	url: string;
	icon?: string;
	body?: string;
	sourcePath?: string;
}

export type SearchResult = Omit<SearchDocument, "body">;

let fuse: Fuse<SearchDocument> | null = null;

export function buildIndex(docs: SearchDocument[]) {
	fuse = new Fuse(docs, {
		keys: [
			{ name: "title", weight: 0.9 },
			{ name: "description", weight: 0.5 },
			{ name: "body", weight: 0.3 },
		],
		includeScore: true,
		threshold: 0.4, // 0 = exact match only, 1 = match anything
		ignoreLocation: true,
	});
}

export function search(query: string, limit = 10): SearchResult[] {
	if (!fuse || !query.trim()) return [];

	return fuse.search(query, { limit }).map(({ item }) => {
		const { body: _, ...rest } = item;
		return rest;
	});
}
