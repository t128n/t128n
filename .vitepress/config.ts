import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vitepress';

import { markdownItFrontmatterTitlePlugin } from './plugins/markdown-it-frontmatter-title';
import { markdownItShorthandLinksPlugin } from './plugins/markdown-it-shorthand-links';
import { markdownItWikilinksPlugin } from './plugins/markdown-it-wikilinks';
import { autoSidebar } from './plugins/vitepress-auto-sidebar';
import { vitepressCv } from './plugins/vitepress-cv';
import { vitepressThemeOverlay } from './plugins/vitepress-theme-overlay';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	srcDir: 'docs',

	title: 't128n.dev',
	description: 'A VitePress Site',

	head: [['link', { rel: 'icon', href: '/logo.svg' }]],

	markdown: {
		config: (md) => {
			md.use(markdownItFrontmatterTitlePlugin);
			md.use(markdownItWikilinksPlugin, { root: 'docs' });
			md.use(markdownItShorthandLinksPlugin, {
				shorthands: {
					github: {
						link: 'https://github.com/{{value}}',
						icon: 'i-simple-icons-github',
					},
					bluesky: {
						link: 'https://bsky.app/profile/{{value}}',
						icon: 'i-simple-icons-bluesky',
					},
					npm: {
						link: 'https://www.npmx.dev/package/{{value}}',
						icon: 'i-simple-icons-npm',
					},
					signal: {
						link: 'https://signal.me/#eu/BMRqmT75wtRq70h2SsWvfa7yD1sWGt2cC2G2a4papB5jVe2hFI9PZ5V2nPljy84d',
						icon: 'i-simple-icons-signal',
					},
					linkedin: {
						link: 'https://www.linkedin.com/in/{{value}}',
						icon: 'i-simple-icons-linkedin',
					},
				},
			});
		},
	},

	vite: {
		resolve: {
			alias: [...vitepressThemeOverlay('.vitepress/theme/components')],
		},
		plugins: [UnoCSS(), vitepressCv()],
	},

	rewrites: {
		'README.md': 'index.md',
		'(.*)/README.md': '(.*)/index.md',
	},

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		logo: '/logo.svg',

		search: {
			provider: 'local',
		},

		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Blog', link: '/blog/' },
			{ text: 'TIL', link: '/til/' },
		],

		socialLinks: [
			{ icon: 'i-simple-icons-github', link: '/go/github' },
			{ icon: 'i-simple-icons-bluesky', link: '/go/bluesky' },
			{ icon: 'i-simple-icons-linkedin', link: '/go/linkedin' },
		],

		sidebar: [
			{
				text: 'Blog',
				link: '/blog/',
				collapsed: false,
				items: autoSidebar('blog'),
			},
			{
				text: 'TIL',
				link: '/til/',
				collapsed: false,
				items: autoSidebar('til'),
			},
			{
				text: 'Miscellaneous',
				collapsed: false,
				items: [
					{
						text: 'Curriculum Vitae',
						link: '/cv',
					},
					...autoSidebar('misc'),
				],
			},
		],

		docFooter: {
			prev: false,
			next: false,
		},
	},
});
