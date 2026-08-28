---
title: Consensus Algorithms
slug: consensus-algorithms
summary: Paxos, Raft
tags: [distributed-systems, consistency]
links:
  - title: Wikipedia — Raft (algorithm)
    url: "https://en.wikipedia.org/wiki/Raft_(algorithm)"
    kind: resource
  - title: Wikipedia — Paxos (computer science)
    url: "https://en.wikipedia.org/wiki/Paxos_(computer_science)"
    kind: resource
---
## In one sentence

A **consensus algorithm** is a set of rules that lets a group of servers agree on a single value or decision — like who the leader is, or what the next entry in a log should be — even if some servers are slow, crash, or briefly disconnected.

## Why it matters

If every server in a cluster could just decide things on its own, you'd get contradictions — two servers both thinking they're the leader, or two different values both "confirmed" for the same record. Consensus algorithms are the mechanism that keeps a distributed system behaving like one coherent system instead of a pile of confused, disagreeing machines. They're the foundation underneath things like leader election, distributed locks, and replicated logs.

## The idea

The core problem: multiple servers need to agree on one answer, but messages between them can be delayed or lost, and any server might crash at any moment. **Paxos** was the first widely known solution, but it's famously hard to understand and implement correctly — it works through rounds of proposals and acknowledgments where a value is only considered "chosen" once a majority of servers accept it.

**Raft** was designed later specifically to be easier to understand while solving the same problem, and it's the one most modern systems (like etcd, which powers Kubernetes) actually use. Raft breaks the problem into three clear parts: **leader election** (servers vote for one leader; whoever gets a majority of votes wins), **log replication** (the leader receives writes and copies them to followers in order), and **safety** (a write is only considered committed once a majority of servers have stored it, so it survives even if the leader crashes right after).

The key idea shared by both is the **majority quorum**: as long as more than half the servers are up and can talk to each other, the group can keep making progress and agreeing on new values, even if the rest are down or unreachable. This is why clusters are usually set up with an odd number of nodes (3 or 5) — it makes majority math clean and tells you exactly how many failures you can tolerate.

## In practice

```js
// A simplified illustration of majority-quorum decision making
function isCommitted(totalNodes, acksReceived) {
  const majority = Math.floor(totalNodes / 2) + 1;
  return acksReceived >= majority;
}

console.log(isCommitted(5, 3)); // true — 3 out of 5 is a majority, write is safely committed
console.log(isCommitted(5, 2)); // false — not enough nodes have confirmed yet
```

A write (or a leader election vote) is only treated as final once more than half the cluster has acknowledged it — that's what protects the decision even if some nodes later fail.

## Quick reference

| Algorithm | Known for | Used in |
|---|---|---|
| Paxos | First formal solution, hard to implement correctly | Google Chubby, some internal systems |
| Raft | Designed to be understandable, same guarantees | etcd (Kubernetes), Consul, CockroachDB |
| ZAB | Similar goals, built for one specific system | Apache ZooKeeper |

## What interviewers ask

- **What problem does a consensus algorithm actually solve?** — It lets a group of unreliable, network-connected servers agree on a single value or ordering of events, even when some servers crash or messages are delayed, so the whole cluster can act as one consistent system instead of contradicting itself.
- **Why does Raft use a majority quorum, and why are clusters usually an odd number of nodes?** — A majority ensures any two decisions (like two leader elections) must overlap on at least one node, preventing two conflicting values from both being 'confirmed'; an odd number (like 3 or 5) avoids wasted nodes, since 4 nodes tolerate the same 1 failure as 3 but need one more machine.
- **Why did Raft get created when Paxos already existed?** — Paxos is provably correct but notoriously difficult to understand and implement safely in real systems; Raft was explicitly designed for understandability, breaking the same guarantees into clearer, separated sub-problems.

## Common mistakes

- Thinking consensus algorithms are only about picking a leader — leader election is one part, but ongoing log replication and safety guarantees under failure are equally important.
- Assuming any majority of nodes being up is enough regardless of network conditions — a network partition can split a cluster so that no side has a majority, in which case the system correctly refuses to make progress rather than risk a split-brain decision.
