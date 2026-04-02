import blogroll from "~/content/data/blogroll.opml";
import podroll from "~/content/data/podroll.json";
import { resolveRemoteUrl } from "~/lib/resolve-remote-url";

type BlogrollOutline = {
	"@_text": string;
	"@_title": string;
	"@_htmlUrl": string;
	"@_xmlUrl": string;
};

export async function getPodrollEntries() {
	return Promise.all(
		podroll.map(async (url) => {
			const meta = await resolveRemoteUrl(url);
			return {
				url,
				title: meta.title ?? url,
				description: meta.description ?? "",
				image: meta.image,
			};
		}),
	);
}

export async function getBlogrollEntries() {
	return Promise.all(
		(blogroll.opml.body.outline as BlogrollOutline[]).map(
			async (outline) => {
				const meta = await resolveRemoteUrl(outline["@_htmlUrl"]);
				return {
					title:
						meta.title ?? outline["@_text"] ?? outline["@_title"],
					htmlUrl: outline["@_htmlUrl"],
					xmlUrl: outline["@_xmlUrl"],
					description: meta.description ?? "",
					image: meta.image,
				};
			},
		),
	);
}
