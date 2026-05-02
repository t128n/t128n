---
title: RICE
description: Roadmap prioritization with a simple scoring model.
pubDate: 2026-05-02
---

[RICE](https://community.atlassian.com/forums/Jira-Product-Discovery-articles/Guide-Mastering-prioritization-with-RICE/ba-p/3169901) is a prioritization model for comparing roadmap candidates with the same planning horizon.

Higher scores suggest stronger relative priority, assuming the inputs are estimated consistently.

## Formula

$$
\frac{R \times I \times C}{E}
$$

| Symbol | Input      | Meaning                                       |
| ------ | ---------- | --------------------------------------------- |
| R      | Reach      | Number of affected entities in a time period  |
| I      | Impact     | Expected improvement for each affected entity |
| C      | Confidence | Certainty in the reach and impact estimates   |
| E      | Effort     | Total work required to deliver the project    |

## Inputs

| Input      | Unit                     | Notes                                                                      |
| ---------- | ------------------------ | -------------------------------------------------------------------------- |
| Reach      | Entities per time period | Use a consistent period, such as users per month or transactions per day.  |
| Impact     | Numeric scale            | Use one scale across all candidates. A 1-5 scale keeps scoring simple.     |
| Confidence | Percentage               | Use `0-100%` as a multiplier. Lower confidence reduces speculative scores. |
| Effort     | Time or capacity         | Include research, design, development, testing, launch, and coordination.  |

## Example

| Project           | Reach | Impact | Confidence | Effort | Score |
| ----------------- | ----: | -----: | ---------: | -----: | ----: |
| Add dark mode     | 1,000 |      3 |        80% |      2 | 1,200 |
| Refactor codebase |   500 |      4 |        70% |      4 |   350 |
| Add new feature   | 2,000 |      5 |        60% |      6 | 1,000 |

The example assumes reach is measured in users per month and effort is measured in person-weeks.
