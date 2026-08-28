---
title: Stacks
slug: stacks
summary: LIFO principles, Implementation
tags: [data-structures, complexity, fundamentals]
links:
  - title: MDN — Array.prototype.push/pop
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
    kind: resource
  - title: Wikipedia — Stack (abstract data type)
    url: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)"
    kind: resource
---
## In one sentence

A **stack** is a pile of items where you can only add or remove from the top — the last thing you put on is the first thing you take off, known as **LIFO** (last in, first out).

## Why it matters

Stacks model anything that needs to "remember where it came from" and unwind in reverse: your browser's back button, undo in a text editor, and how function calls track their return points all rely on this exact pattern. Without a stack-like structure, reversing a sequence of steps in the right order would need extra bookkeeping every time.

## The idea

Picture a stack of plates: you place new plates on top, and you always grab the top plate first, never one from the middle or bottom. That's the entire contract of a stack — two operations, **push** (add to the top) and **pop** (remove from the top), plus usually a **peek** (look at the top without removing it).

A stack doesn't care what's underneath until it becomes the new top. This makes it perfect for problems involving matching or nesting, like checking balanced parentheses: every opening bracket gets pushed, and every closing bracket pops the most recent opening bracket to check it matches.

Your program already uses a stack you never see: the **call stack**. Every function call pushes a new frame holding its local variables and return address; when the function returns, its frame pops off. That's also why infinite recursion crashes with a "stack overflow" — the pile of frames grows until it runs out of space.

## In practice

```js
// A stack built on a plain array — push/pop already work at the end
class Stack {
  constructor() { this.items = []; }
  push(value) { this.items.push(value); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}

function isBalanced(str) {
  const stack = new Stack();
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const char of str) {
    if ('([{'.includes(char)) stack.push(char);
    else if (char in pairs) {
      if (stack.pop() !== pairs[char]) return false; // mismatched or empty
    }
  }
  return stack.isEmpty();
}

console.log(isBalanced('({[]})')); // true
console.log(isBalanced('([)]'));   // false
```

Each opening bracket is pushed, and each closing bracket pops the most recent one to verify it's the correct match.

## Quick reference

| Operation | Time complexity |
|---|---|
| Push (add to top) | O(1) |
| Pop (remove from top) | O(1) |
| Peek (read top) | O(1) |
| Search for a value | O(n) |

## What interviewers ask

- **How would you check if a string of brackets is balanced?** — Push every opening bracket onto a stack, and for every closing bracket, pop and check it matches the expected opening bracket; if the stack is empty at a closing bracket or non-empty at the end, it's unbalanced. It works because a stack naturally tracks "most recently opened, must close first," which is exactly nesting order.
- **How would you implement a stack using two queues, or a queue using two stacks?** — For a queue from two stacks, push new items onto stack A; when you need to dequeue, if stack B is empty, pour all of stack A into stack B (reversing the order), then pop from B. This gives amortized O(1) per operation, and interviewers ask it to test whether you understand amortized cost, not just the mechanics.
- **Why does deep recursion cause a "stack overflow"?** — Every recursive call pushes a new frame onto the call stack, and if the recursion doesn't reach a base case quickly enough, the number of frames exceeds the memory reserved for the stack, crashing the program.

## Common mistakes

- Popping from an empty stack without checking `isEmpty()` first, which returns `undefined` in JavaScript instead of throwing — leading to silent bugs downstream.
- Reaching for a stack when you actually need FIFO order (a queue) — mixing these up gives you output in the reverse order you expected.
- Forgetting that array-based stacks in JavaScript should push/pop from the **end**, not the front — using `shift()`/`unshift()` for a stack works but is needlessly O(n) per operation.
