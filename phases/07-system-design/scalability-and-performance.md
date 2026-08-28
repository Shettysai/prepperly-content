---
title: Scalability & Performance
slug: scalability-and-performance
summary: Vertical/Horizontal scaling, Bottlenecks
tags: [scalability, system-design, distributed-systems]
links:
  - title: Wikipedia — Scalability
    url: "https://en.wikipedia.org/wiki/Scalability"
    kind: resource
  - title: MDN — HTTP caching (relevant to reducing load)
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching"
    kind: resource
---
## In one sentence

**Scalability** is a system's ability to handle more load — more users, more data, more requests — by adding resources, while **performance** is how fast it responds to a single request right now.

## Why it matters

A system can be fast for one user and completely fall over at ten thousand users if it can't scale; conversely, a system can scale to millions of users while still feeling slow to each one. You need both: performance keeps individual users happy, scalability keeps the system standing as more of them show up at once.

## The idea

There are two ways to scale. **Vertical scaling** means making one machine bigger — more CPU, more RAM. It's simple (no code changes) but has a hard ceiling and a single point of failure. **Horizontal scaling** means adding more machines and spreading load across them with a load balancer. It scales further but requires your app to not depend on local, single-machine state (like an in-memory session only one server knows about).

A **bottleneck** is whatever component limits the whole system's throughput — it doesn't matter how fast your API server is if every request waits on one overloaded database. Finding the real bottleneck via monitoring, not guessing, is most of the actual work of scaling; adding servers in front of the wrong bottleneck does nothing.

A useful way to reason about scale before writing code is doing the math on expected load, so you can decide whether your architecture can plausibly handle it before you hit production.

## In practice

Here's a capacity calculation — the kind of concrete number worth doing before you design anything:

```js
// Estimate load for a notifications feature
const dailyActiveUsers = 100_000;
const requestsPerUserPerDay = 3; // e.g. open app, refresh, check again

const totalRequestsPerDay = dailyActiveUsers * requestsPerUserPerDay; // 300,000
const secondsPerDay = 24 * 60 * 60; // 86,400

// Traffic isn't flat — assume peak hour carries ~20% of the day's traffic
const peakFraction = 0.20;
const avgRequestsPerSecond = totalRequestsPerDay / secondsPerDay;
const peakRequestsPerSecond =
  (totalRequestsPerDay * peakFraction) / (60 * 60);

console.log({ avgRequestsPerSecond: avgRequestsPerSecond.toFixed(2), peakRequestsPerSecond: peakRequestsPerSecond.toFixed(2) });
// avg ~3.5 req/s, but peak ~16.7 req/s — design for the peak, not the average
```

Designing for the average (3.5 req/s) would mean the system falls over exactly when it matters most — during the peak hour. This is why real capacity planning always uses peak load, not average load.

## Quick reference

| Aspect | Vertical scaling | Horizontal scaling |
|---|---|---|
| How | Bigger machine (more CPU/RAM) | More machines |
| Code changes needed | Usually none | Often yes (stateless design, load balancing) |
| Ceiling | Hard limit (biggest machine) | Very high, add more machines |
| Failure impact | Single point of failure | One machine dying doesn't take down the system |
| Cost curve | Gets expensive fast at the high end | More linear, but adds operational complexity |

## What interviewers ask

- **How do you find a bottleneck in a slow system?** — Measure, don't guess: use monitoring/profiling to see where time actually goes (database query time, network latency, CPU), then fix the biggest measured cost first rather than optimizing whatever seems slow.
- **Why is horizontal scaling harder than vertical scaling?** — It requires the application to be stateless or to externalize state (sessions, uploaded files) to a shared store, because any request might land on any server; a system built assuming one machine's local memory breaks the moment you add a second machine.
- **What's the difference between throughput and latency?** — Latency is how long one request takes; throughput is how many requests the system handles per unit time. You can increase throughput (via horizontal scaling, more workers) without improving latency, and the two sometimes trade off against each other under load.
- **How would you design for a 10x traffic spike (like a sale event)?** — Identify the bottleneck ahead of time (usually the database), add caching in front of hot reads, make the app horizontally scalable so you can add servers on demand, and load-test at the expected peak before the event, not during it.

## Common mistakes

- Designing capacity around average load instead of peak load, so the system fails exactly when traffic matters most.
- Scaling horizontally before removing server-local state, which causes users to get logged out depending on which server they hit.
- Optimizing code that isn't actually the bottleneck instead of measuring where time is really spent.
