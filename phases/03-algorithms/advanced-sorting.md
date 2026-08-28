---
title: Advanced Sorting
slug: advanced-sorting
summary: Merge Sort, Quick Sort
tags: [sorting, algorithms, complexity, recursion]
links:
  - title: Wikipedia — Merge sort
    url: "https://en.wikipedia.org/wiki/Merge_sort"
    kind: resource
  - title: Wikipedia — Quicksort
    url: "https://en.wikipedia.org/wiki/Quicksort"
    kind: resource
  - title: MDN — Array.prototype.sort()
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort"
    kind: resource
---
## In one sentence

**Merge Sort** and **Quick Sort** are faster sorting algorithms that get a full array in order in O(n log n) time by splitting the problem into smaller pieces instead of comparing every pair of elements.

## Why it matters

The simple sorts (Bubble, Insertion, Selection) take O(n²) time, which becomes painfully slow past a few thousand items. Merge Sort and Quick Sort are what real languages actually use under the hood — JavaScript's `Array.prototype.sort` and most standard libraries are built on variations of these — because O(n log n) scales to millions of items.

## The idea

Both use **divide and conquer**: break the problem into smaller sub-problems, solve those, then combine. Think of Merge Sort like splitting a huge pile of papers in half repeatedly with a friend until you each have one sheet, then merging pairs of sorted piles back together by always taking the smaller top sheet first.

**Merge Sort** splits the array in half repeatedly until each piece has one element, then merges pairs of sorted pieces back together, comparing the front of each pile at every step. It always takes O(n log n), since splitting takes log n levels and merging each level costs O(n).

**Quick Sort** works differently: pick a **pivot**, then rearrange the array so everything smaller is on its left and everything bigger is on its right — called **partitioning**. Then recursively sort the left and right sides. This averages O(n log n) too, but a bad pivot choice can degrade it to O(n²).

## In practice

```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr; // a single element is already sorted

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    // always take the smaller of the two current fronts
    merged.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return [...merged, ...left.slice(i), ...right.slice(j)];
}

console.log(mergeSort([5, 2, 4, 6, 1, 3])); // [1, 2, 3, 4, 5, 6]
```

The recursion splits the array down to single elements, and the `while` loop does all the real work: merging two already-sorted halves in one linear pass.

## Quick reference

| Algorithm | Average | Worst case | Space | Stable? |
|---|---|---|---|---|
| Merge Sort | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n²) | O(log n) | No |

## What interviewers ask

- **Why is Quick Sort usually faster in practice despite a worse worst case?** — It sorts in place with O(log n) extra space, while Merge Sort needs O(n) extra memory. Fewer allocations and better cache locality make Quick Sort win on average.
- **How do you avoid Quick Sort's O(n²) worst case?** — Pick the pivot randomly, or use "median of three," so unlucky already-sorted input can't consistently force the worst pivot.
- **When would you choose Merge Sort over Quick Sort?** — When you need a stable sort, or when sorting linked lists or data too large for memory, where sequential access beats in-place swaps.

## Common mistakes

- Thinking Quick Sort is "always" O(n log n) — a poor pivot on already-sorted or reverse-sorted input degrades it to O(n²) without randomization.
- Forgetting Merge Sort's O(n) space cost — it's not free; in memory-constrained environments that extra array matters.
