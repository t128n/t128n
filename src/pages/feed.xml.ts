import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { meta, getWritingFeedItems } from "~/lib/feed";

export async function GET(context: APIContext) {
	const items = await getWritingFeedItems(context.site!);
	return rss({
		title: meta.title,
		description: meta.description,
		site: context.site!,
		items,
	});
}
