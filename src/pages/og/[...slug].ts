import { readFileSync } from "node:fs";

import React from "react";
import satori from "satori";
import sharp from "sharp";

import { OGImage } from "~/components/og-image";
import { meta } from "~/config";
import { buildSearchIndex } from "~/lib/search-index";

const docs = await buildSearchIndex();

const pagesMap = Object.fromEntries(
	docs
		.filter((doc) => doc.url.startsWith("/") && doc.url !== "/")
		.map((doc) => [
			doc.url.replace(/\/+$/, "").slice(1),
			{ title: doc.title, description: doc.description },
		]),
);

// Add home page
pagesMap["index"] = {
	title: meta.title,
	description: meta.description,
};

export async function getStaticPaths() {
	return Object.keys(pagesMap).map((slug) => ({
		params: { slug: slug + ".png" },
		props: { slug },
	}));
}

export const GET = async ({ props }: { props: { slug: string } }) => {
	const page = pagesMap[props.slug];

	if (!page) {
		return new Response("Not Found", { status: 404 });
	}

	// Load fonts
	const fontRegular = readFileSync(
		"./node_modules/@fontsource/ia-writer-duo/files/ia-writer-duo-latin-400-normal.woff",
	);
	const fontBold = readFileSync(
		"./node_modules/@fontsource/ia-writer-duo/files/ia-writer-duo-latin-700-normal.woff",
	);
	const fontMonoRegular = readFileSync(
		"./node_modules/@fontsource/ia-writer-mono/files/ia-writer-mono-latin-400-normal.woff",
	);

	const width = 1200;
	const height = 630;

	// Replicate splash.astro layout using the TSX component
	const svg = await satori(
		React.createElement(OGImage, {
			title: page.title,
			description: page.description,
		}),
		{
			width,
			height,
			fonts: [
				{
					name: "iA Writer Duo",
					data: fontRegular,
					weight: 400,
					style: "normal",
				},
				{
					name: "iA Writer Duo",
					data: fontBold,
					weight: 700,
					style: "normal",
				},
				{
					name: "iA Writer Mono",
					data: fontMonoRegular,
					weight: 400,
					style: "normal",
				},
			],
		},
	);

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
