---
title: Queues
slug: queues
summary: FIFO principles, Deque
tags: [data-structures, complexity, fundamentals]
links:
  - title: MDN — Array reference
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
    kind: resource
  - title: Wikipedia — Queue (abstract data type)
    url: "https://en.wikipedia.org/wiki/Queue_(abstract_data_type)"
    kind: resource
---
## In one sentence

A **queue** is a line of items where you add to the back and remove from the front — the first thing in is the first thing out, known as **FIFO** (first in, first out).

## Why it matters

Queues model anything that must be processed in the order it arrived: people waiting in line, print jobs, messages between services, or tasks waiting for a worker. Without FIFO ordering, a system would risk starving early requests while later ones jump ahead, which is unfair or outright broken for things like customer support tickets or event processing.

## The idea

Think of a queue like a checkout line at a shop: new customers join at the back, and the cashier serves whoever has been waiting longest, at the front. The two core operations are **enqueue** (add to the back) and **dequeue** (remove from the front).

A plain JavaScript array can act as a queue with `push` (enqueue) and `shift` (dequeue), but `shift` is O(n) because every remaining element has to move down one slot. For performance-sensitive code, you'd use a **circular buffer** or a linked list with head and tail pointers, both of which make enqueue and dequeue O(1).

A **deque** (double-ended queue) relaxes the rule further: you can add or remove from *either* end, which makes it flexible enough to implement both a stack and a queue, and is the structure behind sliding-window algorithms. A **priority queue** is a different beast entirely — it dequeues by importance rather than arrival order, and is usually built on a heap rather than a plain list.

## In practice

```js
// A queue backed by an object, avoiding the O(n) cost of Array.shift()
class Queue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(value) {
    this.items[this.tail] = value;
    this.tail++;
  }
  dequeue() {
    if (this.head === this.tail) return undefined; // empty
    const value = this.items[this.head];
    delete this.items[this.head];
    this.head++;
    return value;
  }
  peek() {
    return this.items[this.head];
  }
}

const q = new Queue();
q.enqueue('first'); q.enqueue('second'); q.enqueue('third');
console.log(q.dequeue()); // 'first' — served in arrival order
```

Using separate `head`/`tail` counters on an object avoids re-indexing every remaining element, unlike calling `Array.prototype.shift()` in a loop.

## Quick reference

| Operation | Array (`push`/`shift`) | Linked-list or circular-buffer queue |
|---|---|---|
| Enqueue (add to back) | O(1) amortized | O(1) |
| Dequeue (remove from front) | O(n) | O(1) |
| Peek front | O(1) | O(1) |
| Search for a value | O(n) | O(n) |

## What interviewers ask

- **Why is `Array.prototype.shift()` a bad choice for a high-throughput queue?** — `shift()` removes the first element and then re-indexes every remaining element down by one, costing O(n) per call. A queue built with head/tail pointers over a linked list or circular buffer avoids that shift entirely, giving O(1) dequeues.
- **How would you implement a queue using two stacks?** — Push new items onto an 'in' stack; when dequeuing, if an 'out' stack is empty, pop everything off 'in' onto 'out' (reversing order to FIFO) and pop from there. Each element moves between stacks at most once, giving amortized O(1) per operation.
- **When would you use a deque instead of a plain queue?** — When you need efficient access at both ends, such as sliding-window maximum problems where you push and pop from both the front and back of the window as it slides.

## Common mistakes

- Using `Array.shift()` in a hot loop and being surprised by poor performance on large inputs — it silently costs O(n) per call.
- Confusing a queue (FIFO) with a stack (LIFO) when the problem statement implies "process in arrival order," leading to output in the wrong sequence.
- Forgetting to handle the empty-queue case in `dequeue`, causing errors or `undefined` to propagate silently.
