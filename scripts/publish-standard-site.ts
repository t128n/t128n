/**
 * Publishes writings to ATProto using standard.site lexicons.
 * Creates/updates site.standard.publication + site.standard.document records.
 *
 * Usage:
 *   ATP_HANDLE=you.bsky.social ATP_APP_PASSWORD=xxxx bun scripts/publish-standard-site.ts
 *
 * Required env vars:
 *   ATP_HANDLE       — your Bluesky handle
 *   ATP_APP_PASSWORD — app password from bsky.app → Settings → App Passwords
 *
 * Optional:
 *   ATP_PDS          — PDS host (default: https://npmx.social)
 */

import { readdir, readFile } from "node:fs/promises";
import { join, basename } from "node:path";

import { Client, CredentialManager } from "@atcute/client";

import { meta } from "~/config";

const PDS = process.env.ATP_PDS ?? "https://npmx.social";
const HANDLE = process.env.ATP_HANDLE;
const APP_PASSWORD = process.env.ATP_APP_PASSWORD;

if (!HANDLE || !APP_PASSWORD) {
	console.error("ATP_HANDLE and ATP_APP_PASSWORD are required.");
	process.exit(1);
}

const WRITINGS_DIR = new URL("../src/content/writings", import.meta.url)
	.pathname;

// --- auth ---
const manager = new CredentialManager({ service: PDS });
const session = await manager.login({
	identifier: HANDLE,
	password: APP_PASSWORD,
});
console.log(`Authenticated as ${session.did}`);

const rpc = new Client({ handler: manager }) as Client<
	Record<string, unknown>,
	Record<string, unknown>
>;

type PutRecordResponse = {
	uri: string;
};

async function putRecord(
	collection: string,
	rkey: string,
	record: Record<string, unknown>,
) {
	const response = await rpc.post("com.atproto.repo.putRecord", {
		input: {
			repo: session.did,
			collection,
			rkey,
			record,
		},
		as: "json",
	});
	if (!response.ok) throw new Error(`putRecord ${collection}/${rkey} failed`);
	return response.data as PutRecordResponse;
}

// --- publication (once per blog) ---
const pub = await putRecord("site.standard.publication", "self", {
	$type: "site.standard.publication",
	url: meta.siteUrl,
	name: meta.title,
	description: meta.description,
	preferences: {
		showInDiscover: true,
	},
});
console.log(`publication → ${pub.uri}`);

// --- documents (one per writing) ---
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

const files = (await readdir(WRITINGS_DIR)).filter((f) =>
	/\.(md|mdx)$/.test(f),
);
let published = 0;

for (const file of files) {
	const raw = await readFile(join(WRITINGS_DIR, file), "utf8");
	const data = parseFrontmatter(raw);

	if (data.draft === "true") {
		console.log(`  skip (draft): ${file}`);
		continue;
	}

	const slug = basename(file).replace(/\.(md|mdx)$/, "");

	const record: Record<string, unknown> = {
		$type: "site.standard.document",
		site: pub.uri,
		path: `/writing/${slug}`,
		title: data.title ?? slug,
		publishedAt: data.createdAt
			? new Date(data.createdAt).toISOString()
			: new Date().toISOString(),
		textContent: stripFrontmatter(raw).trim(),
	};
	if (data.description) record.description = data.description;

	const doc = await putRecord("site.standard.document", slug, record);
	console.log(`  [${slug}] → ${doc.uri}`);
	published++;
}

console.log(`\nDone. ${published} document(s) published.`);
