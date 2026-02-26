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
- [`jq`](https://jqlang.github.io/jq/download/) — used by the installer for safe JSON manipulation
- `git` — you probably already have this

## Install

```bash
git clone https://github.com/hartphoenix/maestro ~/maestro
cd ~/maestro && bash scripts/bootstrap.sh
```

Bootstrap does three things:
1. Registers skills globally so they're available in any project
2. Registers a session-start hook that checks your learning state
3. Writes a path-resolution section to `~/.claude/CLAUDE.md`

Everything is tracked in a manifest (`~/.config/maestro/manifest.json`)
and backed up. Run `bash scripts/uninstall.sh` to reverse it cleanly.

## Quick start

### 1. (Optional) Load your background

Drop files into `~/maestro/background/` before running intake. The more
signal you provide, the sharper your starting profile:

- **Code you've written** — shows what you can build and how you think
- **Resumes or portfolios** — background, experience, trajectory
- **Writing samples** — communication style, how you explain things
- **Conversation exports** — past Claude/ChatGPT transcripts that show
  your working patterns
- **Course materials** — syllabi, assignments, lecture notes for what
  you're currently learning

The background folder is optional. If you skip it, the interview covers
everything — it just takes a few more questions.

### 2. Run intake

Start Claude Code in **any project directory** and run:

```
/intake
```

The intake interview has four phases:

1. **Discover** — scans your background materials (if any) to build a
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

After intake, use Claude Code normally in any project. The harness works
in the background:

- **Skills activate contextually** — when you hit an error, the
  debugger skill shapes the response. When you ask a quick question,
  quick-ref answers tersely. You don't invoke them manually.
- **Run `/session-review` at the end of sessions** — this is the
  learning loop. It analyzes what you worked on, quizzes you on key
  concepts, and updates your learning state.
- **Your profile sharpens over time** — concept scores, gap
  classifications, and growth trajectories update session by session.

## Update

```bash
cd ~/maestro && git pull
```

Skills update immediately. Learning state (`~/maestro/learning/`) is
never overwritten by pull — it's gitignored.

If you set `"updates": "notify"` (default), the harness tells you when
updates are available at session start.

## Uninstall

```bash
bash ~/maestro/scripts/uninstall.sh
```

Removes the settings.json entries, the CLAUDE.md section, and the
config directory. Learning state is preserved — you're told where it
is and can delete it manually.

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

- `background/` and `learning/` are gitignored out of the box
- During intake, you choose whether `CLAUDE.md` is shared or private
- Nothing leaves your machine without your explicit action

## Recommended: Install a command guard

AI coding agents occasionally attempt destructive commands — `git reset
--hard`, `rm -rf`, force pushes — that can destroy uncommitted work in
seconds. This is a [known class of issue](https://github.com/anthropics/claude-code/issues/7232)
across all AI coding tools.

[DCG (Destructive Command Guard)](https://github.com/Dicklesworthstone/destructive_command_guard?tab=readme-ov-file#dcg-destructive-command-guard)
intercepts these before execution and explains what the agent was trying
to do. Install it once and it protects all your projects:

```bash
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/destructive_command_guard/main/install.sh?$(date +%s)" | bash -s -- --easy-mode
```

**When DCG blocks an agent command:** read DCG's explanation of what it
intercepted. If the command is legitimately needed — for example,
reverting a mistake the agent just made — run it yourself in the
terminal. Otherwise, let the block stand and tell the agent to find an
alternative approach.

## Data sharing (optional)

During `/intake`, you'll be asked if you want to share learning data
to GitHub. One question, one consent. If you opt in, two things happen:

1. **Developer signals** — at the end of each `/session-review`, a
   short signal is posted to the developer's repo with your feedback on
   how the tool worked, plus learning metrics (concept scores, gap
   types, progress patterns). You see every signal before it sends and
   approve or skip each one.

2. **Progress repo** — a public GitHub repo is created on your account
   (`your-username/learning-signals`). When you run `/progress-review`,
   a summary posts there. Teachers, mentors, or peers can watch the
   repo and comment with guidance — `/startwork` surfaces their
   responses in your next session.

**What's shared:** concept scores, gap types, progress patterns, goals,
and growth edges.
**What's never shared:** conversation content, code, file paths,
background materials, or raw quiz answers.

**To invite a teacher:** send them your progress repo link. They Watch
it on GitHub. Add their GitHub handle to `learning/relationships.md`
and `/progress-review` will assign issues to them automatically.

To opt out of all data sharing, delete `.claude/feedback.json`.

## Everything is editable

The intake gives you a starting point, not a lock-in. Every generated
file is plain markdown. Edit your `CLAUDE.md` to change how the system
behaves. Edit `learning/current-state.md` to correct a score. The
system reads what's there — if you change it, it adapts.
