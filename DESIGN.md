# Design Notes

`t128n.dev` is a small personal website and technical blog built with Astro and
`open.css`, a classless terminal UI stylesheet for semantic HTML.

## Direction

- Terminal UI aesthetic: one monospace size, a `1ch` × `1.5rem` cell grid, and
  1px rules.
- Semantic HTML without utility or component classes.
- Dark theme by default, following `prefers-color-scheme: light` automatically.
- Plain document structure with no decorative graphics.

## Foundation

- Astro static site generation.
- Astro content collections for blog articles.
- `src/styles/open.css` (`@layer open`) for all base, layout, typography,
  navigation, table, and pane styling.
- Markdown for articles, with MDX available when needed.
- Astro's built-in Shiki syntax highlighting.

## Layout

- `body` acts as the terminal window frame with full-bleed `<header>` and
  `<footer>` status bars and `<main>` as the workspace between them.
- The homepage presents the name, introduction, Connect list, and recent posts
  in `<main>`.
- The blog index uses a semantic `<table>` with date and post columns.
- Article pages use a breadcrumb `<nav>` and a `<article>` pane with `<hgroup>`
  header, content, and a `<footer>` back link.

## Theme

- `open.css` uses CSS `light-dark()` with `color-scheme: dark` as default and
  `prefers-color-scheme: light` for light mode.
- Shiki syntax highlighting follows the active color scheme.

## Content

Articles live in `src/content/blog` and use typed frontmatter:

- `title`
- `description` (optional)
- `publishedAt`
- `updatedAt` (optional)
- `draft` (optional)

Drafts remain visible during development and are excluded from production
builds. There are no tags, categories, authors, or series.

## Custom CSS

`src/styles/site.css` is layered on top of `@layer open` and only handles:

- Accessible `.skip-link` visibility on focus.
- Shiki dual-theme variable switching to match `open.css`'s color scheme.
