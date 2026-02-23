---
name: design-iterate
description: Recursively implements design specifications for a webapp. Reads user-provided specs, makes one change at a time, verifies each visually in-browser via Chrome automation, and loops until the spec is satisfied. Use when the user has design improvements, UI changes, layout fixes, or visual specifications to apply iteratively to a running webapp.
---

# Design Iterate

Implement design specs one change at a time. Every change gets verified in-browser before moving on.

## Workflow

### 1. Receive spec

The user provides a design spec — could be a list of changes, a screenshot of desired outcome, a description, or a reference file.

Parse the spec into discrete, ordered items. Example:

> User: "Make the header sticky, bump the body font to 18px, and add a subtle border to the cards."

Parsed items:
1. Make header sticky
2. Increase body font size to 18px
3. Add border to card components

Present the list back to the user for confirmation before starting.

### 2. Implementation loop

For each spec item:

1. **Read** the relevant source files. Understand what exists before changing it.
2. **Implement** the change. One item at a time — don't batch.
3. **Verify in browser:**
   - Navigate to (or refresh) the app in a browser tab
   - Take a screenshot
   - Present the result to the user: "Here's what [item] looks like now."
4. **Wait for feedback.** Three possible responses:
   - **Approved** → mark done, move to next item
   - **Adjust** → user gives correction, re-implement and re-verify
   - **Revert** → undo the change, discuss approach before retrying

### 3. Completion

After all items are done (or user stops):

- Summarize what was changed and where (files, line ranges)
- Note any remaining spec items not yet addressed
- Suggest running browser-qa if the changes warrant regression testing

## Principles

- **Spec fidelity.** Implement what was asked, not what you think looks better. If the spec says "red border," use red — don't substitute a color you prefer.
- **One at a time.** Single changes are easier to verify, easier to revert, and easier to discuss. Resist the urge to batch "quick" changes.
- **Browser is the source of truth.** Code changes aren't done until they look right in the browser. Always verify visually.
- **Pause at ambiguity.** If a spec item is unclear (e.g., "make it cleaner"), ask what that means concretely before implementing. Don't guess.

## Anti-patterns

- **Don't redesign.** Implement the spec. If you notice something that could be better, mention it — don't do it.
- **Don't skip verification.** Every change gets a browser check. "It's just a color change" still gets verified.
- **Don't batch spec items.** Even if two items seem related, implement and verify separately.
- **Don't confuse with browser-qa.** This skill implements changes. QA tests without changing. If the user says "test this," that's QA.
