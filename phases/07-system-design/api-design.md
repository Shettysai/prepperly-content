---
title: API Design
slug: api-design
summary: RESTful principles, GraphQL
tags: [api-design, http, system-design]
links:
  - title: MDN — HTTP response status codes
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
    kind: resource
  - title: MDN — An overview of HTTP
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"
    kind: resource
---
## In one sentence

**API design** is deciding the shape of the contract other programs use to talk to your backend — what URLs exist, what data they accept, and what they return — so that anyone reading it can predict how it behaves.

## Why it matters

An API is a promise: change it carelessly and every app or team depending on it breaks. Good design makes an API predictable and easy to learn without reading source code; bad design means every consumer has to guess, retry, and work around inconsistencies.

## The idea

Think of an API like a restaurant menu. A good menu groups similar dishes, names them clearly, and tells you the price upfront. A bad menu makes you ask the waiter what's actually in "Chef's Special #7" every time. **REST** is the most common style: it models your system as **resources** (nouns, like `/orders` or `/users`) and uses HTTP methods as verbs (`GET` to read, `POST` to create, `PUT`/`PATCH` to update, `DELETE` to remove).

**GraphQL** flips this: one endpoint, and the client asks for exactly the fields it needs. REST is simpler to cache; GraphQL avoids over-fetching and under-fetching when a screen needs data shaped from several resources at once.

Good API design also means consistent naming (plural nouns, not a mix of `/getUser` and `/orders`) and using HTTP status codes to mean what they actually mean — not returning `200 OK` with an error buried in the body.

## In practice

A request/response shape says more than prose. Here's a well-designed REST response versus a poorly designed one for the same operation:

```js
// Bad: status is always 200, client must parse the body to know if it worked
// POST /api/createOrder -> 200 OK
{ "result": "error", "msg": "out of stock" }

// Good: status code carries meaning, body is consistent, resource is a noun
// POST /orders -> 201 Created
{ "id": "ord_123", "status": "pending", "total": 49.99 }

// Good: failure uses a matching status code + a consistent error shape
// POST /orders -> 409 Conflict
{ "error": { "code": "OUT_OF_STOCK", "message": "Item sku_44 has 0 units left" } }
```

A client can now branch on `response.status` alone without parsing the body first, and every error across the whole API looks the same shape.

## Quick reference

| Status code | When to use it |
|---|---|
| 200 OK | `GET`/`PUT` succeeded, returning data |
| 201 Created | `POST` that made a new resource |
| 204 No Content | `DELETE` succeeded, nothing to return |
| 400 Bad Request | Missing or malformed fields |
| 401 Unauthorized | Missing or bad auth token |
| 403 Forbidden | Valid identity, wrong permissions |
| 404 Not Found | Wrong ID or deleted resource |
| 409 Conflict | Duplicate or out of stock |
| 500 Internal Server Error | Unhandled server exception |

## What interviewers ask

- **When would you choose GraphQL over REST?** — When clients need very different, nested slices of data (like a mobile app vs. a dashboard) and over-fetching with REST would mean multiple round trips; the cost is losing simple HTTP caching and adding query complexity on the server.
- **What makes an API RESTful?** — Resources are nouns addressed by URL, HTTP methods express the action, responses use standard status codes, and ideally it's stateless — each request carries everything the server needs, with no server-side session between calls.
- **How do you version an API without breaking existing clients?** — Common approaches are a version in the URL (`/v2/orders`) or a header; the key point is old clients keep working on the old version while you migrate consumers, rather than mutating a live endpoint's contract.
- **How should pagination work for a large list endpoint?** — Return a page of results plus a cursor or `next` link rather than the whole dataset, so the client and server both avoid loading everything into memory at once.

## Common mistakes

- Using verbs in URLs (`/getUser`, `/deleteOrder`) instead of letting the HTTP method be the verb and the URL be the noun.
- Returning `200 OK` for every response and putting the real success/failure inside the JSON body, forcing every client to parse the body to know what happened.
- Designing the API around your database tables instead of around what the client actually needs, which leaks internal structure and makes future refactors painful.
