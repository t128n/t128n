# Design Notes

`t128n.dev` is a personal technical journal. The design preserves the original
site's narrow, text-first character while adding a small Markdown blog.

## Direction

- One narrow reading column with generous outer whitespace.
- Near-black canvas, muted text, and restrained contrast.
- Small text-only site identity.
- Plain underlined links.
- Compact monospace headings and serif body text.
- No application-style navigation, cards, or decorative containers.

## Foundation

- Astro static site generation.
- Astro content collections for blog articles.
- Bootstrap 5 CSS for the reset, utilities, and color-mode plumbing.
- Bootstrap Icons CSS loaded through the official package.
- Markdown for articles, with MDX available when needed.
- Astro's built-in Shiki syntax highlighting.

## Layout

- A single column, approximately 640px wide on desktop.
- The site title and Blog link sit in a small text line at the top of the
  column. There is no full-width navbar.
- Narrative text is indented relative to headings, preserving the original
  editorial alignment.
- The homepage contains the name, introduction, Connect list, and a short
  Writing list of recent posts.
- The blog index is a plain list of dated text links.
- Article pages use the same column and typography, with a compact header and a
  link back to all posts.
- There is no site footer.

## Theme

- The dark theme is the default: `#121214` canvas, `#e4e4e7` text, `#a1a1aa`
  secondary text, and `#27272a` rules.
- Bootstrap's `data-bs-theme` support keeps a restrained light theme available.
- The near-black appearance is the primary visual target.

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

`src/styles/site.css` recreates the original reading column, typography, and
Markdown presentation. It also defines the small set of light and dark color
values used by the site. Bootstrap remains the CSS foundation, but does not
dictate the page composition.
