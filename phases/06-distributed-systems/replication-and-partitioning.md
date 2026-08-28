---
title: Replication & Partitioning
slug: replication-and-partitioning
summary: Leader-follower, Sharding
tags: [distributed-systems, scalability, databases]
links:
  - title: Wikipedia — Replication (computing)
    url: "https://en.wikipedia.org/wiki/Replication_(computing)"
    kind: resource
  - title: Wikipedia — Shard (database architecture)
    url: "https://en.wikipedia.org/wiki/Shard_(database_architecture)"
    kind: resource
  - title: PostgreSQL docs — High Availability, Load Balancing, and Replication
    url: "https://www.postgresql.org/docs/current/high-availability.html"
    kind: resource
---
## In one sentence

**Replication** means keeping multiple copies of the same data on different servers for safety and speed, while **partitioning** (also called sharding) means splitting one big dataset into smaller pieces spread across different servers so no single machine has to hold it all.

## Why it matters

One server can only hold so much data and handle so many requests before it becomes a bottleneck or a single point of failure. Replication protects you from losing data when a server dies; partitioning lets you scale beyond what any one machine could store or serve. Nearly every large-scale system — from your bank to your social feed — uses both together.

## The idea

With **replication**, the same data lives on multiple servers. The most common setup is **leader-follower** (also called primary-replica): one server, the leader, accepts all writes, and one or more followers copy those changes and can serve read requests. This spreads out read traffic and gives you a backup if the leader fails — a follower can be promoted to take over. The trade-off is that followers might lag slightly behind the leader, so a read from a follower could be a moment out of date.

With **partitioning** (sharding), instead of copying the whole dataset, you split it — for example, users A-M go on server 1, and N-Z go on server 2. Each server only needs to hold and serve its slice, so the system can grow far beyond what one machine could handle. The hard part is choosing a good **partition key** (what you split by) so data and traffic spread evenly, and handling queries that need to touch multiple partitions at once, which is slower than a query that stays on one shard.

In practice, real systems combine both: each partition (shard) is itself replicated across multiple servers, so you get both scale (via partitioning) and safety (via replication) at the same time.

## In practice

```js
// A simple hash-based partitioning function: decide which shard a user belongs to
function getShard(userId, shardCount) {
  // A basic hash spreads users evenly across shards
  let hash = 0;
  for (const char of String(userId)) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1000003;
  }
  return hash % shardCount; // e.g. shard 0, 1, or 2 out of 3
}

console.log(getShard('user_482', 3)); // always routes this user to the same shard
```

The same user ID always hashes to the same shard, so the application always knows exactly which server to query for that user's data.

## Quick reference

| Concept | Solves | Trade-off |
|---|---|---|
| Leader-follower replication | Read scaling + failover safety | Followers can lag (replication delay) |
| Multi-leader replication | Writes accepted in multiple locations | Conflicting writes need resolution |
| Partitioning (sharding) | Dataset too big for one server | Cross-shard queries are slower/harder |
| Replicated + partitioned | Scale and safety together | More operational complexity overall |

## What interviewers ask

- **What's the difference between replication and partitioning?** — Replication copies the *same* data onto multiple servers for redundancy and read scaling; partitioning *splits* data into different pieces across servers so each one only holds a slice, which is how you scale storage and write capacity.
- **What happens if a leader server fails in leader-follower replication?** — One of the followers is promoted to become the new leader (often automatically via a health-check and election process), and other followers start replicating from it; any writes that hadn't yet reached a follower before the crash can be lost, which is a real trade-off of this design.
- **What's a downside of sharding you should mention?** — Queries that span multiple shards (like 'find all orders above $100 across all users') become much harder and slower, since you either query every shard and merge results, or maintain a separate index just for that kind of lookup.

## Common mistakes

- Assuming replication alone solves scaling — it helps with reads and safety, but every write still has to go through the leader, which remains a bottleneck; only partitioning spreads write load.
- Picking a partition key that creates a 'hot' shard, like partitioning by signup date when most active traffic comes from recently joined users, overloading the newest shard.
