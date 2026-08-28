---
title: Tries
slug: tries
summary: Prefix trees, Autocomplete implementation
tags: [data-structures, trees, algorithms, complexity]
links:
  - title: Wikipedia — Trie
    url: "https://en.wikipedia.org/wiki/Trie"
    kind: resource
  - title: MDN — Object reference
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object"
    kind: resource
---
## In one sentence

A **trie** (pronounced "try," short for retrieval) is a tree built specifically for storing words, where each step down the tree consumes one character, so all words sharing the same prefix share the same path from the root.

## Why it matters

Tries are what make autocomplete and spell-check feel instant: instead of comparing your typed text against every word in a dictionary, a trie lets you follow one character at a time and immediately know which words are even still possible. This turns "find all words starting with 'cat'" from a full scan into a direct walk of a few nodes.

## The idea

Think of a trie like a directory tree for words: to store "cat" and "car," you'd have a shared path `c -> a`, then it splits into `t` (finishing "cat") and `r` (finishing "car"). Every word that starts with "ca" passes through those same first two nodes, which is exactly why prefix lookups are so cheap — you don't search for a prefix, you just walk directly to it.

Each node in a trie represents one character and holds a set of children (one possible child per letter of the alphabet), plus a flag marking whether a complete word ends at that node — this flag matters because "car" being a word doesn't mean "ca" is also a word, even though "ca" is a valid path through the trie.

Inserting a word means walking from the root, creating any child nodes that don't exist yet for each character, and marking the final node as "end of word." Searching for a whole word follows the same path and checks that end-of-word flag at the last character. Searching for a prefix follows the same path but skips checking that flag — you only care that the path exists, not that a word terminates there.

## In practice

```js
class TrieNode {
  constructor() { this.children = {}; this.isEndOfWord = false; }
}

class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char]; // walk down, creating nodes as needed
    }
    node.isEndOfWord = true;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return true; // path exists, regardless of whether a word ends here
  }
}

const trie = new Trie();
trie.insert('cat');
trie.insert('car');
console.log(trie.startsWith('ca'));  // true
console.log(trie.startsWith('cow')); // false
```

`startsWith` only checks that the path of characters exists, which is why it answers prefix questions without scanning every stored word.

## Quick reference

| Operation | Time complexity (word/prefix length L) |
|---|---|
| Insert a word | O(L) |
| Search for a whole word | O(L) |
| Search for a prefix | O(L) |
| Space (n words, average length L) | O(n × L) worst case, less with shared prefixes |

| Structure | Best for |
|---|---|
| Trie | Prefix search, autocomplete, spell-check |
| Hash set | Exact word lookup only, no prefix support |
| Sorted array | Prefix search via binary search, but slower inserts |

## What interviewers ask

- **Why use a trie instead of a hash set for autocomplete?** — A hash set can tell you instantly whether an exact word exists, but it can't efficiently answer "give me all words starting with this prefix" without scanning every entry. A trie answers that by walking directly to the prefix's node and exploring everything beneath it.
- **How would you implement autocomplete suggestions using a trie?** — Walk the trie to the node representing the typed prefix, then perform a DFS from that node collecting every path that reaches an end-of-word flag, reconstructing each word along the way.
- **What's the space trade-off of a trie?** — Words sharing prefixes share nodes, which saves space when your dataset has a lot of overlap (like a dictionary), but a trie can use more memory than a simple list for datasets with little shared structure, since each node typically reserves space for many possible children.

## Common mistakes

- Forgetting the `isEndOfWord` flag and treating any valid path as a complete word — "ca" being a valid prefix path doesn't mean "ca" was ever inserted as a word.
- Using a plain object for children without considering memory overhead on large alphabets or case sensitivity — decide upfront whether to normalize case before inserting.
- Reaching for a trie when a simple hash set would do — if you never need prefix queries, a trie adds complexity for no benefit over a hash set's O(1) average lookup.
