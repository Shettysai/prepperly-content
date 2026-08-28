---
title: Sorting
slug: sorting
summary: Bubble, Insertion, Selection
tags: [sorting, algorithms, complexity]
links:
  - title: MDN — Array.prototype.sort()
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort"
    kind: resource
  - title: Wikipedia — Sorting algorithm
    url: "https://en.wikipedia.org/wiki/Sorting_algorithm"
    kind: resource
---
## In one sentence

**Sorting** means putting a list of items into order — smallest to largest, or A to Z — and the simple sorting algorithms (Bubble, Insertion, Selection) do it by repeatedly comparing and swapping neighbors until everything lines up.

## Why it matters

A sorted list unlocks fast searching (binary search needs sorted data), makes duplicates easy to spot, and is the first thing interviewers use to teach you how to reason about loops-inside-loops and time complexity. Real databases and languages sort constantly — under the hood, but the simple versions are where you learn the mechanics.

## The idea

Imagine sorting playing cards in your hand. **Bubble Sort** repeatedly walks through the list, comparing each pair of neighbors and swapping them if they're in the wrong order — the largest value "bubbles" to the end each pass. **Selection Sort** instead scans the whole unsorted part to find the smallest value, then puts it at the front — one correct placement per pass. **Insertion Sort** builds the sorted list one card at a time, picking up the next card and sliding it into its correct spot among the cards already sorted, exactly like organizing a hand of cards as you're dealt them.

All three take roughly n² comparisons in the worst case, since for each of the n elements you may scan the rest again. The difference is *when* they do work: Bubble swaps early and often, Selection finds-then-places, Insertion is usually fastest on nearly-sorted data because it can stop early.

## In practice

```js
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;
    // Shift every larger element one step right to make room for `current`
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}

console.log(insertionSort([5, 2, 4, 6, 1, 3])); // [1, 2, 3, 4, 5, 6]
```

The `while` loop is the whole algorithm: it slides `current` left past anything bigger than it, one swap at a time, until it lands in its correct slot.

## Quick reference

| Algorithm | Best case | Worst case | Space | Stable? |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(1) | Yes |

## What interviewers ask

- **Why are these O(n²), and when would you use one?** — Each has a loop inside a loop over roughly n elements. Insertion Sort is genuinely useful for small or nearly-sorted arrays, and many production sorts fall back to it below a size threshold.
- **What does "stable" mean?** — A stable sort keeps equal elements in their original relative order, which matters when sorting by one field after already sorting by another.
- **Which of the three does the fewest swaps?** — Selection Sort: at most one swap per pass, useful when swapping is expensive.

## Common mistakes

- Confusing "comparisons" with "swaps" — Bubble Sort compares O(n²) times but Selection Sort swaps far less; know which cost you're being asked about.
- Forgetting the early-exit optimization for Bubble Sort (stop if a pass makes zero swaps) — without it, you miss the O(n) best case on already-sorted input.
