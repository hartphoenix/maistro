# Schedule & Task Tracker

**Week 4 build:** 2026-02-24 → 2026-03-01 (demo Saturday)

Living tracker for milestones and tasks. Specs live in their respective
design docs; this file tracks execution status.

---

## Milestones

| Day | Target | Status |
|-----|--------|--------|
| Mon 2/24 | PRD submitted. Group pitch sent. Both repos scaffolded. Coordination layer extraction started. | Done |
| Tue 2/25 | Personal harness installable with intake interview + data hopper. Coordination layer extracted and generalized — startwork, triage, dependency protocol all configurable. Team intake flow working. | In progress |
| Wed 2/26 | Coordination layer installable. At least one team running it if collaborators signed on. Personal /startwork working. Iterate on early tester feedback. | Planned |
| Thu 2/27 | Signal return path working end-to-end. Both tools documented with README + quickstart. Compound engineer skill (stretch) if coordination stable. | Planned |
| Fri 2/28 | Compounding indicators (stretch). Demo prep. Everything peer-tested. | Planned |
| Sat 3/1 | Demo. | Planned |

---

## Task Checklist

### Personal harness — MVP

| Task | Spec | Status |
|------|------|--------|
| Data hopper + intake interview | `design/prd.md` §MVP | Planned |
| Parameterized CLAUDE.md generation | `design/prd.md` §MVP | Planned |
| Skills out of the box (debugger, session-review, quick-ref) | `design/build-registry.md` | Done |
| Solo /startwork | `design/startwork.md` §Solo | Designed |
| Learning state persistence (current-state.md) | `design/harness-features.md` §P3 | Done |
| Privacy (.gitignore learner profile) | `design/prd.md` §MVP | Planned |

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
| Privacy boundaries documented | `design/prd.md` §MVP | Planned |

### Stretch goals

| Task | Spec | Status |
|------|------|--------|
| Installation package | `design/prd.md` §Stretch | Not started |
| Solo compound engineer (weekly review) | `design/harness-features.md` §P6 | Not started |
| Team compound engineering workflow | `coordination/commands/workflows/compound.md` | Extracted |
| Compounding indicators | `design/harness-features.md` §P6 | Not started |

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
