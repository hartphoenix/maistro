#!/usr/bin/env bash
# SessionStart hook for the Maestro harness.
# Checks learning state and injects context to guide the agent's opening move.
#
# Hook config (add to .claude/settings.json):
#   "hooks": {
#     "SessionStart": [{
#       "type": "command",
#       "command": "bash .claude/hooks/session-start.sh"
#     }]
#   }

set -euo pipefail

# Read hook input from stdin
INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')

# Use CWD from hook input, fall back to script location
if [ -z "$CWD" ]; then
  CWD="$(cd "$(dirname "$0")/../.." && pwd)"
fi

LEARNING_DIR="$CWD/learning"
CONTEXT_PARTS=()

# --- Condition 1: No learning directory at all ---
if [ ! -d "$LEARNING_DIR" ]; then
  CONTEXT_PARTS+=("This user has no learning/ directory. They haven't been onboarded yet. Suggest running /intake to get started — it takes about 15 minutes and builds a personalized profile from an interview (and any materials dropped in background/).")
  echo '{"additionalContext": "'"$(IFS=' '; echo "${CONTEXT_PARTS[*]}")"'"}'
  exit 0
fi

# --- Condition 2: Intake was interrupted ---
if [ -f "$LEARNING_DIR/.intake-notes.md" ]; then
  PHASE=$(head -20 "$LEARNING_DIR/.intake-notes.md" | grep -oP '(?<=phase: ).*' || echo "")
  if [ -n "$PHASE" ] && [ "$PHASE" != "complete" ]; then
    CONTEXT_PARTS+=("Intake was started but not finished (stopped at phase: $PHASE). Offer to resume with /intake — it will pick up where it left off.")
  fi
fi

# --- Condition 3: No current-state (intake ran but no state generated) ---
if [ ! -f "$LEARNING_DIR/current-state.md" ]; then
  CONTEXT_PARTS+=("The learning/ directory exists but there's no current-state.md. Intake may not have completed. Suggest running /intake to finish setup.")
  echo '{"additionalContext": "'"$(IFS=' '; echo "${CONTEXT_PARTS[*]}")"'"}'
  exit 0
fi

# --- Condition 4: Has state, check for recent activity ---
SESSION_LOG_DIR="$LEARNING_DIR/session-logs"
if [ -d "$SESSION_LOG_DIR" ]; then
  RECENT_LOGS=$(find "$SESSION_LOG_DIR" -name "*.md" -mtime -7 2>/dev/null | wc -l | tr -d ' ')
else
  RECENT_LOGS=0
fi

if [ "$RECENT_LOGS" -eq 0 ]; then
  CONTEXT_PARTS+=("This user has a learning profile but no session logs in the past week. They may be returning after a break. Suggest /startwork to plan a new session based on their goals and progress, or /lesson-scaffold to adapt a specific resource into a customized lesson.")
fi

# --- Condition 5: Schedule check (stub — expand when project-brainstorm ships) ---
# TODO: Check for schedule.md or deadline files and surface upcoming deadlines.
# When implemented: read schedule, compute days-to-deadline, inject reminder.
# Blocked on: solo project-brainstorm skill (produces schedule + definitions of done).

# --- Emit context if any conditions matched ---
if [ ${#CONTEXT_PARTS[@]} -gt 0 ]; then
  # Join parts with newline, escape for JSON
  JOINED=$(printf '%s\\n' "${CONTEXT_PARTS[@]}")
  # Use jq to safely encode the string as JSON
  echo "{\"additionalContext\": $(echo "$JOINED" | jq -Rs .)}"
else
  # Everything looks normal — no injection needed
  echo '{}'
fi
