---
title: Dependency Standback
description: Patience as a security practice.
cover:
    href: "src/assets/images/dependency-standback.jpg"
    caption: "The sand bank, Stanfield, Clarkson, 1836."
createdAt: 2026-04-01
draft: false
icon: i-gg:sand-clock
blueskyUrl: "https://bsky.app/profile/did:plc:m25hu5wadnbqnt47zep7xza6/post/3mimefgduis2b"
---

The recent [LiteLLM PyPI embargo](https://futuresearch.ai/blog/litellm-attack-transcript/) shook the software development community and served as yet another reminder that dependency hygiene isn't optional.

But not everyone has the ressources to audit every dependency thoroughly. Sometimes the best you can do is **just wait**. That's what **dependency standback** is all about. Before installing or upgrading software, you give it some time to "breathe" in the ecosystem. It doesn't do anything magical: it simply gives the community time to find problems before they become your problems.

So how long should you wait? A grace period of **7-14 days** is a solid default. But it depends on the speed of the ecosystem. An npm package allows for a shorter window than a [Julia dependency](https://julialang.org/), because the sheer volume of npm traffic means problems surface faster.

## How It Works In Practice

Most modern package managers expose standback natively, with varying degrees of control. The JS ecosystem is the most mature here: npm covers the basics with `--min-release-age`, pnpm goes further with per-package exclusions via `minimumReleaseAgeExclude` — useful for whitelisting internal or trusted packages — and bun offers the finest granularity of the three, configuring the age gate down to the second.

On the Python side, uv supports standback out of the box via `--exclude-newer`. pip requires a bit more work: it only accepts an absolute date natively, but a small shell wrapper makes relative dates work just as well.

The OS and runtime layer is where things get inconsistent. [mise](https://mise.jdx.dev/) handles it well, supporting both relative durations and absolute timestamps. brew and winget, however, don't support standback at all. Their maintainers argue that existing review cycles make it unnecessary, a position [Andrew Nesbitt expands on](https://nesbitt.io/2026/03/04/package-managers-need-to-cool-down.html). I'm not fully convinced. Slip-ups happen, and malicious actors are patient. A review cycle and a grace period don't have to be mutually exclusive.

## Quick Reference

### JavaScript

#### npm

- `--before` (`date`): Absolute date before which a package must have been published.
- `--min-release-age` (`days`): Relative date computed through `today - n days`, before which a package must have been published.

```bash frame="terminal" title="CLI usage"
npm install --before 2024-01-01
npm install --min-release-age 4
```

<br/>

```ini frame="code"
<!-- .npmrc -->
before = 2024-01-01
min-release-age = 4
```

#### pnpm

- `minimumReleaseAge` (`minutes`): Number of minutes that must have passed since a package has been published.
- `minimumReleaseAgeExclude` (`string[]`): Names of packages which should not be affected by the `minimumReleaseAge` rule.

```bash frame="terminal" title="CLI usage"
pnpm install --minimum-release-age 1440
```

<br/>

```yaml frame="code"
<!-- pnpm-workspace.yaml -->
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
    - webpack
    - react
```

For more advanced logic, such as filtering by `peerDependency` versions, pnpm also exposes standback via [`.pnpmfile.cjs`](https://pnpm.io/pnpmfile):

```js frame="code"
<!-- .pnpmfile.cjs -->
// Example taken from https://pnpm.io/blog/releases/10.16
module.exports = {
	finders: {
		react17: (ctx) => {
			return ctx.readManifest().peerDependencies?.react === "^17.0.0";
		},
	},
};
```

#### bun

- `minimumReleaseAge` (`seconds`): Number of seconds that must have passed since a package has been published.
- `minimumReleaseAgeExcludes` (`string[]`): Names of packages which should not be affected by the `minimumReleaseAge` rule.

```bash frame="terminal" title="CLI usage"
bun add @types/bun --minimum-release-age 259200
```

<br/>

```toml frame="code"
<!-- bunfig.toml -->
[install]
minimumReleaseAge = 259200
minimumReleaseAgeExcludes = ["@types/node", "typescript"]
```

#### taze

- `--maturity-period` (`days`): Number of days that must have passed since a package has been published.

```bash frame="terminal" title="CLI usage"
pnpm dlx taze --maturity-period 14
```

<br/>

```ts frame="code"
<!-- taze.config.ts -->
import { defineConfig } from "taze";

export default defineConfig({
	maturityPeriod: 14,
});
```

### Python

#### uv

- `--exclude-newer` (`date`): Absolute timestamp before which packages must have been published.

```bash frame="terminal" title="CLI usage"
uv pip install --exclude-newer 2026-01-01T00:00:00Z litellm
uv add --exclude-newer 2026-01-01T00:00:00Z litellm
```

<br/>

```toml frame="code"
<!-- pyproject.toml -->
[tool.uv]
exclude-newer = "2026-01-01T00:00:00Z"
```

<br/>

```toml frame="code"
<!-- uv.toml -->
[uv]
exclude-newer = "2026-01-01T00:00:00Z"
```

#### pip

- `--uploaded-prior-to` (`date`): Absolute timestamp before which packages must have been published.
- `PIP_UPLOADED_PRIOR_TO` (`env`): Global equivalent of `--uploaded-prior-to`, evaluated on every run.

pip only accepts an absolute date natively. A small shell expression makes relative dates work:

```bash frame="terminal" title="CLI usage"
pip install litellm --uploaded-prior-to $(date -v-3d "+%Y-%m-%dT%H:%M:%SZ")
```

<br/>

```sh frame="code"
<!-- .bashrc -->
export PIP_UPLOADED_PRIOR_TO=$(date -u -v-3d "+%Y-%m-%dT%H:%M:%SZ")
```

```powershell frame="code"
<!-- profile.ps1 -->
$env:PIP_UPLOADED_PRIOR_TO = (Get-Date).ToUniversalTime().AddDays(-3).ToString('yyyy-MM-ddTHH:mm:ssZ')
```

### OS & Runtime

#### mise

- `install_before` (`duration | date`): Relative durations (`7d`, `6m`, `1y`) or absolute timestamps (`2024-06-01`, `2024-06-01T12:00:00Z`).

```toml frame="code"
<!-- mise.toml -->
[settings]
install_before = "7d"
```

#### brew & winget

Not supported, and not planned.
