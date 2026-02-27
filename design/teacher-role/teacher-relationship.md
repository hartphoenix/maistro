# Teacher Relationship Layer

**Status:** Design draft
**Principle:** P10 — The system facilitates human teaching relationships
**Demo target:** Saturday 2026-02-28

---

## The insight

The boundary condition says the system supplements human learning
relationships — it does not replace them. But until now that was a
passive ceiling: the system acknowledged what it couldn't do and then
did nothing about it.

P10 makes this active. The system has a responsibility to facilitate
the human relationships that supply what it cannot: belonging,
witnessing, true expertise, valid teacherly authority, and the wisdom
to guide development through a landscape of uncomputable problems.

Two observations make this tractable:

1. **Every teacher is an obligate student.** A teacher at their own
   growth edge is a better teacher. The harness serves both roles
   equally because the role distinction is in the relationship between
   two users, not in the tool.

2. **The harness already produces the exchange signal.** Structured
   learner state — goals, gaps, trajectory, progress reviews — is a
   regularized data type describing what the student needs. When shared
   with consent, it becomes high-value signal for a teacher who might
   otherwise spend hours discovering the same information through
   conversation.

---

## Needs analysis

### What flows between student and teacher

**Student → Teacher (pull: "here's where I am")**
- Current state summary (gaps, scores, trajectory)
- Goals and how projects map to them
- Progress-review output (stalls, regressions, breakthroughs)
- Specific asks ("I'm stuck on X," "I need help scoping Y")

**Teacher → Student (push: "here's what I see")**
- Goal refinement suggestions ("your goal says X but your work
  suggests Y")
- Unblocking guidance on regressions/stalls
- Project-goal alignment ("this project would serve your growth edge
  better")
- Challenge calibration ("you're coasting" / "you're overwhelmed")

**Discovery (pub: "here's what I offer / need")**
- Student publishes: learning goals, growth edges, what kind of help
  they want
- Teacher publishes: expertise areas, capacity, teaching style
- Both browse and match

**Lifecycle**
- Relationship initiation (teacher claims a student, or student
  requests a teacher)
- Ongoing exchange (async — both are busy)
- Relationship evolution (roles shift; the student teaches back)

### What the harness already produces

| Data | Source | Format | Ready? |
|------|--------|--------|--------|
| Current state (scores, gaps) | `learning/current-state.md` | Markdown with YAML | Yes |
| Goals | `learning/goals.md` | Markdown | Yes |
| Arcs (developmental lines) | `learning/arcs.md` | Markdown | Yes |
| Progress review (cross-session) | `progress-review` skill | Markdown summary | Yes |
| Session review (single session) | `session-review` skill | Markdown + YAML frontmatter | Yes |
| Scoring rubric | `.claude/references/scoring-rubric.md` | Markdown | Yes |

The data exists. The gap is transport: getting it from the student's
machine to somewhere a teacher can see it, and getting the teacher's
response back into the student's session.

---

## Protocol design

### Transport: GitHub Issues

GitHub Issues is the transport layer. Rationale:

- **Zero new dependencies.** `gh` CLI is already installed,
  authenticated, and used by the signal return path.
- **Full markdown.** Progress reviews render natively.
- **Bidirectional.** Teacher comments on the issue. Agent reads
  comments with `gh issue view --comments`.
- **Structured workflow.** Labels provide state management without
  building anything.
- **Notifications built in.** GitHub emails the teacher. Discord
  webhook optional as a faster ping.
- **Searchable history.** Every exchange is permanent and filterable.

### Per-user signal repos

Each user publishes to their own GitHub repository. No shared repo.

- Student creates a personal signals repo (e.g.,
  `username/learning-signals`) — one `gh repo create` command
- Or uses their existing harness/project repo
- **Public by default.** Any GitHub user can view and comment on
  issues — no collaborator invites needed. The teacher just needs
  the repo URL.
- Teachers subscribe via GitHub's native Watch feature (Issues Only)
- GitHub handles notifications natively

This means:
- **Student owns their data.** Signal repo lives on their account.
- **No shared infrastructure.** No central repo to manage.
- **Role fluidity is natural.** You publish to your repo, you watch
  other people's repos. That's the whole relationship model.
- **Zero-friction teacher onboarding.** Public repo means the
  student shares a link, the teacher watches it. No invite flow.
- **Privacy choice stays with the student.** They can make the repo
  private later if they want — but then teachers need collaborator
  access to comment.

The repo needs:
- Issues enabled
- Public visibility (default — eliminates collaborator invites)
- Label set: `progress-review`, `goal-update`, `needs-teacher`,
  `responded`, `acknowledged`

### Exchange flow

```
Student session                    Student's signal repo            Teacher
─────────────────                  ─────────────────                ─────────

/session-review or
/progress-review
  ↓
Phase 5: Publish
  ↓
gh issue create ─────────────────→ Issue #42 on
  --repo my/learning-signals       my/learning-signals
  --label progress-review          "Progress Review: Feb 25"
  --assignee teacher-handle        [goals, gaps, trajectory,
  --body-file summary.md            specific asks]
                                        │
                                        │ ← GitHub Watch notification
                                        │
                                        ↓                    reads issue
                                   Teacher comments ←──────── writes guidance
                                     --label responded
                                        │
Next session:                           │
/startwork                              │
  ↓                                     │
Check for responses ←───────────── gh issue list
  --repo my/learning-signals         --label responded
  ↓
Surface teacher guidance
  in session plan
  ↓
Student reads, works,
session continues
```

### Label protocol

| Label | Meaning | Set by |
|-------|---------|--------|
| `progress-review` | A progress review for teacher consumption | Agent |
| `goal-update` | Student's goals have changed; teacher should review | Agent |
| `needs-teacher` | Student has a specific ask for the teacher | Agent or student |
| `responded` | Teacher has provided guidance | Teacher |
| `acknowledged` | Student has seen the teacher's response | Agent |

### Relationship scoping

Relationships are scoped by **time**, not by conceptual domain. Two
access modes:

1. **Subscription** (MVP) — Teacher subscribes to the student's
   progress reviews. Ongoing until either party ends it. The teacher
   receives the stream and responds to whatever is in their
   wheelhouse. Domain scope is emergent: it's whatever the teacher
   actually comments on.

2. **Ad-hoc sharing** (post-MVP) — Student shares a specific artifact
   with a specific person. One-off. No persistent relationship
   needed. Natural extension for the discovery layer, where people
   share outside established relationships.

This avoids maintaining a conceptual taxonomy ("this relationship
covers frontend development") that would be a headache to update as
both parties grow and the relationship evolves. The teacher
self-selects based on their own judgment about what they have
expertise in.

### Relationship types and discovery

The same discovery mechanism supports four match types. All use the
structured learner state the harness already produces — the difference
is which signal drives the match.

| Match type | Signal | Relationship |
|-----------|--------|-------------|
| Expertise → gap | My scores high where yours are low | Teacher-student (asymmetric authority) |
| Shared growth edge | Our gaps overlap | Peer (symmetric) |
| Complementary strengths | My strength is your gap, yours is mine | Mutual teaching (symmetric, role-fluid per domain) |
| Project affinity | We're building similar things | Collaborator → reveals latent matches |

**Peer relationships** are structurally distinct from teacher-student:
authority is absent or negotiated per-task rather than granted and
revoked. Peers find commonalities in their learning, exchange lessons
learned, and co-create (group projects). The peer relationship bridges
the personal harness and the coordination layer — it's how solo
learners become collaborators.

**Project affinity** is the most concrete discovery signal because it
falls out of what people are already doing. Two people building similar
projects start collaborating, and through that collaboration discover
latent matches: "you're way better at this part" (complement), "we're
both stuck on the same thing" (peer), "you've already solved what I
need" (teacher). The coordination layer is therefore a discovery
mechanism in its own right — the work reveals the relationship.

**Complement matches** are peer and teacher simultaneously: each person
teaches in their domain of strength and learns in their domain of
weakness. This is role fluidity at its most natural.

One discovery layer, one learner profile card, one discovery board.
The match type determines the relationship shape, not the mechanism.

### Configuration

Stored in `learning/relationships.md` (anticipating role fluidity —
the student may also be a teacher to others):

```yaml
# learning/relationships.md

# Where I publish (my own repo)
signal_repo: myusername/learning-signals

# Who I learn from (they watch my repo; I've added them as collaborators)
teachers:
  - github_handle: teacher-username
    discord_webhook: ""              # optional notification ping

# Who I teach (I watch their repos)
students:
  - github_handle: student-username
    repo: student-username/learning-signals
```

Human-editable. Intake prompts: "Do you have a teacher or mentor
you'd like to connect with?" and "Do you want to create a signals
repo for sharing your progress?" Skills check for presence and skip
teacher exchange steps if the file is absent or empty.

Setup steps for the student:
1. `gh repo create learning-signals --public` (or use existing repo)
2. Label setup (automated by intake — 5 labels for issue workflow)
3. Add teacher's handle to `learning/relationships.md`
4. Share the repo link with teacher: `https://github.com/USERNAME/learning-signals`

Setup steps for the teacher:
1. Watch the student's repo (Issues Only) via the shared link
2. Add student to their own `learning/relationships.md` under `students:`

---

## MVP — Build for demo (Saturday 2/28)

### What to build

**1. Progress-review publish step**

Add an optional Phase 5 to `progress-review` (or a standalone
`/share-progress` skill) that:
- Composes a teacher-facing summary from the progress review output
- Posts it as a GitHub Issue via `gh issue create`
- Labels it `progress-review`, assigns to teacher handle
- Confirms to the student what was shared

The summary should be curated, not a raw dump. The teacher doesn't
need every session log — they need: where the student is, where
they're going, what's changed since last time, and where they're
stuck.

**2. Startwork teacher-response check**

Add a step to `startwork` that:
- Runs `gh issue list --label responded --state open` on the student's signal repo
- If responses exist, reads the teacher's comments
- Surfaces the guidance in the session plan: "Your teacher responded
  to your Feb 25 review — they suggest focusing on component
  composition before tackling useReducer."
- After the student acknowledges, labels the issue `acknowledged`

**3. Teacher opt-in configuration**

Stored in `learning/relationships.md` (see §Configuration above).
Contains the student's signal repo, teacher handles, and optionally
students they teach. Intake asks about it. Skills check for presence
and skip the teacher exchange steps if absent.

### What to articulate (demo narrative, not code)

- **Obligate student:** The teacher runs their own harness instance.
  Same tools, same learning loop. The role is relational, not
  structural.
- **Discovery layer:** A skillshare/timeshare board where learner
  profiles and teacher profiles are browsable. The structured data the
  harness produces is the matching signal. Students find teachers by
  growth edge; teachers find students by expertise overlap.
- **Role fluidity:** User A learns React from User B, who learns
  system design from User C. No separate accounts. The harness
  identity is the person, not the role.
- **Teacher-assisted intake:** Teacher conducts or completes the
  intake interview, seeding the learner profile with higher-fidelity
  observations than the student alone would produce.
- **Teacher-assisted goal refinement:** Teacher reviews goals.md and
  proposes course corrections. The agent surfaces these as proposals,
  not mandates (P7: human authority is non-negotiable — applies to
  both student and teacher authority over their own domains).

---

## Architecture notes

### Relationship to the coordination layer

The teacher-student channel is a specialization of the coordination
protocol. The coordination layer connects harness instances for
task-oriented work (file conflicts, dependency tracking, triage). The
teacher relationship layer connects them for developmental work
(goals, gaps, trajectory, guidance).

Both use GitHub Issues as transport. Both use structured markdown as
the signal format. The difference is in what flows through the
channel and who reads it.

This means the coordination layer and teacher relationship layer share
infrastructure but serve different principles:
- Coordination → P5 (composable capabilities), P6 (self-improvement)
- Teacher relationship → P10 (human teaching relationships)

### Privacy model

- **Student controls what's shared.** The publish step is opt-in per
  review. The student can edit the summary before it's posted. Nothing
  is automatic.
- **Teacher sees summaries, not raw state.** The teacher gets a curated
  progress review, not direct access to `current-state.md` or session
  logs. The agent composes the summary with appropriate abstraction.
- **Learner profile cards (future)** are opt-in exports. The student
  decides what's public and what's private.

### Consent and authority

The teaching relationship is a triad: teacher, student, and the
domain being studied. The teacher's authority is domain-specific —
it derives from expertise in the domain, not from a general
hierarchical position. Authority does not transfer across domains.

The student grants authority to the teacher. This grant is:
- **At-will** — either party can exit at any time
- **Conditional** — premised on the teacher acting in the student's
  developmental interest
- **Revocable** — the student can withdraw the grant at any time

When teacher guidance conflicts with student intent, the student has
two valid moves:
1. **Defer** — "I trust your expertise here more than my own judgment.
   I'll provisionally pursue what you suggest."
2. **Revoke** — "I no longer grant you authority over this."

Both are legitimate. **The system has no role in resolving authority
conflicts between student and teacher.** It does not weight teacher
input higher, push back if the student ignores guidance, or side with
either party. The agent presents teacher guidance as information, not
instruction — the same way it presents any external input.

P7 (human authority) applies in both directions:
- The student's authority over their own learning is primary.
- The teacher's authority over their own time and expertise is
  respected. No automatic demands on teacher attention.

The system never positions the AI agent as a substitute for the
teacher's judgment. The agent facilitates the exchange; the human
relationships do the work that matters.

---

## Roadmap — Post-demo

Ordered by the feature-ordering heuristic (breadth × compounding ×
upstreamness × time-to-value):

1. **Teacher-assisted intake** — Highest upstream value. A teacher
   participating in intake produces a sharper initial model, which
   compounds through every subsequent session.

2. **Learner profile card** — Enables discovery. A portable, shareable
   summary of who you are as a learner: goals, growth edges, project
   interests, what kind of help you seek. Generated from harness state,
   edited by the student. Serves all four match types.

3. **Discovery board** — The matching layer. One mechanism, four match
   types (expertise→gap, shared growth edge, complementary strengths,
   project affinity). Profiles include both what you offer and what you
   seek. Could be as simple as a GitHub Discussions category or as
   complex as a web app with search and filtering. Start simple.

4. **Peer collaboration pathway** — Peers who discover shared growth
   edges or project affinity can exchange lessons learned, share
   session insights, and spin up group projects. The coordination
   layer handles the co-creation workflow; the relationship layer
   handles the discovery and ongoing learning exchange. Authority is
   negotiated per-task, not granted/revoked as in teacher-student.

5. **Teacher-published materials → lesson-scaffold** — Teacher
   disseminates lesson plans and learning materials through the
   subscription channel. Each student's harness runs them through
   `/lesson-scaffold`, which reads the student's `current-state.md`
   and classifies every concept relative to their level. Same lesson,
   different scaffold per student. Connects the teacher's intentional
   curriculum with per-student differentiation that the teacher
   doesn't have to do manually.

6. **Teacher-assisted goal refinement** — Teacher reviews and proposes
   changes to goals.md. The agent mediates: surfaces the proposal,
   explains the teacher's reasoning, lets the student decide.

7. **Role fluidity tooling** — Make it easy for one person to be
   student in one context and teacher in another. Might be as simple
   as a config that lists your relationships and their directions.

8. **Notification layer** — Discord webhooks, email digests, or
   whatever the teacher prefers. Start with Discord (trivial) and
   expand based on feedback.

---

## Resolved decisions

- **Authority model:** Triad (teacher, student, domain). Authority is
  domain-specific, granted at-will, revocable. System does not
  arbitrate conflicts. See §Consent and authority.
- **Relationship scoping:** By time, not conceptual domain. Domain
  scope is emergent (teacher comments on what they know). See
  §Relationship scoping.
- **Access mode (MVP):** Subscription. Teacher subscribes to student's
  progress reviews. Ad-hoc sharing is post-MVP.
- **Teacher suggestions:** Always proposals, never mandates. Agent
  presents them as information. P7 applies in both directions.
- **Config location:** `learning/relationships.md`. List format
  supports multiple teachers and anticipates role fluidity.
- **Signal repo architecture:** Per-user, not shared. Each user
  publishes to their own public repo. Teachers subscribe via GitHub
  Watch — no collaborator invite needed. Role fluidity = you publish
  to your repo, watch others'. No central infrastructure.
- **Discovery model:** One mechanism, four match types. Expertise→gap
  (teacher-student), shared growth edge (peer), complementary strengths
  (mutual teaching), project affinity (collaborator → reveals latent
  matches). Same learner profile card, same discovery board, different
  matching criteria.

## Open questions

- How much of the progress review should the teacher see? Full detail
  vs. executive summary. Probably configurable per relationship.
- What does the discovery board look like concretely? GitHub
  Discussions category? A simple web page? A structured file in a
  public repo?
- How does the system handle a teacher who doesn't respond? Timeout?
  Gentle prompt? Let it be?
- Integration with bootcamp structure: does the cohort itself become
  a network of teaching relationships, with the instructor as one
  node among many rather than the sole teacher? → Now partially
  addressed in `design/platform-layer.md` (courses, cohorts, schools).
- **Teacher expertise validation:** The system's internal scores are
  self-referential — they measure performance within the harness, not
  expertise in the world. Teaching requires understanding beyond
  competence: knowing why something works, common failure modes, how
  to sequence concepts for another person's learning. For the MVP
  this is solved by trust (you add a teacher you already know). For
  discovery at scale — where strangers match — teacher credibility
  becomes load-bearing. Two viable directions: **outcomes** (students
  who worked with this person improved — highest signal, hardest to
  measure, still gameable) and **vouching** (social proof through
  trusted networks — good when the network is good). External
  credentials rejected as unreliable: fakeable, gameable, and often
  poor proxies for actual teaching skill. Both viable directions need
  careful design and selective deployment. The initial bootcamp cohort
  is the right test bed: reputation is local, outcomes are visible in
  real time, and vouching has teeth. Learn what validation looks like
  there before generalizing. Unsolved, but integrity-critical.
