import type MarkdownIt from 'markdown-it';

import { consola } from 'consola';
import { defu } from 'defu';

/**
 * MarkdownEnv interface from VitePress
 * Contains frontmatter and other metadata
 */
interface MarkdownEnv {
	frontmatter?: Record<string, unknown>;
	content?: string;
	excerpt?: string;
	path?: string;
	relativePath?: string;
}

export interface FrontmatterTitleOptions {
	/**
	 * Whether to enable the plugin
	 * @default true
	 */
	enabled?: boolean;
}

export function markdownItFrontmatterTitlePlugin(
	md: MarkdownIt,
	_options: FrontmatterTitleOptions = {},
) {
	const logger = consola.withTag('FrontmatterTitle');

	const options = defu(_options, {
		enabled: true,
	});

	if (!options.enabled) {
		logger.info('Plugin disabled via options');
		return;
	}

	md.core.ruler.push('frontmatter_title', (state) => {
		// Access frontmatter from VitePress env
		const env = state.env as MarkdownEnv;
		const frontmatter = env.frontmatter;

		// Check if frontmatter exists and has a title
		if (!frontmatter || !frontmatter.title || typeof frontmatter.title !== 'string') {
			// Skip silently as per requirements
			return false;
		}

		// Check if prepend_title is explicitly disabled in frontmatter
		if (frontmatter.prepend_title === false) {
			logger.debug(
				`Skipping title injection: prepend_title is false in ${env.relativePath || 'unknown file'}`,
			);
			return false;
		}

		const title = frontmatter.title.trim();

		if (!title) {
			// Empty title, skip
			return false;
		}

		const tokens = state.tokens;

		// Check if the first heading is already an H1
		const firstHeading = tokens.find((t) => t.type === 'heading_open');
		if (firstHeading && firstHeading.tag === 'h1') {
			logger.debug(
				`Skipping title injection: H1 already exists in ${env.relativePath || 'unknown file'}`,
			);
			return false;
		}

		// Create tokens for the H1 heading
		const headingOpen = new state.Token('heading_open', 'h1', 1);
		headingOpen.markup = '#';
		headingOpen.map = [0, 0];

		const inline = new state.Token('inline', '', 0);
		inline.content = title;
		inline.map = [0, 0];
		inline.children = [
			Object.assign(new state.Token('text', '', 0), {
				content: title,
			}),
		];

		const headingClose = new state.Token('heading_close', 'h1', -1);
		headingClose.markup = '#';

		// Insert the heading tokens at the beginning of the document
		// This will prepend the title before any existing content
		tokens.unshift(headingOpen, inline, headingClose);

		logger.debug(`Injected title: "${title}" for ${env.relativePath || 'unknown file'}`);
		return true;
	});

	logger.success('Frontmatter title plugin initialized');
}
