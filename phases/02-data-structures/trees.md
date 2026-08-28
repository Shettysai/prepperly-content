---
title: Trees
slug: trees
summary: Binary Trees, Traversals
tags: [data-structures, trees, recursion, complexity]
links:
  - title: Wikipedia — Tree (data structure)
    url: "https://en.wikipedia.org/wiki/Tree_(data_structure)"
    kind: resource
  - title: MDN — Recursion
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Recursion"
    kind: resource
---
## In one sentence

A **tree** is a way of organizing data as a hierarchy: one item at the top (the **root**), branching down into **children**, like a family tree or a folder structure on your computer.

## Why it matters

Most real-world data is naturally hierarchical — file systems, HTML/DOM structure, org charts, and comment threads all branch rather than sit in a flat line. Trees let you represent that branching directly, and they're the foundation that binary search trees, heaps, and tries all build on.

## The idea

Every tree starts at a single **root node**. Each node can have zero or more **children**, and a node with no children is called a **leaf**. The relationship is always parent-to-child, never circular — a tree with a cycle isn't a tree anymore, it's a graph.

A **binary tree** restricts each node to at most two children, conventionally called **left** and **right**. This restriction is what makes binary trees predictable enough to reason about depth and shape.

To actually process a tree, you **traverse** it — visit every node in some order. **Depth-first traversals** go as deep as possible down one branch before backing up: **pre-order** visits a node before its children, **in-order** visits the left child, then the node, then the right child (useful for getting sorted output from a binary search tree), and **post-order** visits both children before the node itself. **Breadth-first traversal** (also called level-order) visits the tree level by level, using a queue instead of recursion, which is how you'd find the shortest path in an unweighted tree-like structure.

## In practice

```js
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function inOrder(node, result = []) {
  if (!node) return result;
  inOrder(node.left, result);
  result.push(node.value);   // visit the node between its two children
  inOrder(node.right, result);
  return result;
}

const root = new TreeNode(2);
root.left = new TreeNode(1);
root.right = new TreeNode(3);
console.log(inOrder(root)); // [1, 2, 3]
```

In-order traversal visits left, then the node, then right — on a binary search tree this always produces values in sorted order.

## Quick reference

| Traversal | Order of visits | Typical use |
|---|---|---|
| Pre-order | node, left, right | Copy or serialize a tree |
| In-order | left, node, right | Get sorted output from a BST |
| Post-order | left, right, node | Delete a tree, evaluate expression trees |
| Level-order (BFS) | top to bottom, level by level | Shortest path, level-based processing |

| Metric | Balanced tree | Skewed (degenerate) tree |
|---|---|---|
| Height with n nodes | O(log n) | O(n) |
| Search/insert/delete | O(log n) | O(n) |

## What interviewers ask

- **What's the difference between a tree and a graph?** — A tree is a special case of a graph: connected, with no cycles, and exactly one path between any two nodes. Every tree is a graph, but not every graph is a tree.
- **How would you find the height of a binary tree?** — Recursively compute 1 + the maximum of the left and right subtree heights, with an empty node returning 0 (or -1, depending on convention). This is O(n) since you must visit every node once.
- **How do you check if two binary trees are identical?** — Recursively compare the current nodes' values and then recurse on both left and right subtrees; if any pair of nodes differs, or one has a child the other doesn't, they're not identical. Both trees must be fully null or fully match to return true.

## Common mistakes

- Confusing a **binary tree** (at most two children, no ordering rule) with a **binary search tree** (at most two children, with the left-smaller/right-larger ordering rule) — they look similar but support very different operations.
- Writing a recursive traversal without a base case for `null`, causing a crash on empty subtrees instead of simply returning.
- Assuming a tree is always balanced — a tree built by inserting already-sorted data one at a time can degrade into a straight line, losing the O(log n) height advantage entirely.
