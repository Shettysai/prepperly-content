---
title: Event Loop & Async I/O
slug: event-loop-and-async-io
summary: Phases, libuv, Callbacks
tags: [nodejs, concurrency, javascript]
links:
  - title: Node.js docs — The Node.js Event Loop
    url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick"
    kind: resource
  - title: MDN — Concurrency model and the event loop
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model"
    kind: resource
---
## In one sentence

The **event loop** is the mechanism that lets Node.js — which runs your JavaScript on a single thread — still handle thousands of things at once, by handing slow work (reading a file, a network request) off to the system and running your code again only when that work finishes.

## Why it matters

If Node ran everything strictly line by line and waited for each slow operation, one slow database query would freeze your entire server for every other user. The event loop is why a single Node process can serve thousands of concurrent requests without spawning a thread per request.

## The idea

Here's the part beginners "know" but don't really understand: Node.js is single-threaded for your JavaScript, but not single-threaded overall. A C++ library called **libuv** manages a thread pool and talks to the OS for things like file I/O and DNS lookups. Your code runs on one thread; the waiting happens elsewhere.

The event loop is a cycle with distinct **phases** that Node visits in order, forever: **timers** (due `setTimeout`/`setInterval` callbacks), **pending callbacks**, **poll** (new I/O events — most work happens here), **check** (`setImmediate`), and **close callbacks**. Between phases, Node drains the **microtask queue** — `process.nextTick()` then Promise callbacks — before moving on.

This ordering is the source of nearly every "why did this print in that order" surprise in Node.

## In practice

Run this and predict the output before reading the answer below:

```js
console.log('1: start');

setTimeout(() => console.log('2: setTimeout'), 0);

Promise.resolve().then(() => console.log('3: promise'));

process.nextTick(() => console.log('4: nextTick'));

console.log('5: end');

// Actual order: 1, 5, 4, 3, 2
```

Numbers 1 and 5 run first because synchronous code always finishes before anything async, even a `setTimeout(fn, 0)`. Then `nextTick` (4) runs before the Promise (3) because Node drains `process.nextTick` callbacks before the microtask/Promise queue. Only after both queues are empty does Node enter the timers phase and finally run the `setTimeout` (2) — proving that `setTimeout(fn, 0)` never means "immediately," it means "after this synchronous code and all microtasks are done."

## Quick reference

| Phase | What runs here |
|---|---|
| Timers | Due `setTimeout` / `setInterval` callbacks |
| Pending callbacks | Some system-level callbacks deferred from the previous loop |
| Poll | Fetch new I/O events; runs I/O callbacks (file reads, network) |
| Check | `setImmediate()` callbacks |
| Close callbacks | Cleanup, e.g. `socket.on('close', ...)` |
| (between every phase) | Microtasks: `process.nextTick()` first, then Promise callbacks |

## What interviewers ask

- **Is Node.js single-threaded?** — Your JavaScript executes on one thread, but Node uses libuv's thread pool and the OS for I/O under the hood, which is why one slow database call doesn't block other requests from being handled — the answer is "single-threaded execution, multi-threaded I/O."
- **What's the difference between `process.nextTick()` and `setImmediate()`?** — `process.nextTick()` runs before any I/O event, right after the current operation, as part of the microtask draining step; `setImmediate()` runs in the check phase, after the poll phase's I/O callbacks — so despite the name, `setImmediate` typically runs later than `nextTick`.
- **Why does `setTimeout(fn, 0)` not run immediately?** — It only schedules the callback for the timers phase; it still waits for all currently-executing synchronous code and the entire microtask queue (nextTick, Promises) to finish first, so "0ms" means "as soon as possible after everything already queued," not "right now."
- **What happens if you block the event loop with a heavy synchronous loop?** — Nothing else can run — no other requests, no timers, no I/O callbacks — until that loop finishes, because there's only one thread running JavaScript; this is why CPU-heavy work belongs in a worker thread, not the main thread.

## Common mistakes

- Assuming `setTimeout(fn, 0)` runs before Promises — microtasks always drain before the next event loop phase, including timers.
- Writing a synchronous CPU-heavy function in a request handler, which blocks every other concurrent request since there's only one JS thread.
- Confusing "asynchronous" with "parallel" — callbacks still run one at a time, never simultaneously.
