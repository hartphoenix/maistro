---
name: lesson-scaffold
description: Restructures external learning materials into a conceptual scaffold tailored to Hart's current level. Takes source materials (assignment URLs, course chapters, video transcripts, pasted text) and optional context about current state. Use when Hart provides learning materials and wants to understand the "why" before executing.
---

# Lesson Scaffold

Restructure what someone else organized by procedure into what Hart needs organized by understanding.

## Inputs

1. **Source material** (required). URL, file path, or pasted text — any learning content.
2. **Current state** (optional). Energy, time, emotional context, what he needs. Shapes scope.

## Workflow

1. Fetch/read the source material.
2. Read `daily-notes/ARCS.md` for current learning state. Optionally read the most recent daily note.
3. Extract every concept the material teaches or assumes — explicit and implicit. Implicit concepts (things the lesson takes for granted) are often where the real learning edges are.
4. Cross-reference with ARCS.md. What's solid, what's growing, what's new.
5. Produce a scaffold:
   - **Concepts to understand** — each with a one-sentence bridge to something Hart already knows. Flag ARCS.md gaps by name.
   - **Execution sequence** — the instructor's steps reordered by conceptual dependency. Group steps that share a concept. Mark which concepts each step exercises.
   - **Resurfaced gaps** — low-scoring ARCS.md concepts that this material touches. Spaced repetition for free.
6. Present and ask Hart whether the scope and classification feel right. He drives.

## Anti-Patterns

- **Don't execute the assignment.** Scaffold is for understanding, not walkthrough.
- **Don't teach the concepts yet.** Name and bridge them. Teaching happens during execution.
- **Don't skip implicit concepts.** Procedural lessons bury assumptions.
- **Don't ignore emotional context.** "I'm tired" is load-bearing information about session scope.
