import fs from 'node:fs';
import { globSync } from 'tinyglobby';
import { defineConfig, presetWind4, presetIcons } from 'unocss';

export default defineConfig({
	presets: [presetWind4(), presetIcons()],
	content: {
		filesystem: ['**/*.ts', '**/*.md', '**/*.vue'],
		inline: globSync([
			'.vitepress/config.ts',
			'.vitepress/plugins/**/*.ts',
			'.vitepress/theme/**/*.ts',
		])
			.filter((file) => !file.endsWith('.test.ts'))
			.map((file) => fs.readFileSync(file, 'utf-8')),
	},
	theme: {
		colors: {
			// Solid colors
			'vp-white': 'var(--vp-c-white)',
			'vp-black': 'var(--vp-c-black)',
			'vp-neutral': 'var(--vp-c-neutral)',
			'vp-neutral-inverse': 'var(--vp-c-neutral-inverse)',

			// Palette: Gray
			'vp-gray-1': 'var(--vp-c-gray-1)',
			'vp-gray-2': 'var(--vp-c-gray-2)',
			'vp-gray-3': 'var(--vp-c-gray-3)',
			'vp-gray-soft': 'var(--vp-c-gray-soft)',

			// Palette: Indigo
			'vp-indigo-1': 'var(--vp-c-indigo-1)',
			'vp-indigo-2': 'var(--vp-c-indigo-2)',
			'vp-indigo-3': 'var(--vp-c-indigo-3)',
			'vp-indigo-soft': 'var(--vp-c-indigo-soft)',

			// Palette: Purple
			'vp-purple-1': 'var(--vp-c-purple-1)',
			'vp-purple-2': 'var(--vp-c-purple-2)',
			'vp-purple-3': 'var(--vp-c-purple-3)',
			'vp-purple-soft': 'var(--vp-c-purple-soft)',

			// Palette: Green
			'vp-green-1': 'var(--vp-c-green-1)',
			'vp-green-2': 'var(--vp-c-green-2)',
			'vp-green-3': 'var(--vp-c-green-3)',
			'vp-green-soft': 'var(--vp-c-green-soft)',

			// Palette: Yellow
			'vp-yellow-1': 'var(--vp-c-yellow-1)',
			'vp-yellow-2': 'var(--vp-c-yellow-2)',
			'vp-yellow-3': 'var(--vp-c-yellow-3)',
			'vp-yellow-soft': 'var(--vp-c-yellow-soft)',

			// Palette: Red
			'vp-red-1': 'var(--vp-c-red-1)',
			'vp-red-2': 'var(--vp-c-red-2)',
			'vp-red-3': 'var(--vp-c-red-3)',
			'vp-red-soft': 'var(--vp-c-red-soft)',

			// Palette: Sage (Brand)
			'vp-sage-1': 'var(--vp-c-sage-1)',
			'vp-sage-2': 'var(--vp-c-sage-2)',
			'vp-sage-3': 'var(--vp-c-sage-3)',
			'vp-sage-soft': 'var(--vp-c-sage-soft)',

			// Sponsor
			'vp-sponsor': 'var(--vp-c-sponsor)',

			// Background
			'vp-bg': 'var(--vp-c-bg)',
			'vp-bg-alt': 'var(--vp-c-bg-alt)',
			'vp-bg-elv': 'var(--vp-c-bg-elv)',
			'vp-bg-soft': 'var(--vp-c-bg-soft)',

			// Borders
			'vp-border': 'var(--vp-c-border)',
			'vp-divider': 'var(--vp-c-divider)',
			'vp-gutter': 'var(--vp-c-gutter)',

			// Text
			'vp-text-1': 'var(--vp-c-text-1)',
			'vp-text-2': 'var(--vp-c-text-2)',
			'vp-text-3': 'var(--vp-c-text-3)',

			// Functional: Default
			'vp-default-1': 'var(--vp-c-default-1)',
			'vp-default-2': 'var(--vp-c-default-2)',
			'vp-default-3': 'var(--vp-c-default-3)',
			'vp-default-soft': 'var(--vp-c-default-soft)',

			// Functional: Brand
			'vp-brand-1': 'var(--vp-c-brand-1)',
			'vp-brand-2': 'var(--vp-c-brand-2)',
			'vp-brand-3': 'var(--vp-c-brand-3)',
			'vp-brand-soft': 'var(--vp-c-brand-soft)',
			'vp-brand': 'var(--vp-c-brand)',

			// Functional: Tip
			'vp-tip-1': 'var(--vp-c-tip-1)',
			'vp-tip-2': 'var(--vp-c-tip-2)',
			'vp-tip-3': 'var(--vp-c-tip-3)',
			'vp-tip-soft': 'var(--vp-c-tip-soft)',

			// Functional: Note
			'vp-note-1': 'var(--vp-c-note-1)',
			'vp-note-2': 'var(--vp-c-note-2)',
			'vp-note-3': 'var(--vp-c-note-3)',
			'vp-note-soft': 'var(--vp-c-note-soft)',

			// Functional: Success
			'vp-success-1': 'var(--vp-c-success-1)',
			'vp-success-2': 'var(--vp-c-success-2)',
			'vp-success-3': 'var(--vp-c-success-3)',
			'vp-success-soft': 'var(--vp-c-success-soft)',

			// Functional: Important
			'vp-important-1': 'var(--vp-c-important-1)',
			'vp-important-2': 'var(--vp-c-important-2)',
			'vp-important-3': 'var(--vp-c-important-3)',
			'vp-important-soft': 'var(--vp-c-important-soft)',

			// Functional: Warning
			'vp-warning-1': 'var(--vp-c-warning-1)',
			'vp-warning-2': 'var(--vp-c-warning-2)',
			'vp-warning-3': 'var(--vp-c-warning-3)',
			'vp-warning-soft': 'var(--vp-c-warning-soft)',

			// Functional: Danger
			'vp-danger-1': 'var(--vp-c-danger-1)',
			'vp-danger-2': 'var(--vp-c-danger-2)',
			'vp-danger-3': 'var(--vp-c-danger-3)',
			'vp-danger-soft': 'var(--vp-c-danger-soft)',

			// Functional: Caution
			'vp-caution-1': 'var(--vp-c-caution-1)',
			'vp-caution-2': 'var(--vp-c-caution-2)',
			'vp-caution-3': 'var(--vp-c-caution-3)',
			'vp-caution-soft': 'var(--vp-c-caution-soft)',
		},
		boxShadow: {
			'vp-1': 'var(--vp-shadow-1)',
			'vp-2': 'var(--vp-shadow-2)',
			'vp-3': 'var(--vp-shadow-3)',
			'vp-4': 'var(--vp-shadow-4)',
			'vp-5': 'var(--vp-shadow-5)',
		},
	},
});
