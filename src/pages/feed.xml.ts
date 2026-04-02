import type { APIRoute } from "astro";

import { createWritingsFeed } from "~/lib/feed";

export const GET: APIRoute = async () => {
	const feed = await createWritingsFeed();
	return new Response(feed.rss2(), {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
		},
	});
};
