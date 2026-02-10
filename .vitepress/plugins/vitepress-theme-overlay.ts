import type { Alias } from 'vite';

import { regex } from 'arkregex';
import { consola } from 'consola';
import { statSync } from 'node:fs';
import { parse, resolve } from 'pathe';
import { globSync } from 'tinyglobby';

const logger = consola.withTag('vitepress-theme-overlay');

/**
 * Automatically creates Vite aliases to override default VitePress theme components
 * with custom components found in the specified directory.
 *
 * @param componentsDir - The path to the directory containing custom components relative to project root or absolute.
 * @returns An array of Vite Alias objects.
 */
export function vitepressThemeOverlay(componentsDir: string): Alias[] {
	const aliases: Alias[] = [];
	const absoluteComponentsDir = resolve(componentsDir);

	try {
		const stats = statSync(absoluteComponentsDir);
		if (!stats.isDirectory()) {
			logger.warn(`Directory not found or is not a directory: ${absoluteComponentsDir}`);
			return [];
		}
	} catch {
		logger.debug(`Could not access directory: ${absoluteComponentsDir}`);
		return [];
	}

	// Use tinyglobby to find all .vue files recursively
	const vueFiles = globSync('**/*.vue', {
		cwd: absoluteComponentsDir,
		onlyFiles: true,
		absolute: true,
	});

	for (const fullPath of vueFiles) {
		const file = parse(fullPath).base;
		// Create alias to override internal component
		// Matches any import ending with the filename (e.g. /VPHome.vue)
		aliases.push({
			find: regex(`^.*/${file}$`),
			replacement: fullPath,
		});
		logger.debug(`Registered overlay: ${file} -> ${fullPath}`);
	}

	if (aliases.length > 0) {
		logger.success(`Applied ${aliases.length} theme component overlays from ${componentsDir}`);
	}

	return aliases;
}
