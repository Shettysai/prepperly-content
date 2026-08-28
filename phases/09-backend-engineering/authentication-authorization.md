---
title: Authentication & Authorization
slug: authentication-authorization
summary: OAuth 2.0, JWT, Sessions
tags: [security, api-design, nodejs]
links:
  - title: MDN — HTTP authentication
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication"
    kind: resource
  - title: Wikipedia — OAuth
    url: "https://en.wikipedia.org/wiki/OAuth"
    kind: resource
  - title: Wikipedia — JSON Web Token
    url: "https://en.wikipedia.org/wiki/JSON_Web_Token"
    kind: resource
---
## In one sentence

**Authentication** is proving who you are (like showing an ID card), and **authorization** is deciding what you're allowed to do once you're known (like a keycard that only opens certain doors).

## Why it matters

Without authentication, anyone could pretend to be anyone else. Without authorization, every logged-in user could see or change everything — a regular user could delete another user's account. Almost every real app needs both, and mixing them up is one of the most common security bugs.

## The idea

Authentication (often shortened to "auth" or "authN") happens first: the user proves their identity, usually with a password, a code sent to their phone, or a token from a trusted provider like Google. The server checks this and, if it matches, issues a **session** or a **token** so the user doesn't have to log in on every request.

Authorization ("authZ") happens after: now that the server knows who you are, it checks what you're permitted to do. This is usually based on a **role** (admin, editor, viewer) or specific **permissions** attached to your account.

Two common ways to keep someone "logged in" between requests are sessions and JWTs. A **session** stores a small ID in a cookie, and the server looks up who that ID belongs to in a database. A **JWT** (JSON Web Token) packs identity directly into a signed token the server can verify without a database lookup — but it can't easily be revoked before it expires.

**OAuth 2.0** is a standard that lets you log in via another service ("Sign in with Google") without giving your password to the app you're logging into.

## In practice

```js
// A tiny JWT-style payload and a simple authorization check.
// (In a real app you'd use a library like jsonwebtoken to sign/verify.)

const tokenPayload = {
  sub: "user_42",       // "subject" — who this token identifies
  role: "editor",        // used for authorization decisions
  exp: Math.floor(Date.now() / 1000) + 3600 // expires in 1 hour
};

function canDeletePost(user) {
  // Authorization: authentication already happened before this point
  return user.role === "admin" || user.role === "editor";
}

console.log(canDeletePost({ role: "editor" })); // true
console.log(canDeletePost({ role: "viewer" })); // false
```

The token proves identity; the `canDeletePost` check is a separate authorization step that runs after the identity is known.

## Quick reference

| Concept | Answers | Example |
|---|---|---|
| Authentication | "Who are you?" | Password login, "Sign in with Google" |
| Authorization | "What can you do?" | Role checks, permission lists |
| Session | Server remembers you via a stored ID | Cookie + server-side session store |
| JWT | You carry proof of identity with you | Signed token in an `Authorization` header |
| OAuth 2.0 | Delegated login via a trusted provider | "Continue with Google/GitHub" |

## What interviewers ask

- **What's the difference between authentication and authorization?** — Authentication verifies identity; authorization decides permissions for that identity. They ask this to check you don't conflate them in code reviews.
- **How would you invalidate a JWT before it expires?** — You generally can't without extra state (a blocklist or short expiry plus refresh tokens), which is the trade-off versus sessions.
- **Where should you store a JWT on the client, and why?** — Prefer an `httpOnly` cookie over `localStorage` to reduce exposure to XSS attacks stealing the token via JavaScript.

## Common mistakes

- Treating "the user is logged in" as enough — always check authorization separately for the specific action being performed.
- Storing tokens in `localStorage`, which any injected JavaScript can read; an `httpOnly` cookie is safer against XSS.
- Putting sensitive data (like passwords or secrets) inside a JWT payload — it's signed, not encrypted, so anyone can decode and read it.
