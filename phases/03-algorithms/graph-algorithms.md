---
title: Graph Algorithms
slug: graph-algorithms
summary: Dijkstra's, A* Search
tags: [graphs, algorithms, complexity]
links:
  - title: Wikipedia — Dijkstra's algorithm
    url: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm"
    kind: resource
  - title: Wikipedia — A* search algorithm
    url: "https://en.wikipedia.org/wiki/A*_search_algorithm"
    kind: resource
---
## In one sentence

**Graph Algorithms** like **Dijkstra's algorithm** find the cheapest (shortest) path between points in a network where connections have different costs — road distances or flight prices, not just "number of steps."

## Why it matters

Maps apps, network routers, and flight-booking sites need to answer "what's the cheapest way from A to B" where every edge has a different weight — plain BFS only works when every step costs the same. Dijkstra's is the standard answer, and **A\*** speeds it up with a hint about which direction the destination is in.

## The idea

Imagine finding the cheapest flight route between cities, where each direct flight has a different price. Dijkstra's keeps a running "best price so far" for every city, starting at 0 for your origin and infinity elsewhere. It always expands from the cheapest unvisited city, and each visit checks: "can I reach this city's neighbors more cheaply through here?" If yes, it updates that neighbor's price. Once a city's cheapest price is locked in, it's never revisited, since anything reached later would only be more expensive.

This "always expand cheapest so far" strategy is why Dijkstra's is a **greedy** algorithm — it uses a **priority queue** to grab the next-cheapest city efficiently instead of scanning everything.

**A\* Search** is Dijkstra's plus a smart guess: alongside the real cost so far, it adds a **heuristic** — an estimate of remaining distance to the goal (like straight-line map distance) — prioritizing paths heading toward the destination and exploring far fewer nodes.

## In practice

```js
function dijkstra(graph, start) {
  const dist = { [start]: 0 };
  const visited = new Set();
  const nodes = Object.keys(graph);

  while (visited.size < nodes.length) {
    // pick the unvisited node with the smallest known distance
    let current = null;
    for (const node of nodes) {
      if (!visited.has(node) && dist[node] !== undefined &&
          (current === null || dist[node] < dist[current])) current = node;
    }
    if (current === null) break;
    visited.add(current);

    for (const [neighbor, weight] of Object.entries(graph[current])) {
      const newDist = dist[current] + weight;
      if (dist[neighbor] === undefined || newDist < dist[neighbor]) {
        dist[neighbor] = newDist; // found a cheaper way to reach neighbor
      }
    }
  }
  return dist;
}

const graph = { A: { B: 4, C: 1 }, B: { D: 1 }, C: { B: 1, D: 5 }, D: {} };
console.log(dijkstra(graph, 'A')); // { A: 0, B: 2, C: 1, D: 3 }
```

The inner loop is the "relaxation" step: every edge is checked for a cheaper route than what's already known.

## Quick reference

| Algorithm | Handles weighted edges? | Uses a heuristic? | Time complexity (with min-heap) |
|---|---|---|---|
| BFS | No (all edges cost 1) | No | O(V + E) |
| Dijkstra's | Yes (non-negative weights only) | No | O((V + E) log V) |
| A\* Search | Yes | Yes | Depends on heuristic quality; often much faster than Dijkstra's |

## What interviewers ask

- **Why doesn't Dijkstra's work with negative edge weights?** — It assumes once a node's best distance is locked in, it can never improve — but a later negative edge could still make it cheaper. Bellman-Ford handles negative weights instead, at the cost of speed.
- **What's the difference between Dijkstra's and A\*?** — A\* adds a heuristic estimate of distance to the goal, letting it explore far fewer nodes; Dijkstra's has no notion of a goal and explores uniformly by cost alone.
- **What data structure makes Dijkstra's efficient?** — A min-heap (priority queue), since the repeated operation is "grab the cheapest unvisited node," done in O(log n) instead of scanning all nodes in O(n).

## Common mistakes

- Forgetting Dijkstra's requires non-negative weights — a graph with negative edges silently gives wrong answers instead of erroring.
- Using a plain array scan instead of a priority queue, turning an O((V+E) log V) algorithm into a much slower O(V²) one on large graphs.
