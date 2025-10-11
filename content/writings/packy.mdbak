---
title: "Shipping npm Packages Offline — Right in Your Browser"
description: "How I built a zero-backend, browser-only tool that bundles npm packages (and all deps) into a single offline archive you can trust."
pubDate: 2025-08-01
draft: true
---

For years, at work and in my own projects, I kept running into the same hurdle:
installing npm packages in air-gapped or locked-down environments. Most
solutions lean on backend services, shell scripts, or private registries. I
wanted something simpler, more transparent, and truly portable.

So I built Packy: a browser-based utility that bundles any npm package plus all
its dependencies into a single tarball for offline use. No backend. No server.
Just your browser doing the work.

https://t128n.github.io/packy/

## The Problem

If you've ever debugged inside a secure network, on a factory floor, or in a
classroom PC without internet, you know the pattern. You need one more package,
but you can't run `npm install`. Copying files around by hand is brittle and
slow. Standing up a local registry is overkill and often blocked by policy.

I wanted a tool I could open in any modern browser, type a package and version,
and end up with a single archive that "just works" offline later.

## What Packy Does

Packy resolves, fetches, and packages your target npm module and all of its
transitive dependencies into one tarball you can move by USB, shared drive or
sneakernet. Everything happens locally in the browser via WebContainers. No API
keys, no telemetry, no server.

Concretely, Packy orchestrates the same steps you'd do by hand, but automated
and sandboxed:

1) It runs `npm i` to resolve and materialize the full dependency
tree in an isolated filesystem.

2) It rewrites the `package.json` of the selected package to include it's dependencies in bundle.

3) It runs `npm pack` to generate a single tarball that contains the
package and its dependencies, ready for offline delivery.

## Why a Browser-Only Approach?

Zero setup and zero trust surface. A browser app:

- avoids maintenance
- works crossplattform
- requires zero setup 

It reduces friction. You get in, get a clean archive and get moving.


## When It's Useful

Packy shines when you need to move fast without internet or infrastructure. It's
ideal for shipping Node.js apps into locked-down or air-gapped environments
where online installs aren't an option. It's equally at home in teaching
contexts (workshops, classrooms and trainings) where connectivity can be flaky or
restricted and you need a predictable setup. It also doubles as a dependable way
to archive dependencies for reproducible builds or long-term snapshots. And when
you're heading into the field, Packy helps you prepare "dev kits" that contain
everything required to get unstuck.

## Implementation Notes

- WebContainers provide a Node-like runtime inside the browser with a virtual
  filesystem and process API.
- `npm i` runs inside that sandbox, producing a real, resolved
  `node_modules` tree.
- The package's `package.json` is rewritten to include all dependencies when being packaged.
- `npm pack` emits a standard tarball you can store, move, and
  install from later.

This approach mirrors npm's semantics closely while remaining transparent and
auditable.

## Try It

Packy is open-source and evolving. Use it here:

https://t128n.github.io/packy/

If you're curious how it works or want to contribute, dive into the codebase,
file issues or suggest improvements.