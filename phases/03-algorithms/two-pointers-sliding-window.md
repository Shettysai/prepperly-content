---
title: Two Pointers & Sliding Window
slug: two-pointers-sliding-window
summary: Array/String optimization
tags: [algorithms, complexity, searching]
links:
  - title: MDN — Array iteration methods
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections"
    kind: resource
  - title: Wikipedia — Sliding window protocol (related concept in networking)
    url: "https://en.wikipedia.org/wiki/Sliding_window_protocol"
    kind: resource
---
## In one sentence

**Two Pointers** and **Sliding Window** scan an array or string using two moving markers instead of nested loops, turning many O(n²) brute-force solutions into O(n) ones.

## Why it matters

Many array and string interview problems — finding a pair that sums to a target, the longest substring without repeats, reversing in place — look like they need to compare every element against every other element. These techniques solve them in a single pass, often the difference between a solution that passes and one that times out on large inputs.

## The idea

**Two Pointers** uses two index variables that move through the array, often from opposite ends toward each other. Take **Two Sum on a sorted array**: find two numbers that add to a target. Brute force checks every pair — O(n²). With two pointers, start one at the beginning (`left`) and one at the end (`right`). If the sum is too small, move `left` forward; if too big, move `right` backward. Since the array is sorted, each move is guaranteed correct — one pass, O(n).

**Sliding Window** applies the same spirit to a *contiguous* chunk that grows and shrinks as you scan. Picture a window sliding over a strip of paper: it expands to include new characters on the right, and shrinks from the left whenever it breaks a rule (like a repeated character). You never restart — only the two edges move forward, keeping it O(n) instead of re-scanning from every starting point.

Both techniques share one insight: keep pointers that only move forward, carrying forward what you've already learned, instead of restarting the scan each time.

## In practice

```js
function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;   // sum too small — need a bigger number
    else right--;               // sum too big — need a smaller number
  }
  return null;
}

console.log(twoSumSorted([1, 3, 4, 6, 8], 10)); // [2, 3] — arr[2]=4 and arr[3]=6 sum to 10
```

Each comparison either grows `left` or shrinks `right`; since the array is sorted, that move is guaranteed correct — no pair is skipped or revisited.

## Quick reference

| Technique | Pointer movement | Classic problem | Time complexity |
|---|---|---|---|
| Two Pointers (opposite ends) | Inward from both ends | Two Sum on sorted array | O(n) |
| Two Pointers (same direction) | Both move forward, one faster | Detect a cycle in a linked list | O(n) |
| Sliding Window (fixed size) | Both edges move forward together | Max sum of any subarray of size k | O(n) |
| Sliding Window (variable size) | Right expands, left shrinks on violation | Longest substring without repeating characters | O(n) |

## What interviewers ask

- **Why does moving pointers inward work for Two Sum only if the array is sorted?** — Sorted order guarantees the left pointer only increases the sum and the right only decreases it. On unsorted data, a pointer move doesn't reliably move the sum predictably.
- **How do you find the longest substring without repeats using Sliding Window?** — Expand the window right, tracking seen characters in a set. On a duplicate, shrink from the left until it's removed, updating the max length seen.
- **What's the time complexity of Sliding Window versus brute force, and why?** — O(n), since each edge only moves forward, so each element is added and removed at most once. Brute force is O(n²) or worse since it restarts for every starting index.

## Common mistakes

- Using the opposite-ends Two Pointers trick on unsorted data — it silently gives wrong answers since the logic depends entirely on sorted order.
- Forgetting to shrink the window fully on a violation — a common bug is moving the left pointer once instead of looping until the window is valid again.
