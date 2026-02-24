# Build Plan — Week 4

**Week:** 2026-02-23 → 2026-02-28 (demo Saturday)
**Updated:** 2026-02-24 (evening)

Execution plan for the week. Task status lives in `design/schedule.md`;
this document captures the build decisions and current state.

---

## Tuesday 2/24 — Personal harness installable

### Completed

1. **`/intake` skill** — `.claude/skills/intake/SKILL.md`
   Four-phase workflow: hopper scan → adaptive interview → synthesize
   drafts → human-gated write. Generates CLAUDE.md, goals.md, arcs.md,
   current-state.md.

2. **Data hopper convention** — `.hopper/` directory with `.gitkeep`.
   Staging area for intake materials. Gitignored except the keep file.

3. **Parameterized CLAUDE.md generation** — Built into intake Phase 3.
   Template mirrors Hart's working CLAUDE.md. Security section emitted
   verbatim as system invariant.

4. **Privacy** — `.gitignore` updated: `learning/`, `.hopper/*`.

5. **Directory restructure** — `session-logs/` → `learning/`.
   All learning state now lives under `learning/`:
   - `learning/goals.md` — aspirational states of being
   - `learning/arcs.md` — developmental lines serving goals
   - `learning/current-state.md` — concept scores, gap types
   - `learning/session-logs/` — session review logs
   Updated across: intake, session-review, lesson-scaffold, startwork
   spec, harness-features, .gitignore.

6. **Developmental model** — `.claude/references/developmental-model.md`
   Generalized from roger's skill-tree.md. Static analytical framework:
   complexity/chunking dimensions, dependency types, ordering heuristic,
   compounding engine. Referenced by intake for hopper analysis and
   interview calibration.

7. **SuperWhisper** — "slash intake" → `/intake` registered.

8. **Intake context management** — Sub-agent delegation, progressive
   note-taking, and resume protocol to keep the skill within context
   budget for non-technical users:
   - Sub-agent for hopper analysis (raw materials never enter main
     agent context; conditional sub-sub-agent spawning for large
     hoppers)
   - Progressive note-taking to `learning/.intake-notes.md` after each
     interview domain (compression-resistant record)
   - Parallel sub-agent dispatch for synthesis (4 document drafts
     generated in isolated contexts)
   - Resume protocol (Phase 0) — detects interrupted intake via notes
     file, offers to resume or start fresh
   - Sub-agent dispatch reference: `.claude/skills/intake/subagents.md`
   - Failure handling: retry once, re-dispatch on second failure;
     hopper failure degrades gracefully (accelerant, not gate)
   - User communication during wait times

9. **Session-review ↔ intake integration**
   - Shared scoring rubric: `.claude/references/scoring-rubric.md`.
     Single source of truth for 0-5 scale, gap types, and evidence
     source tags. Both skills reference it instead of defining inline.
   - Evidence source tagging: session-review now tags every score
     update (`session-review:quiz`, `session-review:observed`).
     Quiz-verified scores supersede intake estimates. Tagging
     convention defined in scoring rubric.
   - Goals/arcs lifecycle: session-review Phase 3 now reads
     `learning/goals.md` and `learning/arcs.md` after updating
     current-state. Proposes updates when session evidence warrants
     (goal achieved, arc progressed, new capability cluster emerging).
     Human-gated — user approves, edits, or skips.
   - Consumer interface: goals and arcs are now explicitly documented
     as inputs to the startwork skill.

10. **Install package directory structure** — `package/` now ships with
    `learning/` and `learning/session-logs/` via `.gitkeep` files. No
    skill has to create these directories. `.gitignore` uses the same
    `*` / `!.gitkeep` pattern as `.hopper/`.

11. **Repo rename: maistro → maestro** — Migration script
    (`scripts/rename-to-maestro.sh`) renamed directory, updated Claude
    config paths, verified no stale references.

### Remaining (pushed to Wednesday)

- **README + single-action initialization flow** — The onramp that
  makes `/intake` discoverable. New user clones repo, reads README,
  runs one command, lands in the interview. Package README exists but
  the init flow isn't wired.
- **Solo `/startwork`** — Designed, consumes goals/arcs/current-state.
  Session-review now feeds it explicitly.

### Deferred

- Coordination layer (team startwork, triage, dependency protocol) —
  pushed to Thursday. Harness depth was higher priority than breadth.

### Action items surfaced during build

- **Solo project brainstorm skill** — Intake may surface that a learner
  has no current projects. The coordination layer has a brainstorm
  workflow (`coordination/commands/workflows/brainstorm.md`) and skill
  (`coordination/skills/brainstorming/SKILL.md`) designed for team
  feature brainstorming. Adapt to a solo version scoped to project
  brainstorming: takes the learner's goals and growth edge as input,
  explores project ideas that would serve those goals, produces a
  project brief. Could reuse the coordination brainstorm's phased
  structure (understand → explore approaches → capture → handoff) with
  the learner model as context instead of a team codebase.

---

## Architecture decisions made today

**Directory structure:**
```
.claude/
  references/
    developmental-model.md    # static, how to analyze learning
    scoring-rubric.md         # shared scoring scale, gap types, evidence tags
    context-patterns.md       # context management patterns
  skills/
    intake/SKILL.md           # onboarding entry point
    intake/subagents.md       # sub-agent dispatch specs (on-demand)
    session-review/SKILL.md   # end-of-session learning loop
    ...

learning/                     # per-user, gitignored
  goals.md                    # states of being
  arcs.md                     # developmental lines
  current-state.md            # concept scores
  session-logs/               # session review logs

projects/                     # per-project context (future)

.hopper/                      # intake staging area, gitignored
```

**Three abstraction layers for learning state:**
1. Goals (highest) — states of being, aspirational identity
2. Arcs (middle) — capability clusters, skill sequences, dependencies
3. Current-state (ground) — individual concept scores and gap types

**Static vs. dynamic split:**
- `.claude/references/` — system knowledge, doesn't change per user
- `learning/` — user state, changes every session

---

## Wednesday–Saturday targets

See `design/schedule.md` for full milestone table. Key:
- Wed: Install package complete (README + init flow), solo `/startwork`
- Thu: Coordination layer installable, signal return path, docs
- Fri: Demo prep, peer testing, iterate on feedback
- Sat: Demo
