---
title: On Stale PR Reviews
description: Auto-dismissing reviews on every PR update trains reviewers to skim, not to review in depth.
pubDate: 2026-04-18
---

> Mildest of hot takes: just like clicking 'Update branch' does not dismiss a GitHub PR approval, applying a suggestion made by a reviewer should not dismiss that same reviewer's approval.

<cite>— [Philippe Serhal (@philippeserhal.com)](https://bsky.app/profile/philippeserhal.com/post/3mjpea25res2f) on Bluesky</cite>

When I started contributing to [npmx.dev](https://npmx.dev), it surprised me that pushing commits to my PR
**after** it already had been reviewed, did not dismiss that very review.

I always assumed dismissing it was the safer default.

But why should updating the PR against the main branch dismiss the review? Why should implementing
the suggestions by the reviewer dismiss the review?
Those questions made me realize that I had a fundamental misunderstanding of the review process.

Forcing your maintainers to re-review on every change will only train them
to skim through the changes. They will potentially miss important details and
ultimately it'll have the opposite effect of what you intended.

A trusted maintainer merges the PR either way. If the initial review was thorough
and the follow-up changes are minor, there's no reason to restart the process from scratch.
