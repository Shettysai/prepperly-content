---
title: Tree Algorithms
slug: tree-algorithms
summary: BFS, DFS
tags: [trees, graphs, algorithms, recursion]
links:
  - title: Wikipedia — Breadth-first search
    url: "https://en.wikipedia.org/wiki/Breadth-first_search"
    kind: resource
  - title: Wikipedia — Depth-first search
    url: "https://en.wikipedia.org/wiki/Depth-first_search"
    kind: resource
---
## In one sentence

**Tree Algorithms** are the two standard ways to visit every node in a tree — **BFS** (Breadth-First Search, level by level) and **DFS** (Depth-First Search, all the way down one branch before backtracking) — and which one you pick changes what order you discover nodes in and what problems you can solve efficiently.

## Why it matters

Almost every tree problem — finding the shortest path, checking if a value exists, computing a tree's height, serializing a file system — is really "traverse the tree in the right order." Picking BFS vs DFS wrong means writing more complicated code, or an algorithm that's correct but far slower than it needs to be.

## The idea

Picture a family tree with one person at the top and children branching below. **BFS** visits everyone on the same generation before moving on: root first, then all direct children, then all grandchildren. It uses a **queue** (first-in-first-out) to remember which nodes to visit next.

**DFS** instead picks one branch and follows it as far as it goes before backtracking: root, its first child, that child's first child, all the way down, then backtrack. It naturally uses a **stack** — exactly what recursion gives you for free, so DFS is usually written recursively.

BFS is right when you care about "closest" or "fewest steps" — the first time it finds a target, that's guaranteed shortest in an unweighted tree. DFS is right when you need to explore a full path before deciding anything, like checking if a root-to-leaf path sums to a target.

## In practice

```js
function bfs(root) {
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();           // take the oldest node in line
    result.push(node.value);
    for (const child of node.children) queue.push(child); // add its children to the back
  }
  return result;
}

const tree = { value: 1, children: [
  { value: 2, children: [{ value: 4, children: [] }] },
  { value: 3, children: [] },
] };

console.log(bfs(tree)); // [1, 2, 3, 4] — level by level
```

The queue is what enforces level-by-level order: every node's children go to the back of the line, so the entire current level finishes before the next level starts.

## Quick reference

| Traversal | Data structure | Best for | Space (worst case) |
|---|---|---|---|
| BFS | Queue | Shortest path, level-order tasks | O(n) — can hold a whole level |
| DFS | Stack / recursion | Exploring full paths, tree height, backtracking-style problems | O(h) — h = tree height |

## What interviewers ask

- **When would you use BFS over DFS?** — When you need the shortest path or minimum steps in an unweighted tree or graph, since BFS guarantees the first time it reaches a node is via the shortest route.
- **What are the three DFS traversal orders on a binary tree?** — Pre-order (node, left, right), in-order (left, node, right — gives sorted order on a BST), and post-order (left, right, node — useful for safely deleting a tree).
- **What's the space difference between BFS and DFS on a wide vs. deep tree?** — BFS's queue can hold an entire level, using more memory on wide trees. DFS's stack only holds one root-to-current path, but its depth equals tree height, which can overflow on very deep trees.

## Common mistakes

- Using DFS for shortest path and expecting the first match to be closest — DFS can find a target through a long path before a shorter one.
- Forgetting recursive DFS uses the call stack, which can overflow on very deep trees — an iterative DFS with an explicit stack avoids this.
