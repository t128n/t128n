import MarkdownIt from 'markdown-it';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
	markdownItFrontmatterTitlePlugin,
	type FrontmatterTitleOptions,
} from './markdown-it-frontmatter-title';

// Mock dependencies
const mockDebug = vi.fn();
const mockInfo = vi.fn();
const mockSuccess = vi.fn();

vi.mock('consola', () => ({
	consola: {
		withTag: vi.fn(() => ({
			debug: mockDebug,
			info: mockInfo,
			success: mockSuccess,
		})),
	},
}));

/**
 * MarkdownEnv interface from VitePress
 */
interface MarkdownEnv {
	frontmatter?: Record<string, unknown>;
	content?: string;
	excerpt?: string;
	path?: string;
	relativePath?: string;
}

beforeEach(() => {
	vi.clearAllMocks();
	mockDebug.mockClear();
	mockInfo.mockClear();
	mockSuccess.mockClear();
});

// Helper functions
function createMarkdownIt(options: FrontmatterTitleOptions = {}): MarkdownIt {
	return new MarkdownIt().use(markdownItFrontmatterTitlePlugin, options);
}

function renderMarkdown(
	markdown: string,
	env: MarkdownEnv = {},
	options: FrontmatterTitleOptions = {},
): string {
	const md = createMarkdownIt(options);
	return md.render(markdown, env);
}

function createEnv(frontmatter?: Record<string, unknown>): MarkdownEnv {
	return {
		frontmatter,
		relativePath: 'test.md',
	};
}

function extractH1s(html: string): string[] {
	const h1Matches = html.match(/<h1[^>]*>(.*?)<\/h1>/g);
	if (!h1Matches) return [];

	return h1Matches.map((match) => {
		const contentMatch = match.match(/<h1[^>]*>(.*?)<\/h1>/);
		const content = contentMatch ? contentMatch[1].trim() : '';
		// Decode common HTML entities
		return content
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'");
	});
}

function extractFirstH1(html: string): string | null {
	const h1s = extractH1s(html);
	return h1s.length > 0 ? h1s[0] : null;
}

describe('markdown-it-frontmatter-title', () => {
	describe('Basic Title Injection', () => {
		it('should inject title from frontmatter as H1', () => {
			const markdown = 'Some content here';
			const env = createEnv({ title: 'Test Title' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Test Title');
		});

		it('should prepend title before existing content', () => {
			const markdown = 'First paragraph\n\nSecond paragraph';
			const env = createEnv({ title: 'My Title' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('My Title');
			expect(result).toContain('<h1>My Title</h1>');
			expect(result).toContain('First paragraph');
			expect(result).toContain('Second paragraph');

			// Verify title comes before content
			const h1Index = result.indexOf('<h1>My Title</h1>');
			const contentIndex = result.indexOf('First paragraph');
			expect(h1Index).toBeLessThan(contentIndex);
		});

		it('should trim whitespace from titles', () => {
			const testCases = [
				{ input: '  Test Title  ', expected: 'Test Title' },
				{ input: '\tTabbed Title\t', expected: 'Tabbed Title' },
				{ input: '\nNewline Title\n', expected: 'Newline Title' },
				{ input: '   Multiple   Spaces   ', expected: 'Multiple   Spaces' },
			];

			for (const { input, expected } of testCases) {
				const env = createEnv({ title: input });
				const result = renderMarkdown('content', env);
				const h1 = extractFirstH1(result);
				expect(h1).toBe(expected);
			}
		});

		it('should handle title with special characters', () => {
			const specialTitles = [
				'Title & Subtitle',
				'Question?',
				'Title: Subtitle',
				'Title (with parentheses)',
				'Title - with dashes',
				'Title / with slashes',
				'Title @ 2026',
			];

			for (const title of specialTitles) {
				const env = createEnv({ title });
				const result = renderMarkdown('content', env);
				const h1 = extractFirstH1(result);
				expect(h1).toBe(title);
			}
		});

		it('should handle title with unicode characters', () => {
			const unicodeTitles = [
				'日本語タイトル',
				'Título en Español',
				'Заголовок',
				'🚀 Emoji Title 🎉',
				'Café & Thé',
			];

			for (const title of unicodeTitles) {
				const env = createEnv({ title });
				const result = renderMarkdown('content', env);
				const h1 = extractFirstH1(result);
				expect(h1).toBe(title);
			}
		});
	});

	describe('Frontmatter Handling', () => {
		it('should skip files without frontmatter', () => {
			const markdown = '# Existing Header\n\nContent';
			const env = {}; // No frontmatter
			const result = renderMarkdown(markdown, env);

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(1);
			expect(h1s[0]).toBe('Existing Header');
		});

		it('should skip files without title field', () => {
			const markdown = '# Existing Header\n\nContent';
			const env = createEnv({ description: 'No title here' });
			const result = renderMarkdown(markdown, env);

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(1);
			expect(h1s[0]).toBe('Existing Header');
		});

		it('should skip files with empty title', () => {
			const markdown = '# Existing Header';
			const env = createEnv({ title: '' });
			const result = renderMarkdown(markdown, env);

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(1);
			expect(h1s[0]).toBe('Existing Header');
		});

		it('should skip files with whitespace-only title', () => {
			const whitespaceTitles = ['   ', '\t\t', '\n\n', '  \t  \n  '];

			for (const title of whitespaceTitles) {
				const markdown = '# Existing Header';
				const env = createEnv({ title });
				const result = renderMarkdown(markdown, env);

				const h1s = extractH1s(result);
				expect(h1s).toHaveLength(1);
				expect(h1s[0]).toBe('Existing Header');
			}
		});

		it('should skip files with null or undefined title', () => {
			const invalidTitles = [null, undefined];

			for (const title of invalidTitles) {
				const markdown = 'Content';
				const env = createEnv({ title: title as unknown as string });
				const result = renderMarkdown(markdown, env);

				const h1s = extractH1s(result);
				expect(h1s).toHaveLength(0);
			}
		});

		it('should skip injection if prepend_title is explicitly false', () => {
			const markdown = 'Content';
			const env = createEnv({ title: 'Test', prepend_title: false });
			const result = renderMarkdown(markdown, env);

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(0);
		});

		it('should inject if prepend_title is true', () => {
			const markdown = 'Content';
			const env = createEnv({ title: 'Test', prepend_title: true });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Test');
		});

		it('should inject if prepend_title is missing (default)', () => {
			const markdown = 'Content';
			const env = createEnv({ title: 'Test' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Test');
		});

		it('should skip files with non-string title', () => {
			const nonStringTitles = [123, true, false, { text: 'Title' }, ['Title'], () => 'Title'];

			for (const title of nonStringTitles) {
				const markdown = 'Content';
				const env = createEnv({ title: title as unknown as string });
				const result = renderMarkdown(markdown, env);

				const h1s = extractH1s(result);
				expect(h1s).toHaveLength(0);
			}
		});
	});

	describe('Multiple Headers', () => {
		it('should skip title injection if an H1 header already exists', () => {
			const markdown = '# Existing H1\n\nContent';
			const env = createEnv({ title: 'Frontmatter Title' });
			const result = renderMarkdown(markdown, env);

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(1);
			expect(h1s[0]).toBe('Existing H1');
			expect(result).not.toContain('Frontmatter Title');
		});

		it('should prepend title before H2/H3 headers if no H1 exists', () => {
			const markdown = '## H2 Header\n\n### H3 Header\n\nContent';
			const env = createEnv({ title: 'Main Title' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Main Title');
			expect(result).toContain('<h2>H2 Header</h2>');
			expect(result).toContain('<h3>H3 Header</h3>');

			// Verify order: H1 comes before H2
			const h1Index = result.indexOf('<h1>Main Title</h1>');
			const h2Index = result.indexOf('<h2>H2 Header</h2>');
			expect(h1Index).toBeLessThan(h2Index);
		});

		it('should skip title injection if any H1 exists as the first heading', () => {
			const markdown = '# First\n\n## Second\n\n# Third\n\n### Fourth';
			const env = createEnv({ title: 'Prepended Title' });
			const result = renderMarkdown(markdown, env);

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(2);
			expect(h1s[0]).toBe('First');
			expect(h1s[1]).toBe('Third');
			expect(result).not.toContain('Prepended Title');
		});

		it('should work with multiple existing H1 headers (skipping injection)', () => {
			const markdown = '# Header 1\n\n# Header 2\n\n# Header 3';
			const env = createEnv({ title: 'Title' });
			const result = renderMarkdown(markdown, env);

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(3);
			expect(h1s[0]).toBe('Header 1');
			expect(h1s[1]).toBe('Header 2');
			expect(h1s[2]).toBe('Header 3');
			expect(result).not.toContain('<h1>Title</h1>');
		});
	});

	describe('Options Configuration', () => {
		it('should respect enabled: false option', () => {
			const markdown = 'Content';
			const env = createEnv({ title: 'Should Not Appear' });
			const result = renderMarkdown(markdown, env, { enabled: false });

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(0);
		});

		it('should work with enabled: true explicitly', () => {
			const markdown = 'Content';
			const env = createEnv({ title: 'Should Appear' });
			const result = renderMarkdown(markdown, env, { enabled: true });

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Should Appear');
		});

		it('should use default options when none provided', () => {
			const markdown = 'Content';
			const env = createEnv({ title: 'Default Options' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Default Options');
		});
	});

	describe('Integration with VitePress env', () => {
		it('should access frontmatter from env object', () => {
			const markdown = 'Content';
			const env: MarkdownEnv = {
				frontmatter: { title: 'From Env' },
				relativePath: 'test.md',
			};
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('From Env');
		});

		it('should handle env without frontmatter property', () => {
			const markdown = 'Content';
			const env: MarkdownEnv = {
				relativePath: 'test.md',
			};
			const result = renderMarkdown(markdown, env);

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(0);
		});

		it('should handle empty env object', () => {
			const markdown = 'Content';
			const env: MarkdownEnv = {};
			const result = renderMarkdown(markdown, env);

			const h1s = extractH1s(result);
			expect(h1s).toHaveLength(0);
		});

		it('should preserve other env properties', () => {
			const markdown = 'Content';
			const env: MarkdownEnv = {
				frontmatter: { title: 'Test', description: 'Desc' },
				relativePath: 'path/to/file.md',
				content: 'Raw content',
			};
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Test');
			// Verify env still has other properties (not modified)
			expect(env.relativePath).toBe('path/to/file.md');
			expect(env.content).toBe('Raw content');
		});

		it('should handle frontmatter with multiple fields', () => {
			const markdown = 'Content';
			const env = createEnv({
				title: 'Main Title',
				description: 'Description',
				author: 'Author',
				date: '2026-02-06',
			});
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Main Title');
		});
	});

	describe('Edge Cases', () => {
		it('should handle very long titles', () => {
			const longTitle = 'A'.repeat(500);
			const markdown = 'Content';
			const env = createEnv({ title: longTitle });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe(longTitle);
		});

		it('should handle titles with HTML entities', () => {
			const markdown = 'Content';
			const env = createEnv({ title: 'Title with <html> & entities' });
			const result = renderMarkdown(markdown, env);

			// The title should be properly escaped in HTML
			expect(result).toContain('<h1>Title with &lt;html&gt; &amp; entities</h1>');
		});

		it('should handle empty markdown content', () => {
			const markdown = '';
			const env = createEnv({ title: 'Title Only' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Title Only');
		});

		it('should not crash with malformed env', () => {
			const markdown = 'Content';
			const malformedEnvs = [null, undefined, 'string', 123, []] as unknown as MarkdownEnv[];

			for (const env of malformedEnvs) {
				expect(() => renderMarkdown(markdown, env)).not.toThrow();
			}
		});

		it('should handle titles with quotes', () => {
			const quoteTitles = [
				'Title with "double quotes"',
				"Title with 'single quotes'",
				'Title with `backticks`',
				'Title with "mixed" \'quotes\'',
			];

			for (const title of quoteTitles) {
				const env = createEnv({ title });
				const result = renderMarkdown('content', env);
				const h1 = extractFirstH1(result);
				expect(h1).toBeTruthy();
				expect(result).toContain('<h1>');
			}
		});

		it('should handle titles with markdown syntax', () => {
			const markdownTitles = [
				'Title with **bold**',
				'Title with *italic*',
				'Title with [link](url)',
				'Title with `code`',
				'Title with ~~strikethrough~~',
			];

			for (const title of markdownTitles) {
				const env = createEnv({ title });
				const result = renderMarkdown('content', env);
				// Title should be rendered as plain text, not parsed as markdown
				const h1 = extractFirstH1(result);
				expect(h1).toBe(title);
			}
		});
	});

	describe('Complex Markdown', () => {
		it('should work with markdown containing lists', () => {
			const markdown = `
- Item 1
- Item 2
- Item 3
`;
			const env = createEnv({ title: 'List Title' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('List Title');
			expect(result).toContain('<li>Item 1</li>');
			expect(result).toContain('<li>Item 2</li>');
		});

		it('should work with markdown containing code blocks', () => {
			const markdown = `
\`\`\`javascript
console.log('Hello');
\`\`\`
`;
			const env = createEnv({ title: 'Code Example' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Code Example');
			expect(result).toContain('console.log');
			expect(result).toContain('<pre>');
		});

		it('should work with markdown containing tables', () => {
			const markdown = `
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
`;
			const env = createEnv({ title: 'Table Title' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Table Title');
			expect(result).toContain('<table>');
		});

		it('should work with markdown containing blockquotes', () => {
			const markdown = `
> This is a quote
> with multiple lines
`;
			const env = createEnv({ title: 'Quote Title' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Quote Title');
			expect(result).toContain('<blockquote>');
		});

		it('should work with markdown containing inline code', () => {
			const markdown = 'Use the `function()` to call it.';
			const env = createEnv({ title: 'Inline Code Title' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Inline Code Title');
			expect(result).toContain('<code>function()</code>');
		});

		it('should work with complex nested markdown', () => {
			const markdown = `
## Section 1

Some text with **bold** and *italic*.

- List item 1
  - Nested item
- List item 2

\`\`\`js
const x = 1;
\`\`\`

> Quote

### Subsection

More content.
`;
			const env = createEnv({ title: 'Complex Document' });
			const result = renderMarkdown(markdown, env);

			const h1 = extractFirstH1(result);
			expect(h1).toBe('Complex Document');
			expect(result).toContain('<h2>Section 1</h2>');
			expect(result).toContain('<h3>Subsection</h3>');
			expect(result).toContain('<strong>bold</strong>');
			expect(result).toContain('<blockquote>');
		});
	});

	describe('Initialization', () => {
		it('should initialize plugin successfully', () => {
			createMarkdownIt();
			expect(mockSuccess).toHaveBeenCalledWith('Frontmatter title plugin initialized');
		});

		it('should log info when plugin is disabled', () => {
			createMarkdownIt({ enabled: false });
			expect(mockInfo).toHaveBeenCalledWith('Plugin disabled via options');
		});

		it('should not throw when creating multiple instances', () => {
			expect(() => {
				createMarkdownIt();
				createMarkdownIt();
				createMarkdownIt();
			}).not.toThrow();
		});
	});
});
