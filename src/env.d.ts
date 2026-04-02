declare module "*.opml" {
	const value: {
		opml: {
			body: {
				outline: Array<{
					"@_text": string;
					"@_title": string;
					"@_description"?: string;
					"@_htmlUrl": string;
					"@_xmlUrl": string;
				}>;
			};
		};
	};

	export default value;
}
