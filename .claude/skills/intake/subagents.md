# Intake Sub-agents

Reference for intake skill sub-agent dispatch. Read on demand during
Phases 1 and 3 — not loaded into ambient context.

---

## Background Analyzer

Dispatch as a Task sub-agent (`subagent_type: "general-purpose"`).

### What to include in the dispatch prompt

```
You are analyzing materials a learner has provided for onboarding into
a personal development harness. Your job is to read their materials and
extract signal about who this person is, where they are in their
development, and what patterns their work reveals.

**Before reading any background files**, read the developmental model at
`.claude/references/developmental-model.md`. This tells you what to
look for: complexity level, chunking depth, the gap between them,
bridge dependencies from prior domains, and the compounding engine.
Use it as your analytical lens for everything you read.

**Background path:** [insert path]
**File manifest:** [insert the file listing you produced]

Read each file. For each, extract signals using the guide below.

[Insert the extraction table from this file, § Material Extraction]

After reading all files, produce a Background Analysis Report using the
output schema below. Be specific — cite materials, quote relevant
passages, name concrete skills and tools. "Good code quality" is not
a signal; "consistent use of early returns, descriptive variable names,
and test files mirroring source structure" is.

**Delegation:** If background is large enough that you cannot read all
materials and do the analysis justice within your own context, use the
Task tool to dispatch sub-agents for subsets of files. This is a HIGH
threshold — do it only when you genuinely cannot hold the material.
Each sub-agent receives: the developmental model path (they read it
themselves), their assigned files, and the extraction table. They
return their findings using the same output schema. You then merge
their reports, resolve contradictions, and produce one unified report.

**Do NOT write any files. Return text only.**
```

### Material extraction guide

Include this table in the dispatch prompt:

| Material type | What to extract |
|---------------|-----------------|
| Code files / repos | Languages, frameworks, file structure patterns, naming conventions, code style, README content, commit messages if `.git/` present, test patterns |
| Resumes / CVs | Background domains, career trajectory, skills claimed, projects highlighted, education |
| Writing samples | Reasoning patterns, tone, vocabulary, domain interests, self-awareness cues |
| Conversation exports | Question patterns, help-seeking style, what confuses vs. what flows, reflection depth |
| Course materials / transcripts | Subject areas, performance indicators, completion status |
| Other files | Describe what you found and what signals it contains |

### Output schema

Include this in the dispatch prompt as the expected return format:

```markdown
## Background Analysis Report

### Background & Context
[findings with material citations]
**Signal strength:** strong | moderate | thin

### Goals & Aspirations
[findings — may be thin if materials don't reveal goals directly]
**Signal strength:** strong | moderate | thin

### Current State
[specific skills, tools, patterns observed — with evidence]
**Signal strength:** strong | moderate | thin

### Learning Style
[behavioral patterns: how they organize, iterate, seek help]
**Signal strength:** strong | moderate | thin

### Work & Communication Preferences
[quality standards, style signals, collaboration patterns]
**Signal strength:** strong | moderate | thin

### Cross-file Observations
[correlations, contradictions, and patterns that only emerge from seeing
multiple materials together. A resume claiming "JavaScript expert" plus
code showing dated patterns is a calibration signal. A writing style
that mirrors code organization suggests structural thinking transfer.]

### Surprises
[Anything that doesn't fit the categories above but seems significant.
Anomalies, unexpected signals, things worth surfacing even if you're
not sure what to do with them yet. This section exists because the most
valuable findings are often the ones we didn't think to ask for. If
nothing surprised you, say so explicitly.]
```

---

## Synthesis Agents

Dispatch up to 4 Task sub-agents in parallel
(`subagent_type: "general-purpose"`), one per output document.

### What each agent receives

Every synthesis agent receives:
1. The full contents of `learning/.intake-notes.md`
2. Its specific template and guidelines (copied from SKILL.md sections
   3a-3d at dispatch time — the main agent includes the relevant
   section text in the prompt)

Additionally:
- **Arcs agent** and **current-state agent**: instruct them to read
  `.claude/references/developmental-model.md` before drafting.
- **CLAUDE.md agent**: remind it that the Security section is a system
  invariant — emit verbatim, do not personalize.

### Dispatch prompt pattern

```
You are drafting a [document name] for a new learner based on their
intake interview. Below are the full intake notes (background analysis +
interview findings), followed by the template and guidelines for your
document.

[Paste full contents of learning/.intake-notes.md]

---

## Template and guidelines

[Paste the relevant section from SKILL.md: 3a, 3b, 3c, or 3d]

---

Generate the document following the template exactly. Use evidence
from the intake notes — do not invent or speculate beyond what the
notes contain.

**Do NOT write any files. Return the draft as text only.**
```

For the arcs and current-state agents, prepend:
```
Before drafting, read `.claude/references/developmental-model.md` to
inform your analysis of capability clusters and scoring context.
```

### After receiving drafts

The main agent reviews all 4 drafts for cross-document consistency
before presenting. See SKILL.md Phase 3 for the consistency checklist.
