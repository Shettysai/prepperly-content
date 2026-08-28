---
title: Number Theory
slug: number-theory
summary: Primes, Modulo arithmetic
tags: [fundamentals, algorithms, complexity]
links:
  - title: MDN — Remainder operator
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder"
    kind: resource
  - title: Wikipedia — Number theory
    url: "https://en.wikipedia.org/wiki/Number_theory"
    kind: resource
---
## In one sentence

**Number theory** is the study of whole numbers and the relationships between them, especially division, remainders, and prime numbers.

## Why it matters

It sounds academic, but number theory quietly powers things you use daily: hash tables use remainders to spread data evenly, cryptography (the math behind HTTPS) relies on prime numbers, and many interview problems reduce to "find the pattern in how these numbers divide."

## The idea

A **prime number** is a whole number greater than 1 with no divisors other than 1 and itself — 7 is prime because nothing else divides it evenly, but 8 is not, since 2 and 4 also divide it. Primes matter because every whole number can be built by multiplying primes together in exactly one way, the foundation for a lot of cryptography.

**Modulo arithmetic** (the `%` operator) gives the remainder after division. `10 % 3` is `1`, because 3 goes into 10 three times with 1 left over. This shows up constantly: checking if a number is even (`n % 2 === 0`), wrapping an index around an array (`i % arr.length`), or spreading data evenly across buckets in a hash table.

Think of modulo like a clock face: a 12-hour clock wraps around after 12, so 13 o'clock is really 1 o'clock — that's `13 % 12 = 1`. Anything that needs to cycle back to the start uses this idea.

**Greatest common divisor (GCD)** is the largest number dividing two numbers evenly — useful for simplifying fractions or finding the largest equal groups two quantities split into. The **Euclidean algorithm** computes it by repeatedly replacing the larger number with the remainder of dividing it by the smaller, until the remainder is 0.

## In practice

```js
// Modulo: check even/odd and wrap an index around an array
function isEven(n) {
  return n % 2 === 0;
}

function wrapIndex(i, length) {
  return ((i % length) + length) % length; // handles negative i too
}

// Euclidean algorithm: greatest common divisor
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b]; // replace (a, b) with (b, remainder)
  }
  return a;
}

console.log(gcd(48, 18)); // 6
```

`gcd` keeps taking remainders until nothing is left — the last non-zero remainder is the answer, finding two numbers' largest shared factor without checking every possibility.

## Quick reference

| Concept | Meaning | Example |
|---|---|---|
| Prime number | Divisible only by 1 and itself | 2, 3, 5, 7, 11 |
| Modulo (`%`) | Remainder after division | `17 % 5 = 2` |
| GCD | Largest number dividing both evenly | `gcd(12, 18) = 6` |
| Even/odd check | Uses modulo by 2 | `n % 2 === 0` means even |

## What interviewers ask

- **How would you check if a number is prime?** — Try dividing it by every number from 2 up to its square root; if none divide evenly, it's prime, since any larger factor would have a matching smaller factor you'd already have found.
- **Why do hash tables use the modulo operator?** — To map a huge or unevenly distributed set of hash values into a fixed number of buckets, `hash % numberOfBuckets` gives an index guaranteed to fall within the array's bounds.
- **How does the Euclidean algorithm find the GCD faster than checking every divisor?** — It repeatedly replaces the pair with the smaller number and their remainder, shrinking the numbers quickly each step, giving logarithmic time instead of checking every number up to the smaller value.

## Common mistakes

- Forgetting `%` in JavaScript can return a negative result for negative inputs (`-1 % 5` is `-1`, not `4`), which breaks naive array-index wrapping — fix with `((i % n) + n) % n`.
- Checking primality by testing all numbers up to `n` instead of up to the square root of `n`, doing far more work than necessary.
