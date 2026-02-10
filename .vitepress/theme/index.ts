import type { Theme } from 'vitepress';

import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import 'virtual:uno.css';
import '#theme/styles/index.css';
import Hero from './components/Hero.vue';

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		});
	},
	enhanceApp({ app, router: _router, siteData: _siteData }) {
		app.component('Hero', Hero);
	},
} satisfies Theme;
