---
title: Bit Manipulation
slug: bit-manipulation
summary: AND, OR, XOR, Shifts
tags: [fundamentals, javascript, algorithms]
links:
  - title: MDN — Bitwise operators
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_operators"
    kind: resource
  - title: Wikipedia — Bitwise operation
    url: "https://en.wikipedia.org/wiki/Bitwise_operation"
    kind: resource
---
## In one sentence

**Bit manipulation** means working directly with the individual 0s and 1s (bits) that make up a number, instead of treating the number as a whole.

## Why it matters

Computers store everything as bits, so bit operations are the fastest thing a CPU can do — often a single instruction. Bit tricks let you pack multiple flags into one number and check or set specific options efficiently, and they solve certain interview problems in far less memory than the obvious approach.

## The idea

Every integer is stored as a sequence of bits. The number 5 is `101` in binary: one 4, no 2s, one 1 (4 + 0 + 1 = 5). Bitwise operators combine or inspect these bits directly.

`AND` (`&`) keeps a bit only if it's 1 in *both* numbers — useful for checking if a specific bit is set. `OR` (`|`) keeps a bit if it's 1 in *either* number — useful for turning a flag on. `XOR` (`^`) keeps a bit only if the two numbers *disagree* — useful for toggling a flag, since a number XORed with itself is always 0.

Shifting moves bits left or right. `<<` shifts bits left, filling with zeros, which multiplies by 2 per position shifted. `>>` does the reverse, dividing by 2. It's like sliding decimal digits: shifting `12` left by one digit gives `120`, multiplying by 10 — bit shifts do the same in base 2.

A common real use is a **bitmask**: instead of ten separate boolean variables, you use one number where each bit is an on/off setting, checked and changed with `AND`, `OR`, and shifts.

## In practice

```js
const READ = 1 << 0;   // 001
const WRITE = 1 << 1;  // 010
const EXECUTE = 1 << 2; // 100

let permissions = READ | WRITE;             // turn on READ and WRITE: 011

console.log((permissions & WRITE) !== 0);   // true: WRITE bit is set
console.log((permissions & EXECUTE) !== 0); // false: EXECUTE bit not set

permissions ^= WRITE;                       // toggle WRITE off: 001
console.log(permissions.toString(2));       // '1' - READ only
```

This shows a bitmask storing three independent permission flags in one number, checked with `&` and toggled with `^`.

## Quick reference

| Operator | Symbol | Effect | Common use |
|---|---|---|---|
| AND | `&` | 1 only if both bits are 1 | Check if a bit is set |
| OR | `\|` | 1 if either bit is 1 | Turn a flag on |
| XOR | `^` | 1 if bits differ | Toggle a flag, find differences |
| NOT | `~` | Flips every bit | Invert a mask |
| Left shift | `<<` | Shifts left, fills with 0 | Multiply by 2ⁿ |
| Right shift | `>>` | Shifts right | Divide by 2ⁿ |

## What interviewers ask

- **How would you check if a number is even or odd using bits?** — Check the last bit with `n & 1`: 0 means even, 1 means odd, since only the last bit determines whether a binary number is a multiple of 2.
- **How do you find the number that appears once in an array where every other number appears twice?** — XOR every element together; since `x ^ x = 0` and `x ^ 0 = x`, all pairs cancel and only the unique number remains, giving O(n) time and O(1) space.
- **What does `n & (n - 1)` do?** — It clears the lowest set bit of `n`, useful for counting set bits or checking if a number is a power of two, since a power of two has exactly one set bit.

## Common mistakes

- Confusing logical operators (`&&`, `\|\|`) with bitwise operators (`&`, `\|`) — logical operators work on true/false, bitwise ones work on individual bits, and mixing them gives silently wrong results.
- Forgetting that JavaScript converts numbers to 32-bit integers before a bitwise operation, so bit tricks behave unexpectedly on very large numbers or floats.
