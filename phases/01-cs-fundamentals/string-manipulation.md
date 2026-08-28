---
title: String Manipulation
slug: string-manipulation
summary: Encodings, ASCII/Unicode
tags: [fundamentals, javascript]
links:
  - title: MDN — String reference
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"
    kind: resource
  - title: Wikipedia — UTF-8
    url: "https://en.wikipedia.org/wiki/UTF-8"
    kind: resource
---
## In one sentence

**String manipulation** is reading, changing, and analyzing text data — the sequences of characters that make up names, messages, file contents, and nearly everything a user types.

## Why it matters

Almost every application deals with text: validating an email, searching for a word, formatting a name, parsing a log file. Strings look simple, but they hide real complexity around how characters are stored and compared, and interviewers use string problems constantly because they reveal whether you think carefully about edge cases.

## The idea

A string is a sequence of characters, but "character" is trickier than it looks. Computers store text as numbers, using an **encoding** — a system that maps numbers to characters. **ASCII** was an early encoding covering just 128 characters (English letters, digits, basic punctuation), using one byte per character. It couldn't represent accented letters, emoji, or other languages' scripts.

**Unicode** replaced this by assigning a unique number (called a code point) to every character in essentially every writing system, plus emoji and symbols. **UTF-8** is the most common way to actually store Unicode code points as bytes — it uses 1 byte for basic English characters (staying compatible with ASCII) but up to 4 bytes for characters like emoji, which is why a string with emoji can take up more storage than its visible character count suggests.

This matters practically: JavaScript strings are sequences of UTF-16 code units, and some characters (like many emoji) are represented by *two* code units, not one. This means `'😀'.length` returns `2`, not `1`, which surprises almost everyone the first time they hit it — a naive loop over `.length` can split an emoji in half.

Common string operations you'll use constantly include searching (`.includes()`, `.indexOf()`), splitting and joining (`.split()`, `.join()`), and case/whitespace normalization (`.toLowerCase()`, `.trim()`) — these form the toolkit for almost every text-processing task.

## In practice

```js
const email = '  User@Example.com  ';

// Normalize before comparing: trim whitespace, lowercase for case-insensitive match
const normalized = email.trim().toLowerCase();
console.log(normalized); // 'user@example.com'

// Reversing a string, character by character
function reverse(str) {
  return str.split('').reverse().join('');
}
console.log(reverse('hello')); // 'olleh'

// Careful: emoji can be 2 UTF-16 code units, so naive length/reverse can break them
console.log('😀'.length); // 2, not 1
```

Normalizing a string before comparing it (trimming whitespace, matching case) is one of the most common real-world string tasks, and the emoji example shows why `.length` isn't always "number of visible characters."

## Quick reference

| Method | What it does | Example |
|---|---|---|
| `.includes()` | Checks if a substring exists | `'hello'.includes('ell')` → true |
| `.split(sep)` | Breaks a string into an array | `'a,b,c'.split(',')` → `['a','b','c']` |
| `.trim()` | Removes leading/trailing whitespace | `'  hi  '.trim()` → `'hi'` |
| `.toLowerCase()` | Converts to lowercase | `'ABC'.toLowerCase()` → `'abc'` |
| `.padStart(n, ch)` | Pads to length `n` from the left | `'5'.padStart(2,'0')` → `'05'` |

## What interviewers ask

- **How would you check if two strings are anagrams of each other?** — Sort the characters of both strings and compare the results, or count character frequencies in both and compare the counts; the second approach is O(n) versus O(n log n) for sorting, which is worth mentioning as a follow-up optimization.
- **Why might `'😀'.length` not equal 1 in JavaScript?** — JavaScript strings are UTF-16 encoded, and some characters (including many emoji) require two 16-bit code units to represent, so `.length` counts code units, not visible characters.
- **How would you reverse a string efficiently?** — Convert it to an array of characters with `.split('')`, reverse the array, then join it back — but flag that this can break apart multi-code-unit characters like emoji, and mention `Array.from(str)` as a safer split for those cases.

## Common mistakes

- Comparing strings without normalizing case or whitespace first, causing `'Test' === 'test '` to fail when the intent was to treat them as the same value.
- Assuming `.length` equals the number of visible characters — it's actually the number of UTF-16 code units, which differs for emoji and some other characters outside the basic range.
