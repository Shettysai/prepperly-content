/**
 * Regenerates manifest.json from the files on disk.
 *
 * The manifest carries a sha256 per topic, and the app uses that hash as its
 * cache key — a stale hash means users keep seeing the previously cached
 * version of a topic after it has been edited. So this MUST run after any
 * content change, and the sha must be of exactly the bytes that will be
 * served.
 *
 * Usage: node scripts/build-manifest.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Minimal frontmatter reader — enough for the keys the manifest needs. */
function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1 || /^\s/.test(line)) continue;   // skip list continuations
    out[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return out;
}

const phaseDirs = readdirSync(join(root, "phases"))
  .filter((d) => /^\d\d-/.test(d))
  .sort();

const phases = phaseDirs.map((dir) => {
  const phasePath = join(root, "phases", dir);
  const meta = JSON.parse(readFileSync(join(phasePath, "phase.json"), "utf8"));

  const topics = readdirSync(phasePath)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file, i) => {
      const rel = `phases/${dir}/${file}`;
      const bytes = readFileSync(join(root, rel));
      const fm = frontmatter(bytes.toString("utf8"));
      const slug = fm.slug ?? file.replace(/\.md$/, "");
      const questionsRel = `questions/${slug}.json`;

      return {
        slug,
        title: fm.title ?? slug,
        summary: fm.summary ?? "",
        position: i + 1,
        path: rel,
        questionsPath: existsSync(join(root, questionsRel)) ? questionsRel : null,
        // Hash of the exact bytes served, so a content edit invalidates the
        // app's cache. Hashing the parsed body instead would miss frontmatter
        // changes (tags, links), which are also user-visible.
        sha256: createHash("sha256").update(bytes).digest("hex"),
      };
    });

  return { ...meta, topics };
});

const manifest = {
  version: new Date().toISOString().slice(0, 10),
  phases,
};

writeFileSync(join(root, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const topicCount = phases.reduce((n, p) => n + p.topics.length, 0);
console.log(`manifest: ${phases.length} phases, ${topicCount} topics`);
