---
title: Computer Architecture
slug: computer-architecture
summary: CPU cache, Registers
tags: [fundamentals, memory, complexity]
links:
  - title: Wikipedia — CPU cache
    url: "https://en.wikipedia.org/wiki/CPU_cache"
    kind: resource
  - title: Wikipedia — Computer architecture
    url: "https://en.wikipedia.org/wiki/Computer_architecture"
    kind: resource
---
## In one sentence

**Computer architecture** is how a computer's physical parts — the CPU, memory, and storage — are organized to actually run your code.

## Why it matters

Your code runs on hardware with real limits, like how fast memory can be reached or how much data fits close to the processor. Understanding the basics explains why some code is fast and some is slow even with the same Big O complexity, and it's a check that you understand what's happening below your programming language.

## The idea

The **CPU** executes instructions one step at a time, at billions of steps per second. Inside it are **registers** — tiny, extremely fast storage slots holding the values the CPU is working with right now, like scratch paper next to your desk.

Beyond the CPU is a chain of memory, each step slower but bigger than the last — the **memory hierarchy**: registers are fastest and smallest, then **cache** (fast memory between CPU and main memory), then RAM (bigger, slower), then disk (huge, far slower).

Cache exists because RAM is too slow to keep up with the CPU. When the CPU needs data, it checks cache first; if found, that's a **cache hit** and it's fast. If not, it's a **cache miss**, and the CPU waits for slower RAM — often 100x slower. Programs accessing memory in predictable, nearby patterns (looping through an array) get far more cache hits than programs jumping around randomly, which is why array iteration often beats linked-list traversal in practice, even at equal Big O.

Think of a kitchen: ingredients on the counter (registers) are instantly reachable, ingredients in the fridge (cache) take a few steps, ingredients at the store (RAM) take a real trip.

## In practice

```js
// Iterating an array in order is cache-friendly: adjacent memory, few misses
const arr = new Array(1_000_000).fill(1);
let sum = 0;
for (let i = 0; i < arr.length; i++) {
  sum += arr[i]; // sequential access pattern helps the CPU cache
}
console.log(sum);
```

This loop touches memory in a straight line, letting the CPU load nearby values into cache ahead of time (prefetching), making it faster than jumping to random indices.

## Quick reference

| Level | Speed | Size | Analogy |
|---|---|---|---|
| Registers | Fastest | A few bytes | Item in your hand |
| Cache (L1/L2/L3) | Very fast | KB–MB | Ingredients on the counter |
| RAM | Fast | GB | Ingredients in the fridge |
| Disk/SSD | Slow | TB | A trip to the store |

## What interviewers ask

- **What is the difference between cache and RAM?** — Cache is a small, very fast memory layer between the CPU and RAM storing recently or frequently used data; RAM is larger and slower, holding the full working set of a running program.
- **Why can two algorithms with the same Big O have very different real speeds?** — Big O ignores hardware details like cache behavior; sequential memory access gets far more cache hits than jumping around, even with the same operation count.
- **What is a register, and why can't we just have more of them?** — Ultra-fast storage built into the CPU for values in active use; there are few because they're physically expensive and space-limited on the chip.

## Common mistakes

- Assuming all memory access takes the same time — a cache miss can be roughly 100x slower than a hit, so access patterns matter as much as algorithm choice.
- Thinking of CPU and memory as one thing — they're separate components connected by a bus, and much of the CPU's time is spent waiting for data to arrive.
