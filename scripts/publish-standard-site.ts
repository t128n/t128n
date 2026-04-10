/**
 * Publishes writings to ATProto using standard.site lexicons.
 */

import { Client, CredentialManager } from "@atcute/client";

import {
	buildDocumentRecord,
	buildPublicationRecord,
	getWritingSources,
} from "~/lib/standard-site";

const DRY_RUN = process.argv.includes("--dry-run");
const PDS = process.env.ATP_PDS ?? "https://npmx.social";
const HANDLE = process.env.ATP_HANDLE;
const APP_PASSWORD = process.env.ATP_APP_PASSWORD;

if (!DRY_RUN && (!HANDLE || !APP_PASSWORD)) {
	console.error("ATP_HANDLE and ATP_APP_PASSWORD are required.");
	process.exit(1);
}

type PutRecordResponse = {
	uri: string;
};

async function putRecord(
	rpc: Client<Record<string, unknown>, Record<string, unknown>>,
	sessionDid: string,
	collection: string,
	rkey: string,
	record: Record<string, unknown>,
) {
	const response = await rpc.post("com.atproto.repo.putRecord", {
		input: {
			repo: sessionDid,
			collection,
			rkey,
			record,
		},
		as: "json",
	});
	if (!response.ok) throw new Error(`putRecord ${collection}/${rkey} failed`);
	return response.data as PutRecordResponse;
}

const writings = await getWritingSources();

if (DRY_RUN) {
	console.log("Dry run: no records will be published.");
	console.log(JSON.stringify(buildPublicationRecord(), null, 2));

	for (const writing of writings) {
		if (writing.data.draft) {
			console.log(`  skip (draft): ${writing.id}`);
			continue;
		}

		console.log(
			JSON.stringify(
				buildDocumentRecord(writing, "at://publication"),
				null,
				2,
			),
		);
	}

	process.exit(0);
}

const manager = new CredentialManager({ service: PDS });
const handle = HANDLE;
const appPassword = APP_PASSWORD;

if (!handle || !appPassword) {
	console.error("ATP_HANDLE and ATP_APP_PASSWORD are required.");
	process.exit(1);
}

const session = await manager.login({
	identifier: handle,
	password: appPassword,
});
console.log(`Authenticated as ${session.did}`);

const rpc = new Client({ handler: manager }) as Client<
	Record<string, unknown>,
	Record<string, unknown>
>;

const pub = await putRecord(
	rpc,
	session.did,
	"site.standard.publication",
	"self",
	buildPublicationRecord(),
);
console.log(`publication → ${pub.uri}`);

let published = 0;

for (const writing of writings) {
	if (writing.data.draft) {
		console.log(`  skip (draft): ${writing.id}`);
		continue;
	}

	const doc = await putRecord(
		rpc,
		session.did,
		"site.standard.document",
		writing.id,
		buildDocumentRecord(writing, pub.uri),
	);
	console.log(`  [${writing.id}] → ${doc.uri}`);
	published++;
}

console.log(`\nDone. ${published} document(s) published.`);
