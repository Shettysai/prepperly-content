---
title: Streams & Buffers
slug: streams-and-buffers
summary: Readable, Writable, Transform
tags: [nodejs, memory, javascript]
links:
  - title: Node.js docs — Stream
    url: "https://nodejs.org/api/stream.html"
    kind: resource
  - title: Node.js docs — Buffer
    url: "https://nodejs.org/api/buffer.html"
    kind: resource
---
## In one sentence

A **buffer** is a chunk of raw binary data held in memory, and a **stream** is a way of processing data piece by piece as it arrives, instead of waiting for the whole thing to load into memory first.

## Why it matters

If you read a 2GB video file with `fs.readFileSync`, Node tries to hold all 2GB in memory at once before you can do anything with it — that can crash your process or make it painfully slow. Streams let you process data in small chunks as they flow in, so memory use stays flat regardless of whether the file is 2KB or 2GB.

## The idea

Think of the difference like drinking from a garden hose versus receiving a swimming pool's worth of water all at once in a bucket. A buffer is the bucket — a fixed amount of data sitting fully in memory. A stream is the hose — data flows continuously, and you handle each bit as it comes.

Node has four kinds of streams: **Readable** (a source, like a file or an incoming HTTP request), **Writable** (a destination, like a file or an HTTP response), **Duplex** (both, like a TCP socket), and **Transform** (a duplex stream that modifies data in transit, like a gzip compressor).

The real power move is **piping**: `readableStream.pipe(writableStream)` connects a source directly to a destination, and Node automatically handles **backpressure** — pausing the source if the destination can't keep up, so a fast reader doesn't overwhelm a slow writer.

## In practice

Copying a large file without ever loading it fully into memory:

```js
const fs = require('fs');
const zlib = require('zlib');

const readStream = fs.createReadStream('input.txt');   // Readable: emits chunks
const gzip = zlib.createGzip();                        // Transform: compresses chunks
const writeStream = fs.createWriteStream('input.txt.gz'); // Writable: consumes chunks

// pipe handles backpressure automatically — if writeStream is slow,
// readStream pauses instead of piling up chunks in memory
readStream.pipe(gzip).pipe(writeStream);

writeStream.on('finish', () => console.log('Done — compressed without loading the whole file into RAM'));
```

No matter how large `input.txt` is, memory usage stays roughly constant, because only a small chunk exists in memory at any moment as it flows through the pipeline.

## Quick reference

| Stream type | Direction | Example |
|---|---|---|
| Readable | Source you read from | `fs.createReadStream()`, incoming HTTP request |
| Writable | Destination you write to | `fs.createWriteStream()`, HTTP response |
| Duplex | Both read and write | TCP socket |
| Transform | Duplex that modifies data in transit | `zlib.createGzip()`, a CSV parser |

## What interviewers ask

- **Why use a stream instead of reading a whole file into memory?** — Memory efficiency: a stream processes data in small chunks with roughly constant memory use, while reading the whole file loads it entirely into RAM first, which fails or slows badly on large files.
- **What is backpressure and why does it matter?** — It's the mechanism where a writable destination signals a readable source to pause when it can't keep up, preventing unbounded memory growth from unconsumed chunks piling up; `.pipe()` implements this automatically, which is why it's preferred over manually forwarding `data` events.
- **What is a Buffer in Node.js?** — A fixed-size chunk of raw binary data, used because JavaScript strings weren't originally designed to handle binary data efficiently; you see buffers when reading files, handling network protocols, or working with anything that isn't plain text.
- **When would you use a Transform stream?** — Any time you need to modify data as it passes through a pipeline without buffering the whole thing first, like compressing a file, encrypting data, or parsing a large CSV row by row.

## Common mistakes

- Using `fs.readFileSync()` or loading an entire request body into a string for large files, defeating the purpose of streaming.
- Manually piping data with `.on('data', ...)` without handling the `false` return from `.write()`, silently ignoring backpressure — `.pipe()` avoids this trap.
- Forgetting to handle the `'error'` event on streams — `.pipe()` does not automatically forward errors between chained streams.
