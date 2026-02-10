interface Link {
	slug: string;
	link: string;
}

const LINKS: Link[] = [
	{
		slug: 'github',
		link: 'https://github.com/t128n',
	},
	{
		slug: 'bluesky',
		link: 'https://bsky.app/profile/t128n.dev',
	},
	{
		slug: 'linkedin',
		link: 'https://www.linkedin.com/in/torben-haack',
	},
	{
		slug: 'signal',
		link: 'https://signal.me/#eu/BMRqmT75wtRq70h2SsWvfa7yD1sWGt2cC2G2a4papB5jVe2hFI9PZ5V2nPljy84d',
	},
];

export default {
	paths() {
		return LINKS.map((entry) => ({
			params: {
				link: entry.slug,
				target: entry.link,
			},
		}));
	},
};
