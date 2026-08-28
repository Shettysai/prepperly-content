---
title: Caching Strategies
slug: caching-strategies
summary: Redis, Memcached, Eviction policies
tags: [caching, scalability, system-design]
links:
  - title: Redis docs — Introduction to Redis
    url: "https://redis.io/docs/latest/"
    kind: resource
  - title: Wikipedia — Cache replacement policies
    url: "https://en.wikipedia.org/wiki/Cache_replacement_policies"
    kind: resource
---
## In one sentence

**Caching** means storing a copy of expensive-to-compute or slow-to-fetch data somewhere fast, like memory, so the next request for the same thing is answered instantly instead of redoing the work.

## Why it matters

Without caching, every request hits your database or does the same heavy computation from scratch, even if a thousand users just asked the exact same question. A cache turns a 200ms database query into a 1ms memory lookup, which is often the difference between a system that survives a traffic spike and one that falls over.

## The idea

Imagine a librarian who keeps the five most-requested books on a cart next to the front desk instead of walking to the shelves every time. That cart is the cache: small, fast to check, and only useful if it holds what people actually ask for. If the cart is full and a new popular book arrives, the librarian must decide which book to remove — that's an **eviction policy**.

Caches sit at different layers: in-process memory (fastest, but not shared across servers), a shared store like **Redis** or **Memcached** (shared across app servers), or a CDN (caches content close to users geographically).

The hardest part of caching isn't storing data — it's knowing when the cached copy is wrong. This is **cache invalidation**: if the underlying data changes but the cache still has the old value, users see stale data. Common strategies are cache-aside (check cache, fall back to the database and fill the cache on a miss), write-through (every write updates cache and database together), and TTL (time-to-live — the entry expires automatically).

## In practice

A cache-aside pattern with a TTL, and a key design that avoids collisions between different users' data:

```js
const cache = new Map(); // stand-in for Redis; same logic applies

async function getUserProfile(userId) {
  const key = `user:${userId}:profile`; // namespaced key avoids collisions
  const cached = cache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value; // cache hit — skip the database entirely
  }

  const value = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  cache.set(key, { value, expiresAt: Date.now() + 60_000 }); // 60s TTL
  return value;
}
```

The key includes the entity type and ID (`user:123:profile`) so unrelated data never overwrites it, and the TTL guarantees stale data self-heals within 60 seconds even if nothing explicitly invalidates it.

## Quick reference

| Eviction policy | Removes | Good for |
|---|---|---|
| LRU (Least Recently Used) | The item not accessed for the longest time | General-purpose caching, most common default |
| LFU (Least Frequently Used) | The item accessed the fewest times | Data with a stable set of "hot" items |
| FIFO (First In, First Out) | The oldest item added, regardless of use | Simple queues, low overhead |
| TTL-based | Anything past its expiry time | Data that naturally goes stale (prices, sessions) |

## What interviewers ask

- **What is cache invalidation and why is it hard?** — It's the problem of updating or removing cached data when the source changes; it's hard because you must catch every code path that writes the underlying data, and a missed path leaves silently stale results with no error to alert you.
- **What's the difference between write-through and write-back caching?** — Write-through updates the cache and the database in the same operation, so they never disagree but every write pays both costs; write-back updates the cache immediately and writes to the database later (async), which is faster but risks losing data if the cache crashes before the write-back happens.
- **How would you cache a paginated list endpoint?** — Cache each page under its own key (including the page number and any filters in the key), with a shorter TTL than single-item data, since lists change more often as new items get added.
- **What happens if your cache goes down?** — With cache-aside, the app should fall back to hitting the database directly (a "cache miss" for everything), just slower — the cache should never be a single point of failure for correctness, only for speed.

## Common mistakes

- Caching data with no expiry, so a bug in invalidation logic serves wrong data forever instead of self-healing.
- Using a cache key that's too broad, so unrelated requests overwrite each other's cached values.
- Treating the cache as the source of truth — if it's evicted, that data must still exist safely in the real database.
