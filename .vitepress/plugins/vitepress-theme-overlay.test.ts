import * as fs from 'node:fs';
import { resolve, join } from 'pathe';
import { globSync } from 'tinyglobby';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { vitepressThemeOverlay } from './vitepress-theme-overlay';

vi.mock('node:fs');
vi.mock('tinyglobby');
vi.mock('consola', () => ({
	consola: {
		withTag: vi.fn(() => ({
			debug: vi.fn(),
			warn: vi.fn(),
			success: vi.fn(),
		})),
	},
}));

describe('vitepressThemeOverlay', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return empty array if directory does not exist', () => {
		vi.mocked(fs.statSync).mockImplementation(() => {
			throw new Error('ENOENT');
		});

		const aliases = vitepressThemeOverlay('non-existent');
		expect(aliases).toEqual([]);
	});

	it('should generate aliases for .vue files in flat directory', () => {
		const testDir = 'test/components';
		const absTestDir = resolve(testDir);

		// Mock directory existence
		vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);

		// Mock globSync to return vue files
		vi.mocked(globSync).mockReturnValue([join(absTestDir, 'VPHome.vue')]);

		const aliases = vitepressThemeOverlay(testDir);

		expect(aliases).toHaveLength(1);
		expect(aliases[0].find).toBeInstanceOf(RegExp);
		const regex = aliases[0].find as RegExp;
		expect(regex.test('/path/to/VPHome.vue')).toBe(true);
		expect(aliases[0].replacement).toBe(join(absTestDir, 'VPHome.vue'));
	});

	it('should generate aliases for .vue files recursively', () => {
		const testDir = 'test/components';
		const absTestDir = resolve(testDir);
		const absSubDir = join(absTestDir, 'subdir');

		vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as any);

		// Mock globSync to return vue files in nested directories
		vi.mocked(globSync).mockReturnValue([
			join(absTestDir, 'RootComp.vue'),
			join(absSubDir, 'SubComp.vue'),
		]);

		const aliases = vitepressThemeOverlay(testDir);

		expect(aliases).toHaveLength(2);
		const rootComp = aliases.find((a) => (a.replacement as string).includes('RootComp.vue'));
		const subComp = aliases.find((a) => (a.replacement as string).includes('SubComp.vue'));

		expect(rootComp).toBeDefined();
		expect(subComp).toBeDefined();

		expect((rootComp!.find as RegExp).test('.../RootComp.vue')).toBe(true);
		expect((subComp!.find as RegExp).test('.../SubComp.vue')).toBe(true);
	});
});
