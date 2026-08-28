---
title: CI/CD Pipelines
slug: cicd-pipelines
summary: GitHub Actions, Jenkins
tags: [devops, nodejs]
links:
  - title: GitHub Docs — About continuous integration
    url: "https://docs.github.com/en/actions/about-github-actions/about-continuous-integration-with-github-actions"
    kind: resource
  - title: Wikipedia — CI/CD
    url: "https://en.wikipedia.org/wiki/CI/CD"
    kind: resource
---
## In one sentence

**CI/CD** is an automated pipeline that tests your code every time you change it (Continuous Integration) and then ships it to users automatically or with one click (Continuous Delivery/Deployment).

## Why it matters

Without it, someone manually runs tests and copies files to a server, which is slow and easy to get wrong under pressure. A pipeline catches broken code before it reaches users and makes releasing software a routine, low-stress event instead of a scary one.

## The idea

**Continuous Integration (CI)** means every time someone pushes code, a server automatically builds the project and runs the test suite. If a test fails, the team finds out in minutes, not days later when it's tangled up with other changes.

**Continuous Delivery** takes this further: after CI passes, the code is automatically packaged and made ready to release, but a human still clicks a button to actually deploy it. **Continuous Deployment** removes even that click — every change that passes tests goes straight to production.

A pipeline is usually made of **stages** that run in order: install dependencies, lint, run tests, build, then deploy. If any stage fails, the pipeline stops there so broken code never reaches the next stage. Popular tools include GitHub Actions, Jenkins, and GitLab CI — they all follow this same stage-based idea, just with different configuration syntax.

Think of it like an assembly line with quality inspectors at each station: a faulty part gets pulled off immediately instead of ending up in the finished car.

## In practice

```yaml
# .github/workflows/ci.yml — a minimal GitHub Actions pipeline
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci              # install exact dependency versions
      - run: npm test            # pipeline stops here if tests fail
```

Each `step` runs in order; `npm ci` fails fast if the lockfile is inconsistent, and `npm test` only runs if the install succeeded.

## Quick reference

| Term | Meaning |
|---|---|
| Continuous Integration | Auto-build and test on every push |
| Continuous Delivery | Auto-package a release; human approves deploy |
| Continuous Deployment | Every passing change auto-deploys to production |
| Pipeline stage | One step (build, test, deploy) that can pass or fail |
| Runner/agent | The machine that actually executes the pipeline |

## What interviewers ask

- **What's the difference between continuous delivery and continuous deployment?** — Delivery stops at "ready to release" and waits for a human; deployment ships automatically with no manual gate.
- **What happens if a stage in the pipeline fails?** — The pipeline halts at that stage, later stages don't run, and the team is notified so the broken change doesn't reach production.
- **Why run tests in CI instead of just trusting developers to run them locally?** — Local runs get skipped under deadline pressure and environments differ; CI guarantees the same checks run the same way, every time.

## Common mistakes

- Treating a green pipeline as proof the app fully works — it only proves what the tests actually cover, so weak test coverage gives false confidence.
- Making the pipeline so slow that developers start skipping or ignoring it; fast feedback is the whole point.
- Deploying straight to production with no rollback plan, so a bad deploy has no quick way back.
