---
title: Docker & Containerization
slug: docker-containerization
summary: Images, Volumes, Networking
tags: [containers, devops]
links:
  - title: Docker Docs — Getting started overview
    url: "https://docs.docker.com/get-started/"
    kind: resource
  - title: Docker Docs — Dockerfile reference
    url: "https://docs.docker.com/reference/dockerfile/"
    kind: resource
  - title: Wikipedia — OS-level virtualization
    url: "https://en.wikipedia.org/wiki/OS-level_virtualization"
    kind: resource
---
## In one sentence

**Docker** packages your app together with everything it needs to run — code, dependencies, and settings — into a single portable **container**, so it behaves the same on your laptop as it does on a server.

## Why it matters

"It works on my machine" is a real, frequent problem: different operating systems, missing dependencies, or a different Node version can all break an app that ran fine for you. Containers remove that excuse by shipping the entire environment along with the code, so what you tested is exactly what runs in production.

## The idea

A container is like a shipping container for software: no matter what's inside, it has a standard shape that any ship, truck, or crane can handle. Docker defines that shape for applications — a lightweight, isolated unit that bundles your code with its runtime, libraries, and configuration.

An **image** is the blueprint — a read-only snapshot of everything your app needs. A **container** is a running instance of that image, similar to how a class and an object relate in programming: one image can spin up many identical containers.

You build an image using a **Dockerfile**, a text file listing the steps to assemble it: start from a base image, copy in your code, install dependencies, and specify the command that starts the app. Docker also has **volumes**, which let a container persist data outside its own filesystem (so data survives even if the container is deleted), and a **network** layer that lets containers talk to each other by name, like a service called `api` reaching a service called `db`.

## In practice

```dockerfile
# Dockerfile — packages a small Node.js app
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t my-app .          # build the image from the Dockerfile
docker run -p 3000:3000 my-app    # run a container, mapping host port 3000
```

The `Dockerfile` defines what goes into the image once; `docker run` can then start as many identical containers from it as you need.

## Quick reference

| Term | What it is |
|---|---|
| Image | Read-only blueprint for a container |
| Container | A running (or stopped) instance of an image |
| Dockerfile | Recipe used to build an image |
| Volume | Persistent storage outside the container's own filesystem |
| Docker network | Lets containers reach each other by service name |

## What interviewers ask

- **What's the difference between an image and a container?** — An image is the static blueprint; a container is a running instance of it, the way a class relates to an object.
- **How is a container different from a virtual machine?** — A container shares the host machine's OS kernel and only isolates the application layer, making it much lighter and faster to start than a full VM, which virtualizes an entire OS.
- **Why use volumes instead of storing data inside the container?** — Containers are meant to be disposable; anything written inside them is lost when the container is removed, so persistent data (like a database's files) needs a volume.

## Common mistakes

- Storing important data inside the container's own filesystem, then losing it when the container restarts or is replaced — use a volume instead.
- Building huge images by copying unnecessary files or using a heavy base image; a smaller base (like `alpine`) and a `.dockerignore` file keep images fast to build and deploy.
- Assuming a container is as isolated as a full VM — containers share the host kernel, so kernel-level vulnerabilities can still matter for security.
