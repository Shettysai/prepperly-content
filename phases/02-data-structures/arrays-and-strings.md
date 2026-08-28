---
title: Arrays & Strings
slug: arrays-and-strings
summary: Dynamic arrays, String builder
tags: [data-structures, complexity, javascript, fundamentals]
links:
  - title: MDN — Array reference
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
    kind: resource
  - title: MDN — String reference
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"
    kind: resource
---
## In one sentence

An **array** is a row of boxes, all the same size, sitting next to each other in memory, and a **string** is just an array of characters with some extra rules.

## Why it matters

Almost every interview question touches an array or a string, because they are the simplest way to hold a group of related values in order. Without arrays you would need a separate named variable for every item, which falls apart the moment you have more than a handful of values.

## The idea

Because every box in an array is the same size and sits back-to-back in memory, the computer can jump straight to box number 5 using simple math — no searching required. This is why reading `arr[5]` is instant, regardless of how big the array is.

JavaScript arrays are actually **dynamic arrays**: under the hood, when the fixed-size block fills up, the engine allocates a bigger block elsewhere and copies everything over. You never see this happen, but it explains why adding to the end (`push`) is usually fast, while adding to the front (`unshift`) is slow — every existing item has to shift over by one.

Strings behave like read-only arrays of characters. In JavaScript, strings are **immutable**: `str[0] = 'X'` silently does nothing. Any "change" — `toUpperCase()`, `slice()`, concatenation — actually builds a brand new string. That is why repeatedly gluing strings together in a loop with `+=` is wasteful; a **string builder** pattern (collecting pieces in an array, then joining once) avoids creating a new string on every step.

## In practice

```js
// Dynamic array growth and a string-builder pattern
const nums = [1, 2, 3];
nums.push(4);              // fast: adds to the end, amortized O(1)
nums.unshift(0);           // slow: shifts every element right, O(n)

// Building a string efficiently
const parts = [];
for (let i = 0; i < 5; i++) {
  parts.push(`item-${i}`);
}
const joined = parts.join(', '); // one allocation instead of five
console.log(joined); // "item-0, item-1, item-2, item-3, item-4"
```

The loop collects pieces in an array first, then joins once, instead of rebuilding a new string on every iteration.

## Quick reference

| Operation | Array | String |
|---|---|---|
| Access by index | O(1) | O(1) |
| Search (unsorted) | O(n) | O(n) |
| Insert/delete at end | O(1) amortized | O(n) — new string |
| Insert/delete at start/middle | O(n) | O(n) |
| Mutable? | Yes | No (immutable) |

## What interviewers ask

- **Why is array access O(1) but linked list access is not?** — Arrays store elements contiguously, so the address of any index is computed with simple arithmetic. Linked lists store nodes scattered in memory, so you must walk from the head to reach a given position.
- **Why is string concatenation in a loop slow?** — Because strings are immutable, each `+=` creates an entirely new string and copies the old contents in, turning an n-step loop into roughly O(n²) work. Using an array plus `join()` avoids the repeated copying.
- **Reverse a string in place — can you?** — Not truly in place in JavaScript since strings are immutable; you convert to an array, reverse the array, and join it back, which is O(n) time and O(n) extra space.
- **What's the difference between a static array and a dynamic array?** — A static array has a fixed size set at creation; a dynamic array (like JS arrays or Python lists) resizes itself automatically by allocating a larger block and copying elements when it runs out of room.

## Common mistakes

- Assuming `array.push()` and `array.unshift()` cost the same — they don't; `unshift` re-indexes every element.
- Mutating a string directly (`str[0] = 'a'`) and being surprised nothing changes — always reassign the result of a string method instead.
- Using `+=` to build a large string inside a loop instead of collecting pieces in an array and calling `.join()` once.
