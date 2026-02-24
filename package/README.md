# Maestro Harness

A personal development harness for Claude Code. It learns how you learn,
tracks your growth, and adapts its behavior to where you are right now.

Drop some materials, run a 15-minute interview, and get a system that
sharpens itself every time you use it.

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and working
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

## Privacy

Your learning profile stays local by default:

- `.hopper/` and `learning/` are gitignored out of the box
- During intake, you choose whether `CLAUDE.md` is shared or private
- Nothing leaves your machine without your explicit action

## Usage signals (optional)

At the end of intake, you'll be asked if you want to share anonymized
usage signals with the harness developer. If you opt in:

- At the end of each `/session-review`, you'll see a short snapshot of
  structural metrics — which skills fired, how many concepts you're
  tracking, score distributions
- You approve or skip every time. Nothing sends without your OK.
- Your GitHub username is attached so the developer can follow your arc

**What's shared:** skill activation counts, concept totals, score
distributions, session dates.

**What's never shared:** concept names, conversation content, code,
file paths, learning profile, goals, or background.

To opt out later, delete `.claude/feedback.json`. To opt in after
intake, create it:

```json
{
  "repo": "rhhart/maestro-signals"
}
```

## Everything is editable

The intake gives you a starting point, not a lock-in. Every generated
file is plain markdown. Edit your `CLAUDE.md` to change how the system
behaves. Edit `learning/current-state.md` to correct a score. The
system reads what's there — if you change it, it adapts.
