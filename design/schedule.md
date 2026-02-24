# Schedule & Task Tracker

**Week 4 build:** 2026-02-23 → 2026-02-28 (demo Saturday)

Living tracker for milestones and tasks. Specs live in their respective
design docs; this file tracks execution status.

---

## Milestones

| Day | Target | Status |
|-----|--------|--------|
| Mon 2/23 | PRD submitted. Group pitch sent. Both repos scaffolded. Coordination layer extraction started. | Done |
| Tue 2/24 | Personal harness depth: intake + session-review end-to-end compatible, shared scoring rubric, evidence tagging, goals/arcs lifecycle. Install package taking shape. | Done |
| Wed 2/25 | Install package complete (README + init flow). Solo /startwork built. Coordination layer extraction started if time. | In progress |
| Thu 2/26 | Coordination layer installable. Signal return path end-to-end. Both tools documented. | Planned |
| Fri 2/27 | Demo prep. Peer testing. Iterate on feedback. | Planned |
| Sat 2/28 | Demo. | Planned |

---

## Task Checklist

### Personal harness — MVP

| Task | Spec | Status |
|------|------|--------|
| Data hopper + intake interview | `design/prd.md` §MVP | Done |
| Parameterized CLAUDE.md generation | `design/prd.md` §MVP | Done |
| Skills out of the box (debugger, session-review, quick-ref) | `design/build-registry.md` | Done |
| Intake ↔ session-review integration | Shared scoring rubric, evidence tagging, goals/arcs lifecycle | Done |
| Solo /startwork | `design/startwork.md` §Solo | Done |
| Solo /project-brainstorm | `design/build-registry.md` §Skills | Planned |
| Learning state persistence (current-state.md) | `design/harness-features.md` §P3 | Done |
| Privacy (.gitignore learner profile) | `design/prd.md` §MVP | Done |

### Personal harness — additional built skills

| Skill | Status |
|-------|--------|
| browser-qa | Done |
| design-iterate | Done |
| design-skill | Done |
| diagram | Done |
| lesson-scaffold | Done |

### Coordination layer — MVP

| Task | Spec | Status |
|------|------|--------|
| Extract from field-test project | `coordination/README.md` | Done |
| Generalize hardcoded references | `coordination/README.md` §Config | Done |
| Team intake flow | `design/prd.md` §MVP | Planned |
| /startwork (team) | `design/startwork.md` §Team | Extracted (needs parameterization) |
| /handoff-test | `.claude/skills/handoff-test/` | Done |
| /triage | `coordination/commands/workflows/triage.md` | Extracted |
| Dependency protocol | `coordination/commands/startwork.md` | Extracted |
| Signal return path (GitHub issues) | `coordination/architecture.md` §Signal Catch Basin | Designed |
| Agent feedback skill | `design/build-registry.md` §Skills | Planned — replaces session-review Phase 4 strict schema |
| Privacy boundaries documented | `design/prd.md` §MVP | Planned |

### Stretch goals

| Task | Spec | Status |
|------|------|--------|
| Installation package | `design/prd.md` §Stretch | In progress — see checklist below |
| Solo compound engineer (weekly review) | `design/harness-features.md` §P6 | Not started |
| Team compound engineering workflow | `coordination/commands/workflows/compound.md` | Extracted |
| Compounding indicators | `design/harness-features.md` §P6 | Not started |

### Install package checklist

What ships in `package/` — everything a new user needs to clone and go.

| Item | Status |
|------|--------|
| `README.md` (quick start, what intake creates, privacy) | Done |
| `CLAUDE.md` (template, replaced by intake) | Done |
| `.gitignore` (learning/, .hopper/) | Done |
| `learning/` + `learning/session-logs/` (with .gitkeep) | Done |
| `.hopper/` (with .gitkeep) | Missing |
| `.claude/skills/intake/` | Missing |
| `.claude/skills/session-review/` | Missing |
| `.claude/skills/startwork/` | Missing |
| `.claude/skills/quick-ref/` | Missing |
| `.claude/skills/debugger/` | Missing |
| `.claude/skills/lesson-scaffold/` | Missing |
| `.claude/references/developmental-model.md` | Missing |
| `.claude/references/scoring-rubric.md` | Missing |
| `.claude/references/context-patterns.md` | Missing |
| `.claude/feedback.json` (pre-populated for testers) | Done |
| `gh` CLI documented as prerequisite in README | Done |
| Create `rhhart/maestro-signals` repo | Missing (pre-deploy checkpoint) |
| Agent feedback skill (`.claude/skills/agent-feedback/`) | Planned — see build registry |
| End-to-end test: clone → /intake → work → /session-review → signal | Not run |

### Validation experiments

See `design/validation-plan.md` for full specs. All designed, none run.

| Experiment | Priority |
|------------|----------|
| Retrospective compliance audit | 1 (highest info yield) |
| A/B testing infrastructure | 2 (enables experiments 3, 7) |
| First-person framing | 3 |
| Instruction persistence | 4 (can run with #2) |
| Context budget measurement + skill audit | 5 |
| Embedding loop validation | 6 |
| Onboarding design | 7 (deployment-blocking) |
| Context budget discipline | 8 (deployment-blocking) |

---

## Definition of Done

From `design/prd.md`:

- A non-Hart developer can install the personal harness and have a
  working, personalized setup within 15–20 minutes
- A team of 2+ can install the coordination layer and have working task
  selection, triage, and dependency tracking within 30 minutes
- Both tools have a README with quickstart
- Demo shows both working and self-improving — with at least one other
  person's real usage as evidence
