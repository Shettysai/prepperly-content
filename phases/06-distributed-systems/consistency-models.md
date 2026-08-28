---
title: Consistency Models
slug: consistency-models
summary: Strong, Eventual, Causal
tags: [distributed-systems, consistency]
links:
  - title: Wikipedia — Consistency model
    url: "https://en.wikipedia.org/wiki/Consistency_model"
    kind: resource
  - title: Wikipedia — Eventual consistency
    url: "https://en.wikipedia.org/wiki/Eventual_consistency"
    kind: resource
---
## In one sentence

A **consistency model** is a promise a distributed system makes about how up to date the data you read will be, ranging from "always the absolute latest" to "eventually correct, but maybe not right now."

## Why it matters

When data is copied across multiple servers, updates take time to spread, and a read might hit a server that hasn't caught up yet. Choosing a consistency model decides whether your app ever shows outdated information, and how much performance you're willing to trade to prevent that. Get it wrong and you either build something too slow for its use case, or something that shows users confusing, contradictory data.

## The idea

**Strong consistency** guarantees every read sees the most recent write, no matter which server answers — as if there were only one copy of the data. This is safest but slowest, since servers must coordinate before confirming any write, similar to everyone in a meeting having to agree before anyone can act.

**Eventual consistency** guarantees that if no new writes happen, all copies will *eventually* converge to the same value — but right after a write, different servers might briefly disagree. Think of a group chat where a message takes a moment to appear on everyone's phone; for a short window some people have seen it and others haven't, but everyone gets there eventually.

**Causal consistency** sits in between: operations that are causally related (a comment replying to a post) are seen by everyone in the same order, but unrelated operations can appear in any order for different readers.

A concrete scenario: two people try to book the last seat on a flight at the same second. With strong consistency, one booking is confirmed and the other rejected immediately, since both check the same up-to-date source. With eventual consistency, both might briefly see "seat available" and both succeed locally, with the conflict surfacing later.

## In practice

```js
// A simplified illustration of the gap eventual consistency allows
let replicaA = { seats: 1 };
let replicaB = { seats: 1 }; // starts as a copy of replicaA

function bookSeat(replica) {
  if (replica.seats > 0) {
    replica.seats -= 1;
    return 'booked';
  }
  return 'sold out';
}

console.log(bookSeat(replicaA)); // 'booked' — replicaA now has 0 seats
console.log(bookSeat(replicaB)); // 'booked' too! replicaB hasn't heard about A's update yet
```

Both replicas independently think a seat is available because the update from A hasn't propagated to B yet — exactly the kind of conflict eventual consistency has to reconcile after the fact.

## Quick reference

| Model | Guarantee | Speed | Example use case |
|---|---|---|---|
| Strong | Every read sees the latest write | Slowest (needs coordination) | Bank balances, seat booking |
| Causal | Related events stay in order | Medium | Comments/replies, social feeds |
| Eventual | All copies converge, eventually | Fastest | Shopping cart, DNS, likes count |

## What interviewers ask

- **What's the difference between strong and eventual consistency?** — Strong consistency guarantees every read reflects the latest write immediately, requiring coordination between replicas; eventual consistency allows temporary disagreement between replicas after a write, only guaranteeing they converge over time, which is much faster but can briefly show stale data.
- **Give an example where eventual consistency is perfectly fine.** — A "likes" counter on a social media post — if it briefly shows 104 on one server and 105 on another right after a like, nobody is harmed, and it corrects itself within moments.
- **What is causal consistency and why would you choose it over strong or eventual?** — It guarantees operations that depend on each other (like a reply and its post) are seen in the correct order, without the full cost of strong consistency, making it a middle ground for comment threads.

## Common mistakes

- Assuming eventual consistency means the data is unreliable forever — it converges, usually within milliseconds to seconds, it just doesn't guarantee an instant global view.
- Using strong consistency everywhere "to be safe" — this adds coordination overhead and latency even to data where nobody cares about a few seconds of staleness, hurting overall system performance for no real benefit.
