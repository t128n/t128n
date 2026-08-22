## Tooling & Runtime

Use **Bun** as the runtime and package manager, managed via `mise.toml` (`bun = "1.4.0"`). Always run scripts and commands using Bun (e.g. `bun run dev`, `bun run build`, `bun run fmt`, `bunx`, etc.).

## Development

When starting the dev server, use background mode:

```
bun astro dev --background
```

Manage the background server with `bun astro dev stop`, `bun astro dev status`, and `bun astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
