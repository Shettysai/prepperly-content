---
title: Kubernetes basics
slug: kubernetes-basics
summary: Pods, Deployments, Services
tags: [containers, devops, distributed-systems]
links:
  - title: Kubernetes Docs — Concepts overview
    url: "https://kubernetes.io/docs/concepts/overview/"
    kind: resource
  - title: Kubernetes Docs — Pods
    url: "https://kubernetes.io/docs/concepts/workloads/pods/"
    kind: resource
---
## In one sentence

**Kubernetes** (often called K8s) is a system that runs your containers across many machines for you, automatically restarting them if they crash and adding more copies when traffic increases.

## Why it matters

Docker runs one container on one machine, but real apps need many containers running reliably across many machines, surviving crashes, and scaling with demand. Doing that by hand — noticing a crashed container and manually restarting it at 3 a.m. — doesn't scale; Kubernetes automates it.

## The idea

Think of Kubernetes as a manager for a fleet of containers. You describe what you want ("keep 3 copies of my app running"), and Kubernetes continuously works to match reality to that description, replacing containers whenever they drift from it.

The smallest unit Kubernetes manages is a **Pod** — one or more containers that always run together on the same machine, sharing the same network address. Most of the time a Pod holds just one container.

A **Deployment** describes how many copies (replicas) of a Pod you want running and manages rolling out new versions without downtime — it creates new Pods and only removes old ones once the new ones are healthy.

Pods are temporary and get new IP addresses whenever they restart, so a **Service** gives them a stable address other parts of your app can rely on, and it load-balances traffic across the healthy Pods behind it.

A useful mental model: a Deployment is the instruction, Pods are the running instances, and a Service is the front door that routes to whichever Pods are currently healthy.

## In practice

```bash
# A minimal Deployment description (deployment.yaml), then applying it
kubectl apply -f deployment.yaml

kubectl get pods                  # see the running Pods and their status
kubectl scale deployment my-app --replicas=5   # scale up to 5 copies
kubectl logs my-app-7d9f8-abcde   # view logs from one Pod
```

```yaml
# deployment.yaml (simplified)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3          # Kubernetes keeps exactly 3 Pods running
  template:
    spec:
      containers:
        - name: my-app
          image: my-app:1.0
```

`replicas: 3` is the instruction Kubernetes continuously enforces — if a Pod dies, it starts a new one to get back to 3.

## Quick reference

| Concept | Role |
|---|---|
| Pod | Smallest deployable unit; one or more containers running together |
| Deployment | Declares how many Pod replicas to keep running, manages rollouts |
| Service | Stable network address that load-balances across healthy Pods |
| Node | A physical or virtual machine that runs Pods |
| kubectl | The command-line tool used to talk to a Kubernetes cluster |

## What interviewers ask

- **What is a Pod, and why not just run containers directly?** — A Pod is Kubernetes's unit of scheduling; it groups containers that must share networking and storage, and Kubernetes needs this abstraction to manage scaling, restarts, and networking consistently.
- **Why do you need a Service if you already have Pods?** — Pods get replaced and get new IPs constantly, so a Service provides one stable address and spreads traffic across whichever Pods are currently alive.
- **How does Kubernetes handle a Pod crashing?** — The Deployment notices the actual replica count is below the desired count and starts a replacement Pod automatically, without a human intervening.

## Common mistakes

- Thinking a Pod and a container are the same thing — a Pod can hold multiple containers that share the same network namespace.
- Talking to Pods directly by IP address instead of through a Service, which breaks the moment a Pod restarts and gets a new IP.
- Assuming more replicas alone fixes performance problems — if the app itself has a bottleneck (like a shared database), adding Pods won't help until that's addressed.
