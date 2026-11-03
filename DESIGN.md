# Design Notes

`t128n.dev` is a static personal site and technical journal. It uses stock
Bootstrap patterns and keeps custom presentation code to a minimum.

## Direction

- Plain and conventional: use Bootstrap's navbar, containers, grid, tables,
  lists, and link styles directly.
- Content first: the page is a document, not an application shell.
- Minimal chrome: no custom headers, floating sidebars, cards, gradients, or
  decorative illustrations.
- Editorial presentation: clear headings, readable spacing, and restrained
  metadata.

## Foundation

- Astro static site generation.
- Astro content collections for blog articles.
- Bootstrap 5 CSS and utilities.
- Bootstrap Icons loaded through the official CSS package.
- Markdown for articles, with MDX available when needed.
- Astro's built-in Shiki syntax highlighting.

## Layout

- A standard Bootstrap navbar holds the site title, Home, Blog, and RSS.
- Pages use Bootstrap's default container rather than a custom reading width.
- The homepage uses a two-column grid: introduction and recent posts next to a
  Connect list.
- The blog index is a standard Bootstrap table with date and post columns.
- Article pages use a breadcrumb, a page header, and a wide Bootstrap grid
  column. Navigation and metadata stay in the document flow.
- The footer is a centered row of links followed by a short copyright line.

## Theme

- Bootstrap's `data-bs-theme` color mode is initialized from the system
  preference.
- Light and dark canvases, text, borders, links, and secondary information use
  Bootstrap's default colors.
- No custom color palette or design tokens are maintained.

## Content

Articles live in `src/content/blog` and use typed frontmatter:

- `title`
- `description` (optional)
- `publishedAt`
- `updatedAt` (optional)
- `draft` (optional)

Drafts remain visible during development and are excluded from production
builds. There are no tags, categories, authors, series, or other metadata until
there is a concrete need for them.

## Custom CSS

`src/styles/site.css` only styles Markdown content that Bootstrap does not
class automatically:

- Code blocks and inline code.
- Tables and horizontal overflow.
- Blockquotes.
- Images and figures.
- Shiki's light/dark theme variables.

Everything else should use Bootstrap classes and utilities.
