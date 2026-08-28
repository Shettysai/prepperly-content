---
title: Whiteboarding practice
slug: whiteboarding-practice
summary: Communication, Edge cases
tags: [interview-skills, system-design]
links: []
---
## In one sentence

**Whiteboarding** is solving a problem on a shared surface (a real whiteboard, an online doc, or a virtual canvas) while explaining your thinking out loud, so the interviewer can watch how you reason, not just check your final answer.

## Why it matters

Engineers constantly explain designs and trade-offs to teammates before writing code — whiteboarding is a direct proxy for that skill. A candidate who writes a perfect solution silently often scores worse than one who talks through a rougher one, because the interviewer has no visibility into silent reasoning.

## The idea

The skill being tested isn't drawing ability — it's **structured communication under uncertainty**. Always restate the problem and ask about constraints before touching the board; it proves you're solving the actual problem asked, not the one you assumed.

Once you start, keep the board organized: write the problem statement at the top, keep a running list of constraints to the side, and leave space for examples separate from your solution. A cluttered board makes it hard for the interviewer to follow you, and hard for you to check your own work.

For system-design-style whiteboarding, work top-down: state the high-level components first (client, API, database, cache), then drill into whichever piece the interviewer seems most interested in. For algorithmic whiteboarding, sketch the data structure's state at each step of an example — this catches logic bugs before you've written a full solution.

When you get stuck, narrate the stuck-ness itself: "I'm not sure this handles duplicates correctly, let me trace through an example." This keeps the interviewer engaged instead of watching silence, and it often unsticks you because saying the problem out loud surfaces the gap.

## In practice

```text
Opening lines for a whiteboarding session:

"Let me restate the problem to make sure I have it right: [restate
in your own words]. Before I start, a couple of clarifying questions —
[constraint question 1]? [constraint question 2]?"

"I'll sketch a small example first to make sure I understand the
shape of the input and output, then think about an approach."

[After proposing an approach]
"Before I commit to this, let me trace through the example on the
board to check it actually works, including an edge case like an
empty input."
```

This catches misunderstandings while they're still cheap to fix.

## Quick reference

| Board habit | Why it helps |
|---|---|
| Problem statement at the top | Keeps you and the interviewer anchored to what's actually being solved |
| Constraints/assumptions listed to the side | Makes your reasoning visible and easy to correct if wrong |
| Example traced step-by-step | Catches logic errors before or after writing the full solution |
| Top-down structure for system design | Shows overall shape before deep-diving one component |
| Narrate when stuck | Keeps interviewer engaged and often reveals the fix |

## What interviewers ask

- **"Can you walk me through your diagram again?"** — They're checking whether you can explain your own reasoning clearly after the fact, which mirrors explaining a design to teammates later.
- **"What would you change if this component became a bottleneck?"** — They're testing whether you understand the trade-offs in what you drew, not just that you drew something plausible.
- **"Why did you organize the board this way?"** — Rare but real; it checks whether your structure was deliberate or accidental, since organized thinking usually produces an organized board.

## Common mistakes

- Diving straight into a diagram before restating the problem or asking about constraints, then having to backtrack once a wrong assumption surfaces.
- Letting the board become cluttered with crossed-out attempts, making it hard for the interviewer (and you) to follow the current state of the solution.
- Going silent while stuck instead of narrating the confusion — saying what's unclear out loud often unblocks you and keeps the interviewer engaged.
