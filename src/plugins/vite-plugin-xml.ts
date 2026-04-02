import { XMLParser } from "fast-xml-parser";

interface XmlPluginOptions {
	/** Defaults to ['xml', 'opml'] */
	extensions?: string[];
	/** Passed directly to fast-xml-parser */
	parserOptions?: ConstructorParameters<typeof XMLParser>[0];
}

export function xmlPlugin(options: XmlPluginOptions = {}) {
	const { extensions = ["xml", "opml"], parserOptions = {} } = options;

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_",
		...parserOptions,
	});

	const extensionPattern = new RegExp(`\\.(${extensions.join("|")})$`);

	return {
		name: "vite-plugin-xml",
		transform(code: string, id: string) {
			if (!extensionPattern.test(id)) return null;

			const parsed = parser.parse(code);
			return `export default ${JSON.stringify(parsed)}`;
		},
	};
}
