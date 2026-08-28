---
title: Binary Search Trees
slug: binary-search-trees
summary: Insertion, Deletion, Searching
tags: [data-structures, trees, searching, complexity]
links:
  - title: Wikipedia — Binary search tree
    url: "https://en.wikipedia.org/wiki/Binary_search_tree"
    kind: resource
  - title: Wikipedia — AVL tree
    url: "https://en.wikipedia.org/wiki/AVL_tree"
    kind: resource
---
## In one sentence

A **binary search tree** (BST) is a binary tree with one extra rule: for every node, everything in its left subtree is smaller, and everything in its right subtree is larger, which lets you search it the way you'd search a sorted phone book.

## Why it matters

That one ordering rule is what turns a tree into a fast lookup structure: instead of scanning every item, you can eliminate half the remaining tree at each step, similar to binary search on a sorted array. BSTs back many language library implementations of ordered sets and maps, because they support fast search, insert, delete, *and* keep everything sorted, which a hash table cannot do.

## The idea

Imagine guessing a number between 1 and 100: you'd ask "is it more than 50?" and immediately discard half the range. A BST works the same way — at each node, you compare your target to the node's value, then go left if it's smaller or right if it's larger, discarding the other half of the tree each time.

Inserting works by the same walk: follow left/right comparisons until you fall off the tree, then attach the new node there. Deleting is the trickiest operation, because removing a node with two children would break the tree unless you patch the gap — the standard fix is to replace the deleted node's value with its **in-order successor** (the smallest value in its right subtree) and then delete that successor instead, which is guaranteed to have at most one child.

The entire point of a BST is that its height determines its speed. If you insert values in random order, the tree tends to stay roughly balanced, giving O(log n) height. But if you insert already-sorted data (1, 2, 3, 4...), every node only ever gets a right child, and the tree degenerates into a straight line — effectively a linked list with O(n) operations. This is exactly why self-balancing variants like AVL trees and red-black trees exist: they rebalance automatically after every insert or delete.

## In practice

```js
class Node {
  constructor(value) { this.value = value; this.left = null; this.right = null; }
}

function insert(node, value) {
  if (!node) return new Node(value);
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  return node;
}

function contains(node, value) {
  if (!node) return false;
  if (value === node.value) return true;
  return value < node.value ? contains(node.left, value) : contains(node.right, value); // halve the search space
}

let root = null;
for (const n of [5, 3, 8, 1, 4]) root = insert(root, n);
console.log(contains(root, 4)); // true
console.log(contains(root, 9)); // false
```

Each comparison rules out one entire subtree, so search cost is proportional to the tree's height, not its total size.

## Quick reference

| Operation | Balanced BST | Degenerate (skewed) BST |
|---|---|---|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Find min/max | O(log n) | O(n) |
| In-order traversal gives | Sorted output | Sorted output |

## What interviewers ask

- **How do you validate that a binary tree is a valid BST?** — Don't just compare each node to its immediate children; track a valid (min, max) range as you recurse down, tightening the bounds at each step, since a node deep in the left subtree must be smaller than every ancestor above it, not just its direct parent.
- **How do you delete a node with two children from a BST?** — Find its in-order successor (the leftmost node in its right subtree), copy that value into the node being deleted, then delete the successor node from the right subtree, which is guaranteed to have at most one child, making that deletion simple.
- **Why can BST performance degrade to O(n), and how do self-balancing trees fix it?** — Inserting sorted data in order creates a tree that's really a straight chain. Self-balancing trees like AVL or red-black trees perform rotations after inserts/deletes to keep the height at O(log n) regardless of insertion order.

## Common mistakes

- Validating a BST by only checking a node against its direct children instead of the full valid range inherited from all ancestors.
- Forgetting that deleting a node with two children requires finding a replacement (successor or predecessor) rather than just removing it.
- Assuming a BST is always O(log n) — without self-balancing, sorted or nearly-sorted input degrades it to a linked list.
