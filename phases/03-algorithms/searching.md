---
title: Searching
slug: searching
summary: Linear Search, Binary Search
tags: [searching, algorithms, complexity]
links:
  - title: Wikipedia — Binary search algorithm
    url: "https://en.wikipedia.org/wiki/Binary_search_algorithm"
    kind: resource
  - title: MDN — Array.prototype.indexOf()
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf"
    kind: resource
---
## In one sentence

**Searching** means finding whether a target value exists in a collection (and often where it is), and the two core techniques are **Linear Search** (check every item one by one) and **Binary Search** (repeatedly cut a sorted list in half).

## Why it matters

Almost every program looks things up — a user by ID, a word in a dictionary, a price in a sorted list. Picking the right search strategy is the difference between an app that feels instant and one that crawls as data grows, and it's the most common building block inside bigger algorithms and interview problems.

## The idea

**Linear Search** is the obvious approach: check each item in order until you find the target or run out. It works on any list, sorted or not, but in the worst case you check every element.

**Binary Search** only works on a **sorted** list, but it's dramatically faster. Think of looking up a name in a phone book: you open to the middle, see whether your name comes before or after that page, and throw away the half you don't need. Repeat on the remaining half until you land on the answer. Each step eliminates half the remaining data, so instead of checking n items you check about log₂(n) — for a million items, roughly 20 checks instead of a million.

The trade-off: Binary Search needs sorted data to work, and if your data changes often, keeping it sorted has its own cost. Linear Search needs no setup at all.

## In practice

```js
function binarySearch(sortedArr, target) {
  let low = 0;
  let high = sortedArr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedArr[mid] === target) return mid;      // found it
    if (sortedArr[mid] < target) low = mid + 1;      // target is in the right half
    else high = mid - 1;                             // target is in the left half
  }
  return -1; // not found
}

console.log(binarySearch([1, 3, 5, 7, 9, 11], 7)); // 3
```

Every loop iteration throws away half the remaining search space by moving `low` or `high` — that halving is what makes it O(log n) instead of O(n).

## Quick reference

| Algorithm | Requires sorted input? | Time complexity | Space |
|---|---|---|---|
| Linear Search | No | O(n) | O(1) |
| Binary Search | Yes | O(log n) | O(1) iterative, O(log n) recursive |

## What interviewers ask

- **Why can't you binary search an unsorted array?** — It decides which half to discard by comparing the middle value to the target, which only works if one side is guaranteed smaller and the other guaranteed larger. Without sorted order, you could discard the half containing your target.
- **What's the time complexity of Binary Search and why?** — O(log n), since each comparison eliminates half the remaining elements — the number of comparisons is how many times you can halve n before reaching 1.
- **How would you search a sorted array that's also been rotated (e.g., [4,5,6,1,2,3])?** — At each step, figure out which half of the array is still properly sorted, check if the target falls in that half's range, and recurse into the correct half. A very common follow-up.

## Common mistakes

- Writing `mid = (low + high) / 2` can overflow in languages with fixed-size integers — `low + Math.floor((high - low) / 2)` is the safer pattern (less critical in JS, but interviewers expect you to know why).
- Forgetting `+1`/`-1` when updating `low` or `high` causes infinite loops — trace through a 2-3 element example to check your boundaries.
