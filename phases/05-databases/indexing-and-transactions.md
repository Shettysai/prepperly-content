---
title: Indexing & Transactions
slug: indexing-and-transactions
summary: B-Trees, Isolation levels
tags: [databases, indexing, sql]
links:
  - title: PostgreSQL docs — Indexes
    url: "https://www.postgresql.org/docs/current/indexes.html"
    kind: resource
  - title: PostgreSQL docs — Transaction Isolation
    url: "https://www.postgresql.org/docs/current/transaction-iso.html"
    kind: resource
  - title: Wikipedia — ACID
    url: "https://en.wikipedia.org/wiki/ACID"
    kind: resource
---
## In one sentence

An **index** is a shortcut structure that lets a database find rows fast instead of scanning every row, and a **transaction** is a group of database operations that either all succeed together or all fail together.

## Why it matters

Without an index, looking up one row in a million-row table means checking every single row — like reading an entire book to find one sentence. Without transactions, a crash halfway through transferring money between two accounts could deduct from one account and never credit the other, silently losing money. Both are foundational to why real databases can be both fast and trustworthy.

## The idea

Most database indexes use a **B-tree**, a structure that keeps values sorted in a way that lets the database jump straight to the range it needs, similar to how you'd flip directly to the "M" section of a phone book instead of reading from "A". An index is usually built on one or more columns you frequently filter or sort by; it speeds up reads significantly but slows down writes slightly, because the index itself has to be updated every time you insert, update, or delete a row.

A **transaction** wraps multiple operations (like debit account A, credit account B) so the database guarantees **atomicity** — if any step fails, everything rolls back as if nothing happened. This is captured by **ACID**: Atomicity, Consistency, Isolation, Durability.

**Isolation levels** control how much concurrent transactions can see of each other's in-progress changes. At the loosest level (**Read Uncommitted**), you might see another transaction's uncommitted changes (a "dirty read"). **Read Committed** only shows committed data. **Repeatable Read** guarantees the same query returns the same rows if run twice within one transaction. **Serializable** is the strictest — transactions behave as if run one after another, with zero overlap, at the cost of the most performance.

## In practice

```sql
-- A transaction: both updates succeed together, or neither happens
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1; -- debit
UPDATE accounts SET balance = balance + 100 WHERE id = 2; -- credit

COMMIT; -- only now are both changes made permanent
-- if anything failed above, you'd run ROLLBACK instead of COMMIT
```

If the server crashed between the two UPDATEs without a transaction, account 1 would lose money that account 2 never received; wrapping both in `BEGIN`/`COMMIT` guarantees that can't happen.

## Quick reference

| Isolation level | Prevents dirty read | Prevents non-repeatable read | Prevents phantom read |
|---|---|---|---|
| Read Uncommitted | No | No | No |
| Read Committed | Yes | No | No |
| Repeatable Read | Yes | Yes | No |
| Serializable | Yes | Yes | Yes |

## What interviewers ask

- **Why would adding an index ever be a bad idea?** — Every index speeds up reads on that column but slows down every write, since the index must be updated too; over-indexing a write-heavy table can hurt overall performance more than it helps.
- **What does the 'A' in ACID actually guarantee, with an example?** — Atomicity means a transaction is all-or-nothing; in a money transfer, either both the debit and credit happen, or neither does — you never end up with only one side applied.
- **What's a dirty read, and which isolation level prevents it?** — A dirty read is seeing another transaction's uncommitted changes, which might get rolled back later; Read Committed (and stricter levels) prevent this by only ever showing committed data.

## Common mistakes

- Adding an index to every column "just in case" — this bloats storage and slows down writes without necessarily speeding up the reads you actually run.
- Forgetting to wrap multiple related writes in a transaction, leaving a real risk of partial updates if something fails midway.
