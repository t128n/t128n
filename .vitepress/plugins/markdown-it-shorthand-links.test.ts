import MarkdownIt from 'markdown-it';
import { describe, it, expect } from 'vitest';

import {
	markdownItShorthandLinksPlugin,
	type ShorthandLinksOptions,
} from './markdown-it-shorthand-links';

function createMarkdownIt(options: ShorthandLinksOptions = {}): MarkdownIt {
	return new MarkdownIt().use(markdownItShorthandLinksPlugin, options);
}

function render(markdown: string, options: ShorthandLinksOptions = {}): string {
	return createMarkdownIt(options).render(markdown);
}

describe('markdown-it-shorthand-links', () => {
	const defaultOptions: ShorthandLinksOptions = {
		shorthands: {
			github: {
				link: (value) => `https://github.com/${value}`,
				icon: 'i-simple-icons-github',
			},
			bluesky: {
				link: 'https://bsky.app/profile/{{value}}',
				icon: 'i-simple-icons-bluesky',
			},
			npm: {
				link: 'https://www.npmjs.com/package/{{value}}',
			},
		},
	};

	it('should parse simple shorthand', () => {
		const result = render('Check #github:vuejs/core', defaultOptions);
		expect(result).toContain('href="https://github.com/vuejs/core"');
		expect(result).toContain('class="inline-flex gap-1 items-center"');
		expect(result).toContain('<span class="i-simple-icons-github inline-block"></span>');
		expect(result).toContain('<span class="no-underline">vuejs/core</span>');
	});

	it('should handle template string replacement', () => {
		const result = render('Contact #bluesky:t128n.dev', defaultOptions);
		expect(result).toContain('href="https://bsky.app/profile/t128n.dev"');
		expect(result).toContain('<span class="i-simple-icons-bluesky inline-block"></span>');
		expect(result).toContain('<span class="no-underline">t128n.dev</span>');
	});

	it('should handle missing icon', () => {
		const result = render('#npm:vitepress', defaultOptions);
		expect(result).toContain('href="https://www.npmjs.com/package/vitepress"');
		expect(result).toContain('<span class="no-underline">vitepress</span>');
		expect(result).not.toContain('i-simple-icons');
	});

	it('should ignore unknown prefixes', () => {
		const result = render('#unknown:value', defaultOptions);
		expect(result).not.toContain('<a');
		expect(result).toContain('#unknown:value');
	});

	it('should handle complex paths', () => {
		const result = render('#github:user/repo/issues/123', defaultOptions);
		expect(result).toContain('href="https://github.com/user/repo/issues/123"');
	});

	it('should work inside other text', () => {
		const result = render('Start #github:a/b end', defaultOptions);
		expect(result).toContain('Start <a');
		expect(result).toContain('</a> end');
	});

	it('should validate correctly at start of string', () => {
		const result = render('#github:start', defaultOptions);
		expect(result).toContain('href="https://github.com/start"');
	});

	it('should not match if not preceded by space or start of line', () => {
		const result = render('email#github:repo', defaultOptions);
		expect(result).not.toContain('<a');
		expect(result).toContain('email#github:repo');
	});
});
