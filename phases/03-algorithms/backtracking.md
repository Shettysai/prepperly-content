---
title: Backtracking
slug: backtracking
summary: N-Queens, Sudoku solver
tags: [recursion, algorithms, complexity]
links:
  - title: Wikipedia — Backtracking
    url: "https://en.wikipedia.org/wiki/Backtracking"
    kind: resource
  - title: Wikipedia — Eight queens puzzle
    url: "https://en.wikipedia.org/wiki/Eight_queens_puzzle"
    kind: resource
---
## In one sentence

**Backtracking** means trying a choice, moving forward as if it works, and if it turns out to be a dead end, undoing it and trying the next one — like solving a maze by retracing your steps the moment you hit a wall.

## Why it matters

Many problems (Sudoku, N-Queens, generating every valid combination of something) have too many possibilities to check by brute force, but you can't just guess randomly either. Backtracking gives you a systematic way to explore all possibilities while immediately abandoning any path that's already broken the rules, so you never waste time finishing a solution you already know is invalid.

## The idea

Take the **N-Queens** problem: place queens on a chessboard so no queen attacks another (same row, column, or diagonal). Brute force tries every arrangement and checks each at the end. Backtracking instead builds a solution one queen at a time, checking validity **as it goes**: place a queen in row 1, then before row 2, check every column — if a column conflicts with the queen already placed, skip it immediately.

If you place a queen and later realize no valid position exists for the remaining rows, you **backtrack**: remove the last queen and try the next option in its row. This is the whole algorithm: choose, explore, and if it fails, un-choose and try the next choice.

The pattern is always the same three steps: **1) choose** an option, **2) explore** what happens next, **3) un-choose** before trying the next option — so the search tree never carries forward decisions from a failed path.

## In practice

```js
function solveNQueens(n) {
  const results = [];
  const cols = []; // cols[row] = column index of the queen in that row

  function isSafe(row, col) {
    for (let r = 0; r < row; r++) {
      const c = cols[r];
      // same column, or same diagonal (row difference equals column difference)
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  function place(row) {
    if (row === n) { results.push([...cols]); return; } // all rows filled — valid solution
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        cols[row] = col;      // choose
        place(row + 1);       // explore
        cols[row] = undefined; // un-choose (backtrack)
      }
    }
  }

  place(0);
  return results;
}

console.log(solveNQueens(4)); // [[1,3,0,2],[2,0,3,1]] — 2 valid arrangements
```

The `cols[row] = undefined` line is backtracking in one line: after exploring a choice fully, it's wiped clean so the next loop iteration starts fresh.

## Quick reference

| Approach | Checks validity | Wasted work on invalid paths |
|---|---|---|
| Brute force (generate all, then check) | After building a complete solution | High — fully builds solutions that were doomed early on |
| Backtracking | At every step, before going deeper | Low — abandons a path the moment it breaks a rule |

## What interviewers ask

- **What's the difference between backtracking and plain recursion?** — Backtracking specifically includes an undo step: after exploring a choice, you revert any state changed before trying the next option, so choices don't leak between branches.
- **Why check `isSafe` before recursing instead of after?** — Checking early ('pruning') skips entire branches of impossible solutions immediately — in N-Queens, an early conflict means you never bother filling remaining rows.
- **What's the time complexity of N-Queens backtracking, and why still exponential?** — Roughly O(n!) worst case — pruning cuts off huge portions early, but placements still grow combinatorially.

## Common mistakes

- Forgetting the un-choose step, so state from a failed branch leaks into the next attempt — the single most common backtracking bug.
- Checking validity only after a complete solution is built — this turns backtracking into slow brute force and defeats the point of pruning early.
