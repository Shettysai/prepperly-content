---
title: CAP Theorem
slug: cap-theorem
summary: Consistency, Availability, Partition Tolerance
tags: [distributed-systems, consistency, databases]
links:
  - title: Wikipedia — CAP theorem
    url: "https://en.wikipedia.org/wiki/CAP_theorem"
    kind: resource
  - title: Wikipedia — Eventual consistency
    url: "https://en.wikipedia.org/wiki/Eventual_consistency"
    kind: resource
---
## In one sentence

The **CAP theorem** says that when part of a distributed database's network breaks, it must choose between staying perfectly correct (Consistency) or staying available to answer requests (Availability) — it cannot fully guarantee both at the same time.

## Why it matters

Every system that spreads data across multiple machines will eventually face a network hiccup between them, and what it does in that moment defines the whole product's behavior. Knowing CAP means you can predict how a database will behave during an outage before it happens in production, instead of being surprised.

## The idea

CAP stands for three properties: **Consistency** (every read gets the most recent write, or an error — everyone sees the same data), **Availability** (every request gets a response, even if it might not be the latest data), and **Partition tolerance** (the system keeps working even if network messages between servers are lost or delayed).

Here's the key insight: **network partitions will happen** — cables get cut, servers lose connectivity — so partition tolerance isn't really optional for any real distributed system. That leaves a genuine choice only between Consistency and Availability *during* a partition. A **CP** system (like a traditional bank ledger) will refuse to answer or will block until it's sure the data is correct, rather than risk returning stale data. An **AP** system (like a shopping cart) will keep responding using whatever data it has locally, accepting that two servers might briefly disagree, and reconcile later.

A concrete scenario: two servers hold a copy of a "seats remaining" counter for a concert, and the network link between them drops. A CP system would stop selling tickets from at least one server until the link is restored, guaranteeing no overselling. An AP system would let both servers keep selling, risking that a few extra tickets get sold, then fix the count afterward.

## In practice

```js
// A tiny simulation of the CP vs AP decision during a network partition
function handleRead(nodeIsReachable, localData, mode) {
  if (!nodeIsReachable) {
    if (mode === 'CP') {
      throw new Error('Refusing to answer: cannot confirm latest data'); // consistency wins
    }
    if (mode === 'AP') {
      return { ...localData, stale: true }; // availability wins, flagged as possibly outdated
    }
  }
  return localData;
}
```

The same partition produces two very different behaviors depending on which guarantee the system was designed to protect.

## Quick reference

| System type | Chooses | Behavior during a network partition | Example |
|---|---|---|---|
| CP | Consistency over Availability | Refuses/blocks requests it can't guarantee are correct | Traditional relational DBs in cluster mode, ZooKeeper |
| AP | Availability over Consistency | Keeps responding, may serve stale data | DNS, many NoSQL stores (Cassandra, DynamoDB) |
| CA | Both, but only without partitions | Not realistic for real distributed systems | A single-node database (no partition possible) |

## What interviewers ask

- **Explain CAP theorem in your own words.** — During a network partition, a distributed system must choose between guaranteeing every read is fully up to date (Consistency) or guaranteeing it always responds (Availability); it can't fully do both at once, since answering with local data risks staleness, and waiting to confirm correctness risks not answering at all.
- **Is CA a real option?** — Not for a genuinely distributed system, because partitions are a fact of networking; CA only makes sense for a single machine with no network to partition, which defeats the purpose of being distributed.
- **Give a real example of a CP system and an AP system.** — A banking ledger is typically CP — it would rather reject a transaction than risk double-spending; a DNS system or shopping cart is typically AP — it would rather show you a slightly stale cart than refuse to load your page.

## Common mistakes

- Treating CAP as a permanent, always-on choice — it only actually forces a trade-off *during* a network partition; outside of a partition, a well-designed system can offer both consistency and availability.
- Assuming AP means "no consistency at all" — AP systems usually still converge to a consistent state eventually, they just don't guarantee it instantly.
