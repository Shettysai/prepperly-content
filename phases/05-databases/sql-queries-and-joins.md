---
title: SQL Queries & Joins
slug: sql-queries-and-joins
summary: Inner, Outer, Group By
tags: [databases, sql]
links:
  - title: PostgreSQL docs — Joins between tables
    url: "https://www.postgresql.org/docs/current/tutorial-join.html"
    kind: resource
  - title: PostgreSQL docs — Aggregate functions
    url: "https://www.postgresql.org/docs/current/functions-aggregate.html"
    kind: resource
---
## In one sentence

**SQL** (Structured Query Language) is how you ask a relational database for exactly the data you want, and a **join** is how you combine rows from two or more tables based on a shared value.

## Why it matters

Real data is rarely in one table — a store has separate tables for customers, orders, and products, and almost every useful question ("which customers bought this product last month?") requires combining them. Without joins you'd have to fetch everything and stitch it together in application code, which is slower and far more error-prone than letting the database do it.

## The idea

A basic query starts with `SELECT` (which columns), `FROM` (which table), and `WHERE` (which rows to filter). `GROUP BY` collapses many rows into summary rows — like counting orders per customer — usually paired with aggregate functions like `COUNT`, `SUM`, or `AVG`.

A **join** connects two tables using a shared column, usually a foreign key. An **INNER JOIN** returns only rows that match in both tables — if a customer has no orders, they're excluded entirely. A **LEFT JOIN** returns every row from the left table, filling in `NULL` for any missing match on the right — so every customer shows up, even ones with zero orders. A **RIGHT JOIN** is the mirror image, and a **FULL OUTER JOIN** keeps everything from both sides, matched where possible.

Think of it like matching two lists by a shared ID: an inner join only keeps names that appear on both lists, while a left join keeps everyone from the first list and just leaves a blank next to names that aren't on the second.

## In practice

```sql
-- Every customer and their order count, including customers with zero orders
SELECT
  customers.name,
  COUNT(orders.id) AS order_count
FROM customers
LEFT JOIN orders
  ON orders.customer_id = customers.id   -- the shared key linking the two tables
GROUP BY customers.name
ORDER BY order_count DESC;
```

The `LEFT JOIN` guarantees every customer appears even with no matching orders; an `INNER JOIN` here would silently drop customers who never ordered anything.

## Quick reference

| Join type | Returns |
|---|---|
| INNER JOIN | Only rows matching in both tables |
| LEFT JOIN | All rows from the left table, matched rows from the right (or NULL) |
| RIGHT JOIN | All rows from the right table, matched rows from the left (or NULL) |
| FULL OUTER JOIN | All rows from both tables, matched where possible |
| CROSS JOIN | Every row from one table paired with every row from the other |

## What interviewers ask

- **What's the difference between INNER JOIN and LEFT JOIN?** — INNER JOIN only keeps rows where both tables have a match, dropping unmatched rows entirely; LEFT JOIN keeps all rows from the left table regardless of a match, filling in NULLs where the right table has nothing.
- **What does GROUP BY do, and why does it need aggregate functions?** — It collapses multiple rows sharing a value into one summary row; any non-grouped column you select must go through an aggregate function like COUNT or SUM, since the database needs to know how to combine the multiple underlying values into one.
- **How would you find customers with no orders using a join?** — Use a LEFT JOIN from customers to orders, then filter WHERE orders.id IS NULL, which isolates exactly the customers that had no matching row on the right.

## Common mistakes

- Using an INNER JOIN when you actually need every row from one side — this silently drops data (like customers with zero orders) without any error, producing a report that looks correct but is missing rows.
- Joining on the wrong column, like matching by name instead of ID — names can collide or have different casing/spacing, while a foreign key ID is guaranteed unique and stable.
