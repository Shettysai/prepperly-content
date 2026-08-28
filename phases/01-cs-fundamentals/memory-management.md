---
title: Memory Management
slug: memory-management
summary: Stack vs Heap, Pointers
tags: [memory, fundamentals, javascript]
links:
  - title: MDN — Memory management
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management"
    kind: resource
  - title: Wikipedia — Garbage collection (computer science)
    url: "https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)"
    kind: resource
---
## In one sentence

**Memory management** is how a program asks for, uses, and gives back the computer's RAM while it runs.

## Why it matters

Every variable, object, and function call needs somewhere to live in memory. Get it wrong and you get a program that crashes from running out of memory, or one that slows down because it's holding on to things it no longer needs. Understanding it also explains bugs like a variable holding an unexpected shared value.

## The idea

A running program uses two regions of memory: the **stack** and the **heap**. The stack works like a stack of plates — you add one on top (push) and remove from the top (pop), in strict order. Each function call pushes a new "frame" holding its local variables; when the function returns, that frame is popped and instantly reclaimed. This makes the stack fast, but limited in size and only good for data whose size is known upfront.

The **heap** is more like a warehouse where you can store things in any order, sized however you need. Objects, arrays, and anything that must outlive the function that created it goes here. The heap is flexible but slower to manage, since something has to track what's still in use.

That "something" is **garbage collection** in languages like JavaScript and Java: it automatically finds heap memory nothing points to anymore and frees it, by tracing which objects are still reachable from your running code. Languages like C require you to free memory yourself — forget, and you get a **memory leak**; free something twice, and you get a crash.

A **pointer** (or a **reference**, in JavaScript) is a variable that stores the *location* of a value rather than the value itself, which is how two variables can end up sharing the same object.

## In practice

```js
function createUser() {
  const id = 42;                 // primitive: copied by value
  const profile = { name: 'A' }; // object: lives on the heap
  return profile;                // only the reference survives
}

const user1 = createUser();
const user2 = user1;             // user2 points to the SAME heap object
user2.name = 'B';
console.log(user1.name);         // 'B' — both variables reference one object
```

Primitives are copied by value, but objects are shared by reference, which is why mutating `user2` also changes what `user1` sees.

## Quick reference

| Concept | Stack | Heap |
|---|---|---|
| Speed | Very fast | Slower |
| Size | Small, fixed limit | Large, flexible |
| Lifetime | Ends when function returns | Until nothing references it |
| Stores | Primitives, call frames | Objects, arrays, closures |
| Managed by | Automatic (call/return) | Garbage collector or manual `free` |

## What interviewers ask

- **What's the difference between stack and heap memory?** — The stack holds short-lived, fixed-size data tied to function calls and frees itself automatically; the heap holds longer-lived, variable-sized data that a garbage collector or manual code must reclaim.
- **What causes a memory leak in JavaScript?** — Something you no longer need stays reachable from a live reference, like a forgotten event listener or an array that only ever grows; the collector can only free what it proves is unreachable.
- **What is a stack overflow?** — Too many nested function calls (often unbounded recursion) exhaust the stack's limited space, since each call adds another frame.

## Common mistakes

- Assuming copying an object variable copies its data — it copies the reference; use `{ ...obj }` or `structuredClone` for an actual copy.
- Thinking garbage collection makes leaks impossible — you can still leak by keeping a reference alive longer than you meant to, such as in a global array or an unremoved listener.
