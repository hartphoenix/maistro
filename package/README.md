# Maestro Harness

A personal development harness for Claude Code. It learns how you learn,
tracks your growth, and adapts its behavior to where you are right now.

Drop some materials, run a 15-minute interview, and get a system that
sharpens itself every time you use it.

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and working
- [GitHub CLI (`gh`)](https://cli.github.com/) installed and authenticated — used
  for usage signals. Run `gh auth status` to check. If you need to set it up:
  [GitHub CLI quickstart](https://docs.github.com/en/github-cli/github-cli/quickstart)
- A project directory (new or existing)

## Quick start

### 1. (Optional) Load the hopper

Drop files into `.hopper/` before running intake. The more signal you
provide, the sharper your starting profile:

- **Code you've written** — shows what you can build and how you think
- **Resumes or portfolios** — background, experience, trajectory
- **Writing samples** — communication style, how you explain things
- **Conversation exports** — past Claude/ChatGPT transcripts that show
  your working patterns
- **Course materials** — syllabi, assignments, lecture notes for what
  you're currently learning

The hopper is optional. If you skip it, the interview covers everything —
it just takes a few more questions.

### 2. Run intake

```
/intake
```

The intake interview has four phases:

1. **Discover** — scans your hopper materials (if any) to build a
   starting picture
2. **Interview** — conversational, ~10-15 minutes. Covers your
   background, goals, current skills, how you learn, and how you like
   to work
3. **Synthesize** — generates your personalized configuration and
   learning state
4. **Write** — presents everything for your approval before writing
   any files

Nothing is written without your explicit OK.

### 3. Start working

After intake, use Claude Code normally. The harness works in the
background:

- **Skills activate contextually** — when you hit an error, the
  debugger skill shapes the response. When you ask a quick question,
  quick-ref answers tersely. You don't invoke them manually.
- **Run `/session-review` at the end of sessions** — this is the
  learning loop. It analyzes what you worked on, quizzes you on key
  concepts, and updates your learning state.
- **Your profile sharpens over time** — concept scores, gap
  classifications, and growth trajectories update session by session.

## What intake creates

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Personalized configuration — how the system behaves toward you |
| `learning/goals.md` | Your aspirations as states of being, not skill checklists |
| `learning/arcs.md` | Capability clusters — groups of skills serving your goals |
| `learning/current-state.md` | Concept inventory — scores, gap types, evidence sources |

After sessions, `/session-review` also creates session logs in
`learning/session-logs/`.

## Skills included

| Skill | What it does |
|-------|-------------|
| **intake** | Onboarding interview that bootstraps your profile |
| **session-review** | End-of-session analysis, quiz, and learning state update |
| **quick-ref** | Fast, direct answers. Flags structural gaps in one sentence. |
| **debugger** | Visibility-first debugging. Gets the full error before guessing. |
| **lesson-scaffold** | Restructures learning materials around what you already know |
| **startwork** | Session planner. Reads your state and proposes what to work on. |
| **progress-review** | Cross-session pattern analysis. Detects stalls, regressions, and goal drift that single sessions miss. Runs automatically via startwork when enough sessions accumulate, or invoke directly. |

## Privacy

Your learning profile stays local by default:

- `.hopper/` and `learning/` are gitignored out of the box
- During intake, you choose whether `CLAUDE.md` is shared or private
- Nothing leaves your machine without your explicit action

## Usage signals

This package ships with `.claude/feedback.json` pre-configured — as a
tester, your feedback helps improve the harness.

At the end of each `/session-review`, you'll be asked if you want to
send a feedback signal. You approve, edit, or skip every time. Nothing
sends without your OK.

**What's shared:** your feedback about whether the harness worked well,
plus the agent's own observations about friction and file-state issues.

**What's never shared:** quiz answers, scores, conversation content,
code, file paths, learning profile, goals, or background.

To opt out, delete `.claude/feedback.json`.

## Everything is editable

The intake gives you a starting point, not a lock-in. Every generated
file is plain markdown. Edit your `CLAUDE.md` to change how the system
behaves. Edit `learning/current-state.md` to correct a score. The
system reads what's there — if you change it, it adapts.
