import type MarkdownIt from 'markdown-it';

import { regex } from 'arkregex';
import { consola } from 'consola';
import { defu } from 'defu';

export interface ShorthandDefinition {
	/**
	 * The URL template. Use `{{value}}` as a placeholder for the captured value,
	 * or provide a function that takes the value and returns the URL.
	 */
	link: string | ((value: string) => string);
	/**
	 * Optional HTML/SVG icon to display before the link text.
	 */
	icon?: string;
}

export interface ShorthandLinksOptions {
	/**
	 * Dictionary of prefixes to shorthand definitions.
	 * Example: { github: { link: 'https://github.com/{{value}}' } }
	 */
	shorthands?: Record<string, ShorthandDefinition>;
}

export function markdownItShorthandLinksPlugin(
	md: MarkdownIt,
	_options: ShorthandLinksOptions = {},
) {
	const logger = consola.withTag('ShorthandLinks');
	const options = defu(_options, { shorthands: {} });

	// Convert options.shorthands to a plain object if it's not already
	// (defu handles this mostly, but good to be safe)
	const shorthands = options.shorthands || {};

	if (Object.keys(shorthands).length === 0) {
		logger.debug('No shorthands configured, plugin will be inactive.');
		return;
	}

	// Compile regex patterns once for performance
	// Pattern explanation:
	// ^#              - Starts with #
	// (?<prefix>[a-zA-Z0-9_-]+) - Capture group for prefix (alphanumeric, -, _)
	// :               - Separator
	// (?<value>[^\s\t\n]+) - Capture group for value (anything except whitespace)
	const shorthandPattern = regex('^#(?<prefix>[a-zA-Z0-9_-]+):(?<value>[^\\s\\t\\n]+)');
	const templatePattern = regex('\\{\\{value}}', 'g');

	// Register rule
	md.inline.ruler.push('shorthand_link', (state, silent) => {
		const start = state.pos;

		// Fast check: current char must be '#'
		if (state.src.charCodeAt(start) !== 0x23 /* # */) {
			return false;
		}

		// Check if previous character allows us to start a token here
		// Standard markdown rules usually require whitespace or start of line
		if (start > 0) {
			const prevChar = state.src.charCodeAt(start - 1);
			// 0x20 = space, 0x09 = tab, 0x0A = newline
			// Also allow punctuation marks? Let's stick to whitespace for now to be safe
			// This prevents matching in 'email#github:repo'
			if (prevChar !== 0x20 && prevChar !== 0x09 && prevChar !== 0x0a) {
				return false;
			}
		}

		// Try to match standard shorthand pattern: #prefix:value
		// Value continues until whitespace
		const content = state.src.slice(start);

		const match = shorthandPattern.exec(content);

		if (!match || !match.groups) {
			return false;
		}

		const { prefix, value } = match.groups;
		const config = shorthands[prefix];

		if (!config) {
			// Not a configured shorthand, skip and let other rules handle it (or render as text)
			return false;
		}

		// If we are in silent mode (validation only), we return true and advance pos
		if (silent) {
			state.pos += match[0].length;
			return true;
		}

		// Generate the link URL
		let href: string;
		if (typeof config.link === 'function') {
			href = config.link(value);
		} else {
			// Simple string replacement
			href = config.link.replace(templatePattern, value);
		}

		// 1. Open link
		const tokenOpen = state.push('link_open', 'a', 1);
		tokenOpen.attrs = [
			['href', href],
			['target', '_blank'],
			['rel', 'noopener noreferrer'],
			['class', `inline-flex gap-1 items-center`],
		];

		// 2. Insert icon if configured
		if (config.icon) {
			const iconToken = state.push('html_inline', '', 0);
			iconToken.content = `<span class="${config.icon} inline-block"></span>`;
		}

		// 3. Link text (the value part)
		state.push('span_open', 'span', 1).attrs = [['class', 'no-underline']];
		const textToken = state.push('text', '', 0);
		textToken.content = value;
		state.push('span_close', 'span', -1);

		// 4. Close link
		state.push('link_close', 'a', -1);

		// Advance state position past the matched string
		state.pos += match[0].length;

		return true;
	});

	logger.success(`Initialized with ${Object.keys(shorthands).length} shorthands.`);
}
