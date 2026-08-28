---
title: Dynamic Programming
slug: dynamic-programming
summary: Memoization, Tabulation
tags: [dynamic-programming, recursion, algorithms, complexity]
links:
  - title: Wikipedia — Dynamic programming
    url: "https://en.wikipedia.org/wiki/Dynamic_programming"
    kind: resource
  - title: Wikipedia — Memoization
    url: "https://en.wikipedia.org/wiki/Memoization"
    kind: resource
---
## In one sentence

**Dynamic Programming** (DP) is a technique for problems where you'd otherwise solve the exact same smaller sub-problem over and over again — DP just remembers the answer the first time so you never redo that work.

## Why it matters

Many problems can be solved with plain recursion, but the naive version can be exponentially slow because it recalculates identical sub-problems thousands of times. DP is the difference between a Fibonacci-style function taking a fraction of a second versus taking longer than the age of the universe on a moderately large input — and it shows up constantly in interviews because it tests whether you can spot repeated work.

## The idea

Take computing the nth **Fibonacci number**, where each number is the sum of the two before it (0, 1, 1, 2, 3, 5, 8...). The naive recursive solution says `fib(n) = fib(n-1) + fib(n-2)`. That looks fine, but to compute `fib(5)`, it computes `fib(3)` twice, `fib(2)` three times, and so on — the same calls repeat, doubling roughly every step, giving O(2ⁿ) time.

DP fixes this with one idea: **store the answer to each sub-problem the first time you compute it, and look it up instead of recomputing it.** There are two ways to do this. **Memoization** is top-down: keep the recursive structure, check a cache before computing, and save the result after. **Tabulation** is bottom-up: build a table starting from the smallest sub-problems and work upward, so by the time you need `fib(n-1)` and `fib(n-2)`, they're already in the table.

The pattern to recognize DP: a problem can be broken into smaller versions of itself (**overlapping sub-problems**), and the smaller versions repeat.

## In practice

```js
// Naive: recomputes the same values over and over — O(2^n)
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// DP with memoization: each value computed exactly once — O(n)
function fibMemo(n, cache = {}) {
  if (n <= 1) return n;
  if (cache[n] !== undefined) return cache[n]; // already solved — reuse it
  cache[n] = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
  return cache[n];
}

console.log(fibMemo(40)); // 102334155 — instant, vs. fibNaive(40) which takes seconds
```

The `cache` object is the whole trick: the second call for any `n` returns immediately instead of re-triggering two more recursive calls.

## Quick reference

| Approach | Direction | Extra space | Typical use |
|---|---|---|---|
| Naive recursion | Top-down | O(n) call stack | Only for tiny inputs |
| Memoization | Top-down + cache | O(n) cache + O(n) stack | Easiest to write from a recursive solution |
| Tabulation | Bottom-up, iterative | O(n) table (often reducible to O(1)) | Avoids recursion depth limits, usually faster in practice |

## What interviewers ask

- **How do you recognize a DP problem?** — Look for two signs: it breaks into smaller versions of itself (optimal substructure), and those smaller versions repeat if solved naively (overlapping sub-problems). If recursion means the same inputs show up again and again, DP applies.
- **What's the difference between memoization and tabulation?** — Memoization is top-down: keep the recursive solution, add a cache check. Tabulation is bottom-up: fill a table from the base cases upward, avoiding recursion and its stack overflow risk.
- **Can you reduce the space used in the Fibonacci DP solution?** — Yes — each step only needs the previous two values, so two variables in a loop suffice, bringing space from O(n) to O(1).

## Common mistakes

- Writing the DP table before identifying the recursive relationship — find the naive recursive solution first, then add caching; the cache doesn't help if you don't know what to cache.
- Forgetting base cases in the cache — `fib(0)` and `fib(1)` must be handled directly, or the recursion never terminates correctly.
