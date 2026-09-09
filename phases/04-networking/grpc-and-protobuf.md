---
title: gRPC & Protocol Buffers
slug: grpc-and-protobuf
summary: Binary RPC, Streaming
tags: [networking, api-design, system-design]
links:
  - title: gRPC docs — Core concepts, architecture and lifecycle
    url: "https://grpc.io/docs/what-is-grpc/core-concepts/"
    kind: resource
  - title: gRPC docs — Introduction to gRPC
    url: "https://grpc.io/docs/what-is-grpc/introduction/"
    kind: resource
  - title: Protocol Buffers — Language guide (proto3)
    url: "https://protobuf.dev/programming-guides/proto3/"
    kind: resource
  - title: gRPC — Node.js basics tutorial
    url: "https://grpc.io/docs/languages/node/basics/"
    kind: practice
---

## Before you start

`network-performance` explains HTTP/2 and multiplexing, which gRPC is built on. `api-design` gives the REST baseline that gRPC is usually compared against.

## In one sentence

**gRPC** is a way for one service to call a function in another service as if it were local, sending compact binary messages defined by **Protocol Buffers** (protobuf) — a schema language that generates the client and server code for you.

## Why it matters

Inside a system of many services, the same two services may exchange millions of calls a day. JSON over HTTP/1.1 spends a surprising amount of that on overhead: field names repeated in every message, text parsing, and a fresh connection setup per call.

The bigger win is the **contract**. With REST and JSON, the shape of a response is an agreement written in documentation and enforced by hope — a renamed field breaks consumers at runtime, in production. With protobuf, the schema is a file both sides compile against, so mismatches surface at build time. That guarantee is why gRPC dominates internal service-to-service communication.

## The intuition

Compare two ways of shipping a form.

**JSON** is a paper form where every field is written out longhand every time: "customer_first_name: Ada", "customer_last_name: Lovelace". Readable by anyone, self-describing, and verbose — the field names cost more than the data.

**Protobuf** is the same form where both sides hold an identical numbered legend: field 1 is first name, field 2 is last name. The wire message carries `1: Ada, 2: Lovelace` — just tags and values. Far smaller and faster to parse, but meaningless without the legend. That legend is the `.proto` file, and it must be shared.

This is the whole trade-off. gRPC is excellent where you control both ends and can share the schema, and awkward where you cannot — like a browser or a public API consumed by strangers.

## How it actually works

```mermaid
flowchart LR
  P[".proto schema"] --> CG[code generator]
  CG --> CS[client stub]
  CG --> SS[server stub]
  CS -->|"binary over HTTP/2"| SS
```

You write a `.proto` file describing messages and services. A code generator produces a **client stub** and a **server interface** in your language. Calling a remote method looks like calling a local one; the stub serialises arguments, sends them over HTTP/2, and deserialises the reply.

```proto
syntax = "proto3";

message UserRequest { int32 id = 1; }          // 1 is the field NUMBER, not a value
message UserReply { string name = 1; string email = 2; }

service Users {
  rpc GetUser(UserRequest) returns (UserReply);
}
```

Those field numbers are the contract. They — not the names — are what travels on the wire, so you can rename `name` to `full_name` freely, but **reusing or changing a number breaks every existing client**. Numbers are permanent; treat retired ones as reserved.

Because it runs on HTTP/2, gRPC gets multiplexing (many concurrent calls on one connection) and long-lived connections that skip repeated handshakes.

gRPC defines **four call types**, and interviewers do ask for all four:

| Type | Client sends | Server sends | Example |
|---|---|---|---|
| Unary | 1 message | 1 message | Fetch a user |
| Server streaming | 1 message | Stream | Subscribe to price updates |
| Client streaming | Stream | 1 message | Upload chunks, get a summary |
| Bidirectional | Stream | Stream | Live chat, continuous sync |

Streaming is native, not bolted on: each call is an HTTP/2 stream, so streaming in either direction is the natural shape rather than a workaround.

Protobuf's compatibility rules make rollout safe. Unknown fields are ignored rather than rejected, so a new server adding a field doesn't break old clients, and every field is optional in proto3. Adding fields is safe; removing one or changing its type is not.

## Worked example

Protobuf's encoding is simple enough to demonstrate with built-ins — this is what the generated code does under the hood:

```js
// Encode { id: 150 } for `int32 id = 1;` — protobuf's varint + tag format
function encodeVarint(n) {
  const out = [];
  while (n > 127) { out.push((n & 0x7f) | 0x80); n >>>= 7; }
  out.push(n);
  return out;
}

const fieldNumber = 1, wireType = 0;              // 0 = varint
const tag = (fieldNumber << 3) | wireType;        // field number is packed into the tag
const message = Buffer.from([tag, ...encodeVarint(150)]);

console.log('protobuf:', message, message.length);
console.log('json    :', Buffer.byteLength(JSON.stringify({ id: 150 })));
```

Output:

```
protobuf: <Buffer 08 96 01> 3
json    : 10
```

Three bytes versus ten for identical data. The field *name* never appears — only tag `08` (field 1, varint) and the value. Across millions of calls with many fields, that ratio is the bandwidth and parsing win.

## A second example — when it gets harder

The naive view is "gRPC is faster, so use it everywhere". Two things break that.

First, **browsers cannot speak gRPC directly**. Browser JavaScript has no API to control HTTP/2 frames at the level gRPC requires, so a browser needs **gRPC-Web** plus a proxy that translates. That's real infrastructure for a public-facing API, which is why the common architecture is REST or GraphQL at the edge and gRPC between internal services.

Second, **load balancing behaves differently, and this bites in production**. gRPC keeps one long-lived HTTP/2 connection and multiplexes every call over it. An L4 load balancer balances *connections*, not requests — so once a client connects to backend A, all its traffic pins there. Add five new backends during a traffic spike and existing clients never move; you scale out and see no relief, with load stubbornly concentrated on the original pods. The fix is either an L7 proxy that understands HTTP/2 and balances individual requests, or client-side load balancing where the client knows all backends. This is a favourite senior-level interview question because it looks like a scaling bug and is actually a protocol-awareness bug.

The third trade-off is debuggability. You cannot `curl` a gRPC endpoint and read the response, and binary frames in a packet capture are opaque without the schema. Tooling exists, but the casual inspectability of JSON is genuinely gone.

## Quick reference

| | REST + JSON | gRPC + protobuf |
|---|---|---|
| Format | Text, self-describing | Binary, schema-required |
| Transport | Usually HTTP/1.1 | HTTP/2 |
| Contract | Documentation | Compiled `.proto` |
| Streaming | Awkward (SSE/WebSocket) | Native, four modes |
| Browser support | Universal | Needs gRPC-Web + proxy |
| Debugging | `curl`, readable | Needs tooling |
| Best for | Public APIs, browsers | Internal service-to-service |

## Tools & frameworks

| Tool | What it's for | Reach for it when |
|---|---|---|
| [gRPC (Node)](https://grpc.io/docs/languages/node/) | RPC framework over HTTP/2 | You control both ends and want generated, typed clients |
| [Protocol Buffers](https://protobuf.dev/) | Schema and binary wire format | Payload size or schema evolution matters more than human-readable payloads |
| [Buf](https://buf.build/docs/) | Proto linting, breaking-change detection, codegen | Several teams edit `.proto` files and you need a compatibility gate in CI |
| [Connect (Node)](https://connectrpc.com/docs/node/getting-started/) | gRPC-compatible RPC callable from browsers | The same service must be callable by a browser without a translating proxy |

Connect and gRPC-Web exist because browsers cannot speak raw gRPC — that distinction is a common interview follow-up.

## Common mistakes

- Changing or reusing a protobuf field number. Names are cosmetic; numbers are the contract, and reusing one silently misinterprets old data.
- Exposing gRPC directly to browsers without gRPC-Web and a translating proxy.
- Assuming an L4 load balancer spreads gRPC traffic. It balances connections, so long-lived multiplexed connections pin clients to backends.
- Choosing gRPC for a public API where third parties must integrate, then discovering they'd all need generated stubs.

## What interviewers ask

- **When would you choose gRPC over REST?** — Internal service-to-service calls at high volume where you control both ends, want a compiled contract, and benefit from streaming or multiplexing; REST stays better for public and browser-facing APIs.
- **Why do protobuf field numbers matter more than names?** — Only the numbers are transmitted, so renaming is safe while changing or reusing a number breaks compatibility with every deployed client.
- **Why can't browsers call gRPC directly?** — Browser APIs don't expose the HTTP/2 frame control gRPC needs, so gRPC-Web plus a translating proxy is required.
- **You scaled out your gRPC backends but load didn't spread — why?** — L4 balancers balance connections, and gRPC multiplexes everything over one long-lived connection, so clients stay pinned; you need L7 request-level balancing or client-side load balancing.

## Practice

1. Run the encoder above with different values (1, 300, 100000) and explain how varint length changes and why small field numbers are worth reserving for hot fields.
2. Write a `.proto` for an order service with one method of each of the four call types, and justify each choice.
3. Take an existing JSON API response, design the equivalent protobuf message, and describe exactly how you would add a field and later remove one without breaking deployed clients.

## Where to go next

You've finished the networking chapter. Continue to `relational-vs-nosql` to start on databases — where the same theme returns: a rigid schema buys you safety and costs you flexibility.
