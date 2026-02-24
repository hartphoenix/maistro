---
name: session-review
description: End-of-session learning review. Analyzes session for learning patterns and concept coverage, quizzes on 4-6 concepts biased toward gaps, then logs results to daily notes frontmatter and current-state.md. Use at the end of a working session or when the user requests a review, quiz, or session summary.
---

# Session Review

Three phases, in order. Do not skip or reorder.

## Phase 1: Analyze

1. Read `learning/current-state.md` to load current learning state.
2. Review the session for: concepts encountered, strengths (with evidence), growth edges (name the gap, not just the topic), procedural observations.
3. Select 4-6 quiz targets. Bias toward partial/stuck concepts. Include at least one application question. If learning/current-state.md has stale low-score concepts relevant to the session, resurface them.
4. Present the analysis before quizzing: strengths, growth edges, quiz targets with rationale.

Hart has explicitly requested honest negative feedback. 100% positive review is a failure of the skill.

## Phase 2: Quiz

Present all questions as free-text prompts. Evaluate answers after the user responds.

**Question type follows gap classification:**
- **Conceptual** → "Explain why..." / "What happens if..."
- **Procedural** → "Write the code..." / "What would you reach for?"
- **Recall** → "What are the..." / "Name the..."
- **Application** → "Given [novel scenario], how would you..."

Score each answer 0-5 using the rubric in the current-state.md header. Classify gap type from the answer: mental model wrong = conceptual, right concept but wrong execution = procedural, can't reproduce = recall. Correct errors directly — brief and on-task.

**Score the shape of the model, not the precision of the words.** A correct pipeline with wrong locations is a 3; a wrong pipeline is a 2. The question is "does this person understand the system?" — not "did they name every mechanism?"

**Prioritize concepts that compound.** A concept's review value scales with how many other concepts depend on it. If understanding X is a prerequisite for Y, Z, and W, drill X. If X is a leaf node — one thing, no dependencies downstream — it's a lookup, not a quiz target.

**The most important concepts may not be the ones that produced errors.** Architectural decisions, design principles, and structural reasoning often compound more than implementation details. A session that includes both systems design and debugging should weight the design questions higher, not default to quizzing on the bugs.

**Quiz at the right altitude.** If a concept is a detail of something larger, check whether the parent concept is the real learning edge. "How does `Set-Cookie` work?" might be a subquestion of "how does session-based auth work?" — quiz the one that matters more.

## Phase 3: Log

### Daily note (`learning/daily-notes/YYYY-MM-DD.md`)

Prepend YAML frontmatter (or merge if it exists):

```yaml
---
date: YYYY-MM-DD
project: project-name
concepts:
  - name: concept-name
    score: N
    gap: type  # only when score < 4
arcs:
  - arc-name
---
```

Body: what happened, quiz results table, learning patterns, key files, remaining work.

### current-state.md (`learning/current-state.md`)

Update quizzed concepts: score, gap, last-quizzed, increment times-quizzed, append to history. Create new entries as needed. Check existing names first — don't create near-duplicates.

## Anti-Patterns

- Don't teach during review. Note the gap; the next session teaches.
- Don't inflate scores. A generous 4 hides a concept from spaced repetition.
- Don't log without quizzing. Every logged score comes from a quiz answer, not session observation.
- Don't ask leading questions. Test recall, not recognition.

## Consumer Interfaces

**Weekly review** (future, runs Fridays): reads all week's frontmatter + current-state.md. Session-review must write clean YAML and use consistent concept names across sessions.

**Spaced repetition** (future): reads current-state.md only. Prioritizes by score ascending + last-quizzed ascending. Uses gap type to shape question style. Detects stalls via high times-quizzed with low score.
