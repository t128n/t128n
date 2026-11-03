---
title: "A quieter website"
description: "Rebuilding t128n.dev as a static, content-first journal with Astro and Bootstrap."
publishedAt: 2026-11-03
---

This site has always been small: a short introduction, a few ways to get in
touch, and not much else. The previous version leaned into that minimalism with
a custom type system and a carefully tuned grid. It worked, but it also made
every future change a design decision.

The new version keeps the restraint and replaces the machinery with stock
Bootstrap components.

## Why rebuild

I wanted the site to do three things well:

- Present a short personal introduction.
- Publish longer technical notes without a separate documentation system.
- Stay fast, static, and easy to maintain for years.

The first version solved the first point. The second point is what pushed me to
start over. A blog does not need a custom design system; it needs a reliable
document structure, readable typography, and plain links.

> The content should be the interface. Everything else is there to get out of
> its way.

## The stack

The site is built with [Astro](https://astro.build) and uses
[Bootstrap 5](https://getbootstrap.com) for its visual foundation. Articles are
Markdown files in a content collection. There is no database, no client-side
router, and no runtime framework.

| Layer      | Choice                                      |
| :--------- | :------------------------------------------ |
| Pages      | Astro, static output                        |
| Styling    | Bootstrap CSS and utilities                 |
| Icons      | Bootstrap Icons CSS                         |
| Articles   | Markdown and MDX via content collections    |
| Publishing | RSS, sitemap, canonical and Open Graph tags |

Installing the two packages that define the presentation is deliberately
boring:

```sh
bun add bootstrap bootstrap-icons
```

Bootstrap supplies the navbar, containers, grid, typography, tables, links,
spacing, and light/dark color modes. The site adds only a small stylesheet for
Markdown content: code blocks, tables, blockquotes, and Shiki's dark theme.

## What stayed

The homepage still begins with my name and the same introduction. Bluesky,
GitHub, and email are still the only ways to get in touch. The palette is still
neutral, the navigation is still text, and the footer is still quiet.

What changed is the amount of custom design. The old tokens, narrow reading
column, and custom header are gone. Pages now use Bootstrap's container, navbar,
grid, list group, and table components directly.

## Writing in Markdown

An article is a file with a small amount of typed frontmatter:

```md
---
title: "A quieter website"
description: "Rebuilding t128n.dev as a static, content-first journal."
publishedAt: 2026-11-03
draft: false
---

The article starts here.
```

The `draft` flag is the only publishing control. Drafts remain visible during
local development and are excluded from production builds. There are no tags,
categories, series, or author records to maintain.

## What comes next

The site is now a place to write, not just a place to point at. I expect the
design to change slowly: a new post now and then, an occasional correction, and
very little else.

If you would like to follow along, the [RSS feed](/rss.xml) is the most direct
way.
