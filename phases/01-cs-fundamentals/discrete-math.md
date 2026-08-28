---
title: Discrete Math
slug: discrete-math
summary: Boolean logic, Set theory
tags: [fundamentals, algorithms]
links:
  - title: MDN — Set object reference
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set"
    kind: resource
  - title: Wikipedia — Discrete mathematics
    url: "https://en.wikipedia.org/wiki/Discrete_mathematics"
    kind: resource
---
## In one sentence

**Discrete math** is the branch of math dealing with distinct, separate values (like whole numbers and true/false logic) rather than smoothly changing quantities, and it's the math that underlies how computers actually think.

## Why it matters

Every `if` statement, every database query, every set of unique users — all of it rests on discrete math ideas like logic and sets. You don't need to be a mathematician to write code, but recognizing these patterns makes you faster at reasoning through conditionals, deduplicating data, and understanding why certain algorithms work.

## The idea

**Boolean logic** is the math of true and false. You already use it constantly: `AND` is true only when both sides are true, `OR` is true when at least one side is true, `NOT` flips true to false and back. Every `if (a && b)` in your code is a small piece of boolean logic, and simplifying complicated conditions is really just simplifying boolean expressions.

A **set** is simply a collection of distinct items with no duplicates and (usually) no particular order — like a bag of unique marbles. Two core operations are **union** (everything in either set, combined) and **intersection** (only what's in both sets). If you've ever deduplicated a list or found items common to two arrays, you've already used set theory without naming it.

**Logic gates and truth tables** are how you systematically check every possible combination of true/false inputs and what they produce — useful for verifying a complicated condition actually does what you think for every case, not just the cases you happened to test.

Discrete math also covers **combinatorics** — counting how many ways something can happen, like how many possible passwords exist given certain rules — which comes up when you reason about how large a search space is, or why brute-forcing something is or isn't feasible.

## In practice

```js
// Boolean logic: a condition combining AND, OR, NOT
function canVote(age, isCitizen) {
  return age >= 18 && isCitizen; // AND: both conditions must hold
}

// Set theory: using JavaScript's Set to remove duplicates and find overlap
const groupA = new Set([1, 2, 3, 4]);
const groupB = new Set([3, 4, 5, 6]);

const union = new Set([...groupA, ...groupB]);              // {1,2,3,4,5,6}
const intersection = new Set([...groupA].filter(x => groupB.has(x))); // {3,4}

console.log([...union]);
console.log([...intersection]);
```

The `Set` object naturally enforces uniqueness, and combining two sets with spread plus `filter` is exactly the union and intersection operations from set theory.

## Quick reference

| Concept | Meaning | Everyday example |
|---|---|---|
| AND (`&&`) | True only if both are true | Old enough AND has a license |
| OR (`\|\|`) | True if at least one is true | Has a coupon OR is a member |
| NOT (`!`) | Flips true/false | Not logged in |
| Union | Combine, no duplicates | All students in either class |
| Intersection | Only what's in both | Students in both classes |

## What interviewers ask

- **How would you simplify this compound boolean condition?** — Apply boolean algebra rules like De Morgan's laws (`!(a && b)` equals `!a || !b`), which often turn a confusing nested condition into something much more readable, without changing its behavior.
- **How would you find common elements between two lists efficiently?** — Convert one list into a `Set` (O(n) to build), then check membership for each item in the other list (O(1) per lookup), giving O(n) total instead of the O(n²) of comparing every pair directly.
- **What's the difference between a set and an array?** — A set stores only unique values with no guaranteed order and offers fast membership checks; an array allows duplicates, preserves insertion order, and checking membership means scanning through it.

## Common mistakes

- Writing nested `if` statements instead of recognizing they're a single boolean expression that can be simplified with `&&`, `\|\|`, and De Morgan's laws.
- Using an array and `.includes()` for repeated membership checks on large data — this is O(n) per check, while a `Set`'s `.has()` is O(1), which matters a lot as the data grows.
