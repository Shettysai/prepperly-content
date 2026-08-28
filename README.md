# Prepperly Content

The public study content for [Prepperly](https://github.com/Shettysai/prep-tracker), a
software-engineering interview prep tracker. This repository holds the actual curriculum —
60 topics across 10 phases, each with study notes and interview questions — as plain files.

## Why this is a separate repository

Prepperly stores only a CDN URL and a content hash per topic in its database; the app fetches
this repository's raw files at runtime. That means:

- **Content updates without an app deploy.** Fix a typo here, commit, and every user sees the
  fix the next time their cache revalidates.
- **One canonical copy.** Previously this content was duplicated into every user's database row.
  Now there's exactly one copy of each topic, here.
- **Reviewable and contributable.** Changes to study material go through normal commits/PRs
  with diffs and history, like any other content.

## Structure

```
prepperly-content/
├── manifest.json              # index of every phase + topic + path + sha256
├── phases/
│   ├── 01-cs-fundamentals/
│   │   ├── phase.json         # { slug, name, position, targetMonth }
│   │   └── <topic-slug>.md    # YAML frontmatter + study notes (markdown)
│   └── ...                    # 10 phases total
└── questions/
    └── <topic-slug>.json      # that topic's interview questions
```

Each topic markdown file starts with YAML frontmatter (`title`, `slug`, `summary`, `tags`,
`links`) followed by the notes themselves.

`manifest.json` is what the app's sync script reads to populate its content catalogue —
it is not fetched by the app at request time. Each entry includes a `sha256` of the exact
bytes of that topic's markdown file, used as a cache-busting key.

## Contributing

Corrections and improvements to existing topics are welcome — typo fixes, clearer
explanations, updated links, additional interview questions. Please keep the existing
structure:

1. Edit the `.md` file's body (or its `questions/<slug>.json` file) directly.
2. Do not change a topic's `slug` — it's the join key against user progress data in the
   app's database. Renaming one is a breaking change.
3. Keep frontmatter valid: `title`, `slug`, `summary`, `tags` (array), `links` (array of
   `{title, url, kind}`).
4. After merging, the app's maintainer re-runs the sync script to update `manifest.json`
   hashes and push the change live — you don't need to touch `manifest.json` yourself.

## Licence

Content is licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — reuse
and adapt it freely, with attribution, sharing alike. Code snippets embedded in the notes are
additionally available under the [MIT License](https://opensource.org/licenses/MIT).
