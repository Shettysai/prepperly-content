# Tool map

Canonical tools/frameworks per topic, for the `## Tools & frameworks` section.
Every URL verified 2026-09-09 by HTTP fetch in a single session. The `Checked`
column records what the check actually returned.

## Conventions

**Status codes in the `Checked` column**

- `200` — fetched successfully at the URL shown.
- `200 (redirect)` — the URL given is the *resolved destination*; the obvious
  or historical URL 301/307s here. Always link the resolved URL, never the
  old one, or the learner sees a redirect flash and a URL that may rot.
- `403-bot-blocked` — the host refuses automated clients but the page is real
  and was confirmed by a second means (search result or browser-agent fetch).
  Confirmed offenders in this file: `dev.mysql.com/doc/` (403),
  `socket.io/docs/v4/` (connection refused to curl, confirmed via search),
  `docs.ansible.com` (hard 429 to any automated client, confirmed via search),
  `milvus.io/docs` (redirect loop to bots, confirmed via search).

**Verification method.** Every URL in this file was checked twice: once when
selected, and once again as a final sweep of all 351 distinct URLs extracted
from the finished document. The final sweep returned 200 for every URL except
the four bot-blocked hosts above and `crt.sh` / the `nodejs/node` GitHub blob,
which returned a transient connection error and a GitHub 429 respectively on
the second pass having returned 200 on the first. Nothing in this file is a
URL I constructed from a pattern.

**Node-first bias.** Where a tool has both a Python and a JS/TS ecosystem, the
JS docs are linked because this curriculum's runnable code is Node. Where the
Python ecosystem is genuinely the dominant one — training, fine-tuning,
quantization, most eval frameworks — the Python docs are linked and the note
says so. Never pretend a Node port is the standard when it is not.

**Sizing.** Topics with one genuinely dominant tool get 3 rows, not 5. Padding
a table to five is how a reference becomes an advert. Where a subject has a
real spread of choices (vector storage, message queues, service mesh) the
table deliberately covers the *shape* of each option — in-process vs
dedicated service vs managed — because the interview question is always
"which, and why".

**The `Reach for it when` column is the point.** It must state the trade-off
that selects this tool over the row above it. If it merely restates the
description, delete the row.

**Non-doc links used deliberately.** GitHub repo roots are linked for tools
whose canonical documentation *is* the README (`ws`, `nock`, `hnswlib`,
`vegeta`, `dive`). Everything else links a docs site.

---

## 04-networking

### api-gateways-and-proxies

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Envoy | https://www.envoyproxy.io/docs/envoy/latest/ | L7 proxy and data plane | You need programmable routing via a control plane, not a config file | 200 |
| NGINX | https://nginx.org/en/docs/ | Reverse proxy and load balancer | The simplest thing that works, and you want static config in git | 200 |
| Kong Gateway | https://developer.konghq.com/gateway/ | Plugin-based API gateway | You need auth, quotas and rate limits without writing them yourself | 200 (redirect) |
| Traefik | https://doc.traefik.io/traefik/ | Auto-configuring edge router | Your backends come and go and you want service discovery built in | 200 |
| Caddy | https://caddyserver.com/docs/ | HTTPS-by-default web server | You want automatic certificates with near-zero configuration | 200 |

Note: Envoy is the one to be able to discuss — Istio, Contour and Gateway API
implementations are almost all Envoy underneath. Avoid Emissary/Ambassador:
`getambassador.io` now redirects to Gravitee, so the project's identity is in flux.

### cdn-and-edge-caching

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Cloudflare Cache | https://developers.cloudflare.com/cache/ | CDN caching rules and purge | You want cache control expressed as rules, not origin headers alone | 200 |
| CloudFront | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ | AWS-integrated CDN | Your origin is already S3/ALB and you want one IAM boundary | 200 |
| Fastly | https://docs.fastly.com/ | CDN with instant purge and VCL | You need sub-second global purge of a specific object | 200 |
| Varnish | https://www.varnish.org/docs/index.html | Self-hosted caching reverse proxy | You must cache inside your own perimeter for compliance | 200 (redirect) |
| Cloudflare Workers | https://developers.cloudflare.com/workers/ | Compute at the edge | The response varies per user, so a static cache entry cannot work | 200 |

### dns-load-balancing

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Route 53 | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ | DNS with health checks and routing policies | You need latency- or geo-based routing across regions | 200 |
| CoreDNS | https://coredns.io/manual/toc/ | Pluggable DNS server | You are inside Kubernetes, or need custom DNS plugin behaviour | 200 |
| HAProxy | https://docs.haproxy.org/ | L4/L7 load balancer | DNS TTLs are too coarse and you need real connection-level balancing | 200 |
| ExternalDNS | https://kubernetes-sigs.github.io/external-dns/latest/ | Syncs K8s resources to DNS providers | Cluster Services and Ingresses should own their public DNS records | 200 |

Note: the honest lesson of this topic is that DNS is a *poor* load balancer
because of client-side caching. Frame these tools as "DNS for coarse
region-steering, a real LB for anything finer".

### grpc-and-protobuf

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| gRPC (Node) | https://grpc.io/docs/languages/node/ | RPC framework over HTTP/2 | You control both ends and want generated typed clients | 200 |
| Protocol Buffers | https://protobuf.dev/ | Schema and binary wire format | Payload size or schema evolution matters more than human-readability | 200 |
| Buf | https://buf.build/docs/ | Proto linting, breaking-change detection, codegen | Multiple teams edit `.proto` files and you need a compatibility gate | 200 |
| Connect (Node) | https://connectrpc.com/docs/node/getting-started/ | gRPC-compatible RPC that works from browsers | You need the same service callable by a browser without a proxy | 200 (redirect) |

Note: gRPC-Web/Connect exists because browsers cannot speak raw gRPC — that
distinction is a common interview follow-up.

### http-https-websockets

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| MDN WebSockets API | https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API | Protocol and browser API reference | You need the authoritative behaviour, not a library's opinion | 200 |
| ws | https://github.com/websockets/ws | Minimal Node WebSocket server/client | You want the raw protocol with no framing conventions added | 200 |
| Socket.IO | https://socket.io/docs/v4/ | WebSocket library with rooms and fallbacks | You need reconnection, rooms and acks and accept a custom protocol | 403-bot-blocked |
| undici | https://undici.nodejs.org/ | Node's modern HTTP/1.1 client | You need connection pooling and control that `fetch` defaults hide | 200 |
| curl | https://curl.se/docs/manpage.html | Command-line HTTP debugging | Reproducing a request outside your app to prove where the bug is | 200 |

Note: Socket.IO is *not* WebSockets — it is a protocol carried over them.
A Socket.IO client cannot talk to a plain `ws` server. Interviewers ask this.

### mutual-tls-explained

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenSSL | https://docs.openssl.org/ | Generate, inspect and test certs | Learning the mechanics, or debugging a handshake by hand | 200 (redirect) |
| Node.js `tls` | https://nodejs.org/api/tls.html | Client and server certs in Node | Your app terminates or initiates mTLS itself | 200 |
| cert-manager | https://cert-manager.io/docs/ | Certificate issuance and renewal in K8s | Workloads need certs and you refuse to renew them by hand | 200 |
| step-ca | https://smallstep.com/docs/step-ca/ | Small private CA with short-lived certs | You want your own CA without operating enterprise PKI | 200 |

### network-performance

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Wireshark | https://www.wireshark.org/docs/ | Packet capture and protocol analysis | You need to see what actually crossed the wire, not what logs claim | 200 |
| iperf3 | https://iperf.fr/iperf-doc.php | Raw throughput and jitter measurement | Proving whether the network or the application is the bottleneck | 200 |
| tc | https://man7.org/linux/man-pages/man8/tc.8.html | Inject latency, loss and bandwidth caps | Reproducing a slow-network bug on a fast laptop | 200 |
| k6 | https://grafana.com/docs/k6/latest/ | Scripted load generation in JS | You need latency percentiles under a realistic request mix | 200 |
| autocannon | https://github.com/mcollina/autocannon | Fast HTTP benchmarking from Node | A quick throughput number for one endpoint, no scripting needed | 200 |

### osi-model

Deliberately no tools table — the OSI model is a vocabulary for reasoning about
layers, not something you install. If the populating agent wants a "see it in
practice" pointer, use `tcpdump`/Wireshark from `network-performance` rather
than inventing a table here.

### tcp-ip-udp

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Wireshark | https://www.wireshark.org/docs/ | Decode TCP handshakes and retransmits | You need to prove a connection reset came from the peer, not you | 200 |
| iperf3 | https://iperf.fr/iperf-doc.php | TCP vs UDP throughput comparison | Demonstrating the cost of reliability with real numbers | 200 |
| curl | https://curl.se/docs/manpage.html | Drive TCP/HTTP requests from the shell | Reproducing a connection outside your app to isolate the layer | 200 |
| tc | https://man7.org/linux/man-pages/man8/tc.8.html | Simulate packet loss | Showing how TCP recovers and UDP does not | 200 |

### tls-and-certificates

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenSSL | https://docs.openssl.org/ | Inspect certs, chains and handshakes | `openssl s_client` is the first command in any TLS incident | 200 (redirect) |
| Let's Encrypt | https://letsencrypt.org/docs/ | Free automated public certificates | Any public HTTPS endpoint — there is no reason to pay for DV | 200 |
| Mozilla SSL Config Generator | https://ssl-config.mozilla.org/ | Known-good cipher and protocol config | You are about to hand-write a `ssl_ciphers` line — don't | 200 |
| testssl.sh | https://testssl.sh/ | Offline TLS configuration scanner | The endpoint is internal and SSL Labs cannot reach it | 200 |
| SSL Labs Server Test | https://www.ssllabs.com/ssltest/ | Public endpoint TLS grading | A public site, and you want the report a security reviewer will read | 200 |

### websockets-vs-polling

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| ws | https://github.com/websockets/ws | Raw WebSocket server in Node | You need true bidirectional messaging | 200 |
| MDN WebSockets API | https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API | Reference for the push option you are comparing against | Deciding between WebSockets, SSE and polling on the facts | 200 |
| Centrifugo | https://centrifugal.dev/docs/getting-started/introduction | Standalone realtime messaging server | You want fan-out to many clients without building the hub yourself | 200 |
| Ably | https://ably.com/docs | Managed realtime pub/sub | Global presence and delivery guarantees you don't want to operate | 200 |

Note: the interview answer is usually "SSE unless you need client-to-server
push". Make sure the table does not read as "always WebSockets".

---

## 05-databases

### cap-theorem

Deliberately no tools table — CAP is a theorem about trade-offs, and listing
databases here duplicates `relational-vs-nosql` and
`cap-and-tradeoffs-in-practice`. One exception worth a single link if the
populating agent wants it: Jepsen (https://jepsen.io/analyses, 200) publishes
empirical consistency violations in real databases, which is the honest
counterweight to marketing claims.

### connection-pooling

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| node-postgres (`pg.Pool`) | https://node-postgres.com/ | In-process Postgres pool for Node | A single long-lived Node process owns its connections | 200 |
| PgBouncer | https://www.pgbouncer.org/usage.html | External Postgres connection pooler | Many processes or serverless functions would each open their own pool | 200 |
| postgres.js | https://github.com/porsager/postgres | Modern Postgres client with pooling | You want tagged-template SQL and pooling without an ORM | 200 |
| Prisma | https://www.prisma.io/docs | ORM with its own connection management | You already use Prisma — its pool settings, not `pg`'s, are the ones that apply | 200 |

Note: the classic production bug is transaction-pooling mode breaking prepared
statements and session state. PgBouncer's usage doc covers the three pooling
modes and is the right link for that.

### database-migrations

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Prisma Migrate | https://www.prisma.io/docs | Schema-diff migrations for Node | Your schema is already declared in a Prisma file | 200 |
| Drizzle Kit | https://orm.drizzle.team/docs/overview | TypeScript-schema migrations | You want SQL-shaped, type-safe migrations without a DSL layer | 200 |
| Atlas | https://atlasgo.io/getting-started | Declarative schema-as-code with linting | You need migration *linting* and a CI gate on destructive changes | 200 |
| Flyway | https://documentation.red-gate.com/fd/flyway-documentation-138346877.html | Versioned SQL migrations | Plain ordered SQL files, in a polyglot org where Node is not the only client | 200 |
| Knex migrations | https://knexjs.org/guide/migrations.html | Programmatic up/down migrations | You need imperative data backfills, not just schema changes | 200 |

Note: the interview point is *forward-only, expand-contract*, and that
`down()` migrations are largely a development fiction in production.

### indexing-and-transactions

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PostgreSQL `EXPLAIN` | https://www.postgresql.org/docs/current/using-explain.html | See whether an index was actually used | Always, before adding an index — the planner may ignore it | 200 |
| Use The Index, Luke | https://use-the-index-luke.com/ | Index design and composite-key ordering | Learning *why* column order in a composite index decides everything | 200 |
| PostgreSQL docs | https://www.postgresql.org/docs/current/ | Isolation levels and MVCC semantics | You need the exact anomaly each isolation level permits | 200 |
| MySQL docs | https://dev.mysql.com/doc/ | InnoDB locking and gap locks | On MySQL — its locking differs meaningfully from Postgres | 403-bot-blocked |

### normalization-and-schema-design

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PostgreSQL docs | https://www.postgresql.org/docs/current/ | Types, constraints, generated columns | Pushing invariants into the schema instead of application code | 200 |
| Drizzle ORM | https://orm.drizzle.team/docs/overview | Schema as TypeScript, types derived from it | You want one definition producing both DDL and TS types | 200 |
| SQLFluff | https://docs.sqlfluff.com/en/stable/ | SQL/DDL linting and formatting | Schema changes go through review and style arguments waste time | 200 |
| MongoDB docs | https://www.mongodb.com/docs/ | Embedding vs referencing patterns | Document store — "normalize" means something different here | 200 |

### query-optimization

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` | https://www.postgresql.org/docs/current/using-explain.html | Real row counts, timings and I/O | First step, always — estimates lie, `ANALYZE` measures | 200 |
| explain.dalibo.com | https://explain.dalibo.com/ | Visualise a plan and find the hot node | The plan is too large to read as text | 200 |
| pgMustard | https://www.pgmustard.com/ | Scored plan analysis with hints | You want prioritised advice rather than raw plan reading | 200 |
| Percona Toolkit | https://www.percona.com/toolkit/ | MySQL slow-query digest and online DDL | On MySQL, and you need `pt-query-digest` to find the worst query | 200 (redirect) |

### redis-and-caching-patterns

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Redis docs | https://redis.io/docs/latest/ | Data structures, eviction, persistence | The reference for TTL, `maxmemory-policy` and structure choice | 200 |
| ioredis | https://github.com/redis/ioredis | Node client with cluster and Lua support | You need Redis Cluster, pipelines or scripted atomic operations | 200 |
| node-redis | https://redis.io/docs/latest/develop/clients/nodejs/ | Official Node client | Starting fresh and want the vendor-maintained client | 200 |
| BullMQ | https://docs.bullmq.io/ | Redis-backed job queues | You are about to build a queue on raw `LPUSH`/`BRPOP` — don't | 200 |
| Memcached | https://memcached.org/ | Pure LRU key-value cache | You want *only* a cache and value operational simplicity over features | 200 |

### relational-vs-nosql

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PostgreSQL | https://www.postgresql.org/docs/current/ | Relational with JSONB and extensions | The default — it does documents, vectors and time-series adequately | 200 |
| MongoDB | https://www.mongodb.com/docs/ | Document database | Your access pattern really is "fetch one aggregate by id" | 200 |
| DynamoDB | https://docs.aws.amazon.com/dynamodb/ | Managed key-value with predictable latency | Known access patterns, huge scale, and you accept designing for them | 200 |
| Cassandra | https://cassandra.apache.org/doc/latest/ | Wide-column, multi-datacentre writes | Write-heavy, multi-region, and you can live with eventual reads | 200 |
| CockroachDB | https://docs.cockroachlabs.com/docs/ | Distributed SQL with serializable txns | You want horizontal scale but refuse to give up transactions | 200 (redirect) |

Note: the honest interview answer is "Postgres until you can name the specific
property it lacks". Keep that framing.

### search-and-inverted-indexes

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PostgreSQL docs (FTS) | https://www.postgresql.org/docs/current/ | `tsvector`/GIN inverted index in-database | Modest corpora and you want one datastore, not two | 200 |
| Elasticsearch | https://www.elastic.co/docs | Distributed search and analytics engine | Relevance tuning, aggregations and scale beyond one node | 200 (redirect) |
| OpenSearch | https://docs.opensearch.org/latest/ | Apache-2.0 Elasticsearch fork | You need an open licence or AWS-managed search | 200 (redirect) |
| Apache Solr (on Lucene) | https://solr.apache.org/guide/solr/latest/index.html | The underlying index library, and a server on it | Learning what an inverted index actually is beneath the API | 200 (redirect) |
| Typesense | https://typesense.org/docs/ | Typo-tolerant search server | Instant-search UX on a small dataset without Elasticsearch's operations | 200 |

Note: Elasticsearch relicensed away from Apache-2.0 in 2021 (hence OpenSearch),
then added AGPL as an option in 2024. Mention the licence fork exists — do not
attempt to give current licensing advice in a study note.

### sql-queries-and-joins

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PostgreSQL SQL reference | https://www.postgresql.org/docs/current/ | Join types, CTEs, window functions | The authoritative semantics, including `NULL` behaviour in joins | 200 |
| Node.js `sqlite` | https://github.com/nodejs/node/blob/main/doc/api/sqlite.md | Built-in SQLite, no install | Practising joins in a runnable script with zero setup | 200 |
| SQLFluff | https://docs.sqlfluff.com/en/stable/ | Dialect-aware SQL linter | Your team argues about SQL formatting in review | 200 |
| MySQL docs | https://dev.mysql.com/doc/ | Join and function dialect differences | Interviewing somewhere that runs MySQL — the dialects diverge | 403-bot-blocked |

### time-series-and-analytics-databases

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| TimescaleDB / TigerData | https://www.tigerdata.com/docs | Time-series extension for Postgres | You want hypertables and compression without leaving SQL/Postgres | 200 (redirect) |
| ClickHouse | https://clickhouse.com/docs | Columnar OLAP database | Analytical scans over billions of rows, and you can denormalise | 200 |
| Prometheus | https://prometheus.io/docs/introduction/overview/ | Metrics TSDB with pull scraping | Operational metrics with short retention, not business analytics | 200 (redirect) |
| VictoriaMetrics | https://docs.victoriametrics.com/ | Prometheus-compatible TSDB, long retention | Prometheus cardinality or retention has become the problem | 200 |
| DuckDB | https://duckdb.org/docs/ | In-process OLAP engine | Analytics on a file, in a script, with no server at all | 200 |

Note: Prometheus is a *metrics* store, not a general time-series database —
conflating them is a common mistake worth calling out.

---

## 06-distributed-systems

### consensus-algorithms

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| etcd | https://etcd.io/docs/ | Raft-backed consistent key-value store | You need a small amount of strongly-consistent shared state | 200 |
| The Raft site | https://raft.github.io/ | Paper, visualisation and implementations | Learning the algorithm — the visualisation teaches it faster than prose | 200 |
| ZooKeeper | https://zookeeper.apache.org/doc/current/ | ZAB-based coordination service | You are in the Kafka/Hadoop ecosystem where it is already present | 200 |
| Consul | https://developer.hashicorp.com/consul/docs | Raft-backed service catalogue and KV | You want consensus plus service discovery and health checking together | 200 |

Note: almost nobody implements Raft. The interview skill is knowing which
existing consensus system to delegate to, and why quorum size matters.

### consistency-models

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Jepsen analyses | https://jepsen.io/analyses | Empirical consistency testing of real systems | You want evidence a database honours its claimed guarantees | 200 |
| CockroachDB docs | https://docs.cockroachlabs.com/docs/ | Serializable isolation in a distributed SQL DB | Seeing what strong consistency costs in latency terms | 200 (redirect) |
| Cassandra docs | https://cassandra.apache.org/doc/latest/ | Tunable per-query `ONE`/`QUORUM`/`ALL` | Demonstrating that consistency is a dial, not a property of the DB | 200 |
| MongoDB docs | https://www.mongodb.com/docs/ | Read/write concerns, causal sessions | Showing read-your-writes as an explicit, opt-in setting | 200 |

### distributed-tracing-and-observability

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenTelemetry JS | https://opentelemetry.io/docs/languages/js/ | Vendor-neutral instrumentation for Node | Always start here — instrument once, change backend later | 200 |
| OTel Collector | https://opentelemetry.io/docs/collector/ | Receive, process and export telemetry | You want sampling and redaction outside application code | 200 |
| Jaeger | https://www.jaegertracing.io/docs/ | Trace storage and query UI | Self-hosted traces; Jaeger v2 is an OTel Collector distribution | 200 |
| Grafana Tempo | https://grafana.com/docs/tempo/latest/ | Object-storage-backed trace backend | High trace volume and you want cheap retention, not indexed search | 200 |
| Semantic conventions | https://opentelemetry.io/docs/concepts/semantic-conventions/ | Standard attribute names | Naming spans and attributes so dashboards are portable | 200 |

Note: OpenTracing and the Jaeger client libraries are dead — Jaeger v1 reached
end of life 31 Dec 2025 and v2 is built on the OTel Collector. Instrument with
OpenTelemetry SDKs only. The OTel Zipkin exporter is also deprecated
(spec deprecation Dec 2025; patches until at least Dec 2026).

### distributed-transactions

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Temporal (TypeScript SDK) | https://github.com/temporalio/sdk-typescript | Durable workflow execution in Node | You need sagas with retries and compensation, written as normal code | 200 |
| Temporal docs | https://docs.temporal.io/evaluate/use-cases-design-patterns | Saga and long-running patterns | Choosing between orchestration and choreography | 200 |
| Kafka docs | https://kafka.apache.org/documentation/ | Exactly-once between consume and produce | The "transaction" is really read-process-write within one system | 200 |
| PostgreSQL docs | https://www.postgresql.org/docs/current/ | `PREPARE TRANSACTION` / 2PC reference | Demonstrating why 2PC blocks on coordinator failure — mostly a cautionary tool | 200 |

Note: the correct answer in most interviews is "avoid distributed
transactions; use a saga with idempotent steps". 2PC belongs in the table as
the thing you explain *away*.

### event-sourcing-and-cqrs

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Kurrent (formerly EventStoreDB) | https://docs.kurrent.io/ | Purpose-built event store with streams | Event sourcing is the core model, not an add-on | 200 |
| Kafka | https://kafka.apache.org/documentation/ | Durable partitioned log | You want the log as an integration backbone across services | 200 |
| Postgres as event store | https://www.postgresql.org/docs/current/ | Append-only table plus projections | Most real systems — one database, transactional appends, no new operations | 200 |
| Temporal | https://docs.temporal.io/ | Event-sourced workflow state | The events you care about are *process* steps, not domain facts | 200 |
| Axon | https://www.axoniq.io/ | Full CQRS/ES framework (JVM) | JVM shop wanting the whole pattern prescribed; no Node equivalent of this scope | 200 (redirect) |

Note: EventStoreDB was renamed **Kurrent** — `eventstore.com` now redirects.
Use the Kurrent name and URL. Also worth stating plainly: event sourcing in
Postgres is the pragmatic default, and reaching for a dedicated event store is
a decision that needs justifying.

### idempotency-and-retries

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Redis | https://redis.io/docs/latest/develop/using-commands/transactions/ | `SET NX` + TTL as an idempotency-key store | Deduplicating requests across many app instances | 200 |
| p-retry | https://github.com/sindresorhus/p-retry | Retry with exponential backoff in Node | Wrapping a call that fails transiently — do not hand-roll the backoff | 200 |
| opossum | https://nodeshift.dev/opossum/ | Circuit breaker for Node | Retries are amplifying an outage and you need to stop calling | 200 |
| Temporal | https://docs.temporal.io/ | Durable retries with at-least-once activities | The retry must survive your process dying mid-operation | 200 |

Note: retries without idempotency are a duplicate-generation machine. Pair
these tools, never present the retry library alone.

### leader-election-and-coordination

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| etcd | https://etcd.io/docs/ | Lease-based leader election | You need one active instance and already run etcd (or Kubernetes) | 200 |
| Kubernetes architecture docs | https://kubernetes.io/docs/concepts/architecture/ | Where Leases and controller coordination are described | You are on Kubernetes — the API server is already a consistent store | 200 |
| ZooKeeper | https://zookeeper.apache.org/doc/current/ | Ephemeral-node locks and elections | The canonical patterns, and the ecosystem already has ZooKeeper | 200 |
| Consul | https://developer.hashicorp.com/consul/docs | Session-based distributed locks | Multi-datacentre, non-Kubernetes deployments | 200 |

Note: Redis `SETNX` locks are *not* safe leader election under partition —
worth naming as the common wrong answer.

### message-queues

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Kafka | https://kafka.apache.org/documentation/ | Partitioned durable log | Replay, ordered per-key streams, and many independent consumers | 200 |
| KafkaJS | https://kafka.js.org/docs/getting-started | Kafka client for Node | Producing/consuming from Node without a JVM | 200 |
| RabbitMQ | https://www.rabbitmq.com/docs | Broker with flexible routing | Per-message routing, priorities and complex topologies | 200 |
| NATS JetStream | https://docs.nats.io/concepts/jetstream | Lightweight streaming and queueing | You want low latency and a tiny operational footprint | 200 (redirect) |
| Amazon SQS | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/ | Managed queue with visibility timeouts | You want a queue and refuse to operate a broker | 200 |
| BullMQ | https://docs.bullmq.io/ | Redis-backed job queue for Node | Background jobs in one Node app; not a cross-service event bus | 200 |

Note: Kafka is a log, SQS/RabbitMQ are queues, BullMQ is a job runner. The
interview question is almost always which of those three shapes you need.

### replication-and-partitioning

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PostgreSQL docs (replication) | https://www.postgresql.org/docs/current/ | Streaming and logical replication | Read scaling or failover on a single-primary relational DB | 200 |
| Vitess | https://vitess.io/docs/ | MySQL sharding middleware | MySQL has outgrown one node and you cannot rewrite the app | 200 |
| Citus | https://docs.citusdata.com/en/stable/ | Postgres extension for sharding | You want distributed Postgres with the same SQL surface | 200 |
| Cassandra | https://cassandra.apache.org/doc/latest/ | Consistent hashing, tunable replicas | Replication and partitioning are the product, not an add-on | 200 |
| MongoDB sharding | https://www.mongodb.com/docs/manual/sharding/ | Shard keys and balancing | Studying shard-key choice — MongoDB's docs are unusually clear on it | 200 |

### service-discovery-and-mesh

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Kubernetes Services | https://kubernetes.io/docs/concepts/services-networking/service/ | DNS-based discovery, built in | You are on Kubernetes and do not yet need a mesh — start here | 200 |
| Istio (ambient) | https://istio.io/latest/docs/ambient/ | Sidecar-less mesh with ztunnel + waypoints | You need the full L7 feature set and accept the operational cost | 200 |
| Linkerd | https://linkerd.io/2-edge/overview/ | Minimal Rust-proxy mesh | mTLS and golden metrics with the lowest overhead and config surface | 200 |
| Cilium | https://docs.cilium.io/en/stable/ | eBPF networking with mesh features | You want one layer for CNI, policy and mesh instead of two | 200 |
| Consul | https://developer.hashicorp.com/consul/docs | Discovery and mesh across VMs and K8s | Your workloads are not all in Kubernetes | 200 |

Note: Istio's ambient mode reached stable and is the recommended mode for new
clusters — do not describe Istio as sidecar-only. Linkerd remains the low-overhead
option. This is a genuinely contested space; present the trade-off, not a winner.

---

## 07-system-design

### api-design

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenAPI Specification | https://spec.openapis.org/oas/latest.html | The REST contract format | Any HTTP API more than one team consumes | 200 |
| Spectral | https://stoplight.io/open-source/spectral | Lints OpenAPI against style rules | You want a CI gate on API consistency, not review comments | 200 |
| GraphQL | https://graphql.org/learn/ | Client-specified query language | Clients need wildly different field sets and you control the schema | 200 |
| tRPC | https://trpc.io/docs | End-to-end typed RPC for TS | Both ends are TypeScript in one repo and you want no codegen step | 200 |
| Zod | https://zod.dev/ | Runtime request/response validation | Types alone don't validate — Zod makes the boundary actually safe | 200 |

### caching-strategies

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Redis | https://redis.io/docs/latest/ | Shared cache with TTL and eviction | Multiple instances must see the same cached value | 200 |
| Memcached | https://memcached.org/ | Simple distributed LRU cache | You want a cache with no persistence story to reason about | 200 |
| Cloudflare Cache | https://developers.cloudflare.com/cache/ | Edge caching and cache rules | The content is public and cacheable before it reaches your origin | 200 |
| MDN HTTP guides | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP | Entry point to MDN's HTTP header guides | Getting `Cache-Control`, `ETag` and `stale-while-revalidate` right — navigate from here | 200 |

Note: the highest-value cache is usually the one you get free from correct HTTP
headers, before any Redis appears. Order the table that way.

### cap-and-tradeoffs-in-practice

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Jepsen | https://jepsen.io/analyses | Real consistency-violation reports | Checking whether a vendor's claim survives testing | 200 |
| CockroachDB | https://docs.cockroachlabs.com/docs/ | CP distributed SQL | You choose consistency and will pay cross-region latency | 200 (redirect) |
| Cassandra | https://cassandra.apache.org/doc/latest/ | AP with tunable quorums | You choose availability and will handle conflicting reads | 200 |
| DynamoDB | https://docs.aws.amazon.com/dynamodb/ | Eventual reads with a strong-read option | Showing the trade-off as a per-request flag with a cost difference | 200 |

### capacity-planning

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| k6 | https://grafana.com/docs/k6/latest/ | Load testing to find the saturation point | You need a measured number, not an estimate, before sizing | 200 |
| Prometheus | https://prometheus.io/docs/introduction/overview/ | Utilisation and saturation metrics | Deriving headroom from real traffic instead of guessing peaks | 200 (redirect) |
| Grafana | https://grafana.com/docs/grafana/latest/ | Dashboards for the four golden signals | Presenting saturation to people who decide budgets | 200 |
| SRE Workbook (ch. on load) | https://sre.google/workbook/table-of-contents/ | Google's capacity and load-shedding practice | You want the methodology, not a tool | 200 |

### database-sharding

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Vitess | https://vitess.io/docs/ | Transparent MySQL sharding | Existing MySQL app, cannot change queries, must scale writes | 200 |
| Citus | https://docs.citusdata.com/en/stable/ | Sharded Postgres via extension | You are on Postgres and want distributed tables in place | 200 |
| MongoDB sharding | https://www.mongodb.com/docs/manual/sharding/ | Shard-key selection and rebalancing | Learning shard-key mistakes — the docs enumerate them well | 200 |
| CockroachDB | https://docs.cockroachlabs.com/docs/ | Automatic range-based sharding | Greenfield, and you want the database to shard itself | 200 (redirect) |
| YugabyteDB | https://docs.yugabyte.com/ | Distributed SQL, Postgres-compatible wire | You want Postgres compatibility with built-in sharding | 200 |

### designing-for-failure

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| opossum | https://nodeshift.dev/opossum/ | Circuit breaker for Node | A dependency is failing and you must fail fast instead of queueing | 200 |
| p-retry | https://github.com/sindresorhus/p-retry | Backoff and jittered retries | The failure is transient — with jitter, or you build a thundering herd | 200 |
| Chaos Mesh | https://chaos-mesh.org/docs/ | Fault injection in Kubernetes | You want to prove the failure handling works, not assume it | 200 |
| Kubernetes probes | https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/ | Liveness/readiness/startup semantics | Getting probes wrong is itself a top cause of outages | 200 |
| Sentry | https://docs.sentry.io/platforms/javascript/guides/node/ | Error aggregation and alerting | You need to know a failure mode exists before a user reports it | 200 |

### load-balancing-strategies

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| HAProxy | https://docs.haproxy.org/ | L4/L7 balancing with many algorithms | You want to compare round-robin, least-conn and EWMA for real | 200 |
| NGINX | https://nginx.org/en/docs/ | Reverse proxy and upstream balancing | The common default, and its `upstream` docs are the clearest primer | 200 |
| Envoy | https://www.envoyproxy.io/docs/envoy/latest/ | Outlier detection, zone-aware routing | You need per-endpoint health ejection and locality awareness | 200 |
| Netflix concurrency-limits | https://github.com/Netflix/concurrency-limits | Adaptive concurrency limiting | Fixed connection limits are wrong; you want them derived from latency | 200 |

### monolith-vs-microservices

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| NestJS | https://docs.nestjs.com/ | Modular Node framework, monolith or services | You want module boundaries inside a monolith you might later split | 200 |
| Turborepo | https://turborepo.dev/docs | Monorepo task orchestration and caching | Multiple services in one repo and CI is now the bottleneck | 200 (redirect) |
| Nx | https://nx.dev/docs/getting-started/intro | Monorepo with dependency graph and boundaries | You want enforced import rules between modules | 200 (redirect) |
| OpenTelemetry JS | https://opentelemetry.io/docs/languages/js/ | Cross-service tracing | The moment you split, a stack trace stops being enough | 200 |

Note: the tooling for this topic is really *monorepo and boundary* tooling. The
interview point is that microservices trade an in-process call for a network
call, and the tools here are what make that survivable.

### multi-tenancy-and-isolation

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PostgreSQL docs (RLS) | https://www.postgresql.org/docs/current/ | Row-Level Security for per-tenant filtering | Shared-table tenancy and you want isolation the ORM cannot bypass | 200 |
| Kubernetes RBAC | https://kubernetes.io/docs/reference/access-authn-authz/rbac/ | Namespace-scoped permission boundaries | Tenants are namespaces and you need a hard control-plane boundary | 200 |
| Open Policy Agent | https://www.openpolicyagent.org/docs | Externalised authorization policy | Tenancy rules are complex enough to deserve their own language | 200 (redirect) |
| Kyverno | https://kyverno.io/docs/introduction/ | K8s policy as resources | Enforcing per-namespace quotas and network policy without writing Go | 200 (redirect) |
| Prisma / Drizzle | https://orm.drizzle.team/docs/overview | Where tenant scoping actually gets forgotten | Reviewing query layers — a missing `tenant_id` is the classic leak | 200 |

Note: the recurring real bug is a migration or a query path that forgets tenant
scoping. RLS is the defence that survives a developer mistake; application-level
filtering is not.

### rate-limiting-and-throttling

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| rate-limiter-flexible | https://github.com/animir/node-rate-limiter-flexible | Distributed limits backed by Redis | Multiple Node instances must share one budget | 200 |
| express-rate-limit | https://github.com/express-rate-limit/express-rate-limit | Simple per-route limits | A single instance, or in-memory limits are good enough | 200 |
| Kong Rate Limiting | https://developer.konghq.com/plugins/rate-limiting/ | Limits at the gateway | You want limiting before requests reach your app at all | 200 (redirect) |
| NGINX `limit_req` | https://blog.nginx.org/blog/rate-limiting-nginx | Leaky-bucket limiting at the proxy | You already run NGINX and want no application change | 200 (redirect) |
| Cloudflare Rate Limiting | https://developers.cloudflare.com/waf/rate-limiting-rules/ | Edge limiting before origin | The traffic is abusive and should never reach your infrastructure | 200 |

### scalability-and-performance

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| k6 | https://grafana.com/docs/k6/latest/ | Scripted load tests with thresholds | You need percentile latency under a realistic mix | 200 |
| autocannon | https://github.com/mcollina/autocannon | Quick HTTP throughput numbers | A fast before/after on one endpoint | 200 |
| Node.js `perf_hooks` | https://nodejs.org/api/perf_hooks.html | In-process timing and marks | Finding which internal phase costs the milliseconds | 200 |
| Grafana Pyroscope | https://grafana.com/docs/pyroscope/latest/ | Continuous profiling | The slowness only appears in production under real load | 200 |
| Redis | https://redis.io/docs/latest/ | Cache and shared state | The cheapest scale win is usually not doing the work twice | 200 |

---

## 08-node-js

### cluster-module-and-worker-threads

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Node.js `cluster` | https://nodejs.org/api/cluster.html | Fork processes sharing a listening socket | Scaling an I/O-bound HTTP server across cores | 200 |
| Node.js `worker_threads` | https://nodejs.org/api/worker_threads.html | Threads sharing memory in one process | CPU-bound work that would block the event loop | 200 |
| Piscina | https://piscinajs.dev/ | Worker-thread pool with queueing | You need a pool, not one worker — do not hand-roll the lifecycle | 200 (redirect) |
| PM2 | https://pm2.keymetrics.io/docs/usage/quick-start/ | Process manager with cluster mode | Production process supervision outside a container orchestrator | 200 |

Note: the decision here is `cluster` for I/O concurrency, `worker_threads` for
CPU work. Getting that backwards is the most common Node interview error.

### error-handling-patterns

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Node.js `errors` docs | https://nodejs.org/api/errors.html | Error classes, `cause`, `AggregateError` | The reference for `error.code` vs `message` matching | 200 |
| Zod | https://zod.dev/ | Validation errors at the boundary | Most "errors" are bad input — reject it before it becomes an exception | 200 |
| p-retry | https://github.com/sindresorhus/p-retry | Distinguish retryable from permanent | You need `AbortError` semantics rather than retrying a 400 forever | 200 |
| Sentry (Node) | https://docs.sentry.io/platforms/javascript/guides/node/ | Capture and group unhandled errors | You want to know the top failure by volume, not by whoever complained | 200 |
| Boom | https://github.com/hapijs/boom | HTTP-friendly error objects | Mapping domain errors to status codes consistently | 200 |

### event-loop-and-async-io

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Node.js profiling guide | https://nodejs.org/learn/getting-started/profiling | Diagnosing loop phases and blocking | Learning ordering — this is the authoritative explanation | 200 (redirect) |
| Node.js `perf_hooks` | https://nodejs.org/api/perf_hooks.html | `monitorEventLoopDelay` for lag | Proving the loop is blocked, with numbers | 200 |
| Clinic.js | https://clinicjs.org/ | `clinic doctor` diagnoses loop blocking | You suspect a block but cannot name the culprit | 200 |
| Node.js `diagnostics_channel` | https://nodejs.org/api/diagnostics_channel.html | Low-overhead internal instrumentation | Adding tracing hooks without monkey-patching | 200 |

### nestjs-and-di-patterns

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| NestJS | https://docs.nestjs.com/ | Modules, providers, DI container | The dominant opinionated Node framework — this topic is about it | 200 |
| TypeScript docs | https://www.typescriptlang.org/docs/ | Decorators and `emitDecoratorMetadata` | Nest's DI depends on decorator metadata — this is why `tsconfig` matters | 200 |
| Zod | https://zod.dev/ | Validation at the controller boundary | You want runtime-safe DTOs rather than trusting the type annotation | 200 |
| Vitest | https://vitest.dev/guide/ | Unit-test providers with mocked deps | Testing a service in isolation — DI exists to make this possible | 200 |
| Testcontainers (Node) | https://node.testcontainers.org/ | Real dependencies in integration tests | Mocking the repository has stopped catching real bugs | 200 |

Note: one dominant framework, so this table is really "Nest plus what you use
with it". The genuinely interesting content is the DI mechanics — injection
tokens, provider scopes, and the **circular-dependency** problem, which Nest
resolves with `forwardRef()` or by injecting `ModuleRef` and resolving lazily.
That last pattern is the practical fix when two modules legitimately need each
other and is worth a worked example.

### express-and-middleware

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Express | https://expressjs.com/ | Minimal middleware-based HTTP framework | The lingua franca — most interview questions assume it | 200 |
| Fastify | https://fastify.dev/docs/latest/ | Schema-first, faster alternative | Throughput matters and you want JSON-schema validation built in | 200 |
| Helmet | https://helmet.js.org/ | Security response headers | Any Express app — this is the two-line security baseline | 200 (redirect) |
| Hono | https://hono.dev/docs | Small router for edge and Node | Deploying to Workers/Deno as well as Node from one codebase | 200 (redirect) |

### performance-profiling

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Node.js profiling guide | https://nodejs.org/learn/getting-started/profiling | Built-in `--prof` and inspector workflow | Start here — no dependency, and it usually suffices | 200 (redirect) |
| Clinic.js | https://clinicjs.org/ | Flame, bubbleprof and doctor views | You need a picture, and to know *which* profiler to reach for | 200 |
| speedscope | https://github.com/jlfwong/speedscope | Interactive flamegraph viewer | You have a `.cpuprofile` and need to actually read it | 200 |
| Pyroscope | https://grafana.com/docs/pyroscope/latest/ | Continuous production profiling | The regression only reproduces under production traffic | 200 |
| autocannon | https://github.com/mcollina/autocannon | Generate the load you are profiling under | Profiling an idle process teaches nothing | 200 |

### security-best-practices

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OWASP Cheat Sheets | https://cheatsheetseries.owasp.org/ | Per-vulnerability practical guidance | The reference for any specific class of bug | 200 |
| Helmet | https://helmet.js.org/ | CSP, HSTS and friends as middleware | Every Express app, before anything clever | 200 (redirect) |
| `npm audit` | https://docs.npmjs.com/cli/v10/commands/npm-audit/ | Dependency vulnerability report | Built in, zero setup, run it in CI | 200 (redirect) |
| argon2 | https://github.com/ranisalt/node-argon2 | Password hashing | New systems — Argon2id is the current recommendation over bcrypt | 200 |
| gitleaks | https://github.com/gitleaks/gitleaks | Secret scanning in git history | A key was committed, or you want a pre-commit gate so one never is | 200 |

Note: `csurf` is **archived** (May 2025). For CSRF use
`https://github.com/Psifi-Solutions/csrf-csrf` (200) on Express or
`https://github.com/fastify/csrf-protection` (200) on Fastify.

### streams-and-buffers

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Node.js `stream` docs | https://nodejs.org/api/stream.html | Readable/Writable/Transform and `pipeline` | The reference — `pipeline` over `.pipe()` for error propagation | 200 |
| undici | https://undici.nodejs.org/ | Streaming HTTP bodies without buffering | Proxying or transforming a large response, or standard streams in Node | 200 |
| Node.js `zlib` docs | https://nodejs.org/api/stream.html | A concrete Transform stream to study | You need a real Transform to reason about backpressure with | 200 |

Note: this topic's tooling story is thin and that is correct — streams are a
core API, not an ecosystem. Resist padding.

### testing-node-applications

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Node.js `test` runner | https://nodejs.org/api/test.html | Built-in test runner and mocks | New projects — no dependency, and it now covers most needs | 200 |
| Vitest | https://vitest.dev/guide/ | Fast ESM/TS-native runner | You want watch mode, TS with no config, and Jest-like API | 200 |
| Testcontainers (Node) | https://node.testcontainers.org/ | Real Postgres/Redis in tests via Docker | Mocking the database has stopped catching real bugs | 200 |
| MSW | https://mswjs.io/docs/ | Intercept HTTP at the network layer | You want the same mocks in unit tests and the browser | 200 |
| nock | https://github.com/nock/nock | HTTP interception in Node | Node-only, and you want request-shape assertions | 200 |

### typescript-in-node

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| TypeScript docs | https://www.typescriptlang.org/docs/ | Language, `tsconfig`, module resolution | `moduleResolution` and ESM/CJS interop questions | 200 |
| tsx | https://tsx.is/ | Run TS directly, no build step | Local development and scripts | 200 |
| typescript-eslint | https://typescript-eslint.io/ | Type-aware linting | You want rules that need type information, not just syntax | 200 |
| Zod | https://zod.dev/ | Runtime validation inferring TS types | Crossing a trust boundary — types vanish at runtime | 200 |

Note: modern Node can strip types natively, so "do I even need a build step"
is now a live question. Frame tsx as one option, not the only path.

### v8-engine-and-garbage-collection

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Node.js profiling guide | https://nodejs.org/learn/getting-started/profiling | Heap snapshots and `--inspect` | Diagnosing a leak — compare two snapshots, not one | 200 (redirect) |
| Node.js `perf_hooks` | https://nodejs.org/api/perf_hooks.html | GC performance entries | Measuring pause duration and frequency | 200 |
| Clinic.js | https://clinicjs.org/ | Memory and GC visualisation | You want the heap growth curve, not raw numbers | 200 |
| Node.js diagnostics WG | https://github.com/nodejs/diagnostics | Diagnostic tooling and best practices | Choosing between the many overlapping diagnostic options | 200 |

Note: this is a "read the runtime" topic — the tools are all diagnostic. There
is no framework to recommend, which is itself worth saying.

---

## 09-backend-engineering

### api-versioning

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenAPI Specification | https://spec.openapis.org/oas/latest.html | Version the contract explicitly | Any versioning scheme needs a machine-readable contract first | 200 |
| Buf breaking-change detection | https://buf.build/docs/ | Detect incompatible schema changes in CI | gRPC/protobuf — this catches the break before release | 200 |
| Spectral | https://stoplight.io/open-source/spectral | Enforce versioning conventions | Your rule is "URL path versioning" and you want it enforced | 200 |
| GraphQL deprecation | https://graphql.org/learn/ | Field-level `@deprecated` instead of versions | The schema evolves per-field and you never want a `/v2` | 200 |

Note: the strongest answer is usually "don't version, evolve additively". These
tools mostly exist to prove a change was additive.

### authentication-authorization

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OAuth 2.0 (oauth.net) | https://oauth.net/2/ | Delegated authorization framework | Third-party access — and to learn what OAuth is *not* for | 200 |
| OpenID Connect | https://openid.net/developers/how-connect-works/ | Authentication layer on OAuth | You need identity, not just an access token | 200 |
| jose | https://github.com/panva/jose | JWT/JWS/JWKS in Node, done correctly | Verifying tokens — never decode-without-verify | 200 |
| Keycloak | https://www.keycloak.org/documentation | Self-hosted identity provider | You need OIDC/SAML in your own infrastructure | 200 |
| Auth.js | https://authjs.dev/ | Auth for JS applications | A Node/Next app that needs sessions and providers wired quickly | 200 |
| node-casbin | https://github.com/apache/casbin-node-casbin | RBAC/ABAC policy enforcement | Authorization has outgrown `if (user.role === 'admin')` | 200 (redirect) |

Note: node-casbin moved to the Apache org — the old `casbin/node-casbin` URL
redirects. Use the Apache URL.

### cicd-pipelines

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| GitHub Actions | https://docs.github.com/en/actions | CI/CD in the repository host | Your code is on GitHub — the default with the least setup | 200 |
| GitLab CI | https://docs.gitlab.com/ci/ | Pipelines with built-in registry and environments | Self-hosted GitLab, or you want CI and registry in one product | 200 (redirect) |
| Argo CD | https://argo-cd.readthedocs.io/en/stable/ | Pull-based GitOps delivery to K8s | CI should build, not deploy — separate the two halves | 200 |
| Dagger | https://docs.dagger.io/getting-started/introduction/ | Pipelines as code, runnable locally | "Works in CI, fails locally" has become a real cost | 200 (redirect) |

### docker-containerization

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Docker docs | https://docs.docker.com/ | Build, run, Compose | The baseline everyone is asked about | 200 |
| BuildKit | https://docs.docker.com/build/buildkit/ | Cache mounts, parallel stages, secrets | Builds are slow, or a secret must not land in a layer | 200 |
| distroless | https://github.com/GoogleContainerTools/distroless | Minimal runtime base images | Shrinking attack surface — no shell, no package manager | 200 |
| Trivy | https://trivy.dev/ | Image vulnerability and misconfig scanning | Before pushing — CVEs in the base image are the usual finding | 200 |
| dive | https://github.com/wagoodman/dive | Inspect layer contents and wasted space | Your image is 1.2GB and you need to see why | 200 |

### gpu-scheduling-in-kubernetes

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| NVIDIA GPU Operator | https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html | Installs drivers, toolkit and device plugin | Any GPU cluster — do not install drivers by hand | 200 |
| k8s-device-plugin | https://github.com/NVIDIA/k8s-device-plugin | Advertises `nvidia.com/gpu` as a resource | Understanding why GPU requests are integer and non-oversubscribable | 200 |
| MIG user guide | https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/ | Hardware-partition one A100/H100 | Many small inference workloads and whole-GPU allocation wastes money | 200 (redirect) |
| Kueue | https://kueue.sigs.k8s.io/docs/ | Job queueing and quota for batch | Training jobs must queue fairly instead of failing to schedule | 200 |
| DCGM Exporter | https://github.com/NVIDIA/dcgm-exporter | GPU utilisation metrics to Prometheus | Proving the GPUs you paid for are actually busy | 200 |

Note: the core interview point is that GPUs are *non-shareable* integer
resources by default, unlike CPU. MIG and time-slicing are the two ways around
that, with different isolation guarantees.

### infrastructure-as-code

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Terraform | https://developer.hashicorp.com/terraform/docs | Declarative multi-cloud provisioning | The industry default, and what interviews assume | 200 |
| OpenTofu | https://opentofu.org/docs/ | MPL-licensed Terraform fork | The BUSL licence change is a blocker for you | 200 |
| Pulumi | https://www.pulumi.com/docs/ | IaC in TypeScript and other languages | Your team would rather write TS than HCL, and needs real loops | 200 |
| Ansible | https://docs.ansible.com/projects/ansible/latest/index.html | Agentless configuration management | Configuring existing machines, not creating infrastructure | 403-bot-blocked |
| Crossplane | https://docs.crossplane.io/latest/ | Provision cloud resources via K8s CRDs | You already reconcile everything through the K8s API | 200 |

Note: Ansible's docs moved to `/projects/ansible/latest/` — the old
`/ansible/latest/` path is what most links point at. `docs.ansible.com`
rate-limits automated clients hard; the URL above was confirmed via search.

### kubernetes-basics

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Kubernetes docs | https://kubernetes.io/docs/home/ | Concepts and object reference | The only source worth trusting on semantics | 200 |
| kubectl reference | https://kubernetes.io/docs/reference/kubectl/ | The commands you will actually type | Learning `get -o yaml`, `describe`, `explain` | 200 |
| kind | https://kind.sigs.k8s.io/ | Kubernetes in Docker, locally | You need a throwaway multi-node cluster in seconds | 200 |
| minikube | https://minikube.sigs.k8s.io/docs/ | Local single-node cluster with addons | You want built-in ingress, dashboard and storage addons | 200 |
| Helm | https://helm.sh/docs/ | Package and template manifests | You are copy-pasting YAML between environments | 200 |

### logging-and-monitoring

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Pino | https://getpino.io/ | Fast structured JSON logging for Node | Any Node service — structured beats `console.log` immediately | 200 |
| Prometheus | https://prometheus.io/docs/introduction/overview/ | Metrics collection and alert rules | You need numbers over time, not log lines | 200 (redirect) |
| Grafana | https://grafana.com/docs/grafana/latest/ | Dashboards across metrics, logs, traces | Correlating a latency spike with a log burst | 200 |
| Grafana Loki | https://grafana.com/docs/loki/latest/ | Label-indexed log aggregation | Log volume makes full-text indexing too expensive | 200 |
| OpenTelemetry JS | https://opentelemetry.io/docs/languages/js/ | Unified logs, metrics and traces | You want one instrumentation layer, not three agents | 200 |

Note: the mistake to name is logging where you should be metering — one log
line per request is not a latency histogram.

### message-brokers-in-practice

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Kafka | https://kafka.apache.org/documentation/ | Consumer groups, offsets, rebalancing | The operational details interviews actually probe | 200 |
| KafkaJS | https://kafka.js.org/docs/getting-started | Node client with manual offset control | Implementing at-least-once with explicit commits | 200 |
| RabbitMQ | https://www.rabbitmq.com/docs | Acks, DLQs, prefetch, quorum queues | You need dead-letter routing and per-message ack semantics | 200 |
| NATS JetStream | https://docs.nats.io/concepts/jetstream | Streams, consumers, ack policies | Low latency with a fraction of Kafka's operational weight | 200 (redirect) |
| BullMQ | https://docs.bullmq.io/ | Retries, delays, DLQ in Node | Background jobs inside one application | 200 |

### secrets-management

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| HashiCorp Vault | https://developer.hashicorp.com/vault/docs | Central secrets with dynamic credentials | You want short-lived database credentials, not static ones | 200 |
| External Secrets Operator | https://external-secrets.io/latest/ | Syncs external secret stores into K8s | Secrets live in Vault/cloud KMS and pods need them as Secrets | 200 |
| SOPS | https://github.com/getsops/sops | Encrypt secrets in git with KMS/age | GitOps, and secrets must live in the repo without being readable | 200 |
| Sealed Secrets | https://github.com/bitnami/sealed-secrets | One-way-encrypted K8s Secrets in git | You want a simpler in-cluster answer than SOPS plus a KMS | 200 (redirect) |
| gitleaks | https://github.com/gitleaks/gitleaks | Detect committed secrets | Every repo — assume a secret has already been committed | 200 |

Note: Kubernetes Secrets are base64, not encrypted, unless encryption-at-rest
is configured. That is the single most common misconception here. Also note
`bitnami-labs/sealed-secrets` now redirects to `bitnami/sealed-secrets`.

### serverless-and-faas

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| AWS Lambda | https://docs.aws.amazon.com/lambda/latest/dg/welcome.html | The reference FaaS platform | Interviews assume Lambda's model: cold starts, concurrency, timeouts | 200 |
| Cloudflare Workers | https://developers.cloudflare.com/workers/runtime-apis/nodejs/ | V8-isolate functions at the edge | Cold starts must be near-zero and you accept a partial Node API | 200 |
| Serverless Framework | https://www.serverless.com/framework/docs | Deploy functions and their event sources | You want the function and its triggers defined together | 200 |
| AWS SAM | https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html | CloudFormation-native serverless IaC | AWS-only, and you want local invoke plus native CFN | 200 |
| Knative | https://knative.dev/docs/ | Scale-to-zero on your own Kubernetes | You want FaaS economics without leaving your cluster | 200 |
| Hono | https://hono.dev/docs | One handler for Node, Workers and Lambda | You refuse to be locked to one runtime's handler signature | 200 (redirect) |

Note: the two problems that define this topic are **cold starts** and
**connection exhaustion** — a thousand concurrent function instances each
opening a database connection will kill the database, which is precisely why
PgBouncer or a data proxy appears in serverless architectures. Cross-link
`connection-pooling`. Cloudflare Workers' isolate model has a genuinely
different cold-start profile from Lambda's container model; that comparison is
the highest-value thing to teach here.

### web-security-fundamentals

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OWASP Top 10 | https://owasp.org/www-project-top-ten/ | The canonical vulnerability list | Interview prep — these are the categories you will be asked about | 200 |
| OWASP Cheat Sheets | https://cheatsheetseries.owasp.org/ | Concrete mitigation per vulnerability | You know the class of bug and need the fix | 200 |
| MDN CSP guide | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP | Content-Security-Policy in detail | Writing a CSP that actually blocks XSS rather than logging it | 200 |
| OWASP ZAP | https://www.zaproxy.org/docs/ | Open-source dynamic app scanner | You want an automated first pass against a running app | 200 |
| Semgrep | https://docs.semgrep.dev/ | Static analysis with security rules | Catching injection patterns in CI, in your own code | 200 (redirect) |
| Juice Shop / WrongSecrets | https://github.com/OWASP/wrongsecrets | Deliberately vulnerable practice app | Learning by exploiting — reading about XSS is not the same as doing it | 200 |

---

## 11-system-design-case-studies

These topics are design exercises. Tools appear as *the concrete thing you
would name in the interview*, not as an implementation shopping list. Keep
tables to 3-4 rows here; the value is in the choice, not the catalogue.

### design-chat-system

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| ws | https://github.com/websockets/ws | WebSocket connection handling | The persistent-connection layer | 200 |
| Redis Streams | https://redis.io/docs/latest/develop/data-types/streams/ | Fan-out between server instances | Two users on different servers must see each other's messages | 200 |
| Cassandra | https://cassandra.apache.org/doc/latest/ | Write-heavy message history store | Storing every message, partitioned by conversation | 200 |
| Centrifugo | https://centrifugal.dev/docs/getting-started/introduction | Ready-made realtime hub with presence | You would rather not build connection routing and presence yourself | 200 |

### design-news-feed

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Redis | https://redis.io/docs/latest/ | Sorted sets for precomputed per-user timelines | Fan-out-on-write, and reads must be O(1) | 200 |
| Kafka | https://kafka.apache.org/documentation/ | Fan-out pipeline for new posts | Decoupling "post created" from "N timelines updated" | 200 |
| Cassandra | https://cassandra.apache.org/doc/latest/ | Wide rows of timeline entries | Timelines are too large to keep entirely in Redis | 200 |
| PostgreSQL | https://www.postgresql.org/docs/current/ | Source of truth for posts and follows | The graph and the content still need a consistent home | 200 |

Note: the interview is really about fan-out-on-write vs on-read and the
celebrity problem. Tools are secondary — say so in the topic.

### design-notification-system

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Firebase Cloud Messaging | https://firebase.google.com/docs/cloud-messaging | Push to Android, iOS and web | Mobile push — you do not build your own push transport | 200 |
| Apple User Notifications | https://developer.apple.com/documentation/usernotifications | APNs delivery semantics | iOS-specific behaviour and the token lifecycle | 200 |
| Novu | https://docs.novu.co/ | Multi-channel notification infrastructure | You need email, push, SMS and in-app with one preference model | 200 |
| Amazon SQS | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/ | Queue with retries and DLQ | Delivery must survive a provider outage and retry with backoff | 200 |

### design-rate-limiter

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Redis | https://redis.io/docs/latest/develop/using-commands/transactions/ | Atomic counters and Lua for sliding windows | Distributed limiting — the counter must be shared and atomic | 200 |
| rate-limiter-flexible | https://github.com/animir/node-rate-limiter-flexible | Token bucket / sliding window in Node | You want the algorithms implemented and tested already | 200 |
| NGINX `limit_req` | https://blog.nginx.org/blog/rate-limiting-nginx | Leaky bucket at the proxy | Limiting before the application, with no code change | 200 (redirect) |
| Cloudflare Rate Limiting | https://developers.cloudflare.com/waf/rate-limiting-rules/ | Edge enforcement | The traffic should never reach your origin at all | 200 |

### design-ride-sharing

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Redis geospatial | https://redis.io/docs/latest/develop/data-types/geospatial/ | `GEOADD`/`GEOSEARCH` for nearby drivers | Live driver locations with sub-second proximity queries | 200 |
| Uber H3 | https://h3geo.org/docs/ | Hexagonal geospatial indexing | Bucketing space into cells for matching and surge pricing | 200 |
| PostGIS | https://postgis.net/documentation/ | Spatial types and indexes in Postgres | Persistent geo queries, routes and polygons | 200 |
| Kafka | https://kafka.apache.org/documentation/ | High-volume location update ingest | Every driver emits a ping every few seconds | 200 |

### design-search-autocomplete

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Redis | https://redis.io/docs/latest/ | Sorted sets for prefix-scored suggestions | You want single-digit-millisecond prefix reads | 200 |
| Elasticsearch | https://www.elastic.co/docs | FST-based completion suggester | You need fuzziness and weighting, not just prefixes | 200 (redirect) |
| Typesense | https://typesense.org/docs/ | Typo-tolerant instant search | Small-to-medium corpus and you want this working today | 200 |
| Algolia | https://www.algolia.com/doc | Managed instant-search service | Latency and relevance matter and you will not operate a cluster | 200 (redirect) |

Note: the underlying data structure is a trie/FST — link the
`tries` topic rather than pretending a tool teaches it.

### design-url-shortener

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| nanoid | https://github.com/ai/nanoid | Short collision-resistant IDs | Generating the short code — with a documented collision probability | 200 |
| PostgreSQL | https://www.postgresql.org/docs/current/ | Code-to-URL mapping with a unique index | Source of truth, and the unique constraint is your collision guard | 200 |
| Redis | https://redis.io/docs/latest/ | Read-through cache for hot codes | Reads outnumber writes by orders of magnitude | 200 |
| Snowflake (Twitter) | https://github.com/twitter-archive/snowflake | Distributed monotonic ID generation | You want sequential IDs without a single sequence bottleneck | 200 |

Note: `twitter-archive/snowflake` is archived and that is fine — it is linked as
the reference design, not as software to run. Say that in the topic.

### design-video-streaming

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| FFmpeg | https://ffmpeg.org/documentation.html | Transcoding into ABR ladders | The transcoding pipeline — everything else wraps this | 200 |
| hls.js | https://github.com/video-dev/hls.js | HLS playback in browsers | Delivering HLS to browsers without native support | 200 |
| Shaka Player | https://github.com/shaka-project/shaka-player | DASH and HLS player with DRM | You need DRM (Widevine/FairPlay), not just adaptive playback | 200 |
| MDN Media Source Extensions | https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API | How adaptive playback works in the browser | Understanding why ABR is a client-side decision | 200 |
| Mux | https://www.mux.com/docs | Managed video encoding and delivery | Video is not your product and you want an API | 200 (redirect) |

---

## 12-ai-engineering

### agent-orchestration

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| LangGraph (JS) | https://docs.langchain.com/oss/javascript/langgraph/overview | Graph-structured agent state machines | The agent needs cycles, checkpoints and human-in-the-loop | 200 |
| Vercel AI SDK | https://ai-sdk.dev/docs/introduction | Typed tool-calling loops in TS | You want a small, TS-native agent loop without a framework | 200 |
| LangChain (JS) | https://docs.langchain.com/oss/javascript/langchain/overview | Chain and retriever glue | Prototyping quickly with prebuilt integrations | 200 (redirect) |
| Temporal | https://docs.temporal.io/ | Durable execution for long-running agents | The run takes hours and must survive process restarts | 200 |
| CrewAI | https://docs.crewai.com/ | Role-based multi-agent teams (Python) | Multi-agent role delegation; Python-only, no JS equivalent | 200 |

Note: `js.langchain.com` now redirects into `docs.langchain.com/oss/javascript/`
— link the new host. This area churns fast; say so in the topic rather than
implying a settled ecosystem.

### attention-and-transformers

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PyTorch | https://docs.pytorch.org/docs/stable/index.html | `scaled_dot_product_attention` and the primitives | Implementing attention to actually understand it (Python) | 200 (redirect) |
| HuggingFace Transformers | https://huggingface.co/docs/transformers/index | Reference implementations of every architecture | Reading real model code rather than a blog diagram | 200 |
| tiktoken | https://github.com/openai/tiktoken | Tokenization, the step before attention | Seeing what a "token" is before reasoning about sequence length | 200 |

Note: three rows is correct. This is a theory topic; the tooling is a Python
research stack, and pretending otherwise would mislead a Node learner.

### embeddings-and-vector-math

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Sentence Transformers | https://www.sbert.net/ | Open embedding models and training | Self-hosting embeddings, or learning how they are trained (Python) | 200 |
| MTEB leaderboard | https://github.com/embeddings-benchmark/mteb | Benchmark comparing embedding models | Choosing a model — do not pick by dimension count | 200 |
| OpenAI Embeddings API | https://developers.openai.com/api/docs | Hosted embedding generation | You want good embeddings from Node with no model hosting | 200 (redirect) |
| FAISS | https://faiss.ai/ | Similarity search index library | Learning HNSW/IVF trade-offs beneath every vector DB (Python/C++) | 200 |
| hnswlib | https://github.com/nmslib/hnswlib | Small embeddable HNSW index | In-process ANN over a few hundred thousand vectors | 200 |

### kv-cache-and-context-windows

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| vLLM | https://docs.vllm.ai/en/latest/ | PagedAttention KV cache management | Understanding how KV cache is actually paged and shared | 200 |
| tiktoken | https://github.com/openai/tiktoken | Count tokens before you send them | Budgeting a context window precisely | 200 |
| tiktoken (JS port) | https://github.com/dqbd/tiktoken | Token counting from Node | Node service that must enforce a context budget | 200 |
| Anthropic docs | https://platform.claude.com/docs/en/intro | Entry point for prompt caching and context limits | Long stable system prompts — provider-side caching cuts cost and latency | 200 (redirect) |

### llm-cost-and-latency

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| LiteLLM | https://docs.litellm.ai/ | Unified API plus cost tracking across providers | Comparing providers, or needing per-request cost attribution | 200 |
| Langfuse | https://langfuse.com/docs | Tracing with token and cost per span | You need to know which prompt is spending the money | 200 |
| Helicone | https://docs.helicone.ai/getting-started/quick-start | Proxy-based logging, caching and cost | You want observability by changing a base URL | 200 (redirect) |
| OpenRouter | https://openrouter.ai/docs/quickstart | Cross-provider routing and price comparison | Checking live per-token pricing across many models | 200 (redirect) |
| tiktoken | https://github.com/openai/tiktoken | Token counting for cost estimates | Estimating spend before shipping, not after the bill | 200 |

### llm-evaluation-and-testing

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| promptfoo | https://www.promptfoo.dev/docs/intro/ | Declarative prompt/model test matrices | You want eval as a config file in CI — the most Node-friendly option | 200 |
| Ragas | https://docs.ragas.io/en/stable/ | RAG-specific metrics (faithfulness, recall) | Evaluating retrieval separately from generation (Python) | 200 |
| DeepEval | https://deepeval.com/ | Pytest-style LLM assertions | You want unit-test ergonomics for model outputs (Python) | 200 (redirect) |
| Langfuse | https://langfuse.com/docs | Trace-linked datasets and scores | Evals must run against real production traces | 200 |
| lm-evaluation-harness | https://github.com/EleutherAI/lm-evaluation-harness | Standard academic benchmarks | Comparing base models on published benchmarks | 200 |

Note: the interview point is that LLM-as-judge needs its own validation. No
tool solves that — say it plainly.

### llm-fundamentals

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Anthropic docs | https://platform.claude.com/docs/en/intro | Model behaviour, params, capabilities | Learning what the knobs actually do | 200 (redirect) |
| OpenAI API docs | https://developers.openai.com/api/docs | Reference for the most-assumed API shape | Interviews assume this request/response shape | 200 (redirect) |
| Ollama | https://docs.ollama.com/ | Run open models locally | Experimenting without per-token cost or a network round trip | 200 |
| HuggingFace Transformers | https://huggingface.co/docs/transformers/index | Model internals and the model hub | You want to see inside rather than call an API | 200 |
| tiktoken | https://github.com/openai/tiktoken | Tokenization made visible | The first thing that makes "context window" concrete | 200 |

### llm-safety-and-guardrails

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenAI Moderation API | https://developers.openai.com/api/docs/guides/moderation | Hosted content classification | You need a fast, cheap content check from Node | 200 (redirect) |
| NeMo Guardrails | https://docs.nvidia.com/nemo/guardrails/about-nemo-guardrails-library/overview | Dialogue rails in a config DSL (Python) | Conversation-flow constraints, not just content filtering | 200 (redirect) |
| Guardrails AI | https://guardrailsai.com/guardrails/docs | Output validators and structure enforcement | You need typed, validated output with retry-on-fail (Python) | 200 (redirect) |
| LLM Guard | https://github.com/protectai/llm-guard | Input/output scanners incl. prompt injection | Scanning for jailbreaks and PII leakage (Python) | 200 |
| Zod | https://zod.dev/ | Validate model output structurally in Node | The guardrail you can actually deploy in a Node service today | 200 |

Note: `NVIDIA/NeMo-Guardrails` now redirects to `NVIDIA-NeMo/Guardrails`. This
space is Python-heavy; the honest Node answer is schema validation plus a
hosted moderation call. Prompt injection has no solved tooling — say so.

### mcp-and-agent-tool-protocols

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| MCP introduction | https://modelcontextprotocol.io/docs/getting-started/intro | What MCP is and its architecture | Starting point — read this before any SDK | 200 (redirect) |
| MCP specification | https://modelcontextprotocol.io/specification/latest | The wire protocol itself | Implementing a server, or debugging a transport problem | 200 (redirect) |
| MCP TypeScript SDK | https://github.com/modelcontextprotocol/typescript-sdk | Build MCP servers and clients in TS | Node/TS — this is the reference implementation for this curriculum | 200 |
| Vercel AI SDK | https://ai-sdk.dev/docs/introduction | Tool calling with typed schemas | Comparing MCP against plain provider-native tool calling | 200 |

Note: `modelcontextprotocol.io` versions its docs by date, so both the intro and
spec URLs resolve to a dated path. Link the **unversioned** URLs —
`https://modelcontextprotocol.io/docs/getting-started/intro` and
`https://modelcontextprotocol.io/specification/latest` (both verified 200) — so
the topic does not pin to a superseded revision.

### prompt-engineering

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Prompting Guide | https://www.promptingguide.ai/ | Technique catalogue with papers | Learning the named techniques and where each applies | 200 |
| Anthropic prompt engineering | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview | Vendor guidance that reflects model behaviour | Writing prompts for a specific model family | 200 (redirect) |
| OpenAI Cookbook | https://developers.openai.com/cookbook | Runnable prompting recipes | You want working code, not principles | 200 (redirect) |
| promptfoo | https://www.promptfoo.dev/docs/intro/ | A/B test prompt variants | You are about to "improve" a prompt by feel — measure instead | 200 |

### rag-in-production

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Qdrant hybrid queries | https://qdrant.tech/documentation/search/hybrid-queries/ | Dense + sparse fusion with RRF in one query | You need hybrid search server-side rather than fusing in app code | 200 |
| Cohere Rerank | https://docs.cohere.com/docs/rerank | Hosted cross-encoder reranking API | You want reranking from Node today with no model to host | 200 |
| Sentence Transformers CrossEncoder | https://sbert.net/docs/cross_encoder/usage/usage.html | Self-hosted reranking models (Python) | Cost or data residency rules out a hosted reranker | 200 |
| bge-reranker-v2-m3 | https://huggingface.co/BAAI/bge-reranker-v2-m3 | A strong open multilingual reranker | You are self-hosting and need a specific, current model to start from | 200 |
| OpenSearch hybrid search | https://docs.opensearch.org/latest/vector-search/ | BM25 and kNN fused in one engine | You already run OpenSearch and want one system, not two | 200 (redirect) |
| Ragas | https://docs.ragas.io/en/stable/ | Context precision/recall and faithfulness | Before tuning anything — measure retrieval separately from generation | 200 |

Note: this topic is the production half of `rag-retrieval-augmented-generation`,
so keep tool names and URLs identical where they overlap (Qdrant, Ragas,
OpenSearch). The distinctive content is **reranking** and **hybrid search**:
a bi-encoder embeds query and document separately (fast, lossy), a
cross-encoder reads them together (accurate, expensive), which is exactly why
the pattern is retrieve-many-cheaply then rerank-few-expensively. Reciprocal
Rank Fusion is the standard way to combine BM25 and vector rankings and needs
no score normalisation, which is its main practical advantage. Reranker model
choice moves quickly — say so rather than implying a settled leaderboard.

### rag-retrieval-augmented-generation

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| pgvector | https://github.com/pgvector/pgvector | Vector similarity inside Postgres | You already run Postgres and are under roughly 10M vectors | 200 |
| Qdrant | https://qdrant.tech/documentation/ | Dedicated vector DB with payload filters | You need filtered search at scale and can run a separate service | 200 |
| LangChain (JS) | https://docs.langchain.com/oss/javascript/langchain/overview | Loaders, splitters, retrievers | Prototyping the pipeline before writing your own | 200 (redirect) |
| Elasticsearch / OpenSearch hybrid | https://docs.opensearch.org/latest/vector-search/ | BM25 plus vector in one engine | Keyword recall matters — pure vector search misses exact terms | 200 (redirect) |
| Ragas | https://docs.ragas.io/en/stable/ | Retrieval and faithfulness metrics | Before tuning chunk size — measure retrieval, not vibes | 200 |

Note: this topic already exists and already links pgvector/Qdrant/LangChain.js.
Keep names identical, but update the LangChain URL to the new host.

### sampling-and-decoding

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| vLLM | https://docs.vllm.ai/en/latest/ | Sampling params: temperature, top-p, top-k | Seeing every sampling knob in one place with real defaults | 200 |
| HuggingFace Transformers | https://huggingface.co/docs/transformers/index | `generate()` strategies and configs | Learning what each strategy does to the distribution | 200 |
| Ollama | https://docs.ollama.com/ | Change sampling params locally, instantly | Building intuition by turning temperature to 0 and to 2 | 200 |
| llama.cpp | https://github.com/ggml-org/llama.cpp | Sampler implementations you can read | You want the actual code for min-p, mirostat and friends | 200 |

### tool-calling-and-function-calling

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Vercel AI SDK | https://ai-sdk.dev/docs/introduction | Typed tools with Zod schemas in TS | Node/TS — the cleanest tool-calling ergonomics available | 200 |
| Zod | https://zod.dev/ | Define and validate tool parameters | Always — the model will eventually send malformed arguments | 200 |
| OpenAI API docs | https://developers.openai.com/api/docs | The tool-call request/response shape | Understanding the raw protocol beneath any SDK | 200 (redirect) |
| Anthropic docs | https://platform.claude.com/docs/en/intro | Entry point for tool-use semantics | Comparing how providers differ on parallel tool calls | 200 (redirect) |
| MCP TypeScript SDK | https://github.com/modelcontextprotocol/typescript-sdk | Expose tools over a standard protocol | The same tools must serve multiple clients | 200 |

### vector-databases

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| pgvector | https://github.com/pgvector/pgvector | Vectors in Postgres, one datastore | Under ~10M vectors and you value operational simplicity | 200 |
| Qdrant | https://qdrant.tech/documentation/ | Dedicated vector DB, strong filtering | Payload filtering at scale, and you can operate a service | 200 |
| Milvus | https://milvus.io/docs | Distributed vector DB, many index types | Billions of vectors and you need horizontal sharding | 403-bot-blocked |
| Pinecone | https://docs.pinecone.io/guides/get-started/overview | Managed serverless vector DB | You refuse to operate this layer at all | 200 (redirect) |
| Weaviate | https://docs.weaviate.io/weaviate | Vector DB with built-in hybrid search | You want BM25 and vector fused in one query | 200 (redirect) |
| hnswlib | https://github.com/nmslib/hnswlib | In-process HNSW index | Fewer than ~100k vectors — a database is overkill | 200 |

Note: `milvus.io/docs` returns a redirect loop to automated clients; the page is
real and was confirmed by search. The decision axis for this whole table is
in-process → in-database → dedicated service → managed, and that ordering is
the actual interview answer.

---

## 16-security-identity-and-pki

### certificate-lifecycle-and-rotation

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| cert-manager | https://cert-manager.io/docs/ | Automated issuance and renewal in K8s | Any Kubernetes workload needing certs — the de facto standard | 200 |
| step-ca | https://smallstep.com/docs/step-ca/ | Private CA issuing short-lived certs | You want rotation to be routine because lifetimes are hours | 200 |
| Certbot | https://certbot.eff.org/ | ACME client for public certs | A plain VM serving public HTTPS | 200 |
| acme.sh | https://github.com/acmesh-official/acme.sh | Shell ACME client, no dependencies | Minimal or constrained environments where Certbot won't fit | 200 |
| Vault PKI | https://developer.hashicorp.com/vault/docs/secrets/pki | CA as a service with policy and audit | You need issuance auditing and fine-grained role policy | 200 |

Note: the failure mode to teach is renewal that succeeds while nothing reloads
the certificate. cert-manager solves issuance, not reload — name that gap.

### connection-reuse-and-handshake-cost

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Node.js `http.Agent` | https://nodejs.org/api/http.html#new-agentoptions | `keepAlive` and pool sizing | The default agent is why your handshake count is high | 200 |
| undici | https://undici.nodejs.org/ | Pooled HTTP client with explicit dispatchers | You need real control over pooling and pipelining | 200 |
| OpenSSL `s_client` | https://docs.openssl.org/ | Observe full vs resumed handshakes | Proving session resumption is or is not happening | 200 (redirect) |
| Wireshark | https://www.wireshark.org/docs/ | Count handshakes on the wire | The client claims reuse and you need evidence | 200 |
| k6 | https://grafana.com/docs/k6/latest/ | Measure latency with and without reuse | Quantifying what the handshake actually costs you | 200 |

Note: this is exactly the trap where a client library silently leaves the pooled
path — the tooling answer is "measure handshakes, don't trust configuration".

### mtls-failure-modes

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenSSL `s_client` | https://docs.openssl.org/ | Reproduce the handshake outside the app | First move in any mTLS incident — isolate client from app | 200 (redirect) |
| Wireshark | https://www.wireshark.org/docs/ | See which side sent the alert | You need to know whether the client or server rejected | 200 |
| testssl.sh | https://testssl.sh/ | Enumerate accepted certs, CAs and ciphers | Confirming what the server will actually accept | 200 |
| cert-manager | https://cert-manager.io/docs/ | Inspect Certificate/Order status | The failure is "cert never got issued", not a handshake bug | 200 |
| crt.sh | https://crt.sh/ | Certificate Transparency search | Verifying a public cert exists and what SANs it carries | 200 |

### mtls-in-service-meshes

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Istio security concepts | https://istio.io/latest/docs/concepts/security/ | PeerAuthentication and mTLS modes | Understanding STRICT vs PERMISSIVE and the migration path | 200 |
| Linkerd automatic mTLS | https://linkerd.io/2-edge/features/automatic-mtls/ | mTLS with no configuration | You want mTLS on by default with nothing to get wrong | 200 |
| Envoy TLS architecture | https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/security/ssl | What the sidecar actually does | Debugging below the mesh abstraction | 200 |
| Cilium mutual authentication | https://docs.cilium.io/en/stable/network/servicemesh/mutual-authentication/mutual-authentication/ | eBPF-based identity and mTLS | You want mesh identity without a per-pod proxy | 200 |
| SPIRE | https://github.com/spiffe/spire | The identity source under many meshes | Workload identity must span beyond one cluster | 200 |

Note: PERMISSIVE mode is the migration tool and the thing people forget to turn
off — a good "common mistake" for this topic.

### mtls-vs-token-auth

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| jose | https://github.com/panva/jose | JWT signing and verification in Node | Token auth done correctly, including JWKS rotation | 200 |
| OAuth 2.0 | https://oauth.net/2/ | Bearer-token delegation model | The caller is a user or third party, not a workload | 200 |
| SPIFFE | https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/ | Cryptographic workload identity | The caller is a workload and you want identity, not a shared secret | 200 |
| Node.js `tls` | https://nodejs.org/api/tls.html | Client certificates in application code | You must implement mTLS yourself rather than at a proxy | 200 |
| Vault | https://developer.hashicorp.com/vault/docs | Short-lived credentials of either kind | The real fix is lifetime, whichever mechanism you pick | 200 |

### pki-and-certificate-authorities

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenSSL | https://docs.openssl.org/ | Build a CA and issue certs by hand | Learning — doing it manually once makes the model click | 200 (redirect) |
| step-ca | https://smallstep.com/docs/step-ca/ | Practical private CA | You need a real internal CA and not a shell script | 200 |
| CFSSL | https://github.com/cloudflare/cfssl | CA toolkit and signing API | Programmatic issuance in a build or bootstrap pipeline | 200 |
| Vault PKI | https://developer.hashicorp.com/vault/docs/secrets/pki | Enterprise CA with roles and audit | Multiple teams issue certs and you need policy boundaries | 200 |
| crt.sh | https://crt.sh/ | Certificate Transparency logs | Auditing what certificates exist for your domains | 200 |

### secure-defaults-and-common-footguns

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Mozilla SSL Config Generator | https://ssl-config.mozilla.org/ | Known-good TLS config per server | You are about to hand-write cipher suites | 200 |
| OWASP Cheat Sheets | https://cheatsheetseries.owasp.org/ | The footgun catalogue with fixes | Any specific "is this safe?" question | 200 |
| Helmet | https://helmet.js.org/ | Secure headers by default in Node | Express apps ship insecure headers unless you add these | 200 (redirect) |
| Kyverno | https://kyverno.io/docs/introduction/ | Enforce secure defaults as policy | You want the default to be impossible to override accidentally | 200 (redirect) |
| Trivy | https://trivy.dev/ | Misconfiguration scanning (IaC and images) | Catching insecure defaults before they deploy | 200 |

Note: the single biggest footgun in Node is `rejectUnauthorized: false` /
`NODE_TLS_REJECT_UNAUTHORIZED=0`. It silently disables the whole point of TLS.
Name it explicitly.

### tls-termination-and-passthrough

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| NGINX | https://nginx.org/en/docs/ | Terminate, or `stream` for passthrough | The clearest docs for both modes side by side | 200 |
| HAProxy | https://docs.haproxy.org/ | TCP mode with SNI-based routing | Passthrough but you still need to route by hostname | 200 |
| Envoy | https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/security/ssl | Termination, origination and passthrough | Re-encrypting to the backend rather than sending plaintext | 200 |
| Gateway API | https://gateway-api.sigs.k8s.io/ | `Terminate` vs `Passthrough` TLS modes | In Kubernetes, where this is an explicit field | 200 |

Note: the trade-off is that termination lets you inspect L7 (routing, WAF,
caching) but the LB sees plaintext; passthrough preserves end-to-end mTLS but
gives up all L7 features. That sentence is the whole topic.

### workload-identity-and-spiffe

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| SPIFFE concepts | https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/ | SPIFFE ID, SVID, trust domain | Learning the model — start here, not with SPIRE | 200 |
| SPIRE | https://github.com/spiffe/spire | The reference SPIFFE implementation | You need attested identity across clusters and VMs | 200 |
| Istio | https://istio.io/latest/docs/concepts/security/ | SPIFFE identities issued automatically | You are on a mesh — you already have SPIFFE IDs | 200 |
| Vault | https://developer.hashicorp.com/vault/docs | Identity-based secret access | Workload identity should unlock secrets, not a static token | 200 |

Note: the point of SPIFFE is replacing long-lived shared secrets with attested,
short-lived identity. This is a genuinely narrow tooling space — four rows is
generous, not thin.

### x509-and-der-decoded

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenSSL `asn1parse`/`x509` | https://docs.openssl.org/ | Decode DER and PEM structures | The canonical way to see what is inside a certificate | 200 (redirect) |
| asn1js | https://lapo.it/asn1js/ | Browser ASN.1 decoder with byte view | Learning DER's tag-length-value encoding visually | 200 |
| @peculiar/x509 | https://github.com/PeculiarVentures/x509 | Parse and build X.509 in TypeScript | Certificate handling inside a Node service | 200 |
| RFC 5280 | https://www.rfc-editor.org/info/rfc5280/ | The X.509 specification | You need the authoritative meaning of an extension | 200 (redirect) |

---

## 17-llm-infrastructure-and-gpus

### continuous-batching-and-throughput

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| vLLM | https://docs.vllm.ai/en/latest/ | Continuous batching and PagedAttention | The default serving engine — this is where the technique landed | 200 |
| SGLang | https://docs.sglang.io/ | RadixAttention prefix-cache-aware batching | Many requests share long prefixes (agents, few-shot prompts) | 200 (redirect) |
| TensorRT-LLM | https://nvidia.github.io/TensorRT-LLM/ | In-flight batching, compiled kernels | Maximum throughput on NVIDIA and you accept a compile step | 200 |
| GuideLLM | https://github.com/vllm-project/guidellm | Measure throughput vs latency trade-off | Proving batching helped, and finding where TTFT degrades | 200 |

Note: HuggingFace TGI is **archived** — do not present it as an option here even
though it pioneered continuous batching in the open. See the deprecation
section below.

### deploying-a-model-end-to-end

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| vLLM | https://docs.vllm.ai/en/latest/ | OpenAI-compatible inference server | The serving layer; its API shape means clients need no changes | 200 |
| NVIDIA GPU Operator | https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html | Drivers, toolkit and device plugin in K8s | Deploying on Kubernetes — this is the prerequisite layer | 200 |
| KServe | https://kserve.github.io/website/ | Model-serving CRDs with autoscaling | You want a serving abstraction rather than raw Deployments | 200 |
| Modal | https://modal.com/docs | Serverless GPU deployment from Python | You want a GPU endpoint today without touching Kubernetes | 200 |
| Baseten | https://docs.baseten.co/overview | Managed model deployment and autoscaling | Production serving without owning the GPU plumbing | 200 (redirect) |

### fine-tuning-and-lora

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PEFT | https://huggingface.co/docs/peft/index | LoRA/QLoRA adapters (Python) | The standard library for parameter-efficient fine-tuning | 200 |
| TRL | https://huggingface.co/docs/trl/index | SFT, DPO and reward training | You are past supervised fine-tuning into preference tuning | 200 |
| Unsloth | https://unsloth.ai/docs | Faster, lower-memory LoRA training | Fine-tuning on a single consumer or modest cloud GPU | 200 (redirect) |
| Axolotl | https://docs.axolotl.ai/ | YAML-configured fine-tuning pipelines | You want reproducible runs from a config, not a notebook | 200 |
| vLLM | https://docs.vllm.ai/en/latest/ | Serve many LoRA adapters on one base model | Per-tenant adapters — this is the cost argument for LoRA | 200 |

Note: this is entirely a Python ecosystem. Be explicit that a Node engineer
fine-tunes by driving Python tooling or a managed service, not from Node.

### gpu-autoscaling-and-cold-starts

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| KEDA | https://keda.sh/docs/2.20/ | Scale on queue depth or custom metrics | GPU pods should scale on pending requests, not CPU | 200 (redirect) |
| Karpenter | https://karpenter.sh/docs/ | Just-in-time node provisioning | Node provisioning time dominates your cold start | 200 |
| Cluster Autoscaler | https://github.com/kubernetes/autoscaler | Node-group-based scaling | You need the conventional, widely-supported option | 200 |
| Knative | https://knative.dev/docs/ | Scale-to-zero with request buffering | Idle GPU cost is unacceptable and you can absorb cold starts | 200 |
| Modal | https://modal.com/docs | Managed GPU with fast container starts | You want someone else to have solved snapshotting | 200 |

Note: the honest content here is that GPU cold starts are dominated by node
provisioning plus multi-gigabyte image and weight pulls — not by the runtime.
Any tool table that implies autoscaling alone fixes it is misleading.

### gpu-fundamentals-for-engineers

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| NVML (`nvidia-smi`) | https://docs.nvidia.com/deploy/nvml-api/index.html | Query utilisation, memory, clocks | The first command on any GPU box | 200 |
| DCGM Exporter | https://github.com/NVIDIA/dcgm-exporter | GPU metrics into Prometheus | Fleet-level utilisation, not one host | 200 |
| Nsight Systems | https://developer.nvidia.com/nsight-systems | Timeline profiling of GPU workloads | You need to see kernel vs transfer vs idle time | 200 |
| PyTorch | https://docs.pytorch.org/docs/stable/index.html | The API through which you touch the GPU | Understanding device transfers and memory allocation | 200 (redirect) |

Note: `nvidia-smi` utilisation percentage means "a kernel was resident", not
"the GPU was efficiently used". That misreading is a great "common mistake".

### gpu-memory-math

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| vLLM | https://docs.vllm.ai/en/latest/ | `gpu_memory_utilization`, KV cache sizing | Turning the memory formula into a real config value | 200 |
| NVML (`nvidia-smi`) | https://docs.nvidia.com/deploy/nvml-api/index.html | Observe actual allocation vs your estimate | Your arithmetic said it fits and it OOM'd anyway | 200 |
| HuggingFace Transformers | https://huggingface.co/docs/transformers/index | Parameter counts, layers, hidden size | You need the numbers the formula consumes | 200 |
| bitsandbytes | https://huggingface.co/docs/bitsandbytes/main/en/index | See how dtype changes memory | Demonstrating that fp16 → int8 → int4 halves each time | 200 |

Note: this topic is arithmetic first. Tools verify the arithmetic; they do not
replace it. Keep the table small and say that.

### inference-servers-vllm-and-tgi

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| vLLM | https://docs.vllm.ai/en/latest/ | High-throughput OpenAI-compatible server | The default choice for self-hosted LLM serving | 200 |
| SGLang | https://docs.sglang.io/ | Prefix-cache-optimised serving | Structured generation or heavy prefix reuse | 200 (redirect) |
| TensorRT-LLM | https://nvidia.github.io/TensorRT-LLM/ | Compiled NVIDIA-optimised inference | Squeezing the last throughput out of known-fixed models | 200 |
| Triton Inference Server | https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/index.html | Multi-framework model server | You serve more than LLMs from one platform | 200 |
| llama.cpp | https://github.com/ggml-org/llama.cpp | CPU and quantized local inference | No GPU, or edge/laptop deployment | 200 |
| Ollama | https://docs.ollama.com/ | Local model runner over llama.cpp | Local development ergonomics, not production serving | 200 |

Note: **this topic's title names TGI, which is now archived.** The topic must be
updated to say TGI is read-only as of March 2026 (maintenance mode from Dec
2025) and that HuggingFace itself recommends vLLM or SGLang. Keep the TGI
history — it is genuinely why continuous batching became mainstream — but frame
it in the past tense. Repo link for the historical reference:
`https://github.com/huggingface/text-generation-inference` (200).

### multi-gpu-and-model-parallelism

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| PyTorch FSDP | https://docs.pytorch.org/docs/stable/fsdp.html | Shard params, grads and optimizer state | Training a model that does not fit on one GPU | 200 (redirect) |
| DeepSpeed | https://www.deepspeed.ai/ | ZeRO stages and offload | You need CPU/NVMe offload to fit at all | 200 |
| vLLM | https://docs.vllm.ai/en/latest/ | `tensor_parallel_size` for serving | *Inference* across GPUs — different problem from training | 200 |
| Nsight Systems | https://developer.nvidia.com/nsight-systems | See NCCL collective communication cost | Scaling is sublinear and you suspect interconnect | 200 |

Note: separate training parallelism (FSDP/DeepSpeed) from inference parallelism
(tensor/pipeline in vLLM). Conflating them is the standard confusion.

### quantization-explained

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| bitsandbytes | https://huggingface.co/docs/bitsandbytes/main/en/index | 8-bit and 4-bit (NF4) loading | QLoRA fine-tuning, and the simplest way to see quantization work | 200 |
| AutoAWQ | https://github.com/casper-hansen/AutoAWQ | Activation-aware weight quantization | Serving quantized weights with good quality retention | 200 |
| GPTQ (AutoGPTQ) | https://github.com/AutoGPTQ/AutoGPTQ | Post-training weight quantization | The other standard PTQ method to compare against AWQ | 200 |
| llama.cpp | https://github.com/ggml-org/llama.cpp | GGUF K-quant formats for CPU/edge | Running locally, where GGUF is the practical format | 200 |
| vLLM | https://docs.vllm.ai/en/latest/ | Serve AWQ/GPTQ/FP8 checkpoints | You have a quantized model and need it served | 200 |

### self-hosted-vs-api-economics

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| LiteLLM | https://docs.litellm.ai/ | One API over hosted and self-hosted | Running the comparison without rewriting client code | 200 |
| OpenRouter | https://openrouter.ai/docs/quickstart | Live per-token pricing across models | Getting the API side of the arithmetic from real prices | 200 (redirect) |
| RunPod | https://docs.runpod.io/overview | GPU hourly pricing | The self-hosted side of the arithmetic — GPU-hours | 200 (redirect) |
| GuideLLM | https://github.com/vllm-project/guidellm | Measure your achievable tokens/sec | Cost per token needs *your* throughput, not a vendor's | 200 |
| Langfuse | https://langfuse.com/docs | Actual token volume in production | The break-even depends on volume you must measure, not guess | 200 |

Note: the break-even is throughput-dependent, so this topic is a calculation
with two measured inputs. Do not let the table imply a universal answer.

### serving-latency-and-benchmarking

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| GuideLLM | https://github.com/vllm-project/guidellm | TTFT/ITL/throughput sweeps | The vLLM-ecosystem benchmark tool, closest to the serving reality | 200 |
| Triton perf_analyzer | https://github.com/triton-inference-server/perf_analyzer | Concurrency-sweep latency measurement | Benchmarking Triton, or wanting a mature sweep harness | 200 |
| LLMPerf | https://github.com/ray-project/llmperf | Benchmark hosted LLM endpoints | Comparing API providers on TTFT and tokens/sec | 200 |
| NVIDIA NIM benchmarking guide | https://docs.nvidia.com/nim/benchmarking/llm/latest/index.html | Methodology for LLM latency metrics | You need the definitions right before you measure anything | 200 |
| Grafana / Prometheus | https://grafana.com/docs/grafana/latest/ | Track TTFT and ITL percentiles in prod | Benchmarks are not production — instrument both | 200 |

Note: TTFT (prefill) and inter-token latency (decode) have different
bottlenecks — compute-bound vs memory-bandwidth-bound. A benchmark reporting one
average number is the mistake to name.

---

## 18-kubernetes-in-depth

### configmaps-and-configuration

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| ConfigMap docs | https://kubernetes.io/docs/concepts/configuration/configmap/ | Semantics, mounting, immutability | Understanding why an env-var ConfigMap change needs a restart | 200 |
| Kustomize | https://kubectl.docs.kubernetes.io/references/kustomize/ | Overlays and configMapGenerator hashes | You want config changes to trigger rollouts automatically | 200 |
| Helm | https://helm.sh/docs/ | Values-driven templating | One chart, many environments | 200 |
| External Secrets Operator | https://external-secrets.io/latest/ | Pull secrets from external stores | Config is fine in a ConfigMap; secrets are not | 200 |

Note: the classic bug is a mounted-volume ConfigMap updating in place while env
vars do not, so half your config is stale. That is the topic's real content.

### ingress-and-gateway-api

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Gateway API | https://gateway-api.sigs.k8s.io/ | The successor to Ingress | New clusters — Ingress is effectively frozen | 200 |
| ingress-nginx | https://kubernetes.github.io/ingress-nginx/ | The most-deployed Ingress controller | Existing clusters, and what interviews assume | 200 |
| Envoy Gateway / Istio | https://istio.io/latest/docs/ | Gateway API with mesh integration | You already run a mesh and want one ingress story | 200 |
| Traefik | https://doc.traefik.io/traefik/ | Ingress and Gateway API controller | You want CRD-driven routing with good defaults | 200 |
| cert-manager | https://cert-manager.io/docs/ | TLS certificates for your Gateways | Any HTTPS ingress — this is the paired tool | 200 |

Note: Gateway API's split of Gateway (infra) from HTTPRoute (app) is a
role-separation answer, and that is why it exists. Also worth flagging:
ingress-nginx has been announced as heading for retirement in favour of Gateway
API implementations — describe it as "still dominant, but plan the migration"
rather than as the future.

### kubernetes-architecture

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Cluster architecture docs | https://kubernetes.io/docs/concepts/architecture/ | Control plane and node components | The authoritative map of who owns which decision | 200 |
| etcd | https://etcd.io/docs/ | The cluster's source of truth | Understanding why etcd health is cluster health | 200 |
| kind | https://kind.sigs.k8s.io/ | Multi-node cluster you can break safely | Learning by killing components and watching what fails | 200 |
| kubectl reference | https://kubernetes.io/docs/reference/kubectl/ | `get --raw`, `explain`, component status | Inspecting the API server directly rather than through abstractions | 200 |

### kubernetes-autoscaling

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Autoscaling docs | https://kubernetes.io/docs/concepts/workloads/autoscaling/ | HPA, VPA, and how they interact | Understanding why HPA and VPA on the same metric conflict | 200 |
| metrics-server | https://github.com/kubernetes-sigs/metrics-server | Supplies CPU/memory to HPA | HPA reports `<unknown>` — this is almost always why | 200 |
| KEDA | https://keda.sh/docs/2.20/ | Scale on queue depth, Kafka lag, cron | The right signal is not CPU | 200 (redirect) |
| Karpenter | https://karpenter.sh/docs/ | Provision right-sized nodes on demand | Pods are Pending because no node fits, not because of replicas | 200 |
| Cluster Autoscaler | https://github.com/kubernetes/autoscaler | Node-group scaling | You need broad cloud support and predictable node groups | 200 |

Note: pod autoscaling and node autoscaling are different layers. "Scaled to 20
replicas, 12 Pending" is the symptom that teaches the difference.

### kubernetes-debugging

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Debug running pods | https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/ | `kubectl debug`, ephemeral containers | The image is distroless and has no shell | 200 |
| kubectl reference | https://kubernetes.io/docs/reference/kubectl/ | `describe`, `logs --previous`, `events` | Events and previous logs answer most CrashLoopBackOffs | 200 |
| k9s | https://k9scli.io/ | Terminal UI over the cluster | Navigating many namespaces faster than typing kubectl | 200 |
| stern | https://github.com/stern/stern | Tail logs across many pods | The error is in one of twelve replicas | 200 |
| Debug tasks index | https://kubernetes.io/docs/tasks/debug/ | Official troubleshooting decision tree | You do not know where to start | 200 |

Note: `kubectl describe pod` plus events is the highest-yield first move, and
`--previous` for logs of a crashed container. Tools come after that habit.

### kubernetes-networking

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Services docs | https://kubernetes.io/docs/concepts/services-networking/service/ | ClusterIP, NodePort, LoadBalancer, headless | The model everything else builds on | 200 |
| Cilium | https://docs.cilium.io/en/stable/ | eBPF CNI, policy and observability | You want network policy plus visibility in one layer | 200 |
| CoreDNS | https://coredns.io/manual/toc/ | Cluster DNS and its config | Service resolution is failing or slow (`ndots` is a classic) | 200 |
| NetworkPolicy via Cilium docs | https://docs.cilium.io/en/stable/ | Default-deny and egress rules | An egress policy is silently blocking your pod's outbound calls | 200 |
| Gateway API | https://gateway-api.sigs.k8s.io/ | North-south traffic entry | External traffic, as distinct from pod-to-pod | 200 |

Note: a default-deny egress NetworkPolicy silently blocking outbound traffic
looks exactly like an auth or DNS failure. Worth calling out as a footgun.

### kubernetes-operators-and-crds

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Custom Resources docs | https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/ | CRDs vs aggregated API servers | Deciding whether you need an operator at all | 200 |
| Kubebuilder | https://book.kubebuilder.io/ | Scaffold controllers in Go | Writing a real operator — this is the standard path | 200 |
| Operator SDK | https://sdk.operatorframework.io/docs/ | Go, Ansible or Helm operators | You want an operator without writing Go | 200 |
| Metacontroller | https://metacontroller.github.io/metacontroller/ | Write controllers as webhooks in any language | Your team is Node/Python and Go is the blocker | 200 |
| kubernetes-client/javascript | https://github.com/kubernetes-client/javascript | Watch and reconcile from Node | Building a small controller in TypeScript | 200 |

Note: the honest advice is that most people should configure an existing
operator, not write one. And that the reconcile loop must be idempotent and
level-triggered — the single most common operator bug.

### kubernetes-rbac-and-security

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| RBAC docs | https://kubernetes.io/docs/reference/access-authn-authz/rbac/ | Roles, bindings, `kubectl auth can-i` | The reference, and `can-i` is the debugging command | 200 |
| Pod Security Standards | https://kubernetes.io/docs/concepts/security/pod-security-standards/ | Baseline and restricted profiles | Replacing removed PodSecurityPolicy | 200 |
| Kyverno | https://kyverno.io/docs/introduction/ | Policy as Kubernetes resources | You need admission policy without learning Rego | 200 (redirect) |
| OPA / Gatekeeper | https://www.openpolicyagent.org/docs | Rego-based admission control | Policy is complex enough to need a real language | 200 (redirect) |
| kube-bench | https://github.com/aquasecurity/kube-bench | CIS benchmark checks | You need an auditable hardening report | 200 |

Note: PodSecurityPolicy was removed in v1.25. Anyone recommending it is working
from stale material.

### kubernetes-storage

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Persistent Volumes docs | https://kubernetes.io/docs/concepts/storage/persistent-volumes/ | PV/PVC, StorageClass, access modes | Understanding why RWO means one node, not one pod | 200 |
| CSI docs | https://kubernetes-csi.github.io/docs/ | The storage driver interface | Understanding provisioning, attach and mount as distinct steps | 200 |
| Longhorn | https://longhorn.io/docs/ | Replicated block storage in-cluster | On-prem, and you need replicated volumes without a SAN | 200 |
| Rook / Ceph | https://rook.io/docs/rook/latest-release/Getting-Started/intro/ | Block, file and object storage operator | You need all three storage types and can staff Ceph | 200 |
| OpenEBS | https://openebs.io/docs/ | Container-attached storage | You want per-workload storage engines, local or replicated | 200 |

Note: `ReadWriteOnce` is the number-one storage confusion — it is per *node*.
And a StatefulSet's PVCs deliberately survive deletion.

### pod-lifecycle-and-scheduling

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Scheduling docs | https://kubernetes.io/docs/concepts/scheduling-eviction/ | Affinity, taints, topology spread, preemption | Diagnosing `Pending` — the reason is always in here | 200 |
| Scheduler configuration | https://kubernetes.io/docs/reference/scheduling/config/ | Profiles, plugins and scoring | You need to change how scoring works, not just constraints | 200 |
| Descheduler | https://github.com/kubernetes-sigs/descheduler | Evict pods to rebalance | The scheduler was right at placement time but the cluster drifted | 200 |
| kind | https://kind.sigs.k8s.io/ | Reproduce scheduling constraints locally | Testing topology spread without a real multi-zone cluster | 200 |

Note: the scheduler places a pod once and never revisits it — that is why the
descheduler exists as a separate component. Good interview answer.

### statefulsets-daemonsets-and-jobs

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| StatefulSet docs | https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/ | Stable identity, ordered rollout, PVC templates | You need stable network IDs and per-replica storage | 200 |
| Kueue | https://kueue.sigs.k8s.io/docs/ | Job queueing with quotas | Batch jobs must queue rather than fail to schedule | 200 |
| Volcano | https://volcano.sh/docs/home/introduction/ | Gang scheduling for batch/ML | All-or-nothing scheduling for distributed training | 200 (redirect) |
| Argo project | https://argoproj.github.io/cd/ | Argo Workflows for DAG-based job orchestration | Jobs have dependencies and a plain Job is not enough | 200 |

Note: only the Argo project entry point was verified, not a Workflows-specific
docs path — link the verified URL and do not construct `argoproj.github.io/argo-workflows/`
from the pattern. A StatefulSet is not a database — it gives identity and storage, nothing about
replication or leader election.

---

## 19-devops-and-platform-engineering

### chaos-and-resilience-testing

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Principles of Chaos Engineering | https://principlesofchaos.org/ | The method: hypothesis, blast radius, abort | Before any tool — chaos without a hypothesis is just an outage | 200 |
| Chaos Mesh | https://chaos-mesh.org/docs/ | K8s-native fault injection CRDs | On Kubernetes, and you want experiments as manifests | 200 |
| LitmusChaos | https://docs.litmuschaos.io/ | Chaos experiments with a hub of scenarios | You want prebuilt experiments and a control plane UI | 200 |
| tc (netem) | https://man7.org/linux/man-pages/man8/tc.8.html | Latency, loss and partition at the host | You need one precise network fault without a framework | 200 |
| Chaos Monkey | https://github.com/Netflix/chaosmonkey | The original instance-termination tool | Historical reference and the "randomly kill things" baseline | 200 |

Note: `grafana/xk6-disruptor` now redirects to `grafana-cold-storage/` — treat it
as no longer maintained and prefer Chaos Mesh or LitmusChaos.

### cicd-pipeline-design

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| GitHub Actions | https://docs.github.com/en/actions | Reusable workflows, matrices, caching | Designing pipeline structure, not just running commands | 200 |
| Argo CD | https://argo-cd.readthedocs.io/en/stable/ | Deploy half of CI/CD, pull-based | Separating build from deploy — the core design decision | 200 |
| Dagger | https://docs.dagger.io/getting-started/introduction/ | Portable pipelines runnable locally | Pipeline logic must not be locked into one CI vendor | 200 (redirect) |
| Turborepo | https://turborepo.dev/docs | Task graph with remote caching | Monorepo CI time is the bottleneck | 200 (redirect) |
| cosign | https://github.com/sigstore/cosign | Sign and verify artifacts | The pipeline must produce verifiable provenance | 200 |

### container-images-and-oci

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OCI image-spec | https://github.com/opencontainers/image-spec | Manifests, layers, digests | Understanding why a tag is mutable and a digest is not | 200 |
| BuildKit | https://docs.docker.com/build/buildkit/ | Modern build engine, cache mounts | Build speed, or build secrets that must not leak into layers | 200 |
| distroless | https://github.com/GoogleContainerTools/distroless | Minimal base images | Reducing attack surface; accept that debugging gets harder | 200 |
| Kaniko | https://github.com/GoogleContainerTools/kaniko | Build images without a Docker daemon | Building inside a cluster without privileged containers | 200 |
| Syft + cosign | https://github.com/anchore/syft | SBOM generation, then signing | Supply-chain requirements, SLSA attestations | 200 |
| dive | https://github.com/wagoodman/dive | Inspect layers and wasted bytes | Explaining why the image is enormous | 200 |

### gitops-and-argocd

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Argo CD | https://argo-cd.readthedocs.io/en/stable/ | Pull-based reconciliation of manifests | The most-asked-about GitOps tool | 200 |
| Flux | https://fluxcd.io/flux/ | Toolkit-style GitOps controllers | You want composable controllers over one application UI | 200 |
| Kustomize | https://kubectl.docs.kubernetes.io/references/kustomize/ | Environment overlays without templating | Per-environment differences are patches, not variables | 200 |
| Helm | https://helm.sh/docs/ | Packaged, parameterised releases | You are consuming third-party charts | 200 |
| SOPS | https://github.com/getsops/sops | Encrypted secrets committed to git | GitOps needs secrets in git without exposing them | 200 |

Note: worth naming the real operational traps — a permanently OutOfSync
resource caused by a server-defaulted field, and sync waves/hooks blocking a
deploy. Those are what GitOps debugging actually looks like.

### helm-and-templating

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Helm docs | https://helm.sh/docs/ | Charts, values, hooks, `--dry-run` | The standard, and `template --debug` is the debugging tool | 200 |
| Kustomize | https://kubectl.docs.kubernetes.io/references/kustomize/ | Patch-based configuration | Templating logic has become unreadable — patch instead | 200 |
| Helm `values.schema.json` | https://helm.sh/docs/ | Validate values at install time | A typo'd value should fail fast, not deploy silently wrong | 200 |
| Kyverno | https://kyverno.io/docs/introduction/ | Validate the rendered result | Templates can render valid YAML that violates policy | 200 (redirect) |

Note: the trap worth teaching is that a chart packaged before its source edit
silently ships stale content — parity checks that compare packaged artifacts to
each other cannot catch it.

### observability-with-opentelemetry

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| OpenTelemetry JS | https://opentelemetry.io/docs/languages/js/ | `@opentelemetry/sdk-node` auto-instrumentation | Node services — start with auto-instrumentation, add spans after | 200 |
| OTel Collector | https://opentelemetry.io/docs/collector/ | Pipelines for sampling, redaction, routing | Sampling and PII handling belong outside the app | 200 |
| Semantic conventions | https://opentelemetry.io/docs/concepts/semantic-conventions/ | Standard attribute names | Dashboards must survive changing backends | 200 |
| Grafana Tempo | https://grafana.com/docs/tempo/latest/ | Cheap trace storage on object stores | High volume, and search-by-trace-ID is enough | 200 |
| Prometheus | https://prometheus.io/docs/introduction/overview/ | The metrics half, via OTLP or scrape | Metrics still carry the alerting load | 200 (redirect) |

Note: tail sampling in the Collector is the answer to "we cannot afford 100% of
traces". Head sampling throws away the errors you needed.

### platform-engineering

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Backstage | https://backstage.io/docs/overview/what-is-backstage/ | Developer portal, catalogue, templates | You need service ownership and scaffolding in one place | 200 (redirect) |
| Crossplane | https://docs.crossplane.io/latest/ | Cloud resources as K8s APIs | The platform API should be the Kubernetes API | 200 |
| Port | https://docs.port.io/ | Managed developer portal | You want the portal without operating Backstage | 200 (redirect) |
| Terraform | https://developer.hashicorp.com/terraform/docs | The provisioning layer beneath the platform | Golden paths still have to create real infrastructure | 200 |
| Argo CD | https://argo-cd.readthedocs.io/en/stable/ | Delivery mechanism for platform-managed apps | Self-service must land somewhere it deploys | 200 |

Note: the point is a *product* with users and golden paths, not a tool list.
Say that explicitly or this table becomes exactly the anti-pattern it describes.

### progressive-delivery

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Argo Rollouts | https://argo-rollouts.readthedocs.io/en/stable/ | Canary and blue-green with analysis | Automated promotion or rollback based on metrics | 200 |
| Flagger | https://docs.flagger.app/ | Progressive delivery with mesh/ingress | You are on Flux, or want mesh-driven traffic shifting | 200 |
| OpenFeature | https://openfeature.dev/docs/reference/intro/ | Vendor-neutral feature-flag SDK | Decoupling release from deploy without vendor lock-in | 200 (redirect) |
| Unleash | https://docs.getunleash.io/ | Self-hostable feature flag service | You need a flag backend you control | 200 |
| Prometheus | https://prometheus.io/docs/introduction/overview/ | The metrics the analysis gates on | A canary with no failure metric is just a slow deploy | 200 (redirect) |

Note: canary and feature flags solve different halves — traffic shifting moves
requests, flags move *behaviour*. Both need a defined failure metric.

### sre-slos-and-error-budgets

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Google SRE Book | https://sre.google/sre-book/table-of-contents/ | SLI/SLO/error-budget definitions | The source — this is what interviewers are quoting | 200 |
| SRE Workbook | https://sre.google/workbook/table-of-contents/ | Practical SLO implementation | You need to actually pick an SLI and a window | 200 |
| Sloth | https://sloth.dev/ | Generate Prometheus SLO rules and alerts | Multi-window multi-burn-rate alerts are easy to get wrong | 200 |
| OpenSLO | https://openslo.com/ | Vendor-neutral SLO specification | SLOs should be reviewable code, not dashboard config | 200 |
| Prometheus Alertmanager | https://prometheus.io/docs/alerting/latest/alertmanager/ | Route and inhibit burn-rate alerts | Turning burn rate into a page that is worth waking for | 200 |

Note: burn-rate alerting on a *ratio* is the key technique — alerting on raw
error count produces noise at low traffic and silence at high traffic.

### terraform-and-iac-patterns

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| Terraform language docs | https://developer.hashicorp.com/terraform/language | Modules, state, `for_each`, moved blocks | Refactoring without destroying resources | 200 |
| OpenTofu | https://opentofu.org/docs/ | MPL-licensed fork | The BUSL licence is a blocker | 200 |
| Terragrunt | https://docs.terragrunt.com/getting-started/quick-start/ | DRY multi-environment wrapper | Root-module duplication across many environments | 200 (redirect) |
| Trivy (misconfig) | https://trivy.dev/ | Scan IaC for insecure defaults | Catching a public S3 bucket in review, not in production | 200 |
| Crossplane | https://docs.crossplane.io/latest/ | Reconciled-by-controller alternative | You want continuous reconciliation, not run-on-demand plans | 200 |

Note: `count` vs `for_each` and the resulting index-shift destruction is the
single most valuable practical lesson in this topic.

### load-and-performance-testing

| Tool | URL | What it's for | Reach for it when | Checked |
|---|---|---|---|---|
| k6 | https://grafana.com/docs/k6/latest/ | Scripted load tests in JS with thresholds | Node/TS teams — scenarios are JavaScript, and thresholds gate CI | 200 |
| autocannon | https://github.com/mcollina/autocannon | Fast single-endpoint HTTP benchmarking | A quick throughput number, no scripting | 200 |
| Vegeta | https://github.com/tsenart/vegeta | Constant-rate attack with latency histograms | You need a fixed request *rate*, not fixed concurrency | 200 |
| Gatling | https://docs.gatling.io/ | Scenario-based load testing with reports | You need rich HTML reports and complex user journeys | 200 (redirect) |
| Locust | https://docs.locust.io/en/stable/ | Python-scripted distributed load | Python shop, or you need distributed workers easily | 200 |
| JMeter | https://jmeter.apache.org/usermanual/index.html | The long-standing enterprise standard | An organisation already standardised on it | 200 |

Note: the crucial distinction is open vs closed workload models — fixed
concurrency (closed) hides queueing that a fixed arrival rate (open) exposes.
`wrk2` (https://github.com/giltene/wrk2, 200) exists specifically because of
coordinated omission; worth a mention in the topic prose.

---

## Topics deliberately given no tools

| Topic | Reason |
|---|---|
| `04-networking/osi-model` | A conceptual layering model. Any tool table here duplicates `network-performance` and implies you can install a layer. |
| `05-databases/cap-theorem` | A theorem about trade-offs. Listing databases duplicates `relational-vs-nosql` and `cap-and-tradeoffs-in-practice`. Jepsen is the only defensible single link. |
| All of `01-cs-fundamentals` | Per brief: tools genuinely do not apply. |
| All of `02-data-structures` | Per brief. Data structures are implemented, not installed. |
| All of `03-algorithms` | Per brief. |
| All of `10-interview-skills` | Per brief. |
| All of `13-behavioral-and-hr` | Per brief. |
| All of `14-situational-and-leadership` | Per brief. |
| All of `15-how-to-answer` | Per brief. |

Additionally, several covered topics are noted above as **legitimately thin**
(3-4 rows): `attention-and-transformers`, `gpu-memory-math`,
`streams-and-buffers`, `v8-engine-and-garbage-collection`,
`workload-identity-and-spiffe`, `api-versioning`. Do not pad these.

## Deprecated / maintenance-mode findings

| Thing a reader might reach for | Status | Use instead |
|---|---|---|
| **HuggingFace TGI** | Maintenance mode from 11 Dec 2025; repository **archived (read-only) 21 Mar 2026** | vLLM or SGLang. HuggingFace's own Inference Endpoints docs now recommend vLLM/SGLang. Keep TGI as history in `inference-servers-vllm-and-tgi` — that topic's *title* names it and must be reframed in past tense. |
| **Jaeger v1 + Jaeger client libraries** | Jaeger v1 end-of-life 31 Dec 2025; clients deprecated. Jaeger v2 is an OTel Collector distribution | Instrument with OpenTelemetry SDKs; run Jaeger v2 as the backend. |
| **OpenTracing** | Superseded, merged into OpenTelemetry | OpenTelemetry. |
| **OTel Zipkin exporter** | Spec deprecated Dec 2025; patches only until at least Dec 2026 | OTLP exporters. |
| **`expressjs/csurf`** | Repository archived 14 May 2025, no replacement named by maintainers | `csrf-csrf` (Express) or `@fastify/csrf-protection` (Fastify). |
| **EventStoreDB** | Renamed to **Kurrent**; `eventstore.com` redirects | Use the Kurrent name and `docs.kurrent.io`. |
| **`grafana/xk6-disruptor`** | Repository moved to `grafana-cold-storage/` — signals end of maintenance | Chaos Mesh or LitmusChaos. |
| **PodSecurityPolicy** | Removed in Kubernetes v1.25 | Pod Security Admission / Pod Security Standards, plus Kyverno or Gatekeeper. |
| **`bitnami-labs/sealed-secrets`** | Redirects to `bitnami/sealed-secrets` | Link the `bitnami/` path. |
| **`casbin/node-casbin`** | Moved to the Apache org | `github.com/apache/casbin-node-casbin`. |
| **`js.langchain.com`** | Redirects into `docs.langchain.com/oss/javascript/` | Link the new host; the old one will keep working but is not canonical. |
| **`getambassador.io`** | Redirects to Gravitee documentation — project identity in flux | Avoid in tables; use Envoy, Kong, Traefik or a Gateway API implementation. |
| **`kratix.io/docs`** | 404 at time of check | Dropped from `platform-engineering`; used Backstage, Crossplane, Port instead. |
| **ingress-nginx** | Announced as heading for retirement in favour of Gateway API implementations | Still the most-deployed controller, so keep it in `ingress-and-gateway-api`, but frame as "dominant today, plan migration to Gateway API". |
| **`docs.timescale.com`** | Rebranded — redirects to `tigerdata.com/docs` | Use the TigerData URL, mention the TimescaleDB name since that is what interviews say. |
| **Elasticsearch licensing** | Relicensed from Apache-2.0 in 2021 (prompting the OpenSearch fork), AGPL added as an option in 2024 | Mention the fork exists; do not give current licensing advice in a study note. |
| **NVIDIA NeMo Guardrails repo** | Moved to `NVIDIA-NeMo/Guardrails` | Link the new path or the docs site. |
| **`google/vertex-ai` docs** | `cloud.google.com/vertex-ai/docs` now redirects into a "Gemini Enterprise Agent Platform" path | Avoided entirely — the URL is unstable. Used Bedrock and Azure AI Foundry where a managed-cloud row was needed. |

## Recurring tools

Use these exact names and URLs everywhere they appear, so the same tool is never
linked three different ways.

| Canonical name | Canonical URL | Appears in |
|---|---|---|
| PostgreSQL | https://www.postgresql.org/docs/current/ | 12 topics across 05, 07, 11 |
| Redis | https://redis.io/docs/latest/ | 10 topics across 05, 06, 07, 11 |
| Kafka | https://kafka.apache.org/documentation/ | 8 topics across 06, 09, 11 |
| Kubernetes docs (home) | https://kubernetes.io/docs/home/ | 09, and per-concept paths throughout 18 |
| OpenTelemetry JS | https://opentelemetry.io/docs/languages/js/ | 06, 07, 09, 19 |
| Prometheus | https://prometheus.io/docs/introduction/overview/ | 05, 07, 09, 17, 19 |
| Grafana | https://grafana.com/docs/grafana/latest/ | 07, 09, 17 |
| k6 | https://grafana.com/docs/k6/latest/ | 04, 07, 16, 19 |
| OpenSSL | https://docs.openssl.org/ | 04 (×2), 16 (×4) |
| Wireshark | https://www.wireshark.org/docs/ | 04 (×3), 16 (×2) |
| cert-manager | https://cert-manager.io/docs/ | 04, 16 (×3), 18 |
| Envoy | https://www.envoyproxy.io/docs/envoy/latest/ | 04 (×2), 06, 07, 16 |
| NGINX | https://nginx.org/en/docs/ | 04 (×2), 07, 16 |
| Helm | https://helm.sh/docs/ | 09, 18 (×2), 19 (×2) |
| Argo CD | https://argo-cd.readthedocs.io/en/stable/ | 09, 19 (×3) |
| Terraform | https://developer.hashicorp.com/terraform/docs | 09, 19 (×2) — language docs at /terraform/language for `terraform-and-iac-patterns` |
| HashiCorp Vault | https://developer.hashicorp.com/vault/docs | 09, 16 (×3) — PKI path at /vault/docs/secrets/pki |
| Trivy | https://trivy.dev/ | 09, 16, 19 (×2) |
| Zod | https://zod.dev/ | 07, 08 (×2), 12 (×2) |
| vLLM | https://docs.vllm.ai/en/latest/ | 12 (×2), 17 (×7) |
| tiktoken | https://github.com/openai/tiktoken | 12 (×4) — JS port at github.com/dqbd/tiktoken |
| Langfuse | https://langfuse.com/docs | 12 (×2), 17 |
| LangChain (JS) | https://docs.langchain.com/oss/javascript/langchain/overview | 12 (×2) — LangGraph at /oss/javascript/langgraph/overview |
| Vercel AI SDK | https://ai-sdk.dev/docs/introduction | 12 (×3) |
| pgvector | https://github.com/pgvector/pgvector | 12 (×2) |
| Qdrant | https://qdrant.tech/documentation/ | 12 (×2) |
| promptfoo | https://www.promptfoo.dev/docs/intro/ | 12 (×2) |
| Ollama | https://docs.ollama.com/ | 12 (×3), 17 |
| Cassandra | https://cassandra.apache.org/doc/latest/ | 05 (×3), 06 (×2), 07, 11 (×2) |
| CockroachDB | https://docs.cockroachlabs.com/docs/ | 05 (×2), 06, 07 (×2) |
| MongoDB | https://www.mongodb.com/docs/ | 05 (×4), 06, 07 |
| Kyverno | https://kyverno.io/docs/introduction/ | 07, 16, 18, 19 |
| Istio | https://istio.io/latest/docs/ | 04, 06, 16 (×2), 18 — ambient at /latest/docs/ambient/, security at /latest/docs/concepts/security/ |
| SPIFFE / SPIRE | https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/ and https://github.com/spiffe/spire | 06, 16 (×3) |
| KEDA | https://keda.sh/docs/2.20/ | 17, 18 |
| Karpenter | https://karpenter.sh/docs/ | 17, 18 |
| Gateway API | https://gateway-api.sigs.k8s.io/ | 16, 18 (×3) |
| OWASP Cheat Sheets | https://cheatsheetseries.owasp.org/ | 08, 09, 16 |
| p-retry | https://github.com/sindresorhus/p-retry | 06, 07, 08 |
| opossum | https://nodeshift.dev/opossum/ | 06, 07 |
| autocannon | https://github.com/mcollina/autocannon | 04, 07, 08, 19 |
