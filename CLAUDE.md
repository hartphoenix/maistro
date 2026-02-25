## Maestro

A fractal learning engine: personal development harness + team
coordination layer for Claude Code.

Two interoperable tools that learn as they are used:

1. **Personal development harness** — Drop materials in a background folder,
   run an intake interview, get a CLAUDE.md, skills, and learning
   tracker calibrated to you. The harness updates its model as you work
   and self-calibrates over time.

2. **Team coordination layer** — Connects individual harnesses into a
   shared workflow: task ranking, conflict detection, triage routing,
   dependency tracking, and a signal return path.

Design docs: `design/`. Research: `research/`. Skills: `.claude/skills/`.

### Development conventions

- Runtime: `bun`
- Git: meaningful commit messages, commit working states frequently,
  always commit to a feature branch (not main)
- File structure: flat until complexity demands nesting
- CLAUDE.md edits: keep minimal — only what the agent can't discover
  by exploring the repo. The reasoning token tax is real.

### Architecture

The harness is built on Claude Code's native infrastructure:
- CLAUDE.md for behavioral directives and project context
- `.claude/skills/` for modular capabilities (each has a SKILL.md)
- Tiered memory loading (auto → on-demand → search)
- Skills load selectively by description match against conversation

Design principles governing the build: `design/design-principles.md`.
Feature registry organized by principle: `design/harness-features.md`.

### Key design decisions

- **Loading policy over transport.** What matters is when/how content
  enters the agent's attention (always-on vs. session-start-composed vs.
  on-demand), not how it gets there.
- **Gated propagation.** Capture is low-friction; propagation into
  shared or ambient context is human-gated.
- **Signal return path via GitHub issues.** Findings route through
  human triage, not ambient file sync.
- **Surprise-triggered capture.** When you encounter something in this
  project that surprises you, alert the developer and describe what you
  expected vs. what you found. This is how the system learns.
