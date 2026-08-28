---
title: Hash Tables
slug: hash-tables
summary: Collision resolution, Load factor
tags: [data-structures, hashing, complexity, javascript]
links:
  - title: MDN — Map reference
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map"
    kind: resource
  - title: Wikipedia — Hash table
    url: "https://en.wikipedia.org/wiki/Hash_table"
    kind: resource
---
## In one sentence

A **hash table** stores key-value pairs and uses a **hash function** to turn a key directly into the location where its value lives, so you can look it up almost instantly instead of searching.

## Why it matters

Hash tables are what make checking "have I seen this before?" or "look up this user by ID" fast at any scale — they back JavaScript's `Object` and `Map`, database indexes, and caches. Without them, every lookup would mean scanning a list, turning an app that should feel instant into one that crawls as data grows.

## The idea

A hash table is like a coat check counter: you hand over your coat (the value) and get a numbered ticket (computed from your key by the hash function); later, that same ticket number takes you straight back to the right coat hook, no searching the rack required.

The **hash function** converts a key (a string, a number, anything) into a number, which is then used as an index into an underlying array. A good hash function spreads keys evenly across that array so lookups stay fast. But two different keys can occasionally hash to the same index — called a **collision** — and every hash table needs a strategy to handle it. **Chaining** stores a small list at each index and appends colliding entries to it. **Open addressing** instead finds the next free slot in the array itself when a collision happens.

The **load factor** (number of stored items divided by the array's size) tells you how full the table is. As it climbs, collisions become more frequent and performance degrades toward O(n); most implementations automatically resize (grow the underlying array and re-hash everything) once the load factor crosses a threshold, which is why average-case operations stay close to O(1) even as you keep adding items.

## In practice

```js
// JavaScript's Map is a hash table under the hood
const ages = new Map();
ages.set('alice', 30);
ages.set('bob', 25);

console.log(ages.get('alice')); // 30 — direct lookup, no scanning
console.log(ages.has('carol')); // false

// Classic use: counting frequencies with a plain object
function countChars(str) {
  const counts = {};
  for (const char of str) {
    counts[char] = (counts[char] || 0) + 1; // hash lookup + insert, both O(1)
  }
  return counts;
}
console.log(countChars('banana')); // { b: 1, a: 3, n: 2 }
```

`Map.get` and object property access both resolve in roughly constant time because the key is hashed straight to its slot, rather than being searched for.

## Quick reference

| Operation | Average case | Worst case (many collisions) |
|---|---|---|
| Insert | O(1) | O(n) |
| Lookup by key | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Search by value (not key) | O(n) | O(n) |

## What interviewers ask

- **How does a hash table handle collisions?** — Two common strategies: chaining, where each array slot holds a small list of all entries that hashed there, and open addressing, where a colliding entry is placed in the next available slot according to some probing rule. Chaining is simpler to reason about; open addressing uses less memory overhead but needs careful handling of deletions.
- **Why can hash table operations degrade to O(n)?** — If the hash function distributes keys poorly, or the load factor grows too high without resizing, many keys collide into the same slot, turning what should be a direct lookup into scanning through a long chain — effectively a linked list.
- **How would you detect duplicates in an array efficiently?** — Walk the array once, inserting each element into a hash set; if an element is already present when you try to insert it, it's a duplicate. This is O(n) time and O(n) space, versus the O(n^2) naive approach of comparing every pair.

## Common mistakes

- Assuming hash table operations are *always* O(1) — that's the average case; a poor hash function or adversarial input can degrade it to O(n).
- Using a plain object for arbitrary keys in JavaScript instead of `Map` — object keys are coerced to strings, so numeric or object keys silently behave differently than expected; `Map` preserves key types and insertion order.
- Forgetting that iterating a hash table gives no guaranteed order (plain objects are a partial exception with integer-like keys) — don't rely on insertion order unless you're using `Map`, which does guarantee it.
