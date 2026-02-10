import { defineConfig } from 'vitest/config';
import path from 'pathe';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['**/*.{test,spec}.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['.vitepress/plugins/**/*.ts'],
			exclude: ['.vitepress/plugins/**/*.{test,spec}.ts'],
		},
	},
	resolve: {
		alias: {
			'#root': path.resolve(__dirname, '.'),
			'#config': path.resolve(__dirname, '.vitepress'),
			'#plugins': path.resolve(__dirname, '.vitepress/plugins'),
			'#theme': path.resolve(__dirname, '.vitepress/theme'),
			'#docs': path.resolve(__dirname, 'docs'),
		},
	},
});
