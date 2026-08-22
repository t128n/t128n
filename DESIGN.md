# DESIGN SPECIFICATION

This document tells you how to design and build the site. Follow every rule in this document.

## 1. Purpose and Background

This design combines three influences:

- The plain style of minimalist personal homepages.
- The structural precision of technical documentation.
- The editorial style of annotated print, with margin notes and data tables.

The site must respect the reader's time and bandwidth. Do not add decoration. Base the design on typographic rhythm, white space, and data density.

The site must look like well-typeset Markdown.

### 1.1 What to Keep and What to Reject from Each Influence

**From minimalist plain-text pages, keep:**

- Text as the main content.
- Simple HTML.
- Flat text navigation.
- No marketing banners.
- Low page weight and fast page loads.

**From minimalist plain-text pages, reject:**

- Raw HTML with no visual hierarchy.
- Monospace body text (it tires the reader's eyes).
- Margin notes that do not adapt to small screens.

**From technical documentation style, keep:**

- Precise monospace structure.
- Decimal section numbers (example: `1.`, `1.1`).
- Clear tables and code blocks.
- High-contrast text.

**From technical documentation style, reject:**

- Fixed-width line wrapping.
- Lack of proportional text for long narrative content.
- Dense, single-spaced data blocks (they are hard to read on wide screens).

**From annotated editorial style, keep:**

- Sidenotes and margin notes placed beside the related text.
- Proportional serif font for narrative text.
- Tables with no vertical lines, only top and bottom rules.
- Full-width figures that span the main column and the margin.

**From annotated editorial style, reject:**

- CSS checkbox hacks to toggle content.
- Heavy use of serif italics.
- Layouts that break on small screens or render code poorly.

## 2. Core Rules

1. **Text is the product.** Do not add hero images, stock photos, decorative graphics, marketing copy, or taglines. Use only prose, data, code, and links.
2. **Use one reading column.** Keep narrative text between 60 and 65 characters wide, with a maximum width of 680px. Do not stretch text across the full screen. Surround the column with white space and margin notes.
3. **Keep the HTML plain.** Use readable body text. Use thin borders. Do not use drop shadows, gradients, rounded "cards," or icon sets.
4. **Keep navigation as one text link.** Show only the site title in the header. Do not use a hamburger menu, dropdown, or icon button.
5. **Place headings in the left margin.** Align headings (`h1`–`h6`) flush left. Indent body text `2rem` on desktop and `1.25rem` on mobile. This lets headings anchor each section from the margin.
6. **Number every section.** Use decimal numbers in headings (example: `1. Introduction`, `1.1 Protocol Overview`). This shows the reader the document structure.
7. **Write a short, factual bio.** State the author's role, technical interests, and work in plain first-person language. Do not use marketing language or self-promotion.
8. **Limit the color palette.** Use an off-white canvas, near-black ink, and one accent color. Do not add other accent colors.
9. **Place sidenotes with CSS Grid.** Put sidenotes in the document grid, next to the paragraph that references them. On screens under 1024px wide, show sidenotes as inline callouts.
10. **Draw tables with rules only.** Use a top rule, a header underline, and a bottom rule. Do not use vertical lines. Right-align numbers.
11. **Do not add web clutter.** Do not use cookie banners, newsletter popups, modal windows, tracking scripts, share buttons, or hover effects.
12. **Show author information as a colophon.** Place author metadata in a plain block at the end of the article.
13. **Design for the long term.** Build the site to run for decades with low maintenance, fast load times, and lasting visual style.

## 3. Typography

The typographic system has two parts:

- **Structural text** (headings, metadata, code, tables, sidenotes): monospace font.
- **Narrative text** (long-form body copy): serif font.

### 3.1 Font Stacks

**Body text font stack (serif):**
`"Charter", "Bitstream Charter", "Iowan Old Style", "Source Serif 4", Georgia, "Times New Roman", serif`

This font reduces eye fatigue during long reading. It gives the page a book-like feel. It uses common serif fonts already installed on most systems.

**Structural text font stack (monospace):**
`ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace`

Use this font stack for titles, headings, metadata, section numbers, sidenotes, code blocks, and data tables.

### 3.2 Type Scale

| Element                | Font      | Size             | Weight | Line Height | Alignment / Indent                               |
| :--------------------- | :-------- | :--------------- | :----- | :---------- | :----------------------------------------------- |
| Site Title             | Monospace | 1.00rem (16px)   | 600    | 1.30        | Flush left                                       |
| Document Title (H1)    | Monospace | 1.35rem (21.6px) | 600    | 1.30        | Flush left                                       |
| Section Heading (H2)   | Monospace | 1.10rem (17.6px) | 600    | 1.30        | Flush left, numbered                             |
| Subheading (H3)        | Monospace | 1.00rem (16px)   | 600    | 1.30        | Flush left, numbered                             |
| Body Text              | Serif     | 1.00rem (16px)   | 400    | 1.68        | Indent 2rem (1.25rem on mobile)                  |
| Sidenote / Margin Note | Monospace | 0.84rem (13.4px) | 400    | 1.45        | Margin column, 250px wide                        |
| Code Block             | Monospace | 0.88rem (14px)   | 400    | 1.45        | Indent 2rem (1.25rem on mobile)                  |
| Data Table             | Monospace | 0.88rem (14px)   | 400    | 1.45        | Indent 2rem (1.25rem on mobile), tabular numbers |
| Metadata / Colophon    | Monospace | 0.85rem (13.6px) | 400    | 1.40        | Indent 2rem (1.25rem on mobile)                  |

## 4. Color Palette

Use these colors. They meet WCAG AAA contrast requirements.

**Light theme (default):**

| Role                       | Color              | Value                    |
| :------------------------- | :----------------- | :----------------------- |
| Canvas background          | Warm off-white     | `#FBFBFA`                |
| Primary ink                | Deep zinc          | `#18181B`                |
| Secondary / metadata text  | Zinc gray          | `#52525B`                |
| Hairline rules and borders | Light zinc         | `#E4E4E7`                |
| Code background            | Pale zinc          | `#F4F4F5`                |
| Accent color               | Royal Cobalt Blue  | `#1D4ED8`                |
| Link underline             | Ink at 25% opacity | `rgba(24, 24, 27, 0.25)` |

**Dark theme (use when `prefers-color-scheme: dark`):**

| Role                       | Color              | Value                       |
| :------------------------- | :----------------- | :-------------------------- |
| Canvas background          | Deep slate         | `#121214`                   |
| Primary ink                | Soft zinc white    | `#E4E4E7`                   |
| Secondary / metadata text  | Muted zinc gray    | `#A1A1AA`                   |
| Hairline rules and borders | Dark zinc          | `#27272A`                   |
| Code background            | Dark zinc          | `#18181B`                   |
| Accent color               | Saturated blue     | `#3B82F6`                   |
| Link underline             | Ink at 30% opacity | `rgba(228, 228, 231, 0.30)` |

Do not add any other accent color.

## 5. Grid Layout and Margin Notes

Use a 4-column asymmetric CSS Grid. Use CSS Subgrid for child articles. Place sidenotes directly in the grid. Do not use floats or checkbox hacks.

```
+-----------+-----------------------------------+-----------+--------------------+-----------+
| full-start| main-start               main-end | (gutter)  | margin-start margin| full-end  |
| 1fr       | 65ch (approx 680px)               | 2.5rem    | 250px              | 1fr       |
|           | Primary Narrative & Body Text     |           | Sidenotes, Notes   |           |
+-----------+-----------------------------------+-----------+--------------------+-----------+
```

### 5.1 Row Placement Rule

- Set `grid-auto-flow: row` on `main` and on `article.post`. Do not use `dense`.
- Place each `<aside>` element directly after the paragraph it refers to. The grid places it in the same row as that paragraph. This lines up the sidenote with its paragraph on desktop screens.
- For full-width figures and charts, span the element from `main-start` to `margin-end`. This makes the figure cross both columns.

### 5.2 Rules by Screen Size

- **Desktop (1024px and wider):** Show the full 4-column grid. Place sidenotes in the right margin column (250px wide).
- **Tablet and mobile (under 1024px):** Show a single column. Place each margin note below its paragraph. Give it a solid left border, 3px wide, in the accent color.

## 6. Sidenotes, Citations, and Figures

Write all margin content in plain HTML and Markdown. Do not use runtime scripts.

### 6.1 Numbered Sidenotes

Add a reference number in the text:

```html
<sup><a href="#sn-1" class="sidenote-ref">[1]</a></sup>
```

Add the matching note in a margin block:

```html
<aside id="sn-1">
  **[1]** The original idea was cribbed from prior annotated-document systems.
</aside>
```

Style rule: render the bracketed number (example: `**[1]**`) in font-weight 600 and in the accent color.

### 6.2 Unnumbered Margin Notes

Use this format for citations, references, or small notes that do not need a number:

```html
<aside class="marginnote">
  *Margin Note:* F.J. Cole, "The History of Albrecht Dürer's Rhinoceros", 1953.
</aside>
```

### 6.3 Full-Width Figures

Use this format for diagrams, wide tables, or charts that span both columns:

```html
<figure class="full-width">
  <img src="/assets/diagram.svg" alt="Architecture Diagram" />
  <figcaption>Figure 1: High-throughput packet pipeline overview.</figcaption>
</figure>
```

## 7. Code Blocks and Tables

### 7.1 Code Display

- Use the Shiki syntax highlighter. Use the `github-light` theme in light mode. Use the `github-dark` theme in dark mode.
- For inline `code`, add a soft background tint, `0.15em 0.35em` padding, and a 1px border.
- For block `pre` code, use the code background color, a 1px hairline border, `1.15rem 1.25rem` padding, and a 5px scrollbar in the hairline color.

### 7.2 Table Rules

- Draw a top rule, 1.5px solid, in the main text color.
- Draw a header underline, 1.0px solid, in the main text color.
- Draw a bottom rule, 1.5px solid, in the main text color.
- Do not draw vertical lines.
- Right-align all numbers. Use tabular figures (`font-variant-numeric: tabular-nums`).
- Left-align all text labels.

## 8. Navigation and Colophons

### 8.1 Header

- Use a flat, text-only header (`<header class="site-header">`).
- Show only the plain text site title in the header.
- Place other navigation links inside the running text and lists of each page.

### 8.2 Site Architecture

- Build the site as a multi-page application (MPA).
- Do not use client-side routing scripts.
- Do not use view-transition scripts.
- Let the browser handle navigation and history natively.

### 8.3 Author Metadata

- Support an `author` field in the page frontmatter. Accept a string or an object with `name`, `url`, and `note` fields.
- Show the author metadata in a footer colophon (`<footer class="writing-footer">`) at the end of the article.
- Separate the colophon from the article body with a hairline rule.

## 9. Prohibited Patterns

Do not use these patterns on this site:

- Card-based layouts with rounded corners, drop shadows, or wrapping borders.
- Decorative illustrations, stock photos, or hero images.
- Icon sets or icon buttons for navigation or social links. Use words instead (example: `GitHub`, `Bluesky`, `Email`, `RSS`).
- More than one accent color.
- Hover animations, parallax effects, zoom effects, or bounce transitions.
- Cookie banners, newsletter popups, modal windows, or floating share bars.
- Tag pills, reading-time labels, view counters, or "clap" buttons.
- Hamburger menus or dropdown navigation.
- Text that stretches across the full width of a wide screen.

## 10. CSS Reference

Use these CSS custom properties as the source of truth for color and layout values.

```css
:root {
  --font-body:
    "Charter", "Bitstream Charter", "Iowan Old Style", "Source Serif 4", Georgia, "Times New Roman",
    serif;
  --font-mono:
    ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace;

  --bg-color: #fbfbfa;
  --text-main: #18181b;
  --text-muted: #52525b;
  --border-color: #e4e4e7;
  --code-bg: #f4f4f5;
  --accent: #1d4ed8;
  --link-underline: rgba(24, 24, 27, 0.25);

  --max-text-width: 65ch;
  --sidenote-width: 250px;
  --gutter: 2.5rem;
  --max-container-width: 1280px;

  --lh-body: 1.68;
  --lh-mono: 1.45;
  --lh-heading: 1.3;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #121214;
    --text-main: #e4e4e7;
    --text-muted: #a1a1aa;
    --border-color: #27272a;
    --code-bg: #18181b;
    --accent: #3b82f6;
    --link-underline: rgba(228, 228, 231, 0.3);
  }
}
```
