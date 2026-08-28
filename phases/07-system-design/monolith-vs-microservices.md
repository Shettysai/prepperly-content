---
title: Monolith vs Microservices
slug: monolith-vs-microservices
summary: Trade-offs, Architecture
tags: [system-design, scalability, distributed-systems]
links:
  - title: Martin Fowler — Microservices
    url: "https://martinfowler.com/articles/microservices.html"
    kind: resource
  - title: Wikipedia — Microservices
    url: "https://en.wikipedia.org/wiki/Microservices"
    kind: resource
---
## In one sentence

A **monolith** is one application where all the code — user login, orders, payments — runs and deploys together as a single unit, while **microservices** split that same application into small independent services that each run and deploy on their own.

## Why it matters

As a team grows, one giant deployable becomes slow to build, test, and release — a typo in payments code can block the whole product's release. Microservices let teams ship independently, trading that freedom for network calls, consistency problems, and more moving parts to operate.

## The idea

Think of a monolith like a single restaurant kitchen: one team, one set of ovens, everyone works from the same station. It's simple to coordinate, but if the grill breaks, the whole kitchen stops.

Microservices are like a food court: each stall (service) has its own equipment and menu, and one stall closing doesn't stop the others. But now you need shared plumbing — a way for stalls to talk to each other and a plan for when one depends on another that's out of stock.

Most companies start as a monolith because it's faster to build with a small team. They move to microservices only when specific pain shows up: one part needs to scale independently, or teams keep blocking each other on the same codebase. Splitting too early adds network calls, retries, and partial failures before you actually need them.

## In practice

Here's the same feature expressed both ways, since the real difference is deployment boundaries, not syntax:

```js
// monolith: one process, direct function calls, one transaction
function placeOrder(userId, items) {
  const user = getUser(userId);
  const total = calculateTotal(items);
  return saveOrder(user, total);
}

// microservices: each step is now a network call that can fail on its own
async function placeOrder(userId, items) {
  const user = await fetch(`http://user-service/users/${userId}`).then(r => r.json());
  const total = await fetch('http://pricing-service/calc', {
    method: 'POST', body: JSON.stringify({ items }),
  }).then(r => r.json());
  return fetch('http://order-service/orders', {
    method: 'POST', body: JSON.stringify({ user, total }),
  });
}
```

The monolith version can't partially fail — it's one transaction. The microservices version can fail halfway, which is the core trade-off: independence in deployment costs you certainty in execution.

## Quick reference

| Aspect | Monolith | Microservices |
|---|---|---|
| Deployment | One unit, all-or-nothing | Independent per service |
| Scaling | Scale the whole app | Scale only the busy service |
| Team ownership | Shared codebase | One team per service |
| Failure mode | Whole app crashes together | One service fails, others may survive |
| Data consistency | Easy — one database, one transaction | Hard — needs eventual consistency across services |
| Operational cost | Low — one thing to deploy/monitor | High — many things to deploy/monitor |
| Best for | Small teams, early-stage products | Large teams, independently-scaling parts |

## What interviewers ask

- **When would you choose microservices over a monolith?** — When team size or scaling needs create real bottlenecks in a shared codebase, not by default; operational complexity is the cost, so the pain of staying monolithic has to outweigh it.
- **How do microservices talk to each other?** — Usually HTTP/REST or gRPC for direct calls, and message queues (like Kafka or RabbitMQ) for async, decoupled communication.
- **What's the hardest part of microservices in practice?** — Data consistency across services without a shared database, plus debugging a request that touches five services instead of one stack trace.
- **Can you migrate a monolith to microservices gradually?** — Yes, via the "strangler fig" pattern: route specific features to new services one at a time while the monolith still handles the rest.

## Common mistakes

- Splitting into microservices before there's a real scaling or team problem — it adds network failures for no benefit yet.
- Forgetting a service boundary is now a network call that can time out or fail partially, unlike a function call.
- Giving every microservice its own database with no plan for keeping related data consistent across them.
