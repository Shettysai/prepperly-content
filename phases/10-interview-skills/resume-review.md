---
title: Resume Review
slug: resume-review
summary: Impact formatting, Keywords
tags: [interview-skills, fundamentals]
links: []
---
## In one sentence

A good engineering **resume** describes what you actually changed and how much it mattered, in specific measurable terms, instead of just listing the tasks you were assigned or the technologies you touched.

## Why it matters

A recruiter typically spends under a minute on a first pass, and an automated tracking system may filter it before a human sees it — vague bullets like "responsible for backend development" give both nothing to grab onto. Specific, quantified impact is what gets you to the phone screen.

## The idea

The core shift is from **duties** to **impact**. A duty describes what you were supposed to do ("worked on the payments team"); impact describes what changed because you did it ("reduced payment failure rate from 4% to 0.8%"). Recruiters can't evaluate a duty, but a specific number gives them something concrete to ask about.

A reliable formula for a bullet is: **action verb + what you built or fixed + the measurable result**. "Built," "reduced," and "automated" are stronger openers than "responsible for," because they describe something you did, not a role you occupied.

When you don't have a hard metric, use a reasonable proxy: team size affected, time saved, or scale (requests per second, rows processed). "Automated a report that previously took 3 hours manually every week" is concrete even without a percentage.

Keywords matter too, since many companies scan resumes with automated tools before a human reads them — mirroring the exact technology names from the job posting helps you pass that filter, as long as it's honest.

## In practice

```text
Weak:   "Responsible for backend APIs using Node.js"

Strong: "Built a Node.js REST API serving 50K daily requests, cutting
         average response time from 800ms to 150ms by adding caching"

Weak:   "Worked on improving test coverage"

Strong: "Increased test coverage from 40% to 85% across the payments
         module, catching 3 production bugs before release over one
         quarter"

Weak:   "Helped with deployment process"

Strong: "Automated the deployment pipeline with GitHub Actions,
         cutting release time from 2 hours to 10 minutes"
```

Each strong version follows the same shape: an action verb, what was built, and a number that shows the effect of the work.

## Quick reference

| Weak pattern | Why it fails | Fix |
|---|---|---|
| "Responsible for X" | Describes a duty, not an outcome | "Built/Reduced/Automated X, resulting in Y" |
| No numbers anywhere | Recruiter can't gauge scale or impact | Add a metric or a reasonable proxy (time, size, frequency) |
| Generic tech list | Doesn't show what you did with it | Tie each technology to a specific thing you shipped |
| Wall of text bullets | Skimmed in seconds, gets skipped | One idea per bullet, ideally one line |

## What interviewers ask

- **"Walk me through this project on your resume."** — They're checking the bullet wasn't exaggerated and that you can explain the technical decisions behind the number you claimed.
- **"How did you measure that 80% improvement?"** — They're testing whether the metric is real and whether you understand what you actually measured, not just repeating a number someone else gave you.
- **"What was your specific role on that team project?"** — They're separating your individual contribution from the team's, since resume bullets often blur the two.

## Common mistakes

- Listing responsibilities instead of outcomes — "maintained the API" says nothing an interviewer can follow up on; "fixed a memory leak that was causing weekly restarts" does.
- Adding a number you can't explain if asked — every metric on your resume should be one you can defend in detail in an interview.
- Making every bullet the same length and weight — put your strongest, most specific achievement first in each role, since that's what gets read.
