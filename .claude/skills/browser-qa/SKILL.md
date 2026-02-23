---
name: browser-qa
description: Tests a webapp in-browser using Chrome automation. Reads test priorities from and writes outcome logs to .claude/browser-testing/ in the target project. Covers visual inspection, functional flows, console errors, network requests, and responsive checks. Use when the user wants to test, QA, or verify a webapp, or check for regressions after changes.
---

# Browser QA

Test a running webapp systematically. Observe and report — never fix.

## File Structure

All QA files live in the target project at `.claude/browser-testing/`:

```
.claude/browser-testing/
├── priorities.md              # What to test, ordered by severity
└── outcomes/
    └── YYYY-MM-DD-HHMM.md    # One file per test run
```

## Workflow

### First Run (no priorities.md exists)

1. Ask: what does this app do, and what's the URL?
2. Do a quick exploratory pass — navigate the app, take screenshots, note the main flows.
3. Draft `priorities.md` with discovered test items. Present to user for approval before writing.

### Test Run

1. **Read** `.claude/browser-testing/priorities.md` — work through test items top-to-bottom.
2. **Open the app** in a new browser tab at the URL from the priorities header.
3. **For each test item**, run all applicable checks:
   - **Visual:** Screenshot at key states. Flag layout breaks, missing elements, clipping.
   - **Functional:** Click through the flow. Verify inputs, transitions, and outcomes.
   - **Console:** Read console errors/warnings after each action. Flag anything unexpected.
   - **Network:** Check for failed requests (4xx, 5xx), slow responses, missing resources.
   - Record PASS or FAIL with evidence.
4. **Responsive checks** if any test items target viewport behavior: resize to 1280px, 768px, and 375px and retest relevant items.
5. **Write outcome file** to `.claude/browser-testing/outcomes/YYYY-MM-DD-HHMM.md`.
6. **Update priorities.md**: mark tested items with result and date. Add any new issues discovered as untested items.
7. **Report summary** to user.

## File Formats

### priorities.md

```markdown
# Test Priorities

**App URL:** http://localhost:3000

## Critical
- [ ] Login flow completes without errors
- [x] Form validation shows error messages — PASS (2026-02-10)

## High
- [ ] Mobile nav works below 768px
- [-] Dashboard chart loads — FAIL (2026-02-10)

## Medium
- [ ] Dark mode toggle

## Low
- [ ] Footer links resolve
```

Mark items: `[x]` PASS, `[-]` FAIL, `[ ]` untested. Include date on tested items.

### Outcome file (outcomes/YYYY-MM-DD-HHMM.md)

```markdown
# Test Run — YYYY-MM-DD HH:MM

**URL:** http://localhost:3000
**Viewport:** 1280x720

## Results
- [x] Login flow — PASS
- [-] Dashboard chart — FAIL: `TypeError: Cannot read property 'map' of undefined`
- [x] Form validation — PASS

## Console Errors
- `TypeError: Cannot read property 'map' of undefined` — dashboard.js:142

## Network Issues
- GET /api/chart-data → 404 when dataset is empty

## New Issues Found
- Chart data endpoint returns 404 with empty dataset
- Nav z-index conflict below 480px
```

## Anti-patterns

- **Don't fix issues.** QA observes and reports. If you find a bug, log it — don't open the source file.
- **Don't skip the priority list.** Test what's listed, in order. Don't freelance additional testing until the list is complete.
- **Don't interpret screenshots beyond what's visible.** Report what you see ("button is off-screen at 375px"), not what you guess ("probably a flexbox issue").
- **Don't conflate with the debugger.** The debugger investigates a specific error in depth. Browser QA runs a systematic test pass. If a test reveals an error worth investigating, log it and suggest the debugger separately.
