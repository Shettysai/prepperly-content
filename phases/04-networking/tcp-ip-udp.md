---
title: TCP/IP, UDP
slug: tcp-ip-udp
summary: Handshakes, Connections
tags: [networking, fundamentals]
links:
  - title: MDN — HTTP overview (built on TCP)
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"
    kind: resource
  - title: Wikipedia — Transmission Control Protocol
    url: "https://en.wikipedia.org/wiki/Transmission_Control_Protocol"
    kind: resource
  - title: Node.js docs — net module (TCP)
    url: "https://nodejs.org/api/net.html"
    kind: resource
---
## In one sentence

**TCP** and **UDP** are the two ways computers send data over the internet — one double-checks every piece arrives correctly, the other just fires data and moves on.

## Why it matters

Different applications have different needs: a bank transfer must never lose or duplicate data, while a video call would rather drop a frame than freeze waiting for it. Picking the wrong one either wastes performance or corrupts data. Almost every networking interview question — "why does a video call use UDP but a file download uses TCP" — comes back to this single trade-off.

## The idea

Imagine sending a package. **TCP** (Transmission Control Protocol) is like registered mail: it opens a connection first (the **three-way handshake** — SYN, SYN-ACK, ACK), numbers every piece so it can reassemble them in order, and asks for a resend if something goes missing. That reliability costs time and overhead. **UDP** (User Datagram Protocol) is like tossing postcards in the mail — no handshake, no guarantee of order or delivery, but almost no overhead, so it's fast.

Both ride on top of **IP** (Internet Protocol), which is just the addressing system that gets a packet from your machine toward the right destination, one hop at a time — IP itself doesn't guarantee delivery either.

TCP is used when correctness matters more than speed: web pages (HTTP), email, file transfers. UDP is used when speed and low latency matter more than perfect delivery: video calls, live streaming, DNS lookups, online games — a slightly stale game position is better than a laggy one.

## In practice

```js
const net = require('net');
const dgram = require('dgram');

// TCP: a persistent, ordered connection
const tcpServer = net.createServer((socket) => {
  socket.write('TCP: reliable, ordered, connection-based\n');
});
tcpServer.listen(5000);

// UDP: fire-and-forget individual packets, no connection setup
const udpSocket = dgram.createSocket('udp4');
udpSocket.send('UDP: fast, no delivery guarantee', 5001, 'localhost');
```

TCP requires a listening connection before any data flows; UDP just sends a packet to an address and port with no setup at all.

## Quick reference

| | TCP | UDP |
|---|---|---|
| Connection | Handshake required | None |
| Delivery guarantee | Yes (retransmits) | No |
| Order guarantee | Yes | No |
| Speed | Slower (more overhead) | Faster |
| Use case | Web, email, file transfer | Video calls, gaming, DNS |

## What interviewers ask

- **Walk me through the TCP three-way handshake.** — Client sends SYN (synchronize), server replies SYN-ACK (acknowledge and synchronize back), client replies ACK. Only after this does either side send real data, guaranteeing both agree the connection is open.
- **Why would you ever choose UDP over TCP?** — When speed and low latency matter more than occasionally losing data, like live video — retransmitting a stale video frame is pointless because the moment has already passed.
- **How does TCP know a packet was lost?** — Each byte is numbered (sequence numbers); the receiver sends acknowledgments, and if the sender doesn't get an ACK within a timeout, it resends the data.

## Common mistakes

- Saying "UDP is unreliable so it's bad" — unreliable just means no automatic guarantee; some apps handle their own retries at a higher layer and prefer UDP's speed.
- Forgetting that TCP's reliability comes at a real cost — the handshake, acknowledgments, and retransmissions all add latency, which is why real-time systems avoid it.
