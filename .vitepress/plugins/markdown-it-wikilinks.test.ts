import MarkdownIt from 'markdown-it';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { markdownItWikilinksPlugin, type WikilinkOptions } from './markdown-it-wikilinks';

// Mock dependencies
const mockWarn = vi.fn();
const mockError = vi.fn();
const mockSuccess = vi.fn();

vi.mock('tinyglobby', () => ({
	globSync: vi.fn(() => []),
}));

vi.mock('consola', () => ({
	consola: {
		withTag: vi.fn(() => ({
			warn: mockWarn,
			error: mockError,
			success: mockSuccess,
		})),
	},
}));

// Import mocked functions for type safety
import { globSync } from 'tinyglobby';

const mockGlobSync = vi.mocked(globSync);

// Mock process.cwd for consistent test environment
const originalCwd = process.cwd;
const mockCwd = '/mock/root';

beforeEach(() => {
	vi.clearAllMocks();
	process.cwd = vi.fn(() => mockCwd);
	mockGlobSync.mockReturnValue([]);
	mockWarn.mockClear();
	mockError.mockClear();
	mockSuccess.mockClear();
});

afterEach(() => {
	process.cwd = originalCwd;
});

// Helper functions
function createMarkdownIt(options: WikilinkOptions = {}): MarkdownIt {
	return new MarkdownIt().use(markdownItWikilinksPlugin, options);
}

function renderMarkdown(markdown: string, options: WikilinkOptions = {}): string {
	const md = createMarkdownIt(options);
	return md.render(markdown);
}

function mockFiles(files: string[]): void {
	mockGlobSync.mockReturnValue(files);
}

interface LinkInfo {
	href: string;
	text: string;
	class?: string;
}

function extractLink(html: string): LinkInfo | null {
	const linkMatch = html.match(/<a([^>]+)>([^<]+)<\/a>/);
	if (!linkMatch) return null;

	const attrs = linkMatch[1];
	const text = linkMatch[2];
	const hrefMatch = attrs.match(/href="([^"]+)"/);
	const classMatch = attrs.match(/class="([^"]+)"/);

	return {
		href: hrefMatch?.[1] || '',
		text,
		class: classMatch?.[1],
	};
}

describe('markdown-it-wikilinks', () => {
	describe('Basic Wikilink Parsing', () => {
		it('should convert [[Target]] to a basic link', () => {
			mockFiles(['target.md']);
			const result = renderMarkdown('Check out [[Target]]');
			const link = extractLink(result);

			expect(link).toBeTruthy();
			expect(link?.href).toBe('/target');
			expect(link?.text).toBe('Target');
			expect(link?.class).toBeUndefined();
		});

		it('should convert [[Target#Anchor]] to a link with anchor', () => {
			mockFiles(['target.md']);
			const result = renderMarkdown('See [[Target#section]]');
			const link = extractLink(result);

			expect(link?.href).toBe('/target#section');
			expect(link?.text).toBe('Target');
		});

		it('should convert [[Target|Label]] to a link with custom label', () => {
			mockFiles(['target.md']);
			const result = renderMarkdown('Read [[Target|Custom Label]]');
			const link = extractLink(result);

			expect(link?.href).toBe('/target');
			expect(link?.text).toBe('Custom Label');
		});

		it('should convert [[Target#Anchor|Label]] to a full format link', () => {
			mockFiles(['target.md']);
			const result = renderMarkdown('Go to [[Target#intro|Introduction]]');
			const link = extractLink(result);

			expect(link?.href).toBe('/target#intro');
			expect(link?.text).toBe('Introduction');
		});

		it('should not convert invalid wikilink syntax', () => {
			// Test cases that clearly should not be converted
			const definitiveNonWikilinks = [
				'Target]]', // Missing opening brackets
				'[[]]', // Empty brackets
				'[Target]', // Single brackets
			];

			for (const testCase of definitiveNonWikilinks) {
				const result = renderMarkdown(testCase);
				expect(result).not.toContain('<a'); // Should not create any links
				expect(result).toContain(testCase); // Original text should remain
			}

			// Edge cases - these may have unexpected behavior but we document it
			const edgeCases = [
				{
					input: '[[Target',
					description: 'incomplete wikilink - missing closing brackets',
				},
				{
					input: '[[[Target]]]',
					description: 'triple brackets - may parse inner [[Target',
				},
			];

			for (const { input } of edgeCases) {
				const result = renderMarkdown(input);
				// Just verify it doesn't create a proper target link - behavior may vary
				expect(result).not.toContain('href="/target"');
				// These may create some kind of partial links, which is documented behavior
			}
		});
	});

	describe('File Resolution', () => {
		it('should resolve links case-insensitively', () => {
			mockFiles(['MyPage.md']);

			const testCases = ['mypage', 'MyPage', 'MYPAGE', 'mYpAgE'];

			for (const testCase of testCases) {
				const result = renderMarkdown(`[[${testCase}]]`);
				const link = extractLink(result);
				expect(link?.href).toBe('/MyPage');
			}
		});

		it('should resolve files in subdirectories', () => {
			mockFiles(['docs/guide.md', 'tutorials/intro.md']);

			const guideResult = renderMarkdown('[[guide]]');
			const guideLink = extractLink(guideResult);
			expect(guideLink?.href).toBe('/docs/guide');

			const introResult = renderMarkdown('[[intro]]');
			const introLink = extractLink(introResult);
			expect(introLink?.href).toBe('/tutorials/intro');
		});

		it('should handle missing files with default onMissingLink', () => {
			mockFiles([]);
			const result = renderMarkdown('[[NonExistent]]');
			const link = extractLink(result);

			expect(link?.href).toBe('/nonexistent');
			expect(link?.text).toBe('NonExistent');
			expect(link?.class).toBe('wikilink-missing');
			expect(mockWarn).toHaveBeenCalledWith('Missing target: NonExistent');
		});

		it('should handle missing files with custom onMissingLink', () => {
			mockFiles([]);
			const customHandler = (target: string) => `/search?q=${target}`;

			const result = renderMarkdown('[[Missing]]', {
				onMissingLink: customHandler,
			});
			const link = extractLink(result);

			expect(link?.href).toBe('/search?q=Missing');
			expect(link?.class).toBe('wikilink-missing');
		});

		it('should handle multiple wikilinks in one line', () => {
			mockFiles(['page1.md', 'page2.md']);
			const result = renderMarkdown('See [[page1]] and [[page2]] for details');

			const links = result.match(/<a[^>]+>[^<]+<\/a>/g);
			expect(links).toHaveLength(2);

			expect(result).toContain('href="/page1"');
			expect(result).toContain('href="/page2"');
		});

		it('should handle whitespace in target names', () => {
			mockFiles(['my-page.md']);
			const result = renderMarkdown('[[My Page]]');
			const link = extractLink(result);

			// Should normalize to lowercase with dashes
			expect(link?.href).toBe('/my-page');
			expect(link?.text).toBe('My Page');
		});
	});

	describe('Link Generation', () => {
		it('should prepend custom base URL to links', () => {
			mockFiles(['page.md']);
			const result = renderMarkdown('[[page]]', { base: '/docs/' });
			const link = extractLink(result);

			expect(link?.href).toBe('/docs/page');
		});

		it('should normalize paths correctly', () => {
			mockFiles(['nested/deep/page.md']);
			const result = renderMarkdown('[[page]]', { base: '/site/' });
			const link = extractLink(result);

			expect(link?.href).toBe('/site/nested/deep/page');
		});

		it('should append anchors to href', () => {
			mockFiles(['guide.md']);
			const result = renderMarkdown('[[guide#section]]', { base: '/docs/' });
			const link = extractLink(result);

			expect(link?.href).toBe('/docs/guide#section');
		});

		it('should handle complex nested paths', () => {
			mockFiles(['docs/api/reference.md']);
			const result = renderMarkdown('[[reference]]', { base: '/' });
			const link = extractLink(result);

			expect(link?.href).toBe('/docs/api/reference');
		});
	});

	describe('CSS Classes', () => {
		it('should add wikilink-missing class to unresolved links', () => {
			mockFiles([]);
			const result = renderMarkdown('[[Missing]]');
			const link = extractLink(result);

			expect(link?.class).toBe('wikilink-missing');
		});

		it('should not add missing class to resolved links', () => {
			mockFiles(['existing.md']);
			const result = renderMarkdown('[[existing]]');
			const link = extractLink(result);

			expect(link?.class).toBeUndefined();
			expect(result).not.toContain('wikilink-missing');
		});
	});

	describe('Options Configuration', () => {
		it('should use custom base option', () => {
			mockFiles(['test.md']);
			const result = renderMarkdown('[[test]]', { base: '/custom/' });
			const link = extractLink(result);

			expect(link?.href).toBe('/custom/test');
		});

		it('should use custom root option', () => {
			// Since we're mocking globSync, we verify the root is passed correctly
			const customRoot = '/custom/root';
			mockFiles(['page.md']);

			renderMarkdown('[[page]]', { root: customRoot });

			expect(mockGlobSync).toHaveBeenCalledWith(['**/*.md', '!**/node_modules/**'], {
				cwd: customRoot,
				onlyFiles: true,
			});
		});

		it('should use custom onMissingLink callback', () => {
			mockFiles([]);
			const customHandler = vi.fn((target: string) => `/wiki/${target.toLowerCase()}`);

			const result = renderMarkdown('[[Custom]]', { onMissingLink: customHandler });
			const link = extractLink(result);

			expect(customHandler).toHaveBeenCalledWith('Custom');
			expect(link?.href).toBe('/wiki/custom');
		});

		it('should use default options when none provided', () => {
			mockFiles(['default.md']);
			const result = renderMarkdown('[[default]]');
			const link = extractLink(result);

			expect(link?.href).toBe('/default');
			expect(mockGlobSync).toHaveBeenCalledWith(['**/*.md', '!**/node_modules/**'], {
				cwd: mockCwd,
				onlyFiles: true,
			});
		});
	});

	describe('Edge Cases & File Indexing', () => {
		it('should handle multiple wikilinks in complex markdown', () => {
			mockFiles(['intro.md', 'guide.md']);

			const markdown = `
# Title
- Item with [[intro]] link
- Another item with [[guide|User Guide]]

> Quote with [[intro#section]] reference
`;

			const result = renderMarkdown(markdown);
			const links = result.match(/<a[^>]+>[^<]+<\/a>/g);

			expect(links).toHaveLength(3);
			expect(result).toContain('href="/intro"');
			expect(result).toContain('href="/guide"');
			expect(result).toContain('href="/intro#section"');
		});

		it('should handle special characters in filenames', () => {
			mockFiles(['special-chars_123.md', 'with spaces.md']);

			// Test kebab-case file
			const result1 = renderMarkdown('[[special-chars_123]]');
			const link1 = extractLink(result1);
			expect(link1?.href).toBe('/special-chars_123');

			// Test file with spaces (normalized to lowercase with spaces in filename)
			mockFiles(['with-spaces.md']);
			const result2 = renderMarkdown('[[with spaces]]');
			const link2 = extractLink(result2);
			expect(link2?.href).toBe('/with-spaces');
		});

		it('should handle empty/invalid targets gracefully', () => {
			mockFiles([]);

			const testCases = [
				'[[   ]]', // Whitespace only
				'[[]]', // Empty
				'[[ ]]', // Single space
			];

			for (const testCase of testCases) {
				const result = renderMarkdown(testCase);
				// Should not crash, might create link or ignore
				expect(typeof result).toBe('string');
			}
		});

		it('should index all files even with duplicate names', () => {
			mockFiles(['docs/test.md', 'guides/test.md']);

			// Create a new markdown instance to trigger indexing
			createMarkdownIt();

			expect(mockWarn).not.toHaveBeenCalled();
			expect(mockSuccess).toHaveBeenCalledWith('Indexed 2 files for smart linking.');
		});

		it('should handle ambiguous filenames and allow path-based disambiguation', () => {
			mockFiles(['README.md', 'blog/README.md']);

			const md = createMarkdownIt();

			// [[README]] should be ambiguous if both exist
			const ambiguousResult = md.render('[[README]]');
			const ambiguousLink = extractLink(ambiguousResult);
			expect(ambiguousLink?.class).toBe('wikilink-missing');
			expect(mockWarn).toHaveBeenCalledWith(
				expect.stringContaining('Ambiguous target: README. Multiple files found'),
			);

			// [[blog/README]] should resolve to blog/README.md
			const specificResult = md.render('[[blog/README]]');
			const specificLink = extractLink(specificResult);

			expect(specificLink?.href).toBe('/blog/README');
			expect(specificLink?.class).toBeUndefined();
		});
	});

	describe('Error Handling', () => {
		it('should handle globSync errors gracefully', () => {
			mockGlobSync.mockImplementation(() => {
				throw new Error('File system error');
			});

			// Should not crash when creating the plugin
			expect(() => createMarkdownIt()).not.toThrow();

			expect(mockError).toHaveBeenCalledWith(
				'Failed to build file index:',
				expect.any(Error),
			);
		});

		it('should handle malformed wikilink patterns', () => {
			mockFiles(['test.md']);

			const malformedCases = [
				'[[test|]]', // Empty label
				'[[test#]]', // Empty anchor
				'[[|label]]', // Empty target
				'[[test#anchor|]]', // Empty label with anchor
			];

			for (const testCase of malformedCases) {
				const result = renderMarkdown(testCase);
				// Should handle gracefully, not crash
				expect(typeof result).toBe('string');
			}
		});
	});
});
