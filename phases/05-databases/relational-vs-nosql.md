---
title: Relational vs NoSQL
slug: relational-vs-nosql
summary: ACID, BASE, Use cases
tags: [databases, sql]
links:
  - title: PostgreSQL docs
    url: "https://www.postgresql.org/docs/"
    kind: resource
  - title: Wikipedia — ACID
    url: "https://en.wikipedia.org/wiki/ACID"
    kind: resource
  - title: Wikipedia — NoSQL
    url: "https://en.wikipedia.org/wiki/NoSQL"
    kind: resource
---
## In one sentence

**Relational databases** store data in strict tables with fixed columns and strong guarantees about correctness, while **NoSQL databases** store data more flexibly (documents, key-value pairs, graphs) and trade some of those guarantees for speed and scale.

## Why it matters

Picking the wrong type of database can mean either fighting a rigid schema for data that naturally varies, or losing data integrity that your business actually needs, like making sure a bank balance never goes negative. Understanding this trade-off is one of the most common early architecture decisions in any real project.

## The idea

A **relational database** (like PostgreSQL or MySQL) organizes data into tables with predefined columns, and rows must fit that shape. It enforces **ACID** guarantees: Atomicity (a transaction fully happens or not at all), Consistency (data always follows your rules), Isolation (concurrent transactions don't corrupt each other), and Durability (once saved, it survives a crash). This makes relational databases the safe default for anything involving money, inventory, or data with strict relationships.

**NoSQL** is an umbrella term for databases that don't use that rigid table model. A document database like MongoDB stores flexible JSON-like documents where different records can have different fields. A key-value store like Redis just maps a key to a value, extremely fast for caching. These systems often follow **BASE** instead of ACID: Basically Available, Soft state, Eventually consistent — meaning they favor staying up and fast over guaranteeing every read sees the absolute latest write immediately.

The real decision isn't "NoSQL is faster" or "SQL is safer" as absolutes — it's about whether your data has a fixed, relational shape that benefits from strict rules, or a flexible, high-volume shape where eventual consistency is an acceptable trade for speed and scale.

## In practice

```js
// Relational: rigid shape, enforced by the schema itself
const userRow = { id: 1, name: 'Asha', email: 'asha@example.com' };
// Every row in the `users` table MUST have exactly these columns.

// NoSQL (document-style): flexible shape, enforced only by your code
const userDoc = { _id: 1, name: 'Asha', email: 'asha@example.com' };
const userDoc2 = { _id: 2, name: 'Ravi', phone: '555-1234', tags: ['vip'] };
// userDoc2 has completely different fields — the database doesn't complain.
```

The relational row must always match its table's columns; the two NoSQL documents live in the same collection despite having different shapes entirely.

## Quick reference

| | Relational (SQL) | NoSQL |
|---|---|---|
| Schema | Fixed, enforced upfront | Flexible, defined by your app |
| Guarantees | ACID (strong consistency) | Often BASE (eventual consistency) |
| Scaling style | Mostly vertical (bigger machine) | Mostly horizontal (more machines) |
| Best for | Money, relationships, strict rules | High-volume, flexible, fast-changing data |
| Examples | PostgreSQL, MySQL | MongoDB, Redis, Cassandra |

## What interviewers ask

- **When would you choose NoSQL over a relational database?** — When your data doesn't fit a fixed schema well, when you need to scale horizontally across many cheap servers, or when slight staleness is acceptable in exchange for speed — like a social media feed or a product catalog with varying attributes.
- **What does ACID actually guarantee?** — Atomicity means a transaction is all-or-nothing, Consistency means it never leaves data violating your rules, Isolation means concurrent transactions can't see each other's half-finished work, and Durability means a committed change survives a crash.
- **Is NoSQL always faster than SQL?** — No — it's faster for specific access patterns it's optimized for (like key lookups), but a well-indexed relational query can outperform a poorly modeled NoSQL one; the real difference is what guarantees and flexibility you're trading away.

## Common mistakes

- Believing NoSQL means "no rules at all" — it just means the database doesn't enforce the schema; your application code still needs to keep data consistent, or you end up with inconsistent documents that are hard to query reliably.
- Choosing NoSQL purely because it sounds more scalable, without checking if the data actually has relationships that a relational database would model far more simply with joins.
