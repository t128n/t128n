import fs from 'node:fs';
import { resolve, join } from 'pathe';
import { globSync } from 'tinyglobby';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { autoSidebar } from './vitepress-auto-sidebar';

vi.mock('node:fs');
vi.mock('tinyglobby');

const mockSuccess = vi.fn();
const mockError = vi.fn();

vi.mock('consola', () => ({
	consola: {
		withTag: vi.fn(() => ({
			success: mockSuccess,
			error: mockError,
		})),
	},
}));

describe('vitepress-auto-sidebar', () => {
	const mockBaseDir = resolve('docs');

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should generate sidebar items from markdown files', () => {
		const mockFiles = [
			join(mockBaseDir, 'blog/2026-02-06.md'),
			join(mockBaseDir, 'blog/2026-02-05.md'),
		];

		vi.mocked(globSync).mockReturnValue(mockFiles);
		vi.mocked(fs.readFileSync).mockImplementation((path) => {
			if (path.toString().includes('2026-02-06.md')) {
				return '---\ntitle: Feb 6th Post\n---\nContent';
			}
			return '---\ntitle: Feb 5th Post\n---\nContent';
		});

		const result = autoSidebar('blog');

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({ text: 'Feb 6th Post', link: '/blog/2026-02-06' });
		expect(result[1]).toEqual({ text: 'Feb 5th Post', link: '/blog/2026-02-05' });
		expect(mockSuccess).toHaveBeenCalled();
	});

	it('should use filename as title if frontmatter title is missing', () => {
		const mockFiles = [join(mockBaseDir, 'blog/no-title.md')];

		vi.mocked(globSync).mockReturnValue(mockFiles);
		vi.mocked(fs.readFileSync).mockReturnValue('No frontmatter here');

		const result = autoSidebar('blog');

		expect(result[0]).toEqual({ text: 'no-title', link: '/blog/no-title' });
	});

	it('should ignore index.md by default', () => {
		const mockFiles = [
			join(mockBaseDir, 'blog/2026-02-06.md'),
			join(mockBaseDir, 'blog/index.md'),
		];

		vi.mocked(globSync).mockReturnValue(mockFiles);
		vi.mocked(fs.readFileSync).mockReturnValue('---\ntitle: Post\n---\n');

		const result = autoSidebar('blog');

		expect(result).toHaveLength(1);
		expect(result[0].link).toBe('/blog/2026-02-06');
	});

	it('should not ignore index.md if ignoreIndex is false', () => {
		const mockFiles = [join(mockBaseDir, 'blog/index.md')];

		vi.mocked(globSync).mockReturnValue(mockFiles);
		vi.mocked(fs.readFileSync).mockReturnValue('---\ntitle: Blog Index\n---\n');

		const result = autoSidebar('blog', { ignoreIndex: false });

		expect(result).toHaveLength(1);
		expect(result[0].link).toBe('/blog/index');
	});

	it('should sort items by link in descending order', () => {
		const mockFiles = [
			join(mockBaseDir, 'blog/a.md'),
			join(mockBaseDir, 'blog/c.md'),
			join(mockBaseDir, 'blog/b.md'),
		];

		vi.mocked(globSync).mockReturnValue(mockFiles);
		vi.mocked(fs.readFileSync).mockReturnValue('');

		const result = autoSidebar('blog');

		expect(result.map((i) => i.link)).toEqual(['/blog/c', '/blog/b', '/blog/a']);
	});

	it('should handle missing directory or errors gracefully', () => {
		vi.mocked(globSync).mockImplementation(() => {
			throw new Error('Dir not found');
		});

		const result = autoSidebar('non-existent');

		expect(result).toEqual([]);
		expect(mockError).toHaveBeenCalled();
	});

	it('should handle different baseDir', () => {
		const customBase = resolve('src');
		const mockFiles = [join(customBase, 'notes/note1.md')];

		vi.mocked(globSync).mockReturnValue(mockFiles);
		vi.mocked(fs.readFileSync).mockReturnValue('---\ntitle: Note 1\n---\n');

		const result = autoSidebar('notes', { baseDir: 'src' });

		expect(result[0]).toEqual({ text: 'Note 1', link: '/notes/note1' });
	});

	it('should handle nested paths correctly', () => {
		const mockFiles = [join(mockBaseDir, 'blog/2026/tech/post.md')];

		vi.mocked(globSync).mockReturnValue(mockFiles);
		vi.mocked(fs.readFileSync).mockReturnValue('---\ntitle: Tech Post\n---\n');

		const result = autoSidebar('blog/2026/tech');

		expect(result[0]).toEqual({ text: 'Tech Post', link: '/blog/2026/tech/post' });
	});
});
