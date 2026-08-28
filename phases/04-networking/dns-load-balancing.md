---
title: DNS, Load Balancing
slug: dns-load-balancing
summary: Resolution, L4/L7 Load Balancers
tags: [networking, scalability]
links:
  - title: How Does DNS Load Balancing Work? (video)
    url: "https://www.youtube.com/watch?v=IbxdM_nBbTA"
    kind: video
  - title: MDN — DNS overview
    url: "https://developer.mozilla.org/en-US/docs/Glossary/DNS"
    kind: resource
  - title: Node.js docs — dns module
    url: "https://nodejs.org/api/dns.html"
    kind: resource
  - title: Wikipedia — Load balancing (computing)
    url: "https://en.wikipedia.org/wiki/Load_balancing_(computing)"
    kind: resource
---

## Before you start

`http-https-websockets` helps here — DNS is the step that happens right before an HTTP request can even be sent, and load balancers sit in front of the servers that eventually receive it.

## In one sentence

**DNS** (Domain Name System) is the internet's phone book, turning names like `google.com` into IP addresses that computers can actually connect to; **load balancing** is spreading incoming traffic across multiple servers so no single one gets overwhelmed.

## Why it matters

Humans can't remember IP addresses, and IP addresses change — servers get replaced, scaled up, moved to new data centers. DNS lets a name stay stable while everything underneath it changes freely. Load balancing is what lets a popular website survive millions of simultaneous visitors without any one machine falling over, and it's also how you avoid downtime when a server crashes: traffic just quietly shifts to the healthy ones, often before a human even notices.

## The intuition

DNS is like calling a company's main phone line and asking to be transferred to "billing" — you don't need to know billing's direct extension, you just ask for it by name and get routed. Load balancing is like that same company having ten billing agents instead of one: whoever answers the phone routes your call to whichever agent is free, so no single agent gets stuck with every caller in the building while the other nine sit idle.

## How it actually works

```mermaid
flowchart LR
  U["Your computer"] --> R["Recursive resolver"]
  R --> Root["Root server"]
  Root --> TLD["'.com' TLD server"]
  TLD --> Auth["Authoritative server\nfor example.com"]
  Auth -->|"returns IP"| R
  R -->|"cached answer"| U
```

When you type `example.com` into a browser, your computer asks a **DNS resolver** to look it up. That resolver checks a chain of caches before doing real work: first your operating system's own cache, then a **recursive resolver** (often run by your ISP or a public service). If neither has a fresh answer, the recursive resolver asks a **root server**, which points it to a **TLD server** (the server responsible for `.com`), which finally points it to the **authoritative server** for `example.com` — the actual source of truth, which returns the IP address. Every answer along the way gets cached for a duration called its **TTL** (Time To Live), so this whole chain doesn't repeat on every single request.

Once your browser has an IP address, it may not be talking to just one machine. A **load balancer** sits in front of a pool of identical servers and decides which one handles each incoming request. It can operate at different levels: an **L4** (layer 4) load balancer routes purely by IP address and port — fast, but blind to what's actually inside the request. An **L7** (layer 7) load balancer reads the actual HTTP request — its path, headers, cookies — and can route smartly, like sending `/images` requests to servers optimized for serving static files while sending `/api` requests elsewhere.

Common routing strategies include **round robin** (take turns, server 1, then 2, then 3, then back to 1), **least connections** (send the next request to whichever server currently has the fewest active connections), and — critically — **health checks**, where the load balancer periodically pings each server (often hitting a dedicated `/health` endpoint) and stops sending traffic to any server that fails to respond correctly.

DNS itself can even act as a crude load balancer: a domain can resolve to several different IP addresses, and different users (or the same user at different times) get handed different ones — this is called **DNS round robin**. It's simple but has a real weakness: DNS has no concept of "is this server actually healthy right now," so a dead server can keep getting traffic until someone manually updates the DNS record and the change propagates.

## Worked example

```js
const dns = require('dns');

// Resolve a domain name to its IP addresses, exactly like your browser does
dns.resolve4('nodejs.org', (err, addresses) => {
  if (err) throw err;
  console.log('nodejs.org resolves to:', addresses); // could be one or several IPs
});
```

Typical output:

```
nodejs.org resolves to: [ '104.20.22.46' ]
```

A domain can resolve to several IP addresses at once; a client or load balancer can then pick between them, which is one of the simplest forms of load distribution — no dedicated load balancer software required.

## A second example — when it gets harder

Here's the case that trips people up: you update a DNS record to point away from a decommissioned server, expecting traffic to shift immediately. Instead, a slice of your users keep hitting the old, now-dead server for hours. Why? Every DNS answer carries a **TTL**, and any resolver that cached the old answer — your ISP's resolver, your operating system, even your browser — will keep serving that cached answer until the TTL expires, regardless of what the authoritative server says now. If that record had a TTL of 24 hours, some users are stuck on stale data for up to a day.

This is why teams planning a migration lower a record's TTL *in advance* — sometimes days ahead — so that when the actual cutover happens, caches expire quickly and traffic shifts within minutes instead of hours. It's a classic case of a problem that's invisible until the one day you actually need fast propagation and don't have it.

## Quick reference

| Concept | What it does |
|---|---|
| DNS resolver | Looks up which IP address a domain name currently points to |
| Authoritative server | The final source of truth for a domain's DNS records |
| TTL (Time To Live) | How long a DNS answer can be cached before it must be re-checked |
| L4 load balancer | Routes by IP/port only — very fast, no awareness of request content |
| L7 load balancer | Routes by HTTP content (path, headers, cookies) — smarter, more expensive |
| Health check | Load balancer stops sending traffic to a server that fails to respond correctly |

## Common mistakes

- Assuming DNS changes take effect instantly — cached answers with a long TTL can keep pointing at an old IP for minutes to days after you update a record.
- Thinking a load balancer alone guarantees high availability — without health checks, it will happily keep sending traffic to a dead server until something else notices.
- Confusing DNS round robin with real load balancing — DNS has no idea which server is overloaded or down, it just hands out addresses in turn; a proper load balancer actively tracks server health and load.

## What interviewers ask

- **Walk me through what happens when you type a URL into a browser.** — DNS resolves the domain to an IP address (checking caches first), the browser opens a TCP connection (and a TLS handshake for HTTPS) to that IP, sends an HTTP request, and renders the response — a load balancer may sit anywhere in front of the actual servers handling that request.
- **What's the difference between an L4 and L7 load balancer?** — L4 only looks at IP addresses and ports, so it's fast but can't make content-aware decisions; L7 reads the actual HTTP request to route more intelligently, at the cost of extra processing per request.
- **How does a load balancer know a server is unhealthy?** — It periodically sends health check requests, like hitting a `/health` endpoint, and stops routing traffic to any server that fails to respond correctly or in time.
- **Why would you lower a DNS record's TTL before a planned migration?** — A short TTL means caches expire quickly, so when you actually switch the record, users start hitting the new server within minutes instead of being stuck on stale, cached answers for hours.

## Practice

1. Use `dns.resolve4` (or `dig` from a terminal) on a few real domains and compare how many IP addresses each one returns — a single IP suggests one server or a hidden proxy; multiple IPs suggest DNS-level distribution.
2. Design a health check endpoint for a web service: what should it check beyond "the process is running" — think about whether it should verify its database connection too, and what happens if it lies.
3. A load balancer using round robin sends every 10th request to a server that's much slower than the rest. Explain why "least connections" would behave differently here, and why that might still not be the *ideal* strategy.

## Where to go next

You've now covered the full path a request takes: layers (`osi-model`), transport (`tcp-ip-udp`), application protocol (`http-https-websockets`), and how it finds and reaches a server (this topic). Continue to `relational-vs-nosql` to shift from how data travels to how it's stored once a server receives it.
