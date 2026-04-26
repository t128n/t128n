import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { XMLParser } from "fast-xml-parser";
import { describe, expect, it } from "vitest";

const DIST = resolve(import.meta.dirname, "../../dist");
const SITE = "https://t128n.dev";

const W3C_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const xmlParser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "@_",
});

function readDist(file: string): string {
	return readFileSync(resolve(DIST, file), "utf-8");
}

type SitemapUrl = { loc: string; lastmod?: string };

function parseSitemap(): SitemapUrl[] {
	const result = xmlParser.parse(readDist("sitemap.xml"));
	const urls = result?.urlset?.url;
	return Array.isArray(urls) ? urls : [urls];
}

// ─── sitemap.xml ────────────────────────────────────────────────────────────

describe("sitemap.xml", () => {
	let urls: SitemapUrl[];

	it("parses without error", () => {
		urls = parseSitemap();
		expect(urls.length).toBeGreaterThan(0);
	});

	it("includes all static pages", () => {
		urls ??= parseSitemap();
		const locs = urls.map((u) => u.loc);
		for (const path of [
			"",
			"/writing",
			"/bookmarks",
			"/blogroll",
			"/podroll",
		]) {
			expect(locs).toContain(`${SITE}${path}`);
		}
	});

	it("includes all published writing slugs", () => {
		urls ??= parseSitemap();
		const locs = urls.map((u) => u.loc);
		const expected = [
			"a-token-for-details",
			"code-formatting-guidelines",
			"dependency-standback",
			"go-like-error-handling-in-typescript",
			"lean-js-with-e18e-linting-rules",
			"on-stale-pr-reviews",
			"one-thing-at-a-time",
			"releasing-packy-v2",
		];
		for (const slug of expected) {
			expect(locs).toContain(`${SITE}/writing/${slug}`);
		}
	});

	it("excludes draft writings", () => {
		urls ??= parseSitemap();
		const locs = urls.map((u) => u.loc);
		expect(locs).not.toContain(`${SITE}/writing/image-sources`);
	});

	it("every writing URL has a lastmod in W3C date format", () => {
		urls ??= parseSitemap();
		const writingUrls = urls.filter((u) => /\/writing\/.+/.test(u.loc));
		expect(writingUrls.length).toBeGreaterThan(0);
		for (const entry of writingUrls) {
			expect(entry.lastmod, `${entry.loc} missing lastmod`).toBeDefined();
			expect(
				entry.lastmod,
				`${entry.loc} invalid lastmod format`,
			).toMatch(W3C_DATE_RE);
		}
	});

	it("static pages do not have lastmod", () => {
		urls ??= parseSitemap();
		const staticUrls = urls.filter((u) => !/\/writing\/.+/.test(u.loc));
		for (const entry of staticUrls) {
			expect(
				entry.lastmod,
				`${entry.loc} should not have lastmod`,
			).toBeUndefined();
		}
	});

	it("no duplicate URLs", () => {
		urls ??= parseSitemap();
		const locs = urls.map((u) => u.loc);
		expect(new Set(locs).size).toBe(locs.length);
	});

	it("no URLs contain .html", () => {
		urls ??= parseSitemap();
		for (const entry of urls) {
			expect(
				entry.loc,
				`${entry.loc} should not contain .html`,
			).not.toMatch(/\.html/);
		}
	});

	it("all URLs start with the correct site origin", () => {
		urls ??= parseSitemap();
		for (const entry of urls) {
			expect(entry.loc).toMatch(new RegExp(`^${SITE}`));
		}
	});
});

// ─── robots.txt ─────────────────────────────────────────────────────────────

describe("robots.txt", () => {
	let content: string;

	it("allows all user agents", () => {
		content = readDist("robots.txt");
		expect(content).toContain("User-agent: *");
		expect(content).toContain("Allow: /");
	});

	it("points to sitemap.xml (not sitemap-index.xml)", () => {
		content ??= readDist("robots.txt");
		expect(content).toContain(`Sitemap: ${SITE}/sitemap.xml`);
		expect(content).not.toContain("sitemap-index.xml");
	});
});

// ─── feed.xml (RSS) ──────────────────────────────────────────────────────────

describe("feed.xml", () => {
	type RssItem = {
		title: string;
		link: string;
		guid: string | { "#text": string };
		description?: string;
		pubDate?: string;
	};

	let items: RssItem[];
	let channel: Record<string, unknown>;

	function parseRss() {
		const rssParser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: "@_",
			processEntities: false,
		});
		const result = rssParser.parse(readDist("feed.xml"));
		channel = result?.rss?.channel;
		const raw = channel?.item;
		items = Array.isArray(raw) ? raw : [raw];
	}

	it("has correct channel title and description", () => {
		parseRss();
		expect(channel.title).toBe("Torben Haack");
		expect(typeof channel.description).toBe("string");
	});

	it("channel link points to site root", () => {
		items ??= (parseRss(), items);
		expect(channel.link).toBe(`${SITE}/`);
	});

	it("includes all published writing slugs", () => {
		items ??= (parseRss(), items);
		const links = items.map((i) => i.link);
		const expected = [
			"a-token-for-details",
			"code-formatting-guidelines",
			"dependency-standback",
			"go-like-error-handling-in-typescript",
			"lean-js-with-e18e-linting-rules",
			"on-stale-pr-reviews",
			"one-thing-at-a-time",
			"releasing-packy-v2",
		];
		for (const slug of expected) {
			expect(links).toContain(`${SITE}/writing/${slug}`);
		}
	});

	it("excludes draft writings", () => {
		items ??= (parseRss(), items);
		const links = items.map((i) => i.link);
		expect(links).not.toContain(`${SITE}/writing/image-sources`);
	});

	it("every item has a title, link, and guid", () => {
		items ??= (parseRss(), items);
		for (const item of items) {
			expect(item.title, "missing title").toBeTruthy();
			expect(item.link, "missing link").toBeTruthy();
			expect(item.guid, "missing guid").toBeTruthy();
		}
	});

	it("every item link matches its guid", () => {
		items ??= (parseRss(), items);
		for (const item of items) {
			const guidText =
				typeof item.guid === "object" ? item.guid["#text"] : item.guid;
			expect(item.link).toBe(guidText);
		}
	});

	it("no item links contain .html", () => {
		items ??= (parseRss(), items);
		for (const item of items) {
			expect(item.link).not.toMatch(/\.html/);
		}
	});
});

// ─── writing page HTML ───────────────────────────────────────────────────────

describe("writing page HTML", () => {
	function getMeta(html: string, selector: string): string | undefined {
		const match = html.match(new RegExp(`<meta[^>]+${selector}[^>]*>`));
		return match?.[0];
	}

	function getAttr(tag: string, attr: string): string | undefined {
		return tag.match(new RegExp(`${attr}="([^"]+)"`))?.[1];
	}

	function getCanonical(html: string): string | undefined {
		const match = html.match(/<link[^>]+rel="canonical"[^>]*>/);
		return match ? getAttr(match[0], "href") : undefined;
	}

	const slugs = [
		"code-formatting-guidelines",
		"dependency-standback",
		"go-like-error-handling-in-typescript",
	];

	for (const slug of slugs) {
		describe(slug, () => {
			let html: string;

			it("canonical URL has no .html extension", () => {
				html = readDist(`writing/${slug}.html`);
				const canonical = getCanonical(html);
				expect(canonical).toBeDefined();
				expect(canonical).not.toMatch(/\.html/);
				expect(canonical).toBe(`${SITE}/writing/${slug}`);
			});

			it("og:url has no .html extension", () => {
				html ??= readDist(`writing/${slug}.html`);
				const ogUrl = getMeta(html, 'property="og:url"');
				expect(ogUrl).toBeDefined();
				expect(getAttr(ogUrl!, "content")).toBe(
					`${SITE}/writing/${slug}`,
				);
			});

			it("og:type is article", () => {
				html ??= readDist(`writing/${slug}.html`);
				const ogType = getMeta(html, 'property="og:type"');
				expect(getAttr(ogType!, "content")).toBe("article");
			});

			it("has a meta description", () => {
				html ??= readDist(`writing/${slug}.html`);
				const desc = getMeta(html, 'name="description"');
				expect(desc).toBeDefined();
				expect(getAttr(desc!, "content")?.length).toBeGreaterThan(0);
			});

			it("title includes site suffix", () => {
				html ??= readDist(`writing/${slug}.html`);
				expect(html).toMatch(/<title>[^<]+ @ t128n\.dev<\/title>/);
			});
		});
	}
});

// ─── homepage HTML ───────────────────────────────────────────────────────────

describe("homepage HTML", () => {
	let html: string;

	it("canonical is bare origin (no /index.html)", () => {
		html = readDist("index.html");
		const match = html.match(/<link[^>]+rel="canonical"[^>]*>/);
		const canonical = match?.[0].match(/href="([^"]+)"/)?.[1];
		expect(canonical).toBe(`${SITE}/`);
	});

	it("og:type is website", () => {
		html ??= readDist("index.html");
		const ogType = html.match(/property="og:type" content="([^"]+)"/)?.[1];
		expect(ogType).toBe("website");
	});

	it("links to sitemap.xml", () => {
		html ??= readDist("index.html");
		expect(html).toContain(`rel="sitemap"`);
		expect(html).toContain(`href="/sitemap.xml"`);
	});
});
