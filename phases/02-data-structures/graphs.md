---
title: Graphs
slug: graphs
summary: Directed, Undirected, Adjacency List/Matrix
tags: [data-structures, graphs, algorithms, complexity]
links:
  - title: Wikipedia — Graph (abstract data type)
    url: "https://en.wikipedia.org/wiki/Graph_(abstract_data_type)"
    kind: resource
  - title: Wikipedia — Breadth-first search
    url: "https://en.wikipedia.org/wiki/Breadth-first_search"
    kind: resource
---
## In one sentence

A **graph** is a set of points (**nodes** or **vertices**) connected by lines (**edges**), used to represent anything that connects to anything else — people in a social network, cities on a map, pages linking to pages.

## Why it matters

Trees force a strict one-parent hierarchy, but plenty of real relationships aren't hierarchical at all: friendships go both ways, flights connect any city to any other, and web pages link all over the place. Graphs are the only structure in this phase general enough to model those many-to-many connections, and they power route-finding, recommendation systems, and dependency resolution.

## The idea

A graph is **directed** if edges have a one-way direction (a Twitter follow, a one-way street) or **undirected** if the connection goes both ways (a Facebook friendship). It's **weighted** if edges carry a cost or distance (flight prices between cities) or **unweighted** if every edge simply means "connected." A tree is actually a special, restricted kind of graph — connected, with no cycles, and exactly one path between any two nodes.

There are two standard ways to store a graph in code. An **adjacency list** keeps, for each node, a list of the nodes it connects to — compact and efficient when the graph is sparse (few edges relative to possible edges), which is the common case. An **adjacency matrix** is a grid where cell `[i][j]` records whether an edge exists between node i and node j — simpler to reason about and gives O(1) edge lookups, but wastes memory (O(v²)) when most pairs of nodes aren't connected.

Traversal works much like trees but needs to track **visited** nodes, since graphs can have cycles that would otherwise loop forever. **Breadth-first search (BFS)** explores level by level using a queue, and is the go-to for finding the shortest path in an unweighted graph. **Depth-first search (DFS)** dives down one path as far as possible before backtracking, using recursion or an explicit stack, and is well suited to problems like detecting cycles or finding connected components.

## In practice

```js
// Adjacency list + BFS to find shortest path length (unweighted graph)
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A', 'D'],
  D: ['B', 'C'],
};

function shortestPath(graph, start, target) {
  const visited = new Set([start]);
  const queue = [[start, 0]];
  while (queue.length) {
    const [node, dist] = queue.shift();
    if (node === target) return dist;
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor); // mark visited so we never revisit or loop
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return -1; // unreachable
}

console.log(shortestPath(graph, 'A', 'D')); // 2
```

BFS explores neighbor-by-neighbor in waves, so the first time it reaches the target is guaranteed to be via the shortest path, in an unweighted graph.

## Quick reference

| Representation | Space | Check if edge (u,v) exists | Iterate all neighbors of a node |
|---|---|---|---|
| Adjacency list | O(V + E) | O(degree of u) | O(degree of u) |
| Adjacency matrix | O(V²) | O(1) | O(V) |

| Traversal | Data structure used | Good for |
|---|---|---|
| BFS | Queue | Shortest path (unweighted) |
| DFS | Stack / recursion | Cycle detection, connected components |

## What interviewers ask

- **When would you choose an adjacency matrix over an adjacency list?** — When the graph is dense (edges close to the maximum possible) or you need O(1) checks for whether a specific edge exists; for sparse graphs, which are far more common in practice, an adjacency list wastes much less memory.
- **How would you detect a cycle in a directed graph?** — Run DFS while tracking nodes currently on the active recursion path (not just ever-visited); if you reach a node that's already on that active path, you've found a cycle. This differs from cycle detection in an undirected graph, where you just need to avoid immediately revisiting the node you came from.
- **How is Dijkstra's algorithm related to BFS?** — Both explore outward from a start node, but Dijkstra's handles weighted edges by always expanding the closest unvisited node next (tracked with a priority queue/min-heap), while plain BFS assumes every edge costs the same, so a simple queue suffices.

## Common mistakes

- Forgetting to track visited nodes, causing infinite loops on graphs with cycles — trees never need this because they have none.
- Using DFS when the problem actually asks for the shortest path in an unweighted graph — DFS finds *a* path, not necessarily the shortest one; BFS guarantees shortest.
- Assuming an adjacency matrix is always fine — for large sparse graphs (millions of nodes, few edges each) it can silently blow up memory usage compared to an adjacency list.
