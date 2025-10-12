---
title: "Prompting the Right Way"
description: "A practical guide for software engineers to prompt LLMs effectively. Covers context, constraints, model selection and iterative workflows to get better results and integrate AI into real engineering practice."
pubDate: 2025-04-15
draft: true
---

LLMs are changing how software engineers build, debug and design systems. But let's be honest - most engineers still prompt like casual users.
"Write a Python script that does X." Then they complain when the result is mediocre. That's not the model's fault. **It's yours**.

You wouldn't give your intern vague directions and expect top-tier output. So why treat an LLM any differently?

### The Intern Mindset

The best way to think about prompting is this: **treat the LLM like your intern**.
That means:

- Don't just ask for an implementation - **explain what you're trying to build**.
- Provide **context, constraints and goals**.
- Guide with **function signatures**, types and expectations.
- Be iterative. The first answer won't be perfect and that's fine. You're here to collaborate.

You wouldn't hand your intern a whiteboard and say "build our auth system" and walk off. So don't prompt "Build a user service in Go" and expect magic.

### Context is King

LLMs do not have access to your internal knowledge, unwritten conventions, or organizational quirks. You unconsciously apply context - coding guidelines, architectural philosophies, relevant code snippets, integration points - when solving problems. The model doesn't. **You must provide that context.**

- **Share your standards**: If your team enforces certain patterns, testing practices, or error-handling approaches, state them explicitly.
- **Articulate your philosophy**: Do you value functional purity? Defensive programming? "Move fast and break things" versus "measure twice, cut once"? Spell that out.
- **Give code and interfaces**: Supply the LLM with relevant types, interfaces, or even critical utility functions it should use.
- **Be selective**: Don't overload with irrelevant files, configs, or historical baggage. Context is only king if it's pertinent.

Treat context like a scalpel, not a sledgehammer - enough to illuminate, never so much it overwhelms.

### Prompt Like You Design Systems

Here's the difference between a lazy prompt and a productive one:

**Bad Prompt:**

```plaintext
Write a microservice that handles user sign-up.
```

**Better Prompt:**

```plaintext
Design a microservice in TypeScript for user registration.
It should expose a POST `/register` endpoint that accepts name, email and password.
Use Express. Validate input.
Hash passwords using bcrypt.
Assume a MongoDB backend.
Return success or validation errors in JSON format.
I'll integrate it into an existing monorepo later.
```

You gave it a **function signature**, data flow, constraints and return format.
Now you're actually engineering.

### Use the Right Model for the Right Job

Too many engineers throw every problem at GPT-4 or whatever model they have in front of them and expect perfect results.

That's like using your frontend dev to tune your Postgres indexes.

Here's a better flow:

1. **Use a reasoning model** (like o3-mini-high or DeepSeek R1) to break down the problem.
   > What architecture suits a multi-tenant document platform that must support offline syncing and granular RBAC?

2. Once you've got a direction, **move to code generation** using GPT-4.1 or equivalent.
   Prompt with structure: interfaces, expected modules, or even scaffolded TODOs.

3. Review the result *as if your intern wrote it.* Push back. Iterate.
   Don't accept hallucinated nonsense just because it sounds confident.

### Prompt Engineering ≠ Hype—It's Professional Discipline

You don't need the title of "prompt engineer." You need to engineer your prompts with the same precision and rigor you apply to code.
Communicate with the model as you would with a junior engineer: offer explicit context, set clear expectations and provide iterative, actionable feedback.

Leverage the LLM's own capabilities to elevate your prompts—draft, review and refine them using the model itself.
There is no reason to limit LLMs to code generation alone; employ them to optimize your entire engineering workflow, including prompt design.

Remember: **LLMs are collaborative interfaces, not ticketing systems.** Engage in a dialog, not a one-way transaction.

If the first draft misses the mark, say so—directly:
"Try again using async/await."
"Add input validation with Zod."
"Split this into two functions."

Treat every session as a code review: iterate, critique and demand clarity. That is how you extract real value.

### Closing Thoughts

Prompting isn't a magic spell. It's **engineering communication**.
If your prompt is vague, unfocused, or lacks direction, the results will reflect that.

Treat the LLM like a sharp but inexperienced intern.
Use structure. Lead with intent. Iterate like it's pair programming.

It's not about coaxing the model into doing what you want.
It's about **leading it there, step by step - just like you'd do in the real world.**