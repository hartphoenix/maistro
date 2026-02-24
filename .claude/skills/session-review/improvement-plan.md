# Session-Review Skill Improvements

## Context

The session-review skill was just generalized (Hart-specific references
removed) and Phase 4 (Signal) added as part of the MVP install package
build. A handoff test revealed five gaps, and the Phase 1 evidence-
gathering step is too vague to produce consistent results. This plan
redesigns the skill's analysis phase to be concrete and evidence-based,
fixes the handoff gaps, and adds context management for large sessions.

Branch: `hart/intake-skill-learning-paths`

## Critical files

- `.claude/skills/session-review/SKILL.md` — primary (rewrite)
- `.claude/references/context-patterns.md` — read this first for
  context management patterns (especially #1 manifest-then-delegate,
  #6 evidence-tagged scoring, #8 dual-layer output)
- `.claude/references/developmental-model.md` — scoring calibration
- `.claude/skills/intake/SKILL.md` lines 445-457 — the 0-5 scoring
  rubric that session-review references but doesn't define

## Changes

### 1. Fix phase count (line 8)

Current: "Three phases, in order. Do not skip or reorder."

Change to: "Four phases, in order. Do not skip or reorder. Phase 4
is optional."

### 2. Inline the scoring rubric (near line 29)

Current: "Score each answer 0-5 using the rubric in the current-state.md
header."

The rubric lives in the intake synthesis template and gets written
into `learning/current-state.md`'s header — but a naive agent can't
find it. Inline it directly:

```
Score each answer 0-5:
  0 = not encountered
  1 = heard of
  2 = attempted with help
  3 = can do with effort
  4 = fluent
  5 = can teach
```

Keep the rest of line 29 (gap classification from answers) as-is.

### 3. Redesign Phase 1 step 2: evidence-based session analysis

Replace the vague "Review the session for: concepts encountered,
strengths (with evidence), growth edges..." with a concrete evidence-
gathering procedure.

#### 3a. Determine the review window

1. Read `learning/current-state.md` (existing step 1 — keep it).
2. Find the last session-review date: check the most recent file in
   `learning/session-logs/` for its `date:` frontmatter. If no session
   logs exist, this is the first review — the window starts at
   intake (or repo init).

#### 3b. Gather evidence since last review

Three evidence sources, gathered in parallel where possible:

1. **Conversation context** — the current session's full conversation
   history. This is always available and is the primary source for
   the current session.

2. **Git history since last review:**
   ```
   git log --since="YYYY-MM-DD" --oneline
   git diff <last-review-date>..HEAD --stat
   ```
   Shows what was built, what files changed, commit messages reveal
   intent. For large diffs, use `--stat` first to get the manifest,
   then read only files relevant to learning (not config, not
   lock files).

3. **Artifacts produced** — new or modified files since the review
   window. Use git diff `--name-status` to get the list. Focus on
   source code, tests, and documentation the user wrote (not
   generated files).

4. **Prior session logs in the window** — session logs are created
   only by session-review (Phase 3). If multiple reviews ran in a
   short window, read their frontmatter for already-logged concepts
   and scores. Don't re-quiz concepts already reviewed in the
   window.

#### 3c. Context management gate

After gathering the evidence manifest (file list + conversation
size + git stat), assess total volume:

**If manageable** (conversation is the primary source, git diff is
< ~200 lines, < ~10 modified files): analyze inline. The agent reads
the relevant diffs and conversation, produces the analysis directly.

**If context-heavy** (large git diff, many modified files, multiple
unreviewed sessions): apply manifest-then-delegate from
`.claude/references/context-patterns.md` pattern #1.

Dispatch a sub-agent with:
- The evidence manifest (file paths, git stat, daily note dates)
- The current `learning/current-state.md` content
- Instructions to read the files/diffs and return a structured
  analysis report: concepts encountered (with evidence), strengths,
  growth edges (named gaps), procedural observations

The main agent works from the sub-agent's report, never falling back
to reading raw evidence itself. If the sub-agent fails, retry once
or dispatch fresh.

#### 3d. Analysis output (same as current, but now evidence-grounded)

Whether analyzed inline or via sub-agent, the output is:
- Concepts encountered (with specific evidence: file, commit, or
  conversation reference)
- Strengths (what the user did well, with evidence)
- Growth edges (name the gap type — conceptual/procedural/recall —
  not just the topic)
- Procedural observations (workflow patterns, tool usage, debugging
  approach)

Present this analysis before quizzing (existing step 4 — keep it).

### 4. Handle missing `learning/current-state.md`

Add a fallback at Phase 1 step 1: if `learning/current-state.md`
doesn't exist, warn the user that intake hasn't been run (or the
file was deleted). Offer to proceed anyway — scores from this review
will be initial estimates, tagged `source: session-review` rather
than `source: intake`. Create the file during Phase 3 (Log) if it
doesn't exist.

### 5. Fix `skills_activated` in signal snapshot

The signal snapshot (Phase 4, line 74) lists `skills_activated` but
the agent can't reliably determine which skills fired.

Change to best-effort with explicit caveat: "Infer from conversation
patterns which skills appear to have activated (e.g., debugging
exchanges suggest debugger, quick factual answers suggest quick-ref).
List as best-effort; omit if unclear." This is honest about the
signal quality without dropping a useful field.

### 6. Fix `gh issue create --label` failure

The `--label "tester-signal"` flag fails if the label doesn't exist
on the target repo. Change the `gh issue create` command to not use
`--label`. Instead, use a title prefix convention:

```
gh issue create \
  --repo [repo from feedback.json] \
  --title "[signal] YYYY-MM-DD" \
  --body "[snapshot + optional notes]"
```

Hart can filter by title prefix (`[signal]`) without requiring repo
label setup.

## Implementation sequence

1. Read `.claude/references/context-patterns.md` for context
   management patterns before starting edits
2. Fix the phase count (line 8) — trivial
3. Inline the scoring rubric (near line 29)
4. Add missing current-state.md fallback (Phase 1 step 1)
5. Rewrite Phase 1 step 2 with the evidence-gathering procedure
   (3a-3d above) — this is the biggest change
6. Fix `skills_activated` to best-effort (Phase 4)
7. Fix `gh issue create` label → title prefix (Phase 4)
8. Verify the skill stays under 500 lines (reasoning token tax)
   — if it exceeds, extract the sub-agent dispatch prompt to a
   `subagents.md` reference file (same pattern as intake)

## Verification

1. Read the final SKILL.md end-to-end — does it read coherently
   as a standalone document?
2. Grep for "Hart", "Architect", "Tutor", "Setup Guide" — zero hits
3. Count lines — must stay under 500
4. Check that every external reference (current-state.md,
   developmental-model.md, context-patterns.md, feedback.json) is
   named with its path
5. Verify the context management gate has clear criteria (not
   subjective "feels like too much")
