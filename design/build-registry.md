# Build Registry

Registry of personalities, skills, and their build status. Derived from
analysis of 98 browser conversations + 18 Claude Code sessions. Design
each personality using the interview protocol in
`personalities/design-personality/SKILL.md`.

---

## Personalities

| Personality | Usage | Status | Notes |
|-------------|-------|--------|-------|
| **Tutor** | ~15% | Built | `personalities/tutor/CLAUDE.md`. Socratic method, structural bridges, developmental tracking. *Compensation:* When Hart pivots to resource-seeking mid-conversation, offer to teach in context first. |
| **Creative Collaborator** | ~15% | Planned | Co-creator for Lucid Drama, poetry, worldbuilding, naming. Not teaching — inventing together. *Compensation:* Minimal — match his energy. |
| **Research Partner** | ~5% | Planned | Peer-level intellectual exploration. No teaching frame. *Compensation:* Match depth, push back when disagreeing. |

---

## Skills

Ships = included in install package. Dev-only = used during harness
development, not shipped to end users.

| Skill | Usage | Status | Ships | Location |
|-------|-------|--------|-------|----------|
| Quick Reference | ~33% | Built | Yes | `.claude/skills/quick-ref/` |
| Debugger | ~20% | Built | Yes | `.claude/skills/debugger/` |
| Session Review | — | Built | Yes | `.claude/skills/session-review/` |
| Lesson Scaffold | — | Built | Yes | `.claude/skills/lesson-scaffold/` |
| Startwork | — | Built | Yes | `.claude/skills/startwork/` |
| Progress Review | — | Built | Yes | `.claude/skills/progress-review/`. Cross-session pattern analysis: stalls, regressions, goal drift, arc readiness. Primary path: conditional background dispatch from startwork (fires when unreviewed sessions > 2). Also available standalone via direct invocation. Completes the planned Weekly Review. |
| Diagram | — | Built | Dev-only | `.claude/skills/diagram/` |
| Browser QA | — | Built | Dev-only | `.claude/skills/browser-qa/` |
| Design Iterate | — | Built | Dev-only | `.claude/skills/design-iterate/` |
| Design Skill | — | Built | Dev-only | `.claude/skills/design-skill/` |
| Project Brainstorm | — | Planned | — | Solo version: takes learner goals + growth edge, explores project ideas, produces project brief with schedule, definitions of done, and requirements. Adapt from `coordination/commands/workflows/brainstorm.md`. |
| Agent Feedback | — | Deferred | — | Produces meaningful feedback reports for the harness developer. Replaces session-review Phase 4's strict structural schema with a richer signal. Fires on surprise: when the agent encounters something worth telling the developer about, it estimates signal type and composes a report. Readable, contentful — not just structural metrics. Privacy-aware but not so strict it strips all useful data. Triggerable from session-review or independently when surprising harness behavior occurs. **Calibration loop:** checks for discrepancies between lesson-scaffold predictions (concept classifications, predicted difficulty) and session-review outcomes (actual quiz scores, observed struggles). Scaffold said "solid" but learner struggled → classification model needs tuning. Scaffold said "prerequisite gap" but learner handled it → model underestimated. These discrepancies are a first-class signal type. |
| Architect | ~10% | Planned | — | *Compensation:* Always ask for full system picture before answering. Promotion candidate if extended design sessions become common. |
| Setup Guide | — | Planned | — | Procedural, not Socratic. Ask for project structure, package.json, and goal upfront. |
| Emotional Reflection | — | Deferred | — | Behavior embedded in Tutor personality; standalone skill not built. Attentive mirroring, not therapy. Knows its boundary: when somatic/attachment-level, name that it needs a human holder. Key principle (Thorson/Aletheia): mirroring itself is the intervention. |
| Corpus Miner | — | Experimental | — | Retrieval-augmented analysis of personal text archive via Nomic embeddings. Build incrementally: reflection → cluster characterization → cross-domain bridges → longitudinal analysis → structured extraction. |

---

## Prompting Patterns to Compensate For

These patterns are observed across all interactions and should inform
every skill and personality design.

- **Narrow symptom, hidden system.** Hart asks about the error, not
  the goal. Surface the bigger picture without interrogating.
- **Hypothesis withheld.** He usually has a decent guess but doesn't
  volunteer it. Prompt for it.
- **Conversation drift.** Long sessions accumulate topics. Notice
  shifts; suggest starting fresh or mark the transition.
- **"Can I do X?" as permission check.** Encourage trying first.
- **Resource-seeking mid-problem.** Redirect to in-context learning.

## Strengths to Protect

- **Experiment-first loop.** Tries, observes, then asks. Never preempt.
- **High metacognitive accuracy.** Trust his self-reports.
- **Spontaneous bridge-building.** Encourage his own frameworks.
- **Explicit help-mode requests.** He differentiates modes naturally.
- **Full error pasting.** Conversations resolve fastest with complete output.
- **Testing understanding by writing code for review.** Encourage.

## Recurring Friction Points

- **Syntax overloading** (`{}`, `=>`, `()` across JS/JSX contexts)
- **Sandbox-to-real-setup gap** (tutorials hide environment complexity)
- **Error message parsing** (developing fluency)
