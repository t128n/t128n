import type { APIRoute } from "astro";

import { createWritingsFeed } from "~/lib/feed";

export const GET: APIRoute = async () => {
	const feed = await createWritingsFeed();
	return new Response(feed.atom1(), {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
		},
	});
};
