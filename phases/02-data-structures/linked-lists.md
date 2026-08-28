---
title: Linked Lists
slug: linked-lists
summary: Singly, Doubly, Circular
tags: [data-structures, complexity, fundamentals]
links:
  - title: Wikipedia — Linked list
    url: "https://en.wikipedia.org/wiki/Linked_list"
    kind: resource
  - title: Node.js docs
    url: "https://nodejs.org/docs/latest/api/"
    kind: resource
---
## In one sentence

A **linked list** is a chain of items where each item (a **node**) holds its value plus a pointer to the next node, instead of all items sitting side by side like an array.

## Why it matters

Arrays are fast to read but expensive to grow or shrink in the middle, because every later element must shift. Linked lists solve exactly that problem: inserting or removing a node only means re-pointing a couple of links, which is why they show up under the hood of queues, undo history, and music "play next" features.

## The idea

Think of a linked list like a treasure hunt: each clue tells you where to find the next clue, but you can't jump straight to clue 5 — you have to follow the chain from the start. That's the trade-off versus an array: no random access, but cheap insertion and deletion once you're at the right spot.

A **singly linked list** node points only forward, to the next node. A **doubly linked list** node points both forward and backward, which makes it easy to walk in either direction and to delete a node in O(1) once you have a reference to it, since you don't need to re-find its predecessor. A **circular linked list** is either variant with the last node pointing back to the first instead of to `null`, useful for things like round-robin scheduling.

Every list keeps a `head` pointer (the start), and often a `tail` pointer (the end) so appending doesn't require walking the whole list. The last node's `next` is `null`, which is how you know you've reached the end.

## In practice

```js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  push(value) {
    const node = new Node(value);
    if (!this.head) { this.head = node; return; }
    let current = this.head;
    while (current.next) current = current.next; // walk to the end
    current.next = node;
  }
  toArray() {
    const out = [];
    let current = this.head;
    while (current) { out.push(current.value); current = current.next; }
    return out;
  }
}

const list = new LinkedList();
list.push(1); list.push(2); list.push(3);
console.log(list.toArray()); // [1, 2, 3]
```

Each node only knows about the node after it; `toArray` follows those `next` pointers one at a time until it hits `null`.

## Quick reference

| Operation | Array | Singly Linked List |
|---|---|---|
| Access by index | O(1) | O(n) |
| Search by value | O(n) | O(n) |
| Insert/delete at head | O(n) | O(1) |
| Insert/delete at tail (with tail pointer) | O(1) amortized | O(1) |
| Insert/delete in middle (given node ref) | O(n) | O(1) |

## What interviewers ask

- **How do you detect a cycle in a linked list?** — Use Floyd's cycle detection (the "tortoise and hare"): one pointer moves one step at a time, another moves two steps; if they ever meet, there's a cycle, and if the fast pointer hits `null`, there isn't. It runs in O(n) time and O(1) space, which is the whole point versus using a hash set to track visited nodes.
- **How do you reverse a linked list?** — Walk through the list once, and at each node flip its `next` pointer to point backward to the previous node, keeping track of previous, current, and next as you go. This is O(n) time and O(1) space, and is a very common whiteboard question because it tests pointer manipulation directly.
- **Why use a linked list instead of an array?** — When you're doing frequent insertions or deletions away from the end, and you don't need random access by index, a linked list avoids the shifting cost that arrays pay.

## Common mistakes

- Forgetting to update the `head` when inserting or deleting at the very front of the list, which silently drops the connection to the rest of the chain.
- Losing a reference to the rest of the list by overwriting a `next` pointer before saving it in a temporary variable — always save `next` first when rewiring nodes.
- Assuming linked lists are always better for insertion — for random-access-heavy or read-heavy workloads, arrays usually win because of memory locality.
