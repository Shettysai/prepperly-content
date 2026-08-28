---
title: Functional Programming
slug: functional-programming
summary: Pure functions, Closures
tags: [fundamentals, javascript]
links:
  - title: MDN — Closures
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"
    kind: resource
  - title: Wikipedia — Functional programming
    url: "https://en.wikipedia.org/wiki/Functional_programming"
    kind: resource
---
## In one sentence

**Functional programming** is a style of writing code where you build programs mainly out of small functions that don't change anything outside themselves, instead of stepping through instructions that update shared state.

## Why it matters

Code that changes shared data from many places is hard to test and reason about, since a bug could come from anywhere that touched that data. Functional style makes bugs easier to isolate, because a function's behavior depends only on its inputs, not on the rest of the program's state. It also underlies patterns you use daily, like `.map()` and `.filter()`.

## The idea

A **pure function** always returns the same output for the same input and doesn't change anything outside itself — no modifying a global variable, no changing the argument passed in, no writing to a file. If a function is pure, you can test it in isolation and trust it won't cause surprises elsewhere.

The opposite is a function with a **side effect** — something reaching outside its own scope, like updating a database or mutating an argument. Side effects aren't wrong (a program with no observable effect is useless), but functional programming pushes them to the edges and keeps the core logic pure.

A **closure** is a function that "remembers" variables from the scope it was created in, even after that scope has finished running — this is how you create functions with private, persistent state without a class.

**Immutability** means never changing data after it's created — instead of modifying an array in place, you create a new array with the change applied, avoiding bugs where one part of the code unexpectedly changes data another part depends on.

## In practice

```js
// Pure function: same input always gives same output, no side effects
function double(n) {
  return n * 2;
}

// Closure: inner function remembers 'count' from its outer scope
function makeCounter() {
  let count = 0;
  return function () {
    count += 1; // this variable persists between calls, hidden from outside
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2 — count was remembered, not reset

// Immutability: create a new array instead of mutating the original
const doubled = [1, 2, 3].map(double); // original array is untouched
```

`makeCounter` shows a closure giving `counter` private, persistent state, while `.map()` shows building a new array instead of changing the original.

## Quick reference

| Concept | Meaning | Example |
|---|---|---|
| Pure function | Same input → same output, no side effects | `n => n * 2` |
| Side effect | Reaches outside the function's own scope | Writing to a database |
| Closure | Function remembers its creation scope's variables | A counter with private state |
| Immutability | Data is never changed after creation | `[...arr, newItem]` not `arr.push()` |

## What interviewers ask

- **What makes a function "pure"?** — Same output for the same input, no observable side effects like modifying external variables or performing I/O, making it predictable and easy to test in isolation.
- **What is a closure, and when would you use one?** — A function bundled with references to variables from its enclosing scope; a common use is a counter or memoization cache with private state, without needing a class.
- **Why does functional programming favor immutability?** — Shared mutable data is a common source of bugs, where one part of a program changes data another part relies on; immutable data removes that entire category of bug.

## Common mistakes

- Thinking a function that only reads external variables is impure — a function is impure only if its output is inconsistent or it changes something outside itself, not merely because it reads outer scope.
- Overusing closures for state that would be clearer as a class or object — closures are powerful but can make debugging harder for complex, evolving state.
