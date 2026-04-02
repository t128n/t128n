import type { APIRoute } from "astro";

import { createWritingsFeed } from "~/lib/feed";

export const GET: APIRoute = async () => {
	const feed = await createWritingsFeed();
	return new Response(feed.json1(), {
		headers: {
			"Content-Type": "application/feed+json; charset=utf-8",
		},
	});
};
