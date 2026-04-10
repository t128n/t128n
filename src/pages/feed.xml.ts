import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { meta, getWritingFeedItems } from "~/lib/feed";

export async function GET(context: APIContext) {
	const site = context.site ?? new URL(meta.siteUrl);
	const items = await getWritingFeedItems(site);
	return rss({
		title: meta.title,
		description: meta.description,
		site,
		items,
	});
}
