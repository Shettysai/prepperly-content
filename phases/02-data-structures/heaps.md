---
title: Heaps
slug: heaps
summary: Min-heap, Max-heap, Priority Queues
tags: [data-structures, trees, complexity, algorithms]
links:
  - title: Wikipedia — Heap (data structure)
    url: "https://en.wikipedia.org/wiki/Heap_(data_structure)"
    kind: resource
  - title: Wikipedia — Binary heap
    url: "https://en.wikipedia.org/wiki/Binary_heap"
    kind: resource
---
## In one sentence

A **heap** is a tree-shaped structure that always keeps the smallest (or largest) value easily reachable at the top, without bothering to fully sort everything else underneath it.

## Why it matters

Many problems only ever need "give me the current minimum" or "give me the current maximum," repeatedly, as items come and go — task schedulers picking the next highest-priority job, or algorithms like Dijkstra's shortest path that always process the closest unvisited node next. A heap answers that question in O(log n) without paying the cost of keeping the entire collection sorted.

## The idea

Picture a hospital triage queue: patients aren't served in the order they arrived, and the staff doesn't fully sort the waiting room by severity either — they just always know who the most urgent patient is right now, and pull that person next. That's exactly what a heap optimizes for.

A **min-heap** keeps the smallest value at the root, and enforces one rule throughout the tree: every parent is smaller than or equal to both of its children. A **max-heap** flips this rule so every parent is larger. Critically, siblings have no required order relative to each other, and the tree is only loosely sorted — that relaxed rule is exactly what makes heaps cheaper to maintain than a fully sorted structure.

Heaps are usually implemented on a plain array. Because a **binary heap** is always a *complete* tree (every level full except possibly the last, filled left to right), you can find any node's parent and children with index arithmetic: a node at index `i` has children at `2i + 1` and `2i + 2`, and a parent at `Math.floor((i - 1) / 2)`. Adding a value places it at the array's end and "bubbles it up" while it violates the rule; removing the top moves the last element to the root and "sinks it down" until the rule holds again. A **priority queue** is the concept ("give me the next most important item"); a heap is the structure almost always used to implement it.

## In practice

```js
// A minimal min-heap using array index math
class MinHeap {
  constructor() { this.items = []; }
  push(value) {
    this.items.push(value);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.items[parent] <= this.items[i]) break;
      [this.items[parent], this.items[i]] = [this.items[i], this.items[parent]]; // bubble up
      i = parent;
    }
  }
  pop() {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length) { this.items[0] = last; this.sinkDown(0); }
    return top;
  }
  sinkDown(i) {
    const n = this.items.length;
    while (true) {
      let smallest = i, left = 2 * i + 1, right = 2 * i + 2;
      if (left < n && this.items[left] < this.items[smallest]) smallest = left;
      if (right < n && this.items[right] < this.items[smallest]) smallest = right;
      if (smallest === i) break;
      [this.items[i], this.items[smallest]] = [this.items[smallest], this.items[i]];
      i = smallest;
    }
  }
}

const heap = new MinHeap();
[5, 2, 8, 1].forEach(n => heap.push(n));
console.log(heap.pop()); // 1 — always the current minimum
```

`push` bubbles the new value up until parents are smaller, and `pop` moves the last item to the root and sinks it down until the heap rule holds again.

## Quick reference

| Operation | Time complexity |
|---|---|
| Peek min/max (root) | O(1) |
| Insert | O(log n) |
| Remove min/max | O(log n) |
| Build heap from n items | O(n) |
| Search for arbitrary value | O(n) |

## What interviewers ask

- **How would you find the k largest elements in an array?** — Maintain a min-heap of size k: push each element, and if the heap exceeds size k, pop the smallest. At the end, the heap holds exactly the k largest elements. This is O(n log k), better than fully sorting the array at O(n log n) when k is small.
- **Why is finding the min in O(1) but deleting it O(log n)?** — The minimum always sits at the root, so peeking is a single array access. But removing it leaves a hole at the root that must be refilled and then "sunk down" to restore the heap property, which takes a number of swaps proportional to the tree's height.
- **How is a heap different from a binary search tree?** — A heap only guarantees a parent-child ordering (parent smaller/larger than children), while a BST guarantees a full left-smaller/right-larger ordering that supports efficient search for arbitrary values; that's why heaps can't be searched in O(log n) but BSTs can.

## Common mistakes

- Expecting a heap's array or traversal to be fully sorted — it isn't; only the root is guaranteed to be the min or max.
- Trying to search for an arbitrary value in a heap in O(log n), as if it were a BST — heaps only support fast access to the top element, not general search.
- Forgetting to "sink down" (or "bubble up") after modifying the heap, which leaves the structure violating its core invariant and breaks every future operation.
