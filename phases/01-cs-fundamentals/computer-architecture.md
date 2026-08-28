---
title: Computer Architecture
slug: computer-architecture
summary: CPU cache, Registers
tags: [fundamentals, memory, complexity]
links:
  - title: "Video: Memory Hierarchy Explained — CPU Registers, Cache, RAM & SSDs"
    url: "https://www.youtube.com/watch?v=zLq-8Gn5-YA"
    kind: video
  - title: "Video: L1, L2, L3 Cache — CPU Cache Hierarchy Finally Explained"
    url: "https://www.youtube.com/watch?v=tSAcFKW9lM8"
    kind: video
  - title: Wikipedia — CPU cache
    url: "https://en.wikipedia.org/wiki/CPU_cache"
    kind: resource
  - title: Wikipedia — Computer architecture
    url: "https://en.wikipedia.org/wiki/Computer_architecture"
    kind: resource
  - title: Wikipedia — Memory hierarchy
    url: "https://en.wikipedia.org/wiki/Memory_hierarchy"
    kind: resource
---
## Before you start

Builds on `bit-manipulation` — you now know data is stored as bits; this topic covers *where* those bits physically live and why some places are faster to reach than others.

## In one sentence

**Computer architecture** is how a computer's physical parts — the CPU, memory, and storage — are organized to actually run your code.

## Why it matters

Your code runs on hardware with real physical limits: how fast memory can be reached, and how much data fits close to the processor. Understanding the basics explains why some code is fast and some is slow even with identical Big O complexity, and why "just add more RAM" doesn't always fix performance problems. It's also a signal to interviewers that you understand what's happening below the language you write in, not just the syntax.

## The intuition

Think of a kitchen while cooking. Ingredients already in your hand (**registers**) are instantly usable. Ingredients on the counter (**cache**) take a small reach. Ingredients in the fridge (**RAM**) take a few steps across the room. Ingredients you don't have at all require a trip to the store (**disk**). Each step outward gets you more storage space, but at the cost of more time to reach it — and a good cook (or a good program) arranges work to minimize trips to the store.

## How it actually works

The **CPU** executes instructions one at a time, at billions of steps per second. Inside it are **registers** — a handful of tiny, extremely fast storage slots holding the exact values the CPU is working with right now.

Each instruction goes through the same repeating cycle:

```mermaid
flowchart LR
  F["Fetch<br/>get next instruction"] --> D["Decode<br/>figure out what it means"]
  D --> E["Execute<br/>do the operation"]
  E --> S["Store<br/>write the result"]
  S --> F
```

This loop runs continuously — billions of times a second on modern hardware — and every one of the "steps" your code seems to take (adding two numbers, comparing a condition, calling a function) is broken down into many trips around this exact cycle.

Beyond the CPU sits a chain of memory, the **memory hierarchy**, where each step outward is slower but bigger than the last: registers, then **cache** (fast memory sitting between the CPU and main memory), then RAM, then disk. Cache exists because RAM genuinely cannot keep up with how fast the CPU can process data — without cache, the CPU would spend most of its time just waiting.

When the CPU needs a piece of data, it checks cache first. Find it there, and that's a **cache hit** — fast. Not there, and that's a **cache miss** — the CPU has to wait for the much slower RAM, often around 100 times slower than a cache hit. Programs that access memory in predictable, nearby patterns (like looping through an array in order) get far more cache hits, because the CPU speculatively pulls in nearby data it expects you'll need next. Programs that jump around memory unpredictably (like following pointers scattered across a linked list) get far more misses. This is why array iteration often beats linked-list traversal in practice, even though both are O(n) — Big O counts *operations*, not the real-world cost of each one.

## Worked example

```js
// Iterating an array in order is cache-friendly: adjacent memory, few misses
const arr = new Array(1_000_000).fill(1);

console.time('sequential sum');
let sum = 0;
for (let i = 0; i < arr.length; i++) {
  sum += arr[i]; // sequential access pattern helps the CPU cache
}
console.timeEnd('sequential sum');
console.log(sum); // 1000000
```

Running this prints something like `sequential sum: 3.2ms` followed by `1000000`. The loop touches memory in a straight line, so the CPU can load a whole chunk of nearby values into cache in one trip (a technique called prefetching), rather than fetching one value at a time from RAM.

## A second example — when it gets harder

Now compare that to a jump pattern that defeats the cache, using the same amount of "work" by any Big O measure:

```js
const size = 1_000_000;
const arr = new Array(size).fill(1);

// Build a random jump order — same number of reads, unpredictable pattern
const randomOrder = Array.from({ length: size }, () => Math.floor(Math.random() * size));

console.time('random-order sum');
let sum = 0;
for (const idx of randomOrder) {
  sum += arr[idx]; // same O(n) work, but memory access jumps unpredictably
}
console.timeEnd('random-order sum');
console.log(sum);
```

Both loops read exactly `n` values from the array — identical O(n) time complexity on paper. But the random-order version typically runs several times slower in practice, because the CPU can't predict which value comes next and repeatedly misses cache, falling back to slower RAM each time. This is the second-example lesson for this whole course: Big O tells you how work *scales*, not how fast it *actually runs* — two O(n) algorithms can differ wildly once real hardware is involved.

## Why this shows up beyond arrays

This same principle explains a counterintuitive result you'll eventually run into: a well-implemented array-based data structure can outperform a "theoretically better" tree or linked-list structure for small-to-medium sizes, purely because the array keeps its data packed together in memory. It's also why interviewers sometimes ask "why not just always use a hash map" — a hash map has scattered memory layout by design (that's how it gets O(1) lookups), so for small datasets that fit entirely in cache, a simple sorted array with binary search can sometimes win in practice despite being O(log n) instead of O(1).

None of this means you should stop reasoning in Big O — it remains the right tool for understanding how an algorithm scales as input grows without bound. But it's worth knowing the hardware layer exists underneath it, because "the complexity is the same, so it doesn't matter which one I pick" is a trap that real production systems fall into constantly.

## Quick reference

| Level | Speed | Size | Analogy |
|---|---|---|---|
| Registers | Fastest | A few bytes | Item in your hand |
| Cache (L1/L2/L3) | Very fast | KB–MB | Ingredients on the counter |
| RAM | Fast | GB | Ingredients in the fridge |
| Disk/SSD | Slow | TB | A trip to the store |

## Common mistakes

- Assuming all memory access takes the same time — a cache miss can be roughly 100x slower than a hit, so access patterns matter as much as raw operation count.
- Thinking of CPU and memory as one thing — they're physically separate components connected by a bus, and a surprising amount of a program's real runtime is the CPU idling while it waits for data to arrive.
- Judging two algorithms as equally fast just because they share a Big O class — memory access patterns can produce large real-world gaps that complexity analysis alone won't show.

## What interviewers ask

- **What is the difference between cache and RAM?** — Cache is a small, very fast memory layer between the CPU and RAM that stores recently or frequently used data; RAM is larger and slower, holding the full working set of a running program.
- **Why can two algorithms with the same Big O have very different real speeds?** — Big O ignores hardware details like cache behavior; sequential memory access gets far more cache hits than jumping around, even with the same operation count.
- **What is a register, and why can't we just have more of them?** — Ultra-fast storage built directly into the CPU for values in active use; there are only a few because they're physically expensive and space-constrained on the chip.

## Practice

1. Time a loop that sums an array sequentially versus one that sums it in reverse order. Are they meaningfully different? Why or why not, given what you know about cache?
2. Explain, in your own words, why a `for` loop over an array is typically faster than the same traversal over a linked list, even though both are O(n).
3. Research what "locality of reference" means, and describe one way you could restructure a program to take advantage of it.

## Where to go next

Next is `operating-systems` — it explains how one CPU with a handful of cores gets shared across many running programs at once, building directly on the CPU picture from this topic.
