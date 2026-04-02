---
title: Code Formatting Guidelines
description: The formatting rules I use across my projects.
cover:
    href: "src/assets/images/code-formatting-guidelines.jpg"
    caption: "One hundred years' progress of the United States, Brockett, Linus Pierpont et al., 1871."
createdAt: 2026-04-02
draft: false
icon: i-hugeicons:sparkles
blueskyUrl: "https://bsky.app/profile/did:plc:m25hu5wadnbqnt47zep7xza6/post/3mimefpylfs2b"
---

Consistent formatting removes noise from code review and keeps a codebase readable as it grows. These are the rules I've settled on across my projects, using [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) as the formatter.

## Quick Start

```ts frame="code" title="oxfmt.config.ts"
import { defineConfig } from "oxfmt";
// https://t128n.dev/writing/code-formatting-guidelines
export default defineConfig({
	printWidth: 80,

	useTabs: true,
	tabWidth: 4,

	semi: true,
	singleQuote: false,
	trailingComma: "all",

	sortImports: {},
	sortPackageJson: {},
	sortTailwindcss: {},

	ignorePatterns: ["**/*.mdc", "content/**/*.md"],
});
```

## Rules

### Formatting

- `printWidth` (`integer`, default `80`): Soft line length limit. Lines exceeding this will be wrapped where possible.
- `semi` (`boolean`, default `true`): Always add semicolons. Avoids ambiguous ASI edge cases.
- `singleQuote` (`boolean`, default `false`): Use double quotes. Consistent with JSON and most framework conventions.
- `trailingComma` (`string`): Add trailing commas wherever valid. Keeps diffs clean on multi-line additions.

### Indentation

- `useTabs` (`boolean`, default `true`): Indent with tabs. Allows each developer to set their own visual width.
- `tabWidth` (`integer`, default `4`): Visual width of a tab character. Has no effect on the emitted output.

### Sorting

- `sortImports` (`object`): Automatically sort import statements.
- `sortPackageJson` (`object`): Automatically sort `package.json` keys.
- `sortTailwindcss` (`object`): Automatically sort Tailwind CSS class names.

### Ignored Paths

- `ignorePatterns` (`string[]`): Paths excluded from formatting. Markdown content and MDC components are skipped to avoid interference with prose.
