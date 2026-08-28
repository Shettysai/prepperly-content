---
title: Divide and Conquer
slug: divide-and-conquer
summary: Master theorem, Closest pair
tags: [algorithms, recursion, complexity, sorting]
links:
  - title: Wikipedia — Divide-and-conquer algorithm
    url: "https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm"
    kind: resource
  - title: Wikipedia — Master theorem (analysis of algorithms)
    url: "https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)"
    kind: resource
---
## In one sentence

**Divide and Conquer** solves a big problem by splitting it into smaller identical sub-problems, solving each independently (often by splitting again), then combining their answers into the answer for the whole problem.

## Why it matters

Many fast algorithms — Merge Sort, Quick Sort, binary search, even multiplying enormous numbers efficiently — are built on this one idea. Understanding the three-step pattern lets you recognize a whole family of algorithms instead of memorizing each one separately, and it's the basis for analyzing recursive time complexity using the **Master Theorem**.

## The idea

Every divide-and-conquer algorithm follows three steps: **Divide** into smaller sub-problems of the same type, **Conquer** each one (recursing until trivially small), and **Combine** the results. Merge Sort is the cleanest example: divide the array in half, conquer each half recursively, combine by merging the sorted halves.

The **Master Theorem** is a shortcut formula for time complexity without working through recursion by hand. It looks at three things: how many sub-problems you split into, how much smaller each is, and the combine cost. For Merge Sort: 2 sub-problems, each half size, combining costs O(n) — plugging that in gives O(n log n).

A good analogy: finding the closest pair of points among thousands on a map. Checking every pair is O(n²). Divide and Conquer splits the points into a left half and right half, finds the closest pair within each recursively, then does a cheaper check across the dividing line — turning a quadratic problem into O(n log n).

## In practice

```js
// Classic divide and conquer: find the maximum value in an array
function maxDivideAndConquer(arr, low = 0, high = arr.length - 1) {
  if (low === high) return arr[low]; // base case: one element is trivially the max

  const mid = Math.floor((low + high) / 2);
  const leftMax = maxDivideAndConquer(arr, low, mid);       // conquer left half
  const rightMax = maxDivideAndConquer(arr, mid + 1, high); // conquer right half

  return Math.max(leftMax, rightMax); // combine: the overall max is the bigger of the two
}

console.log(maxDivideAndConquer([3, 7, 2, 9, 4])); // 9
```

Each recursive call handles half the array, and `Math.max` at the end is the entire "combine" step — O(1), since comparing two numbers is trivial.

## Quick reference

| Algorithm | Divide | Combine cost | Overall time |
|---|---|---|---|
| Merge Sort | Split array in half | O(n) merge | O(n log n) |
| Binary Search | Split search range in half | O(1) — pick a side | O(log n) |
| Closest Pair of Points | Split points by x-coordinate | O(n) cross-boundary check | O(n log n) |
| Max of an array | Split array in half | O(1) — compare two values | O(n) |

## What interviewers ask

- **What are the three steps of divide and conquer?** — Divide (split into smaller sub-problems), Conquer (solve each recursively), and Combine (merge results, e.g., merging two sorted halves in Merge Sort).
- **How does the Master Theorem help analyze these algorithms?** — It gives a direct formula for time complexity from how many sub-problems you create, how much smaller each is, and the combine cost — no need to expand the recursion tree by hand.
- **What's the difference between Divide and Conquer and DP?** — Divide and Conquer's sub-problems don't overlap, so caching gives no benefit; DP targets problems where sub-problems repeat, and caching is what makes it fast.

## Common mistakes

- Assuming any recursive algorithm is "divide and conquer" — the defining feature is independent, non-overlapping sub-problems; overlapping ones are a sign you want DP instead.
- Forgetting the combine step's cost when reasoning about total complexity — an expensive combine (like an O(n) merge) changes the overall complexity even when dividing is cheap.
