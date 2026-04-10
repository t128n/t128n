import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";

import { meta } from "~/config";

type StandardSitePublicationRecord = {
	$type: "site.standard.publication";
	url: string;
	name: string;
	description?: string;
	preferences?: {
		showInDiscover?: boolean;
	};
};

type StandardSiteDocumentRecord = {
	$type: "site.standard.document";
	site: string;
	path: string;
	title: string;
	publishedAt: string;
	description?: string;
	textContent?: string;
};

type WritingSource = {
	id: string;
	data: {
		title: string;
		description: string;
		pubDate?: string;
		draft?: boolean;
	};
	body?: string;
};

function parseFrontmatter(raw: string): Record<string, string> {
	const match = raw.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};
	const data: Record<string, string> = {};
	for (const line of match[1].split("\n")) {
		const colon = line.indexOf(":");
		if (colon === -1) continue;
		const key = line.slice(0, colon).trim();
		const value = line
			.slice(colon + 1)
			.trim()
			.replace(/^["']|["']$/g, "");
		data[key] = value;
	}
	return data;
}

function stripFrontmatter(raw: string): string {
	return raw.replace(/^---\n[\s\S]*?\n---\n/, "");
}

function toIsoDate(value: string | undefined): string {
	if (!value) return new Date().toISOString();
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? new Date().toISOString()
		: date.toISOString();
}

async function loadWritings(): Promise<WritingSource[]> {
	const writingsDir = new URL("../content/writings", import.meta.url)
		.pathname;
	const files = (await readdir(writingsDir)).filter((file) =>
		/\.(md|mdx)$/.test(file),
	);

	return Promise.all(
		files.map(async (file) => {
			const raw = await readFile(join(writingsDir, file), "utf8");
			const data = parseFrontmatter(raw);
			const id = basename(file).replace(/\.(md|mdx)$/, "");

			return {
				id,
				data: {
					title: data.title ?? id,
					description: data.description ?? "",
					pubDate: data.pubDate,
					draft: data.draft === "true",
				},
				body: stripFrontmatter(raw).trim(),
			};
		}),
	);
}

export async function getWritingSources(): Promise<WritingSource[]> {
	return loadWritings();
}

export function buildPublicationRecord(): StandardSitePublicationRecord {
	return {
		$type: "site.standard.publication",
		url: meta.siteUrl,
		name: meta.title,
		description: meta.description,
		preferences: {
			showInDiscover: true,
		},
	};
}

export function buildDocumentRecord(
	writing: WritingSource,
	publicationUri: string,
): StandardSiteDocumentRecord {
	const slug = writing.id;

	return {
		$type: "site.standard.document",
		site: publicationUri,
		path: `/writing/${slug}`,
		title: writing.data.title ?? slug,
		publishedAt: toIsoDate(writing.data.pubDate),
		description: writing.data.description || undefined,
		textContent: writing.body?.trim(),
	};
}
