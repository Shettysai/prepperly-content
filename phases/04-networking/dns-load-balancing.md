---
title: DNS, Load Balancing
slug: dns-load-balancing
summary: Resolution, L4/L7 Load Balancers
tags: [networking, scalability]
links:
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
## In one sentence

**DNS** (Domain Name System) is the internet's phone book, turning names like `google.com` into IP addresses; **load balancing** is spreading incoming traffic across multiple servers so no single one gets overwhelmed.

## Why it matters

Humans can't remember IP addresses, and IP addresses can change — DNS lets a name stay stable while the underlying servers change freely. Load balancing is what lets a popular website survive millions of visitors without one machine falling over, and it's also how you avoid downtime when one server crashes: traffic just quietly shifts to the healthy ones.

## The idea

When you type `example.com` into a browser, your computer asks a **DNS resolver** to look it up. That resolver checks a chain: your OS's cache, then a **recursive resolver** (often run by your ISP), which asks a **root server**, then a **TLD server** (for `.com`), then finally the **authoritative server** for `example.com`, which returns the actual IP address. This whole lookup is cached along the way so it doesn't happen on every single request.

Once your browser has an IP address, it might not talk to just one server — a **load balancer** sits in front of many identical servers and decides which one handles each request. It can work at layer 4 (just routing by IP/port, fast but simple) or layer 7 (inspecting the actual HTTP request to route smartly, like sending `/images` requests to servers optimized for that). Common strategies include **round robin** (take turns), **least connections** (send to whichever server is least busy), and **health checks** (stop sending traffic to a server that's not responding).

DNS itself can even act as a crude load balancer by returning different IP addresses to different users for the same domain name — this is called DNS round robin.

## In practice

```js
const dns = require('dns');

// Resolve a domain name to its IP addresses, just like your browser does
dns.resolve4('nodejs.org', (err, addresses) => {
  if (err) throw err;
  console.log('nodejs.org resolves to:', addresses); // could be multiple IPs
});
```

A domain can resolve to several IP addresses; a client or load balancer can then pick between them, which is one of the simplest forms of load distribution.

## Quick reference

| Concept | What it does |
|---|---|
| DNS resolver | Looks up which IP address a domain name points to |
| Authoritative server | The final source of truth for a domain's records |
| TTL (Time To Live) | How long a DNS answer can be cached before re-checking |
| L4 load balancer | Routes by IP/port only, very fast, no content awareness |
| L7 load balancer | Routes by HTTP content (path, headers), smarter but slower |
| Health check | Load balancer stops sending traffic to unresponsive servers |

## What interviewers ask

- **Walk me through what happens when you type a URL into a browser.** — DNS resolves the domain to an IP (checking caches first), the browser opens a TCP connection (and TLS handshake for HTTPS) to that IP, sends an HTTP request, and renders the response — load balancers may sit anywhere in that path in front of the actual servers.
- **What's the difference between an L4 and L7 load balancer?** — L4 only looks at IP addresses and ports, so it's fast but can't make smart decisions; L7 reads the actual HTTP request (URL, headers, cookies) to route more intelligently, at the cost of extra processing.
- **How does a load balancer know a server is unhealthy?** — It periodically sends health check requests (like hitting a `/health` endpoint) and stops routing traffic to any server that fails to respond correctly.

## Common mistakes

- Assuming DNS changes take effect instantly — cached answers with a long TTL can keep pointing at an old IP for minutes to days after you update a record.
- Thinking a load balancer alone guarantees high availability — if it doesn't also do health checks, it will keep sending traffic to a dead server.
