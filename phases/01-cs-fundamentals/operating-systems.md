---
title: Operating Systems
slug: operating-systems
summary: Processes, Threads, Concurrency
tags: [concurrency, fundamentals, nodejs]
links:
  - title: MDN — Concurrency model and the event loop
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop"
    kind: resource
  - title: Wikipedia — Process (computing)
    url: "https://en.wikipedia.org/wiki/Process_(computing)"
    kind: resource
---
## In one sentence

An **operating system** is the software that manages a computer's hardware and decides which program gets to use the CPU, memory, and other resources, and when.

## Why it matters

Your code never talks directly to hardware — the OS sits between your program and the machine, sharing one CPU and one pool of memory across many running programs. Understanding processes and threads explains why your Node.js server can handle many requests, why race conditions happen, and what actually happens when you run a command.

## The idea

A **process** is a running program with its own private memory space — running `node server.js` twice creates two separate processes, each with its own copy of variables, fully isolated from each other.

A **thread** is a smaller unit of execution *inside* a process. A process can have multiple threads, and unlike separate processes, threads inside the same process share the same memory. This makes threads lighter and faster to create, but it also means two threads can accidentally read or write the same memory at once — a bug called a **race condition**.

Since a computer usually has far fewer CPU cores than running processes, the OS uses **scheduling**: it rapidly switches which process or thread gets the CPU, giving each a small time slice. This happens so fast it looks simultaneous even on one core — this illusion is **concurrency**. True **parallelism**, actually running at the same instant, only happens with multiple cores.

JavaScript is famously **single-threaded**: your code runs on one thread, so you never get race conditions in your own JS logic, but Node.js still achieves concurrency for I/O by handing that work to the OS and picking it back up later via the event loop.

## In practice

```js
// Node.js is single-threaded for your code, but I/O runs concurrently
console.log('1: starts first');

setTimeout(() => {
  console.log('3: runs after the main thread is free');
}, 0);

console.log('2: runs before the timeout, even with a 0ms delay');
```

This prints 1, 2, then 3 — `setTimeout`'s callback waits for the main thread's current code to finish, showing JavaScript never runs two callbacks at the exact same instant.

## Quick reference

| Concept | Process | Thread |
|---|---|---|
| Memory | Own isolated space | Shared with sibling threads |
| Creation cost | Expensive | Cheap |
| Crash impact | Doesn't affect other processes | Can crash the whole process |
| Communication | Needs IPC | Direct, via shared memory |
| Common risk | None from sharing | Race conditions |

## What interviewers ask

- **What's the difference between a process and a thread?** — A process has its own isolated memory and is expensive to create; a thread lives inside a process and shares memory with sibling threads, making threads cheaper but riskier due to shared state.
- **What is a race condition, and how do you prevent one?** — Two threads read and write shared memory at the same time without coordination, producing unpredictable results; prevent it with locks, atomic operations, or avoiding shared mutable state.
- **Why is JavaScript single-threaded, yet handles many requests concurrently?** — Your JS code runs on one thread, but Node.js delegates I/O work to the OS or a thread pool, then resumes your code via the event loop once that work completes.

## Common mistakes

- Assuming concurrency and parallelism are the same — concurrency *manages* multiple tasks by switching between them, parallelism *actually runs* multiple tasks at once, requiring multiple cores.
- Thinking single-threaded means it can't handle many things at once — it handles I/O concurrency well precisely because slow operations are handed off to the OS, not run on the JS thread.
