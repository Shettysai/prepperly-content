# Expansion plan — mTLS/PKI + LLM Infrastructure & GPU serving

Status: **awaiting approval**. Nothing has been written yet.
Author: planning session 2026-09-08.

## Goal

Add depth in three areas the current 137 topics do not cover:

1. **Mutual TLS and PKI as a first-class subject.** Today `tls-and-certificates`
   (04-networking) teaches one-way TLS well and never uses the word "mutual".
   `service-discovery-and-mesh` name-drops mTLS five times and explains it zero.
2. **Serving your own models on your own GPUs.** `12-ai-engineering` is entirely
   API-consumer-side. Nothing on GPU memory math, vLLM/TGI, quantization,
   continuous batching, K8s GPU scheduling, or cold starts.
3. **LLM internals below the API line.** `llm-fundamentals` carries tokens +
   embeddings + attention + context in 1696 words — four topics in one file.

## What already exists (do not duplicate)

| Existing topic | Phase | Covers | New topics must NOT re-explain |
|---|---|---|---|
| `tls-and-certificates` | 04 | One-way handshake, chain of trust, leaf/intermediate/root, forward secrecy, incomplete-chain incident, `rejectUnauthorized:false` as wrong fix | The basic handshake, what a CA is, chain walking |
| `authentication-authorization` | 09 | OAuth 2.0, JWT, sessions | JWT structure basics |
| `secrets-management` | 09 | Env vars vs vaults, rotation, encryption at rest | Vault concepts generally |
| `service-discovery-and-mesh` | 06 | Sidecars, data/control plane, mesh trade-offs | What a mesh is |
| `kubernetes-basics` | 09 | Pods, Deployments, Services | Pod/Deployment basics |
| `llm-cost-and-latency` | 12 | Prompt caching, streaming, routing, Batch API (consumer-side) | API-level cost levers |
| `llm-fundamentals` | 12 | Tokens, embeddings, attention, context (shallow, all four) | To be **narrowed**, see below |
| `web-security-fundamentals` | 09 | OWASP-style app security | XSS/CSRF/injection |
| `docker-containerization` | 09 | Images, layers, containers | Dockerfile basics |

Every new topic's "Before you start" links the prerequisite above rather than
restating it.

## The asset we are not using: `~/Documents/Projects/mtls-demo`

A real, runnable lab. Decision: **extract its output into the content, cite the
lab as optional hands-on.** Content stays self-contained; the lab is a bonus.

What it contains, and which topic each part feeds:

| Lab file | What it actually does | Feeds topic |
|---|---|---|
| `1-make-certs.sh` | One CA signs 3 leaf certs (server-a, server-b, client) + a rogue | `pki-and-certificate-authorities` |
| `client.js` | 7 deliberate scenarios: happy path, dual-slot cert+Bearer, no cert, wrong CA, mismatched cert/key, client distrusts server, insecure escape hatch | `mutual-tls-explained`, `mtls-failure-modes` |
| `server.js` | `requestCert` / `rejectUnauthorized` matrix; `tlsClientError` vs request handler split | `mutual-tls-explained` |
| `inspect-pem.js` | Public-key fingerprint identical in cert and key = "they are a pair" | `pki-and-certificate-authorities` |
| `explain-mutual.js` | The symmetry: both sides hold "a CA cert", used in opposite directions | `mutual-tls-explained` |
| `manual-verify.js` | Hand-written DER Tag-Length-Value parser; RSA verify from first principles (`s^e mod n`); TBS bytes | `x509-and-der-decoded` |
| `prove-key-never-sent.js` | TCP spy records every byte both directions, searches for private exponent `d`; reruns on TLS 1.2 where Certificate is cleartext | `x509-and-der-decoded`, `mutual-tls-explained` |
| `step9-handshake.js` | The handshake message-by-message with precise names | `mutual-tls-explained` |
| `jwt-vs-cert.js` | Builds + verifies RS256 by hand using the same RSA primitives; tampering attack | `mtls-vs-token-auth` |

Real terminal output from the lab (the `[PAIR] ✓ ... cert and key MATCH`
fingerprint block, the `[MODE] ✓ REAL mTLS` line, the
`ERR_SSL_PEER_DID_NOT_RETURN_A_CERTIFICATE` rejection, the
`authorized=true peer CN=demo-client` line) goes into the worked-example
sections verbatim, because it is genuine output rather than invented.

## Structure

Two new phases, plus targeted inserts. **No existing slug changes** — slugs are
the join key against user progress in the app's database.

```
phases/
  04-networking/          + mutual-tls-explained            (11 topics)
  09-backend-engineering/ + gpu-scheduling-in-kubernetes     (11 topics)
  12-ai-engineering/      + embeddings-and-vector-math
                          + attention-and-transformers
                          + kv-cache-and-context-windows     (13 topics)
  16-security-identity-and-pki/    10 topics  (NEW)
  17-llm-infrastructure-and-gpus/  11 topics  (NEW)
```

Net: **+26 topics**, 137 → 163. At the repo's established 1500–2200 words that
is roughly 42,000–52,000 new words plus 130–156 new interview questions.

### Phase 16 — "Chapter 16: Security, Identity & PKI"

`{ "slug": "security-identity-and-pki", "name": "Chapter 16: Security, Identity & PKI", "position": 16, "targetMonth": 7 }`

| # | Slug | Title | Core content | Prereq |
|---|---|---|---|---|
| 1 | `pki-and-certificate-authorities` | PKI & Certificate Authorities | What a CA actually signs; CSR → issued cert; leaf vs intermediate vs root; the cert/key pair fingerprint check; private CA vs public CA; why roots stay offline | `tls-and-certificates` |
| 2 | `x509-and-der-decoded` | X.509 & DER, Decoded by Hand | ASN.1 Tag-Length-Value; walking a real cert byte by byte; TBS ("to be signed") bytes and why the CA hashes exactly those; `s^e mod n` RSA verification; PEM as Base64-wrapped DER | topic 1 |
| 3 | `mtls-failure-modes` | Diagnosing mTLS Failures | The 7 lab scenarios as a diagnostic tree; handshake error vs HTTP status as the key debugging split; `ERR_SSL_PEER_DID_NOT_RETURN_A_CERTIFICATE`, wrong-CA, mismatched pair (throws synchronously, no socket opened), encrypted-key passphrase, client-distrusts-server | `mutual-tls-explained` |
| 4 | `certificate-lifecycle-and-rotation` | Certificate Lifecycle & Rotation | Expiry as instant total outage; automated renewal; dual-slot / overlapping validity so rotation has no gap; why "rotation" and "two credential slots" are different problems; cert-manager | topic 1 |
| 5 | `mtls-vs-token-auth` | mTLS vs Tokens: Choosing | Connection-level vs request-level identity; RS256 built and verified by hand with the same RSA math; the tampering attack; when you need BOTH (cert for transport, Bearer for the app) | `authentication-authorization` |
| 6 | `workload-identity-and-spiffe` | Workload Identity & SPIFFE | Identity for services rather than users; SPIFFE IDs / SVIDs; short-lived auto-rotated certs; why this replaces long-lived shared secrets; how a mesh issues them | `service-discovery-and-mesh` |
| 7 | `mtls-in-service-meshes` | mTLS Inside a Service Mesh | Who terminates TLS where; sidecar-issued certs; STRICT vs PERMISSIVE mode and the migration path; what "zero trust networking" means concretely | topic 6 |
| 8 | `tls-termination-and-passthrough` | Termination, Re-encryption & Passthrough | Edge termination vs re-encryption vs passthrough; where the client cert is visible and where it is lost; `X-Forwarded-Client-Cert`; why a CDN/LB breaks naive mTLS | `cdn-and-edge-caching` |
| 9 | `connection-reuse-and-handshake-cost` | The Cost of a Handshake | Handshake CPU + round trips; keep-alive and pooling; session resumption / 0-RTT; **the trap: a custom TLS agent silently leaving the pooled path → full handshake per call**; how to measure it | `connection-pooling` |
| 10 | `secure-defaults-and-common-footguns` | Secure Defaults & Footguns | `rejectUnauthorized:false` and `requestCert` without `rejectUnauthorized` (the inspect-only trap: 200 OK with `yourClientCN=null`); trusting a cert vs disabling verification; cipher/version pinning; what to put in code review checklists | topic 3 |

### Phase 17 — "Chapter 17: LLM Infrastructure & GPU Serving"

`{ "slug": "llm-infrastructure-and-gpus", "name": "Chapter 17: LLM Infrastructure & GPU Serving", "position": 17, "targetMonth": 8 }`

| # | Slug | Title | Core content | Prereq |
|---|---|---|---|---|
| 1 | `gpu-fundamentals-for-engineers` | What a GPU Actually Is | SIMT vs CPU cores; VRAM vs system RAM; memory bandwidth as the real bottleneck; why inference is memory-bound not compute-bound; reading an `nvidia-smi` output | `computer-architecture` |
| 2 | `gpu-memory-math` | Sizing GPU Memory | Params × bytes-per-param; fp32/fp16/bf16/int8/int4; weights + KV cache + activations + overhead; a worked calculation for a 7B and a 70B model; which GPU fits what; OOM as arithmetic, not luck | topic 1 |
| 3 | `quantization-explained` | Quantization | Why fewer bits still works; post-training vs quantization-aware; GPTQ/AWQ/GGUF families; the quality/throughput/memory trade curve; when quantization is the wrong answer | topic 2 |
| 4 | `inference-servers-vllm-and-tgi` | Inference Servers | What a serving runtime does beyond `model.generate()`; vLLM, TGI, TensorRT-LLM, Ollama; PagedAttention; OpenAI-compatible endpoints; choosing one | topic 2 |
| 5 | `continuous-batching-and-throughput` | Continuous Batching | Static vs dynamic vs continuous batching; prefill vs decode phases; throughput vs per-request latency tension; how batch size interacts with the KV cache | topic 4 |
| 6 | `deploying-a-model-end-to-end` | Deploying a Model, End to End | The full path: pick model → size GPU → container with CUDA → weights loading strategy → health/readiness probes that account for multi-minute model load → smoke test → first request. A concrete, followable walkthrough | topic 4 |
| 7 | `serving-latency-and-benchmarking` | Measuring Inference Latency | TTFT vs TPOT vs end-to-end; tokens/sec per stream vs aggregate; p50/p95/p99 under concurrency; how to load-test a model endpoint; why average latency lies | topic 5 |
| 8 | `gpu-autoscaling-and-cold-starts` | Autoscaling GPUs | Model load time makes GPU scaling unlike stateless scaling; scale-to-zero vs warm pools; queueing as the pressure valve; what metric to scale on (not CPU); cost of idle VRAM | topic 6 |
| 9 | `self-hosted-vs-api-economics` | Self-Hosted vs API | Cost per million tokens both ways; the utilisation break-even; hidden costs (ops, eval, on-call, idle); latency and data-residency reasons that override cost; how to present the trade-off | `llm-cost-and-latency` |
| 10 | `fine-tuning-and-lora` | Fine-Tuning & LoRA | Full fine-tune vs LoRA/QLoRA; adapters and why they are small; serving many adapters on one base model; when fine-tuning beats RAG or prompting and when it does not | `rag-retrieval-augmented-generation` |
| 11 | `multi-gpu-and-model-parallelism` | Multi-GPU Serving | Data vs tensor vs pipeline parallelism; interconnect (NVLink vs PCIe) as the limit; when a model simply will not fit on one card; sharding overhead | topic 2 |

### Inserts into existing phases

| Phase | New slug | Title | Why here | Position |
|---|---|---|---|---|
| 04-networking | `mutual-tls-explained` | Mutual TLS (mTLS) | Belongs beside `tls-and-certificates`; the natural next step after one-way TLS. Both sides prove identity; the symmetry of the two CA certs; `requestCert`/`rejectUnauthorized` truth table; the handshake with client Certificate + CertificateVerify; proof the private key never crosses the wire | after `tls-and-certificates` |
| 09-backend-engineering | `gpu-scheduling-in-kubernetes` | Scheduling GPUs in Kubernetes | Extends `kubernetes-basics` into GPU resources: device plugin, `nvidia.com/gpu` limits, node selectors/taints, why GPUs are not shareable like CPU, MIG/time-slicing, node pools | after `kubernetes-basics` |
| 12-ai-engineering | `embeddings-and-vector-math` | Embeddings & Vector Math | Currently a paragraph inside `llm-fundamentals` while `vector-databases` assumes you know it. Vectors as meaning; cosine vs dot vs euclidean; dimensionality; why similar text lands nearby | before `vector-databases` |
| 12-ai-engineering | `attention-and-transformers` | Attention & Transformers | The mechanism `llm-fundamentals` can only gesture at. Q/K/V; self-attention; multi-head; why quadratic in sequence length; decoder-only stacks | after `llm-fundamentals` |
| 12-ai-engineering | `kv-cache-and-context-windows` | KV Cache & Context Windows | The bridge between the AI phase and phase 17 — explains why long context costs VRAM. Cache growth per token; prefill vs decode; context limits as a memory constraint; the real cost of a long system prompt | after `attention-and-transformers` |

### One edit to an existing file

`phases/12-ai-engineering/llm-fundamentals.md` — **narrow, do not shrink.** It
currently covers four subjects in 1696 words. Attention, embeddings and context
now have their own topics, so its "How it actually works" hands those off and
reinvests the space in what stays: tokenization, next-token prediction,
sampling's place, and what a "model" is as an artefact. Slug, title, frontmatter
and word count unchanged; the sections that move out are replaced by depth on
what remains, plus "Where to go next" links to the three new topics.

This is the only existing content file the plan touches.

## Agent dispatch — 7 focused agents

One agent per coherent cluster, so cross-topic voice and "where to go next"
links hold inside a cluster. Each agent gets: the full `CONTENT-SPEC.md`, two
existing topics as calibration examples (`tls-and-certificates` +
`llm-cost-and-latency`), its exact topic list with the prereq links above, the
overlap table ("do not re-explain these"), and the tag vocabulary.

| Agent | Topics | Notes |
|---|---|---|
| A — mTLS core | `mutual-tls-explained` (04), `mtls-failure-modes`, `secure-defaults-and-common-footguns` | **Reads `mtls-demo` directly.** Runs nothing, but quotes real output from README/scripts |
| B — PKI & crypto internals | `pki-and-certificate-authorities`, `x509-and-der-decoded`, `certificate-lifecycle-and-rotation` | **Reads `manual-verify.js`, `inspect-pem.js`, `1-make-certs.sh`** |
| C — Identity & mesh | `mtls-vs-token-auth`, `workload-identity-and-spiffe`, `mtls-in-service-meshes`, `tls-termination-and-passthrough`, `connection-reuse-and-handshake-cost` | **Reads `jwt-vs-cert.js`**; must link `service-discovery-and-mesh` not restate it |
| D — GPU hardware & sizing | `gpu-fundamentals-for-engineers`, `gpu-memory-math`, `quantization-explained`, `multi-gpu-and-model-parallelism` | Worked arithmetic must be correct and checkable |
| E — Model serving | `inference-servers-vllm-and-tgi`, `continuous-batching-and-throughput`, `deploying-a-model-end-to-end`, `serving-latency-and-benchmarking` | The "deploy end to end" topic is the centrepiece |
| F — GPU ops & economics | `gpu-scheduling-in-kubernetes` (09), `gpu-autoscaling-and-cold-starts`, `self-hosted-vs-api-economics` | Cost figures must be presented as "as of 2026-09, verify" not as fixed truth |
| G — LLM internals | `embeddings-and-vector-math`, `attention-and-transformers`, `kv-cache-and-context-windows`, `fine-tuning-and-lora`, + the `llm-fundamentals` narrowing edit | Owns the one existing-file edit, so a single agent is responsible for that seam |

### Per-agent deliverable

For each assigned topic, exactly two files:
- `phases/<NN-phase>/<slug>.md` — frontmatter (`title`, `slug`, `summary`,
  `tags`, `links`) + the 12-section journey, 1500–2200 words, ≥1 Mermaid
  diagram, ≥1 table, runnable Node.js (or a concrete equivalent), tags reused
  from the existing vocabulary.
- `questions/<slug>.json` — 5–6 questions, mixed `difficulty`, each
  `answer_markdown` 3–8 sentences explaining the why.

No agent touches `manifest.json`, `phase.json`, or any other agent's files.

### Links policy — the one real risk

`CONTENT-SPEC.md` requires every URL to be **verified by web search in the same
session**, and specifically forbids constructing YouTube IDs from memory.
Agents get an explicit instruction: search, use the exact returned URL, and
**prefer 3 real links over 5 invented ones**. Fabricated links are the single
most likely quality failure in a fan-out like this, so post-run verification
below checks every new URL.

## Sequencing

1. **Approve this plan** (you).
2. I create both `phase.json` files and the two phase directories — small,
   deterministic, avoids 7 agents racing on the same new files.
3. Dispatch A–G in parallel (single message, concurrent).
4. As each returns, I spot-check one topic per agent against the spec:
   section order, word count, diagram parses, table present, prereq links
   point at slugs that exist, no re-explaining of the overlap table.
5. **Verify every new link** — HTTP status check on each URL across all new
   frontmatter; anything dead or redirecting oddly gets pulled or replaced.
6. Run `node scripts/build-manifest.mjs` — mandatory, the sha256 is the app's
   cache key.
7. Validate: every `.md` has a `questions/<slug>.json`; every slug unique
   across all phases; manifest topic count = 163; all JSON parses.
8. Report back: what was written, per-topic word counts, any link that had to
   be dropped, anything an agent could not complete.

## App-side follow-up (not this session unless you want it)

`prep-tracker/scripts/content/sync.mjs` must be re-run against the updated
manifest to create the new `content_phases` / `content_topics` rows. Two new
phases at positions 16–17 with `targetMonth` 7 and 8 — worth a look at how the
curriculum UI paces 17 phases before this goes live to users.

## Open question for you

`targetMonth` for the new phases is a guess (7 and 8, sitting alongside the
existing 11–15 which reuse months 1–6). Say the word if you want different
pacing, or if these should be optional/elective tracks rather than months in
the main sequence.
