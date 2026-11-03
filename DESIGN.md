# Design Notes

`t128n.dev` is a small personal website and technical blog built with Astro and
Bootstrap 5. The presentation follows Bootstrap's standard visual language
rather than a custom theme.

## Direction

- Conventional Bootstrap navbar, container, typography, links, and spacing.
- System sans-serif font stack.
- Normal Bootstrap heading sizes and weights.
- White background in light mode and Bootstrap's standard dark mode.
- Familiar blue hyperlinks.
- Plain document structure with no cards, badges, or decorative graphics.

## Foundation

- Astro static site generation.
- Astro content collections for blog articles.
- Bootstrap 5 CSS and utilities.
- Bootstrap Icons loaded through the official CSS package.
- Markdown for articles, with MDX available when needed.
- Astro's built-in Shiki syntax highlighting.

## Layout

- A standard Bootstrap navbar with the site brand, Home, Blog, and RSS.
- A standard responsive container for page content.
- The homepage presents the name, introduction, Connect list, and recent posts
  in a single content region.
- The blog index uses a standard Bootstrap table with date and post columns.
- Article pages use a breadcrumb, a document header, and a readable Bootstrap
  grid column.
- The footer is a single small copyright line.

## Theme

- Bootstrap's `data-bs-theme` color mode follows the system preference.
- Light mode uses Bootstrap's white canvas and default text, link, border, and
  secondary colors.
- Dark mode uses Bootstrap's standard dark palette.
- No custom color palette or design tokens are maintained.

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

`src/styles/site.css` only styles Markdown content that Bootstrap does not class
automatically:

- Code blocks and inline code.
- Tables and horizontal overflow.
- Blockquotes.
- Images and figures.
- Shiki's light/dark theme variables.

Everything else uses Bootstrap classes and utilities.
