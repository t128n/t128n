# Design Notes

`t128n.dev` is a static personal site and technical journal. The design is
deliberately conventional: content defines the page, and the interface stays out
of the way.

## Direction

- Content first: text, headings, lists, links, and code carry the site.
- Conventional over distinctive: use Bootstrap's established patterns instead
  of a bespoke visual system.
- Minimal chrome: no cards, hero banners, gradients, shadows, or decorative
  illustrations.
- Editorial presentation: one readable column, clear hierarchy, and restrained
  metadata.

## Foundation

- Astro static site generation.
- Astro content collections for blog articles.
- Bootstrap 5 CSS and utilities for typography, spacing, grid, links, tables,
  and color modes.
- Bootstrap Icons loaded through the official CSS package.
- Markdown for articles, with MDX available when needed.
- Astro's built-in Shiki syntax highlighting.

## Layout

- Header, content, and footer share the same centered Bootstrap grid column.
- The reading column is approximately 65–75 characters wide on desktop.
- Article headers are compact: title, publication date, optional description.
- Blog entries are a plain document-style list, newest first.
- Navigation is a single inline row of text links: Home and Blog.

## Theme

- Bootstrap's `data-bs-theme` color mode is initialized from the system
  preference.
- The light canvas is `#fbfbfa`; the dark canvas is `#121214`.
- Text, links, borders, and secondary information otherwise use Bootstrap's
  defaults.
- The dark theme keeps the site's original minimalist character.

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

`src/styles/site.css` is intentionally small. It only covers requirements that
Bootstrap does not handle well:

- The long-form article measure and line height.
- Code block and table overflow.
- Shiki's light/dark theme variables.
- A few navigation details and the site canvases.

Everything else should use Bootstrap classes and utilities.
