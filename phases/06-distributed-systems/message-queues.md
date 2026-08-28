---
title: Message Queues
slug: message-queues
summary: Kafka, RabbitMQ, Pub/Sub
tags: [distributed-systems, system-design, scalability]
links:
  - title: RabbitMQ docs — Getting started
    url: "https://www.rabbitmq.com/docs"
    kind: resource
  - title: Apache Kafka docs
    url: "https://kafka.apache.org/documentation/"
    kind: resource
---
## In one sentence

A **message queue** is a middleman that holds messages sent from one part of a system until another part is ready to process them, so the two sides don't have to talk to each other directly or at the same time.

## Why it matters

Without a queue, if a service that sends emails is slow or temporarily down, whatever is trying to send those emails either has to wait, retry itself, or lose the request entirely. A queue absorbs that mismatch: the sender drops a message and moves on immediately, and the receiver processes messages whenever it's ready, even if that's a few seconds later. This is what lets systems handle sudden traffic spikes and keeps one slow component from freezing the whole app.

## The idea

At its simplest, a **producer** sends a message to a queue, and a **consumer** reads and processes it later. This decouples the two — the producer doesn't need to know who's consuming, how many consumers there are, or whether they're currently busy.

There are two common patterns. In a **point-to-point queue** (like RabbitMQ's classic queue), each message is delivered to exactly one consumer, useful for distributing work across a pool of workers — like processing uploaded images, where you don't want the same image processed twice. In **publish/subscribe** (pub/sub), a message is broadcast to every subscriber interested in that topic, useful when multiple independent parts of a system need to react to the same event, like "order placed" triggering both an email and an inventory update.

**Kafka** is often used as a durable, ordered log of events that many consumers can read independently at their own pace, making it popular for event streaming and analytics. **RabbitMQ** is a more traditional message broker, strong at flexible routing and point-to-point work queues. Both need a delivery guarantee: **at-most-once** (might lose a message, never duplicates), **at-least-once** (never loses a message, but might deliver it twice), or **exactly-once** (the ideal, but hardest and most expensive to guarantee).

## In practice

```js
// A minimal in-memory queue illustrating producer/consumer decoupling
const queue = [];

function produce(message) {
  queue.push(message); // producer doesn't wait for anyone to process it
  console.log('Queued:', message);
}

function consume() {
  const message = queue.shift();
  if (message) console.log('Processing:', message); // consumer works at its own pace
}

produce({ type: 'send_email', to: 'user@example.com' });
consume();
```

The producer's job ends the moment the message is queued; it never blocks waiting for the email to actually be sent.

## Quick reference

| Guarantee | Meaning | Risk |
|---|---|---|
| At-most-once | Message sent once, no retry | Can silently lose messages |
| At-least-once | Retries until acknowledged | Consumer might see duplicates |
| Exactly-once | Delivered and processed exactly once | Hardest/most expensive to implement |

| Pattern | Delivery | Good for |
|---|---|---|
| Point-to-point queue | One consumer per message | Distributing work across workers |
| Publish/Subscribe | All subscribers get the message | Broadcasting an event to many services |

## What interviewers ask

- **Why would you introduce a message queue between two services instead of calling one directly?** — It decouples them in time and load: the caller doesn't have to wait for the receiver to be ready or fast, spikes in traffic get smoothed out by the queue instead of overwhelming the receiver, and if the receiver crashes, messages just wait in the queue instead of being lost.
- **What's the difference between a point-to-point queue and pub/sub?** — Point-to-point delivers each message to exactly one consumer, ideal for splitting up work; pub/sub broadcasts each message to every subscriber, ideal for notifying multiple independent services about the same event.
- **When would you choose Kafka over a traditional queue like RabbitMQ?** — When you need a durable, replayable log of events that multiple independent consumers read at their own pace (like analytics pipelines), rather than a queue where each message is consumed once and gone.

## Common mistakes

- Assuming a queue guarantees exactly-once delivery by default — most real systems default to at-least-once, and it's the consumer's job to handle potential duplicates safely (idempotency).
- Using pub/sub when you actually need work distributed across a pool of workers — broadcasting a task to every worker means every worker processes it, instead of just one.
