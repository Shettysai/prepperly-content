---
title: Security best practices
slug: security-best-practices
summary: OWASP, Helmet, Rate limiting
tags: [nodejs, security]
links:
  - title: OWASP — Top 10 web application security risks
    url: "https://owasp.org/www-project-top-ten/"
    kind: resource
  - title: Node.js docs — Security best practices
    url: "https://nodejs.org/en/learn/getting-started/security-best-practices"
    kind: resource
---
## In one sentence

**Security best practices** in a Node.js app are the routine defenses — validating input, hashing passwords, setting safe HTTP headers, limiting request rates — that stop the most common, well-known attacks before they become a breach.

## Why it matters

Most real-world breaches don't come from exotic zero-day exploits; they come from skipping basic, well-documented protections — an unvalidated input, a plaintext password, a missing rate limit. The **OWASP Top 10** catalogs the most common web app vulnerabilities precisely because the same handful of mistakes keep causing damage across the industry.

## The idea

Think of these practices like locking your doors and windows rather than installing a vault — most attackers aren't targeting you specifically, they're scanning for the easiest unlocked door. A few defenses cover most of that surface.

**Input validation** means never trusting data from the client until you've checked its shape and type, because that's the entry point for injection attacks (like SQL injection, sneaking database commands into a text field). **Never store passwords in plaintext**; hash them with a slow, purpose-built algorithm like **bcrypt**, so a leaked database doesn't expose real passwords. **Rate limiting** caps how many requests a client can make in a time window, defending against brute-force login attempts and basic denial-of-service abuse. **Helmet** is an Express middleware that sets several security HTTP headers that are easy to forget individually but come as sane defaults together.

The common thread: assume every input is hostile until proven otherwise, and never store a secret in a form that's useful if stolen.

## In practice

A minimal Express setup showing three of these defenses together:

```js
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');

const app = express();
app.use(helmet()); // sets safe security headers automatically

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }); // 5 tries per 15 min

app.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' }); // reject malformed input early
  }

  const user = await findUser(username);
  // compare against the HASH, never a stored plaintext password
  const valid = user && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ token: 'issued-here' });
});
```

Each line does one job from the list above: `helmet()` handles headers, `loginLimiter` throttles brute force, the type check rejects bad input, and `bcrypt.compare` means the real password is never stored anywhere.

## Quick reference

| Threat | Defense |
|---|---|
| SQL/NoSQL injection | Validate and sanitize input; use parameterized queries, never string-concatenated ones |
| Stolen password database | Hash passwords with bcrypt/argon2, never store plaintext |
| Brute-force login attempts | Rate limiting on auth endpoints |
| Cross-site scripting (XSS) | Escape output, set a Content-Security-Policy header (Helmet does this) |
| Man-in-the-middle | Enforce HTTPS everywhere, use HSTS headers |
| Dependency vulnerabilities | Run `npm audit` and keep dependencies updated |

## What interviewers ask

- **Why hash passwords instead of encrypting them?** — Encryption is reversible with the right key, meaning anyone who steals both the encrypted data and the key gets the plaintext back; hashing with bcrypt is one-way and deliberately slow, so even a stolen database of hashes is expensive to crack, and you never need to "decrypt" a password anyway since you only ever compare.
- **What is SQL injection and how do you prevent it?** — It's when untrusted input is inserted directly into a query string, letting an attacker inject their own SQL logic (like `' OR '1'='1`) to bypass checks or exfiltrate data; the fix is parameterized queries or an ORM that separates query structure from data, never building queries with string concatenation.
- **What does rate limiting actually protect against?** — Brute-force attacks (guessing passwords repeatedly) and basic abuse/denial-of-service from a single source, by capping how many requests an IP or account can make in a time window before being temporarily blocked.
- **Why use Helmet instead of setting headers yourself?** — It bundles multiple well-researched security headers (like `X-Content-Type-Options`, `Content-Security-Policy` basics, disabling `X-Powered-By`) with safe defaults, so you don't have to remember and correctly configure each one individually — and it gets updated as new best practices emerge.

## Common mistakes

- Trusting `req.body` or `req.query` without validating type and shape, opening the door to injection or crashes from malformed input.
- Storing passwords with fast, general-purpose hashes like plain SHA-256 instead of bcrypt, making brute-forcing a stolen hash database far easier.
- Leaving error messages verbose in production (like a full stack trace), which hands attackers information about your internals.
