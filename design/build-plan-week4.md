# Build Plan — Week 4

**Week:** 2026-02-23 → 2026-02-28 (demo Saturday)
**Updated:** 2026-02-24

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

5. **Directory restructure** — `daily-notes/` → `learning/`.
   All learning state now lives under `learning/`:
   - `learning/goals.md` — aspirational states of being
   - `learning/arcs.md` — developmental lines serving goals
   - `learning/current-state.md` — concept scores, gap types
   - `learning/daily-notes/` — session logs
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

### Remaining today

9. **README + single-action initialization flow** — The onramp that
   makes `/intake` discoverable. New user clones repo, reads README,
   runs one command, lands in the interview.

### Deferred (decide later today)

- Solo `/startwork` — important feature, but README + init flow may
  be higher priority for installability
- Coordination layer (team startwork, triage, dependency protocol) —
  possible afternoon or push to Wednesday

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
  skills/
    intake/SKILL.md           # onboarding entry point
    intake/subagents.md       # sub-agent dispatch specs (on-demand)
    session-review/SKILL.md   # end-of-session learning loop
    ...

learning/                     # per-user, gitignored
  goals.md                    # states of being
  arcs.md                     # developmental lines
  current-state.md            # concept scores
  daily-notes/                # session logs

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
- Wed: Coordination layer installable, solo `/startwork`, early tester
- Thu: Signal return path, README + quickstart for both tools
- Fri: Demo prep, peer testing
- Sat: Demo
