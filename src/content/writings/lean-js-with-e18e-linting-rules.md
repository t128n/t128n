---
title: Lean JavaScript with e18e Linting Rules
description: Use e18e's linting rules to automatically flag outdated packages and enforce modern JS patterns.
cover:
    href: "src/assets/images/lean-js-with-e18e-linting-rules.png"
    caption: "Oh, fast he rode, and fast she ran, Corbould, Edward Henry et al., 1865."
icon: i-hugeicons:java-script
blueskyUrl: "https://bsky.app/profile/did:plc:m25hu5wadnbqnt47zep7xza6/post/3mitew6mhlk2j"
---

[e18e](https://e18e.dev/) is an initiative lead by a small circle of developers who are striving to make the JavaScript ecosystem sustainably better.[^1]

One of their projects is the [eslint](https://eslint.org/) plugin [e18e/eslint-plugin](https://github.com/e18e/eslint-plugin). It enables ESLint (and ESLint-compatible tooling) to detect deviations from current best practices.

Whereas it has **many** powerful rules available, my favorite by far is `e18e/ban-dependencies`. This rule uses the [module replacements list](https://github.com/e18e/module-replacements) to detect the usage of obsolete packages[^2].

```ts frame="code" title="main.ts"
import chalk from "chalk";

chalk.green("Hello world!");
```

<br/>

```bash frame="terminal" title="~/Developer/temp"
~/Developer/temp
✗ bun lint
$ oxlint

  × e18e(ban-dependencies): "chalk" should be replaced with an alternative package. Read more here: https://github.com/es-tooling/module-replacements/blob/main/docs/modules/chalk.md
   ╭─[src/main.ts:1:1]
 1 │ import chalk from 'chalk';
   · ──────────────────────────
 2 │
   ╰────

Found 0 warnings and 1 error.
Finished in 72ms on 2 files with 110 rules using 10 threads.
error: script "lint" exited with code 1
```

Just by using that rule you can make sure that you do not accidentally use packages that have been superseded by timely alternatives.

## Integrating with Oxlint

If you're like me and prefer Oxlint[^3] over ESLint, there's good news:
As Oxlint added support for JS plugins since March 2026, we can neatly integrate `@e18e/eslint-plugin` into our Oxlint setup.

To get started, it's as easy as adding both packages as dev dependencies to our project.

```bash
~/Developer/temp
➜ bun add -D oxlint @e18e/eslint-plugin
bun add v1.3.11 (af24e281)

installed oxlint@1.58.0 with binaries:
 - oxlint
installed @e18e/eslint-plugin@0.3.0

[871.00ms] done
```

Afterwards, you can create an oxlint config either by running `bun oxlint --init` (which creates a JSON config by default) or by manually creating an `oxlint.config.ts` file. I prefer the latter and will therefore cover that approach here.

In that file, you will use the same `defineConfig` flow that may already be familiar from, for example, [Vite](https://vite.dev/) or similiar tools.

```ts frame="code" title="oxlint.config.ts"
import { defineConfig } from "oxlint";

export default defineConfig({
	jsPlugins: ["@e18e/eslint-plugin"],
	ignorePatterns: ["dist", "node_modules"],
	rules: {
		// modernization
		"e18e/prefer-array-at": "error",
		"e18e/prefer-array-fill": "error",
		"e18e/prefer-includes": "error",
		"e18e/prefer-array-to-reversed": "error",
		"e18e/prefer-array-to-sorted": "error",
		"e18e/prefer-array-to-spliced": "error",
		"e18e/prefer-nullish-coalescing": "error",
		"e18e/prefer-object-has-own": "error",
		"e18e/prefer-spread-syntax": "error",
		"e18e/prefer-url-canparse": "error",

		// module replacements
		"e18e/ban-dependencies": "error",

		// performance improvements
		"e18e/prefer-array-from-map": "error",
		"e18e/prefer-timer-args": "error",
		"e18e/prefer-date-now": "error",
		"e18e/prefer-regex-test": "error",
		"e18e/prefer-array-some": "error",
		"e18e/prefer-static-regex": "error",
	},
});
```

It is just as simple as listing the module name in the `jsPlugins` list and then configuring the rules in the `rules` section. You can find the full list of rules in the [e18e/eslint-plugin readme](https://github.com/e18e/eslint-plugin?tab=readme-ov-file#usage-with-oxlint).

[^1]: [Theo (t3.gg)](https://t3.gg/) also made a [video](https://www.youtube.com/watch?v=1t-k6-m50Fc) covering this topic more thoroughly.

[^2]: Packages may be marked as obsolete for various reasons. Some of them are [listed on e18e's website](https://e18e.dev/docs/replacements/#what-are-these).

[^3]: ESLint-compatible linter, part of the [Ox toolchain](https://oxc.rs/).
