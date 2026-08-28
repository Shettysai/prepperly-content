---
title: Mock Interviews (Technical)
slug: mock-interviews-technical
summary: LeetCode medium/hard, Timed practice
tags: [interview-skills, algorithms]
links:
  - title: Wikipedia — Coding interview
    url: "https://en.wikipedia.org/wiki/Coding_interview"
    kind: resource
---
## In one sentence

A **technical mock interview** is timed practice at solving a coding problem out loud, under the same pressure and format (usually 30-45 minutes, a shared screen, a stranger watching) as the real interview, so the format itself stops being the thing that trips you up.

## Why it matters

Many strong engineers can solve a problem alone in a quiet room but freeze when asked to think out loud, on the clock, in front of someone judging them. Interviewers score your communication and approach almost as much as your final answer — practicing the format is what turns raw problem-solving ability into an actual passing interview performance.

## The idea

A real technical interview has a repeating shape: state the problem, ask clarifying questions, propose an approach, code it while narrating, then test against examples and edge cases. Mock interviews drill this shape until it's automatic, not any one specific problem.

The single most common failure is jumping straight to code before fully understanding the problem. Spend the first few minutes restating the problem in your own words and asking about constraints — input size, negative values, duplicates — because these change which approach is correct, and asking them signals rigor rather than uncertainty.

Narrate your thinking as you go, even the parts that feel obvious: "I'll use a hash map here so I can look up values in constant time." Silence makes it impossible for an interviewer to tell whether you're stuck or simply thinking, and most will nudge you toward the right idea, but only if they know where your head is.

## In practice

```text
A 45-minute time budget for one coding question:

0:00-0:03  Restate the problem in your own words; ask 2-3 clarifying
           questions (input size, edge cases, expected output format).
0:03-0:08  Propose a brute-force approach out loud, state its
           complexity, then propose a better approach and why it wins.
0:08-0:30  Write the code, narrating each non-trivial line as you type.
0:30-0:38  Trace through 1-2 examples by hand, including an edge case
           (empty input, single element, duplicates).
0:38-0:45  State final time/space complexity; mention one alternative
           approach if asked.
```

Don't skip the first three minutes — rushing to code without confirming constraints is the most common reason a correct-looking solution fails on a hidden edge case.

## Quick reference

| Phase | What you do | Time (of 45 min) |
|---|---|---|
| Clarify | Restate problem, ask about constraints and edge cases | ~3 min |
| Approach | State brute-force, then propose and justify a better one | ~5 min |
| Code | Write the solution, narrating as you go | ~22 min |
| Test | Trace through examples and edge cases by hand | ~8 min |
| Wrap-up | State complexity, discuss alternatives if asked | ~5 min |

## What interviewers ask

- **"Can you think of a more efficient approach?"** — They're checking whether you recognize your first solution's complexity and can reason about trade-offs, not expecting you to have known the optimal answer instantly.
- **"What's the time and space complexity of your solution?"** — They're confirming you understand the cost of your own code, which matters more to them than the code compiling.
- **"What would you change if the input were much larger?"** — They're testing whether your solution's design (not just correctness) scales, which often reveals whether you actually understood the trade-offs you made.

## Common mistakes

- Coding immediately without clarifying constraints, then having to backtrack when an edge case breaks the approach.
- Going completely silent while thinking, leaving the interviewer no way to help or gauge progress — narrate even half-formed ideas.
- Declaring "done" without testing against at least one edge case (empty input, one element, duplicates) — this is often where the real bugs are.
