---
title: HTTP/HTTPS, WebSockets
slug: http-https-websockets
summary: Methods, Status codes
tags: [networking, http]
links:
  - title: MDN — HTTP overview
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"
    kind: resource
  - title: MDN — WebSockets API
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
    kind: resource
  - title: Node.js docs — http module
    url: "https://nodejs.org/api/http.html"
    kind: resource
---
## In one sentence

**HTTP** is the request-and-response language browsers and servers use to talk to each other; **HTTPS** is the same thing encrypted; **WebSockets** let both sides keep talking back and forth over one connection instead of asking-and-waiting every time.

## Why it matters

Almost every web app you've used runs on HTTP requests: load a page, submit a form, fetch an API response. Without HTTPS, anyone on the network — your Wi-Fi router, your ISP — could read or tamper with that traffic, including passwords. And without WebSockets, live features like chat or stock tickers would need to constantly re-ask the server "anything new yet?", wasting bandwidth and adding delay.

## The idea

**HTTP** works like sending a letter and waiting for a reply: your browser sends a **request** (a method like `GET` or `POST`, a URL, some headers) and the server sends back a **response** (a status code like `200` for success or `404` for not found, plus a body). Each request-response pair is independent — the server doesn't remember you between requests unless you add something like cookies.

**HTTPS** is HTTP wrapped in **TLS** (Transport Layer Security) encryption. It doesn't change what you send, just scrambles it so only your browser and the server can read it, and proves the server is who it claims to be via a certificate.

**WebSockets** solve a different problem: HTTP's request-response pattern is bad for anything that needs constant two-way updates. A WebSocket starts as a normal HTTP request that then "upgrades" into a persistent open connection — after that, either side can send messages at any time without asking again, which is exactly what chat apps, live dashboards, and multiplayer games need.

## In practice

```js
const http = require('http');

const server = http.createServer((req, res) => {
  // req.method + req.url is the request; res.writeHead + res.end is the response
  if (req.url === '/hello') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, world'); // one request, one response, then the exchange is done
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000);
```

This is plain request/response HTTP — every single call opens fresh, unlike a WebSocket which stays open for many messages.

## Quick reference

| | HTTP | HTTPS | WebSocket |
|---|---|---|---|
| Encrypted | No | Yes (TLS) | Depends (wss:// is encrypted) |
| Connection style | Request, response, done | Same as HTTP | Stays open, two-way |
| Good for | Pages, REST APIs | Anything with sensitive data | Chat, live feeds, games |
| Starts as | Plain request | TLS handshake first | Normal HTTP request that "upgrades" |

## What interviewers ask

- **What's the difference between HTTP and HTTPS?** — HTTPS is HTTP encrypted with TLS; the request/response model is identical, but HTTPS also verifies the server's identity via a certificate and prevents eavesdropping or tampering in transit.
- **Why use a WebSocket instead of polling the server every few seconds?** — Polling wastes requests asking "anything new?" even when the answer is no, adding latency and load; a WebSocket lets the server push data the instant it's available, over one connection.
- **How does a WebSocket connection start?** — It begins as a normal HTTP request with an `Upgrade: websocket` header; if the server agrees, it responds with a 101 status and the connection switches protocols, staying open afterward.

## Common mistakes

- Thinking WebSockets replace HTTP entirely — most apps still use HTTP for regular page loads and API calls, and only add a WebSocket for the specific parts that need live, two-way updates.
- Assuming HTTPS makes an app fully secure — it only protects data in transit; the server can still have security bugs, and you still need to validate input and manage auth properly.
