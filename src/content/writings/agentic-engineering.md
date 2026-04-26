---
title: Agentic Engineering
description: Collection of insights, knowledge and actionable advice on Agentic Engineering.
pubDate: 2026-04-26
---

## Preface

Agentic Engineering is a term first coined by [Simon Willison](https://simonwillison.net/2026/Feb/23/agentic-engineering-patterns/).
It encompasses the application of software engineering principles to the use of LLM coding agents.

## Patterns

### Ask, Plan, Execute, Reflect (APER)

Taken from [Agentic Engineering](https://www.youtube.com/watch?v=BEKc4P87XKo) by Brendan O'Leary.
Reflect phase added by me.

A pattern **you** have to apply yourself. Instructing the agent to follow this pattern will
lead to worse results, as some of the context and reasoning will be lost for following this pattern
instead of doing actual work.

#### 1. Ask

**Objective**

- Understand the system
- Find the right files
- Don't plan yet; just gather information

**Output**

- Research file
    - Files involved
    - Line numbers for key functions
    - Data flow
    - Dependencies and side effects
    - Edge cases to consider

#### 2. Plan

**Objective**

- Outline _exact_ steps
- Include testing (how to verify that the goal is achieved)
- Be explicit about assumptions and uncertainties

**Output**

- Plan file
    - Step-by-step plan
    - Specific files and lines to edit
    - Test commands to run
    - Rollback strategy if things go wrong

#### 3. Execute

**Objective**

- Execute the plan
- Keep context low (<= 100K tokens) ([Smart Zone / Dumb Zone](https://youtu.be/-QFHIoCo-Ko?si=FqeWEcyxzBK0XAGV&t=200) by Matt Pocock)
- Review each change
- Commit frequently

#### 4. Reflect

**Objective**

- Review the process and outcome
- Identify what went well and what could be improved
- Document insights for future reference

**Output**

- Modified _SKILLS.md_, _AGENTS.md_, ...
    - If something went wrong, add a skill for how to avoid that in the future
    - If a skill did not do its job, update it to be more effective next time
    - If a new technique was discovered, add it to the relevant skill

### Skills

Skills are a set of atomic markdown files that describe specific concepts, tasks, or techniques.

- [t128n/skills](https://github.com/t128n/skills) — curated collection of skills sourced from various repositories
- [mattpocock/skills](https://github.com/mattpocock/skills) — collection of skills by Matt Pocock
- [skills.sh](https://skills.sh) — CLI and browser for skill files

## References

- [Agentic Engineering](https://simonwillison.net/guides/agentic-engineering-patterns/) by Simon Willison
