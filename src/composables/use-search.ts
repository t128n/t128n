import {
	buildIndex,
	search,
	type SearchDocument,
	type SearchResult,
} from "~/lib/search";

export function useSearch(docs: SearchDocument[]) {
	buildIndex(docs);
	return (query: string, limit?: number): SearchResult[] =>
		search(query, limit);
}
