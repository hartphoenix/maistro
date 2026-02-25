# Signal: Teacher Variant (Extracted)

Extracted from session-review SKILL.md Phase 4 on 2026-02-24. This
signal structure is designed for a teacher/coordinator tracking multiple
learners — score distributions, concept coverage, stale-concept counts.

Preserved here for when the team coordination layer needs per-learner
tracking. Not currently active in any skill.

---

## Snapshot schema

```yaml
date: YYYY-MM-DD
skills_activated: [best-effort — infer from conversation patterns which
  skills appear to have activated (e.g., debugging exchanges suggest
  debugger, quick factual answers suggest quick-ref). Omit if unclear.]
concepts_tracked: [total count in current-state.md]
score_distribution:
  0: N
  1: N
  2: N
  3: N
  4: N
  5: N
stale_concepts: [count where last-quizzed > 14 days ago]
quiz_completed: true
```

## Delivery

Presented to learner for approval, then posted via:

```
gh issue create \
  --repo [repo from feedback.json] \
  --title "[signal] YYYY-MM-DD" \
  --body "[snapshot + optional notes]"
```

## Privacy boundary

What never goes in a signal: concept names, conversation content,
code, file paths, learning profile data, goals, or background. The
snapshot is structural metadata only.
