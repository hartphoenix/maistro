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

| Skill | Usage | Status | Location |
|-------|-------|--------|----------|
| Quick Reference | ~33% | Built | `.claude/skills/quick-ref/` |
| Debugger | ~20% | Built | `.claude/skills/debugger/` |
| Diagram | — | Built | `.claude/skills/diagram/` |
| Session Review | — | Built | `.claude/skills/session-review/` |
| Browser QA | — | Built | `.claude/skills/browser-qa/` |
| Design Iterate | — | Built | `.claude/skills/design-iterate/` |
| Lesson Scaffold | — | Built | `.claude/skills/lesson-scaffold/` |
| Design Skill | — | Built | `.claude/skills/design-skill/` |
| Architect | ~10% | Planned | *Compensation:* Always ask for full system picture before answering. Promotion candidate if extended design sessions become common. |
| Setup Guide | — | Planned | Procedural, not Socratic. Ask for project structure, package.json, and goal upfront. |
| Emotional Reflection | — | Planned | Attentive mirroring, not therapy. Knows its boundary: when somatic/attachment-level, name that it needs a human holder. Key principle (Thorson/Aletheia): mirroring itself is the intervention. |
| Weekly Review | — | Planned | Friday synthesis. Reads daily notes + current-state.md. Higher context budget. |
| Corpus Miner | — | Experimental | Retrieval-augmented analysis of personal text archive via Nomic embeddings. Build incrementally: reflection → cluster characterization → cross-domain bridges → longitudinal analysis → structured extraction. |

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
