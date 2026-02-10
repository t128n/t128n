import type MarkdownIt from 'markdown-it';

import { regex } from 'arkregex';
import { consola } from 'consola';
import { defu } from 'defu';
import { readFileSync } from 'node:fs';
import { join, parse, normalize } from 'pathe';
import { globSync } from 'tinyglobby';

export interface WikilinkOptions {
	/**
	 * The root directory to scan for markdown files.
	 * @default process.cwd()
	 */
	root?: string;
	/**
	 * Base URL to prepend to links.
	 * @default '/'
	 */
	base?: string;
	/**
	 * Custom function to handle unresolved links.
	 */
	onMissingLink?: (target: string) => string;
}

/**
 * ArkRegex pattern for parsing Wikilinks.
 * Captures: target (required), anchor (optional), label (optional)
 * Format: [[Target#Anchor|Label]]
 */
const wikilinkPattern = regex(
	'^\\[\\[(?<target>[^|\\]#]+)(?:#(?<anchor>[^|\\]]+))?(?:\\|(?<label>[^|\\]]+))?\\]\\]',
);

export function markdownItWikilinksPlugin(md: MarkdownIt, _options: WikilinkOptions = {}) {
	const logger = consola.withTag('Wikilinks');

	const options = defu(_options, {
		root: process.cwd(),
		base: '/',
		onMissingLink: (target: string) =>
			`${options.base}${target.replace(/\s+/g, '-').toLowerCase()}`,
	});

	const fileIndex = new Map<string, Array<{ path: string; title?: string }>>();

	try {
		const files = globSync(['**/*.md', '!**/node_modules/**'], {
			cwd: options.root,
			onlyFiles: true,
		});

		for (const file of files) {
			const parsed = parse(file);
			const fileName = parsed.name.toLowerCase();
			const cleanPath = join(parsed.dir, parsed.name);
			const fullPath = cleanPath.toLowerCase();

			let title: string | undefined;

			try {
				const absolutePath = join(options.root, file);
				const content = readFileSync(absolutePath, 'utf-8');
				const fmMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
				if (fmMatch) {
					const titleMatch = fmMatch[1].match(/^title:\s*(.+)$/m);
					if (titleMatch) {
						title = titleMatch[1].trim();
						if (
							(title.startsWith('"') && title.endsWith('"')) ||
							(title.startsWith("'") && title.endsWith("'"))
						) {
							title = title.slice(1, -1);
						}
					}
				}
			} catch {
				// Ignore read errors
			}

			const entry = { path: cleanPath, title };

			// Index by filename
			if (!fileIndex.has(fileName)) fileIndex.set(fileName, []);
			fileIndex.get(fileName)!.push(entry);

			// Index by full relative path if different from filename
			if (fullPath !== fileName) {
				if (!fileIndex.has(fullPath)) fileIndex.set(fullPath, []);
				fileIndex.get(fullPath)!.push(entry);
			}
		}
		logger.success(`Indexed ${files.length} files for smart linking.`);
	} catch (e) {
		logger.error('Failed to build file index:', e);
	}

	md.inline.ruler.push('wikilink', (state, silent) => {
		const start = state.pos;
		const max = state.posMax;

		if (state.src.charCodeAt(start) !== 0x5b || state.src.charCodeAt(start + 1) !== 0x5b) {
			return false;
		}

		let labelEnd = -1;
		for (let i = start + 2; i < max - 1; i++) {
			if (state.src.charCodeAt(i) === 0x5d && state.src.charCodeAt(i + 1) === 0x5d) {
				labelEnd = i;
				break;
			}
		}

		if (labelEnd < 0) return false;

		const content = state.src.slice(start, labelEnd + 2);
		const match = wikilinkPattern.exec(content);

		if (!match) return false;

		if (!silent) {
			const { target, anchor, label } = match.groups;
			const searchKey = target.trim().toLowerCase().replace(/\\/g, '/');
			const entries = fileIndex.get(searchKey);

			let href: string;
			let linkedTitle: string | undefined;
			let isMissing = false;

			if (entries && entries.length === 1) {
				const indexEntry = entries[0];
				href = normalize(join(options.base, indexEntry.path));
				linkedTitle = indexEntry.title;
			} else if (entries && entries.length > 1) {
				href = options.onMissingLink(target);
				isMissing = true;
				logger.warn(
					`Ambiguous target: ${target}. Multiple files found: ${entries
						.map((e) => e.path)
						.join(', ')}. Please use a more specific path.`,
				);
			} else {
				href = options.onMissingLink(target);
				isMissing = true;
				logger.warn(`Missing target: ${target}`);
			}

			if (anchor) href += `#${anchor}`;

			const tokenOpen = state.push('link_open', 'a', 1);
			tokenOpen.attrs = [['href', href]];
			if (isMissing) tokenOpen.attrs.push(['class', 'wikilink-missing']);

			const tokenText = state.push('text', '', 0);
			tokenText.content = label || linkedTitle || target;

			state.push('link_close', 'a', -1);
		}

		state.pos = labelEnd + 2;
		return true;
	});
}
