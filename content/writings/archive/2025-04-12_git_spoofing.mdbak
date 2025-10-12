---
title: "Git's Trust Model is Broken"
description: "Why Git's identity model is insecure, how easy commit spoofing is and how to fix it with commit signing. Explains the risks, demonstrates real-world spoofing and provides a step-by-step solution for securing your commits."
pubDate: 2025-04-12
draft: true
---

Git is one of the most widely used distributed version control systems in the world, relied on daily by millions of developers, especially within the open-source community. Yet, despite its immense popularity, Git's fundamental trust model is surprisingly flawed.

## The Infamous `git config`

You've likely encountered that classic Git message when committing on a fresh machine:

> Please configure your 'user.email' and 'user.name' in git.

Without thinking, you probably entered these commands and moved on. But have you ever wondered why Git needs your email and name even after you've already authenticated with your Git provider?

## The Problem Explained

The core issue here is that Git itself simply doesn't care about your identity. GitHub cares. GitLab cares. But Git itself? Not at all. If you tell Git your email is `tim@apple.com` and your name is `Tim Cook`, Git will happily accept and record it—no questions asked.

To demonstrate just how easily Git allows impersonation, I created a commit using the name and email address of a prominent individual, the CEO of the $3.25 billion company Vercel and successfully pushed it to GitHub without any verification ([check it out here](https://github.com/t128n/git-spoofing)). Pretty great customer service, right?

This highlights how incredibly simple—and dangerous—it is to impersonate someone using Git.

## The Simple Solution

Fortunately, there's a straightforward fix: **signing your commits**.

Most developers already have SSH or GPG keys set up for server authentication or Git provider interactions. These same keys can also secure your commits.

Here's how easy it is:

1. Generate an SSH or GPG Key:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Add your public key to your Git provider.

3. Configure Git to sign all your commits automatically:
```bash
git config --global commit.gpgsign true
```

4. Specify the key to use:
```bash
git config --global user.signingkey <your-signing-key>
```

That's it—your commits are now verifiable and secure.

## Real-World Scenario

Imagine you're part of a 10-person team responsible for your application's authentication system, conveniently managed within a monorepo. Your CI/CD pipeline auto-deploys to production whenever you commit to the main branch, trusting your verified credentials implicitly. But what if your "friendly" coworker decides to impersonate you, injecting a malicious backdoor directly into production under your name?

This isn't a far-fetched scenario - it can happen without commit signing.

## Closing Thoughts

Yes, Git is fundamentally flawed, but it's not Git's fault. When Git was created, the internet was a vastly different place. If we look back 50 years from now, we'll probably laugh at our current implementations, asking ourselves, "Why did we think that was okay?".

Despite this flaw, Git remains the best tool available—fast, reliable and supported by a vast ecosystem. Rather than ditching Git for some obscure alternative, we should focus on improving it. Commit signing is a simple step toward making Git safer and more trustworthy for everyone.