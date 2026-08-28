---
title: Big O Notation
slug: big-o-notation
summary: Time and Space Complexity analysis
tags: [complexity, fundamentals, algorithms]
links:
  - title: Wikipedia — Big O notation
    url: "https://en.wikipedia.org/wiki/Big_O_notation"
    kind: resource
  - title: MDN — Array methods reference
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
    kind: resource
---
## In one sentence

**Big O notation** is a way to describe how much slower or more memory-hungry your code gets as the input grows, without worrying about the exact machine it runs on.

## Why it matters

Two solutions can both work fine on 10 items but behave completely differently on 10 million. Big O lets you predict that difference before running the code, so you can pick an approach that won't fall over in production. Interviewers use it as a proxy for whether you understand what your code actually does.

## The idea

Imagine looking for a name in a phone book. Checking every page one by one means doubling the book roughly doubles your work — that's linear. Flipping to the middle and discarding half the book each time means doubling the size barely adds extra steps — that's logarithmic. Big O captures exactly this kind of growth pattern.

We write it as O(something), where "something" is a function of `n`, the input size. O(1) means constant — the work never grows, like grabbing the first item in an array. O(n) means the work grows in a straight line with input size, like scanning every item once. O(n²) means the work grows by the square, common with nested loops. We only care about growth as `n` gets huge, so we drop constants and lower-order terms — O(2n + 5) is just written as O(n).

Big O usually describes the **worst case**: the slowest the algorithm could possibly be for a given input size. Space complexity measures memory the same way, using the same notation.

## In practice

```js
// O(1): constant time — doesn't depend on array size
function getFirst(arr) {
  return arr[0];
}

// O(n): linear time — work grows one-to-one with input
function containsValue(arr, target) {
  for (const item of arr) {
    if (item === target) return true; // could scan every element
  }
  return false;
}

// O(n^2): quadratic time — a loop inside a loop
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
```

The nested loop in `hasDuplicate` is the line that matters: for every element it re-scans the rest of the array, so 10x more input means roughly 100x more work.

## Quick reference

| Notation | Name | Example | 1,000 items |
|---|---|---|---|
| O(1) | Constant | Array index access | 1 step |
| O(log n) | Logarithmic | Binary search | ~10 steps |
| O(n) | Linear | Simple loop | 1,000 steps |
| O(n log n) | Linearithmic | Merge sort | ~10,000 steps |
| O(n²) | Quadratic | Nested loop | 1,000,000 steps |

## What interviewers ask

- **What's the time complexity of this function?** — Walk through the loops: one loop over `n` items is O(n); a loop inside a loop is usually O(n²); the interviewer wants to see you trace it, not just guess.
- **What's the difference between time and space complexity?** — Time complexity measures steps taken as input grows; space complexity measures extra memory used, such as a new array or hash map created inside the function.
- **Can you optimize this O(n²) solution?** — Often yes, by trading space for time — using a hash set to remember seen values turns a nested-loop duplicate check into a single O(n) pass.

## Common mistakes

- Counting the input's own size as the algorithm's cost — O(n) means the algorithm's *work* scales with n, not that reading input is free.
- Forgetting that Big O drops constants: O(500) is still O(1), and O(3n) is still O(n), because we only care about growth trends at large scale.
