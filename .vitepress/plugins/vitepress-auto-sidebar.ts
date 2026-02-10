import { regex } from 'arkregex';
import { consola } from 'consola';
import { defu } from 'defu';
import fs from 'node:fs';
import { relative, resolve, sep } from 'pathe';
import { globSync } from 'tinyglobby';

export interface AutoSidebarOptions {
	/**
	 * The base directory where markdown files are located.
	 * @default 'docs'
	 */
	baseDir?: string;
	/**
	 * Glob pattern to match markdown files.
	 * @default '*.md'
	 */
	pattern?: string;
	/**
	 * Whether to ignore 'index.md' files.
	 * @default true
	 */
	ignoreIndex?: boolean;
}

/**
 * Automatically generates VitePress sidebar items based on markdown files in a directory.
 * Uses frontmatter title if available, otherwise falls back to the filename.
 *
 * @param dir The directory to scan, relative to baseDir.
 * @param _options Options for scanning and generating sidebar items.
 * @returns An array of VitePress sidebar items.
 */
export function autoSidebar(dir: string, _options: AutoSidebarOptions = {}) {
	const logger = consola.withTag('AutoSidebar');
	const options = defu(_options, {
		baseDir: 'docs',
		pattern: '*.md',
		ignoreIndex: true,
	});

	const scanDir = resolve(options.baseDir, dir);

	// Compile regex patterns once for performance
	const frontmatterPattern = regex('^---\\s*\n([\\s\\S]*?)\n---\\s*\n');
	const titlePattern = regex('^title:\\s*(.*)$', 'm');
	const quotePattern = regex('^[\'"](.*)[\'"]$');
	const mdExtPattern = regex('\\.md$');

	try {
		const files = globSync(options.pattern, {
			cwd: scanDir,
			onlyFiles: true,
			absolute: true,
		});

		const items = files
			.filter((file) => {
				if (
					options.ignoreIndex &&
					(file.endsWith('/index.md') ||
						file.endsWith('\\index.md') ||
						file.endsWith('/README.md') ||
						file.endsWith('\\README.md'))
				) {
					return false;
				}
				return true;
			})
			.map((file) => {
				const content = fs.readFileSync(file, 'utf-8');

				// Simple frontmatter title extraction
				const frontmatterMatch = frontmatterPattern.exec(content);
				let title = '';

				if (frontmatterMatch) {
					const frontmatter = frontmatterMatch[1];
					const titleMatch = titlePattern.exec(frontmatter);
					if (titleMatch) {
						title = titleMatch[1].trim().replace(quotePattern, '$1');
					}
				}

				const relPathFromBase = relative(resolve(options.baseDir), file);
				const link = '/' + relPathFromBase.replace(mdExtPattern, '').split(sep).join('/');

				if (!title) {
					const relPathFromScanDir = relative(scanDir, file);
					title = relPathFromScanDir.replace(mdExtPattern, '');
				}

				return {
					text: title,
					link,
				};
			});

		// Sort items by link in descending order (typical for blogs/dated posts)
		const sortedItems = items.sort((a, b) => b.link.localeCompare(a.link));

		logger.success(`Generated ${sortedItems.length} sidebar items for ${dir}`);
		return sortedItems;
	} catch (e) {
		logger.error(`Failed to generate sidebar for ${dir}:`, e);
		return [];
	}
}
