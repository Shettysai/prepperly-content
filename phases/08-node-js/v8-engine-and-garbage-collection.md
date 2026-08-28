---
title: V8 Engine & Garbage Collection
slug: v8-engine-and-garbage-collection
summary: Memory management, Profiling
tags: [nodejs, memory, javascript]
links:
  - title: Node.js docs — process.memoryUsage()
    url: "https://nodejs.org/api/process.html#processmemoryusage"
    kind: resource
  - title: "V8 blog — Trash talk: the Orinoco garbage collector"
    url: "https://v8.dev/blog/trash-talk"
    kind: resource
---
## In one sentence

**V8** is the engine (originally built for Chrome) that actually runs your JavaScript in Node.js, and **garbage collection** is V8 automatically finding and freeing memory used by objects your code no longer needs, so you don't have to manually manage memory.

## Why it matters

Without garbage collection, you'd have to manually track every object you create and free it yourself, like in C — get it wrong and you get memory leaks or crashes from using freed memory. V8's garbage collector does this automatically, but understanding roughly how it works explains real production problems: why your Node process's memory keeps climbing, or why it occasionally pauses.

## The idea

V8 splits memory into two areas. The **stack** holds simple values and function call frames — fast, small, cleaned up automatically when a function returns. The **heap** holds objects, arrays, closures — anything that needs to outlive the function that created it. Garbage collection is entirely a heap concern.

V8's garbage collector is generational, based on the observation that most objects die young. The heap has a small **young generation** for freshly created objects, collected frequently with a fast algorithm called **Scavenge**. Objects that survive get promoted to the **old generation**, collected less often using the slower but thorough **Mark-Sweep-Compact** — it walks from known root references, marks everything still reachable, and frees the rest.

A **memory leak** in Node.js almost always means you're accidentally keeping a reference alive that should be dead — a growing array you never clear, an event listener never removed, or a cache map with no expiry. The garbage collector isn't broken here; it's correctly refusing to free memory you're technically still referencing.

## In practice

A classic Node.js leak — an array that grows forever because nothing ever removes old entries — and how to see it:

```js
const cache = []; // never cleared — this is the leak

function handleRequest(data) {
  cache.push(data); // grows forever; V8 can never collect these objects
  return cache.length;
}

// Simulate traffic
for (let i = 0; i < 5; i++) handleRequest({ id: i, payload: 'x'.repeat(1000) });

console.log(process.memoryUsage().heapUsed, 'bytes used by the heap');
// heapUsed climbs every call and never comes back down —
// V8 correctly keeps every object alive because `cache` still references them
```

`process.memoryUsage().heapUsed` is the first thing to check when you suspect a leak — if it only ever goes up under steady load, something is holding references it shouldn't.

## Quick reference

| Concept | What it means |
|---|---|
| Stack | Fast memory for function calls and simple values; auto-freed on return |
| Heap | Memory for objects/arrays/closures; managed by the garbage collector |
| Young generation (new space) | Where new objects are created; collected often (Scavenge) |
| Old generation | Where long-lived objects end up; collected less often (Mark-Sweep-Compact) |
| Memory leak | Objects kept reachable (by a reference you forgot about) so GC can't free them |

## What interviewers ask

- **Why does V8 use a generational garbage collector instead of scanning the whole heap every time?** — Most objects are short-lived, so scanning only the small young generation frequently is much cheaper than scanning the entire heap; only survivors get promoted to the less-frequently-scanned old generation, matching effort to actual object lifetime.
- **What causes a memory leak in a Node.js app if there's a garbage collector?** — A leak means your code still holds a reachable reference to something it no longer needs — an ever-growing array, an uncleaned interval, or unremoved event listeners — so the GC is correctly refusing to free memory that's technically still in use.
- **How would you debug high memory usage in a running Node process?** — Take heap snapshots at two points in time under load and diff them to see which object types are growing, combined with watching `process.memoryUsage()` over time to confirm heap usage trends upward instead of stabilizing.
- **What's the difference between a memory leak and normal garbage collection pauses?** — GC pauses are brief and recover memory, then usage drops; a leak climbs steadily and never drops, because the leaked objects are still reachable and therefore ineligible for collection.

## Common mistakes

- Adding event listeners repeatedly without ever calling `.off()`/`.removeListener()`, silently accumulating references that keep old objects alive.
- Using a plain object or Map as an unbounded cache with no TTL or size limit — the garbage collector won't "clean it up" because the cache itself is a live reference.
- Assuming a rising `heapUsed` always means a leak — GC is lazy by design, so short-term growth followed by a drop is normal.
