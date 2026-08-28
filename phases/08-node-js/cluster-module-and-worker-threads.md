---
title: Cluster Module & Worker Threads
slug: cluster-module-and-worker-threads
summary: Multiprocessing, Shared memory
tags: [nodejs, concurrency, scalability]
links:
  - title: Node.js docs — Cluster
    url: "https://nodejs.org/api/cluster.html"
    kind: resource
  - title: Node.js docs — Worker threads
    url: "https://nodejs.org/api/worker_threads.html"
    kind: resource
---
## In one sentence

The **cluster module** lets you run multiple copies of your whole Node.js server (one per CPU core) to handle more requests at once, while **worker threads** let you run a piece of JavaScript on a separate thread within one process, mainly to avoid blocking everything else with heavy computation.

## Why it matters

A single Node process uses only one CPU core no matter how many cores your machine has, so an 8-core server running plain Node is wasting seven of them. Clustering and worker threads are Node's two answers to "how do I use more than one core," and they solve different problems: cluster is for scaling request handling, worker threads are for not blocking the event loop with CPU-heavy work.

## The idea

The **cluster module** forks your entire server process multiple times — typically once per CPU core. Each forked process (a **worker**) is a full, independent copy of your app, and Node's built-in load balancer distributes incoming connections across them round-robin. This is ideal for scaling a web server: more workers means more requests handled per second, and if one crashes, the others keep serving.

**Worker threads** are different: they let you run JavaScript on a separate thread inside the same process, sharing memory more directly (via `SharedArrayBuffer`) if needed. This offloads CPU-heavy work — image processing, large computations — that would otherwise block the main thread's event loop and freeze every request that process is serving.

Rule of thumb: "too many requests for one process" means cluster; "one piece of work is CPU-heavy and blocks everything else" means worker threads. They're often combined: cluster for request capacity, worker threads inside each cluster worker for heavy computation.

## In practice

A cluster setup that forks one worker per CPU core:

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) cluster.fork(); // one process per core

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died — restarting`);
    cluster.fork(); // keep capacity up even if a worker crashes
  });
} else {
  // each worker runs its own full copy of the server
  http.createServer((req, res) => res.end(`Handled by process ${process.pid}`)).listen(3000);
}
```

Running this and hitting the server repeatedly shows different process IDs responding — Node's load balancer is spreading requests across all CPU cores, something a single process could never do alone.

## Quick reference

| Aspect | Cluster module | Worker threads |
|---|---|---|
| What's duplicated | The whole process (separate memory) | Just a thread (can share memory) |
| Solves | Too many requests for one process | CPU-heavy work blocking the event loop |
| Communication | IPC (inter-process messages) | `postMessage`, or shared memory via `SharedArrayBuffer` |
| Crash impact | One worker crashing doesn't affect others | An uncaught error can be isolated per-thread |
| Typical use | Scaling an HTTP server across cores | Image resizing, hashing, parsing large files |

## What interviewers ask

- **Why would you use the cluster module for a Node.js web server?** — A single Node process only uses one CPU core; clustering forks one worker process per core so the app can handle far more concurrent requests, and Node's built-in load balancer spreads incoming connections across them automatically.
- **When would you choose worker threads over cluster?** — When the problem is a specific CPU-heavy task (like resizing an uploaded image) blocking the event loop, not a lack of request-handling capacity; worker threads offload that one task to another thread while the rest of the app keeps responding, without duplicating the entire server process.
- **Do cluster workers share memory?** — No — each cluster worker is a separate OS process with its own memory space, so they can't share in-memory state like a cache directly; you'd need an external shared store (like Redis) for state that must be consistent across workers.
- **What happens if you don't offload a CPU-heavy task at all?** — It runs on the main thread and blocks the event loop, so the entire process — meaning every concurrent request that process is handling — waits until that task finishes, since there's only one thread running JavaScript in a non-worker Node process.

## Common mistakes

- Assuming cluster workers share memory — they're separate processes, so an in-memory cache built in one worker is invisible to the others.
- Reaching for worker threads to fix a scaling problem — that's what cluster is for; worker threads help a single heavy computation, not overall throughput.
- Forgetting to handle a cluster worker's `'exit'` event and restart it, so a crashed worker permanently reduces capacity instead of self-healing.
