import { Window } from "happy-dom";

interface ResolvedRemoteUrl {
	url: string;
	title: string | null;
	description: string | null;
	image: string | null;
}

export async function resolveRemoteUrl(
	url: string,
): Promise<ResolvedRemoteUrl> {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 10_000);
		const response = await fetch(url, { signal: controller.signal });
		clearTimeout(timeout);
		const html = await response.text();

		const window = new Window({ url });
		const document = window.document;
		document.write(html);

		const image =
			document
				.querySelector('meta[property="og:image"]')
				?.getAttribute("content") ||
			document
				.querySelector('meta[name="twitter:image"]')
				?.getAttribute("content") ||
			null;

		const description =
			document
				.querySelector('meta[name="description"]')
				?.getAttribute("content") ||
			document
				.querySelector('meta[property="og:description"]')
				?.getAttribute("content") ||
			null;

		const title =
			document
				.querySelector('meta[property="og:title"]')
				?.getAttribute("content") ||
			document.querySelector("title")?.textContent?.trim() ||
			null;

		window.close();

		return { url, title, description, image };
	} catch {
		return { url, title: null, description: null, image: null };
	}
}
