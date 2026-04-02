import { encode } from "@msgpack/msgpack";
import type { APIRoute } from "astro";

import { buildSearchIndex } from "~/lib/search-index";

export const GET: APIRoute = async () => {
	const index = await buildSearchIndex();

	return new Response(encode(index), {
		headers: { "Content-Type": "application/octet-stream" },
	});
};
