---
title: "Cool URIs Don't Change"
description: "Notes on designing blog URLs that still resolve in twenty years."
pubDate: 2026-08-17
slug: cool-uris-dont-change
tags: ["urls", "architecture"]
---

This post lives at `/2026/08/cool-uris-dont-change/`. The `2026/08` is the
month it was published; the slug after it is set explicitly in the
frontmatter, not derived from the file's path — so this file can move into
a different folder, get retagged, or lose "draft" status later without the
link ever breaking.

A few rules this collection follows, straight from
[Tim Berners-Lee's "Cool URIs don't change"](https://www.w3.org/Provider/Style/URI):

- **The creation date is the one exception.** The essay is emphatic that
  almost everything should stay out of a URI — but a document's issue date
  is "one of the few things ... which will not change," and it explicitly
  recommends starting URIs with it. `/2026/08/` is that date, not a status
  marker.
- **No file extension in the URL** (`.md` is an implementation detail).
- **No category or topic segment** — classifications get reorganized;
  links shouldn't.
- **No status segment** like `/drafts/` — `draft` is data on the entry,
  not part of its address.
- **The slug is frozen at publish time**, same as the date: hand-picked
  once, never renamed afterward, whatever else about the post changes.

The one thing this scheme depends on: `pubDate` has to behave like `slug`
already does — set once, never corrected. Edit it after the fact and the
URL breaks, which is exactly the failure mode the essay is about.
