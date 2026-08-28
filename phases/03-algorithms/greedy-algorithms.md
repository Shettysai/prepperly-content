---
title: Greedy Algorithms
slug: greedy-algorithms
summary: Activity selection, Huffman coding
tags: [algorithms, complexity, dynamic-programming]
links:
  - title: Wikipedia — Greedy algorithm
    url: "https://en.wikipedia.org/wiki/Greedy_algorithm"
    kind: resource
  - title: Wikipedia — Huffman coding
    url: "https://en.wikipedia.org/wiki/Huffman_coding"
    kind: resource
---
## In one sentence

A **greedy algorithm** builds a solution by always making the choice that looks best *right now*, without reconsidering it later — for certain problems that shortcut happens to produce the actual best overall answer.

## Why it matters

Many optimization problems could technically be solved by checking every possible combination, but that's often too slow to be useful. Greedy algorithms trade that exhaustive search for a simple rule applied step by step — the catch is knowing when that shortcut is actually safe to take.

## The idea

Take the **Activity Selection** problem: given a list of meetings, each with a start and end time, attend as many non-overlapping ones as possible in one room. The greedy approach: sort by **end time**, then pick a meeting whenever it doesn't overlap with the last one picked. You never reconsider — once picked, it stays picked.

Why does earliest end time work? Ending early leaves the most room free for everything after. Picking by duration or start time instead could lock in a meeting that blocks two shorter ones later — greedy-by-end-time is proven to never do that.

Not every problem is safe for greedy. **Huffman coding** (compression) is another true greedy success: it repeatedly combines the two least-frequent items into one, and this local merge, repeated, produces a globally optimal tree. But for 0/1 Knapsack (maximize value under a weight limit), greedily grabbing the best value-per-weight item can lock you out of a better combination — that needs Dynamic Programming instead.

## In practice

```js
function activitySelection(activities) {
  // sort by end time — the key greedy decision
  const sorted = [...activities].sort((a, b) => a.end - b.end);
  const selected = [sorted[0]];
  let lastEnd = sorted[0].end;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start >= lastEnd) { // no overlap with the last chosen meeting
      selected.push(sorted[i]);
      lastEnd = sorted[i].end;
    }
  }
  return selected;
}

const meetings = [{ start: 1, end: 4 }, { start: 3, end: 5 }, { start: 0, end: 6 }, { start: 5, end: 7 }];
console.log(activitySelection(meetings)); // [{start:1,end:4}, {start:5,end:7}]
```

The sort does the real work: once meetings are ordered by end time, a single forward pass is enough — no reconsidering earlier choices.

## Quick reference

| Problem | Greedy works? | Why |
|---|---|---|
| Activity Selection | Yes | Picking earliest end time always leaves maximum room for future choices |
| Huffman Coding | Yes | Merging the two smallest frequencies first is always part of some optimal tree |
| 0/1 Knapsack | No | Best value-per-weight item now can block a better combination later — needs DP |
| Fractional Knapsack | Yes | You can take partial items, so grabbing the best ratio first never blocks a better total |

## What interviewers ask

- **How do you know when greedy will give the optimal answer?** — The problem needs the "greedy choice property" (a locally optimal choice is always part of some globally optimal solution). If you can't prove the local choice never rules out a better global answer, greedy is risky.
- **Why does sorting by end time work for Activity Selection but sorting by duration doesn't?** — Ending earliest always leaves the most remaining time free for later meetings. Sorting by shortest duration can pick a meeting that ends late, blocking two others that could fit around it.
- **Give an example where greedy fails and you'd need DP instead.** — 0/1 Knapsack: greedily taking the best value-per-weight item can block a pair whose combined value is higher — DP checks combinations systematically.

## Common mistakes

- Assuming greedy "feels right" is proof it's correct — check whether picking locally best can rule out a better global answer.
- Sorting by the wrong key (e.g., start time instead of end time) — the sort key is often the entire difference between a correct and incorrect greedy solution.
