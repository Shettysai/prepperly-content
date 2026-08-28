---
title: OSI Model
slug: osi-model
summary: 7 Layers, Protocols
tags: [networking, fundamentals]
links:
  - title: MDN — How does the Internet work?
    url: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work"
    kind: resource
  - title: Wikipedia — OSI model
    url: "https://en.wikipedia.org/wiki/OSI_model"
    kind: resource
---
## In one sentence

The **OSI model** is a 7-layer checklist that describes every step data takes to travel from one computer to another, from raw electrical signals up to the app you're using.

## Why it matters

Without a shared way to break networking into layers, every vendor would build incompatible pieces — a cable maker's plug wouldn't fit a router, and a router wouldn't understand a browser's data. The OSI model gives everyone a common vocabulary, so "that's a layer 3 problem" instantly tells another engineer where to look. It also explains why swapping Wi-Fi for Ethernet doesn't break your website — only the lower layers change.

## The idea

Think of mailing a letter. You write a message, put it in an envelope with an address, hand it to the postal service, which moves it by truck or plane. Each step adds its own wrapper and only cares about its own job. Networking works the same way, with 7 layers instead of 3.

From bottom to top: **Physical** (raw bits over a wire or radio wave), **Data Link** (getting bits to the next device on the same network, using MAC addresses), **Network** (routing across different networks, using IP addresses), **Transport** (chunking data and making sure it all arrives — TCP does this), **Session** (keeping a conversation open), **Presentation** (formatting/encrypting data), and **Application** (the protocol your app speaks, like HTTP).

Each layer only talks to the layers directly above and below it. A browser's request travels down through all 7 layers on your machine, across the wire, then back up through all 7 on the server.

## In practice

```js
// You rarely touch layers 1-3 directly in Node.js, but you can see
// layer 4 (Transport) and layer 7 (Application) in a simple TCP echo server.
const net = require('net');

const server = net.createServer((socket) => {
  // socket = a live Transport-layer (TCP) connection
  socket.on('data', (chunk) => {
    console.log('Application layer sees:', chunk.toString());
    socket.write(`echo: ${chunk}`); // Node hands this to TCP, which hands it to IP, etc.
  });
});

server.listen(4000, () => console.log('Listening on layer 7, riding on layer 4'));
```

The code only writes bytes to a socket — Node and the OS quietly handle layers 1 through 4 underneath it.

## Quick reference

| Layer | Name | Does what | Example |
|---|---|---|---|
| 7 | Application | Protocol your app speaks | HTTP, DNS |
| 6 | Presentation | Formats/encrypts data | TLS, JSON encoding |
| 5 | Session | Keeps a conversation open | Login sessions |
| 4 | Transport | Reliable delivery, ordering | TCP, UDP |
| 3 | Network | Routing between networks | IP, routers |
| 2 | Data Link | Delivery on the same network | Ethernet, MAC address, switches |
| 1 | Physical | Raw bits on the wire/air | Cables, Wi-Fi radio |

## What interviewers ask

- **Why do we need 7 layers instead of just sending raw data?** — Splitting responsibilities means each layer can change independently; you can swap Wi-Fi for fiber without rewriting your app, because only layers 1-2 change.
- **Where does a switch operate vs a router?** — A switch works at layer 2 using MAC addresses within one network; a router works at layer 3 using IP addresses to move data between networks.
- **Which layer does HTTPS live at?** — HTTP is layer 7; TLS encryption is usually described as layer 6 (presentation), though in practice TCP/IP stacks blur layers 5-7 together.
- **What's the real-world model actually used, vs OSI?** — The TCP/IP model, which collapses OSI into 4 layers; OSI is mainly a teaching and troubleshooting reference, not something every stack implements literally.

## Common mistakes

- Treating OSI as something every stack implements exactly — the real internet runs on the simpler 4-layer TCP/IP model, and OSI is mostly a mental map.
- Mixing up layer 2 and layer 3 addressing — MAC addresses (layer 2) identify a device locally; IP addresses (layer 3) identify it globally for routing.
