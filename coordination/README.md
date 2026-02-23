# Coordination Layer

Team coordination module for Claude Code. Connects individual
developer harnesses into a shared workflow: task ranking, conflict
detection, triage routing, dependency tracking, and signal return path.

**Source:** Extracted from the Schelling Points group project
(4-person team, 1-week build cycle, Feb 2026). Field-tested through
a full development lifecycle with PRs, code review, and task
coordination all running through the system.

## Components

| Component | Location | Function |
|-----------|----------|----------|
| Startwork command | `commands/startwork.md` | Pre-work conflict detection, dependency checking, task ranking |
| Workflow pipeline | `commands/workflows/` | 6-stage: brainstorm → plan → work → review → triage → compound |
| Coordination skills | `skills/` | brainstorming, compound-docs, document-review, handoff-test |
| Subagents | `subagents/` | 9 specialized analysis agents for review/plan/compound phases |
| Gather script | `scripts/startwork-gather.ts` | Board state aggregation (GitHub Projects API) |
| Review config | `compound-engineering.md` | Multi-agent review orchestration |

## Generalization status

These files were copied directly from the Schelling Points project.
Items below need generalization before the coordination layer is
project-agnostic.

### Hardcoded project references (must fix)

- `compound-engineering.md` — Contains Schelling Points project
  description and review concerns. Replace with configurable project
  context (populated during team intake).
- `scripts/startwork-gather.ts` line 105 — Hardcoded `thrialectics`
  org and project number. Parameterize with config variables.

### Game-specific subagents (generalize or make optional)

- `subagents/decision-balance-audit.md` — Written for game balance
  auditing (dominant strategies, resource pressure, escalation curves).
  Not applicable to non-game projects. Either generalize to "decision
  analysis" or make it an optional/swappable subagent.
- `subagents/feature-ui-completeness.md` — Mostly generic (UI feedback
  loops, invisible state, dead-end UX) but uses game terminology.
  Light rewrite to remove game-specific language.

### Generic subagents (ready to use)

- `subagents/best-practices-researcher.md`
- `subagents/code-simplicity-reviewer.md`
- `subagents/framework-docs-researcher.md`
- `subagents/learnings-researcher.md`
- `subagents/repo-research-analyst.md`
- `subagents/session-log-analyzer.md`
- `subagents/spec-flow-analyzer.md`

## Installation target

When installed into a project, these files map to:
```
project/
├── .claude/
│   ├── commands/
│   │   ├── startwork.md
│   │   └── workflows/*.md
│   ├── skills/
│   │   ├── brainstorming/
│   │   ├── compound-docs/
│   │   ├── document-review/
│   │   └── handoff-test/
│   ├── subagents/*.md
│   ├── scripts/startwork-gather.ts
│   └── compound-engineering.md
```

The project's CLAUDE.md gets team-specific sections added during
team intake: member roster, roles, WIP limits, conventions, dependency
protocol, and label taxonomy.
