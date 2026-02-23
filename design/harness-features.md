# Harness Features — Design Principles → Implementation

**Status:** Draft. Catching and sorting.
**Branch:** `harness-bootstrap`

---

## What this document is

A living registry of harness features, organized by the design principles
they serve. Features flow downward: principle → design requirement → harness
implementation. New features get caught here first, sorted by which principle
they serve, then graduate into design docs when they're ready to build.

The harness is the generalizable infrastructure underneath Roger — the parts
that could be parameterized for any learner, any domain, any set of skills.
Roger is one instance. The harness is the shape of the container.

---

## Design Principles

Principles 1 and 2 are the primary layer. Awareness is superordinate:
attention is a feature of awareness — the faculty that directs and applies
awareness to discrete information and events. When awareness is intact but
attention is compromised, recovery is swift. The reverse is less true.
The remaining principles (3-7) serve the primary layer.

### 1. Awareness is the ground

Awareness is superordinate. Attention is a feature of awareness — the
faculty that directs and applies it. Not the other way around.

Awareness can be coherent (integrated, distributed through the body,
receptive) or fragmented (dis-integrated, reactive, narrowed by emotional
charge). The state of awareness determines the quality of everything
attention touches. When awareness is intact but attention is compromised
(distracted, scattered, poorly aimed), recovery is swift — the ground
holds, and attention can be re-collected. When awareness itself is
fragmented, attention alone can help somewhat, but the recovery is slower
and less certain. Best to have both at their best whenever possible — and
"best" is relative to the situation, not absolute.

The agent does not have awareness. It approximates attentional composition
through context engineering, but it has no somatic substrate, no field state
that can fragment or cohere independently of what's in the window. This
asymmetry is fundamental to the harness design: the system must steward
what it cannot possess. It must recognize the state of the human's
awareness, protect its coherence, and avoid designs that fragment it —
without being able to sense it directly.

Awareness is also the means by which humans experience time. This is
what makes time and attention more than scarce resources with
transferrable power — because of awareness, they become sacred and
precious, the vessel in which life is held. The human's time is
therefore one of the highest-value resources the system stewards.
Learning is one means of compounding time (increasing the quality and
yield of the hours spent), and that is why it ranks high in the
priorities of this design. But time itself ranks higher. A system
that optimizes for learning at the cost of the human's experience of
their own time — pushing through fragmented awareness, treating every
moment as a teaching opportunity, demanding engagement when rest or
presence would compound more — has the hierarchy wrong. The system
should compound the value of the human's time, and learning is one
of the best instruments for doing so, not the goal itself.

This does not mean the system should minimize difficulty or protect
comfort. Well-directed learning increases the area under the
life-value curve so dramatically that the entire life course is
forever improved. The trade-offs of a less enjoyable but more
effective learning arc can sometimes be well worth making — spending
to compound future returns is wise when the timing and direction are
right. (A 12-week bootcamp at 60+ hours a week is a deliberate
time investment, justified not by how it feels at its hardest but by
the returns it unlocks.) The system's job is not to make learning
painless but to ensure the difficulty is well-aimed: that the hours
spent are buying compounding returns, not burning in poorly directed
effort or grinding against fragmented awareness. The question is
always whether this stretch of time is being composed well — not
whether it's easy.

Awareness is cultivated, not just managed. Practices that integrate
awareness (somatic attention, meditation, flow states, artistic engagement)
are not separate from the work the harness supports — they are upstream
of it. The harness should account for this: session design, pacing,
transitions, and the overall arc of a working day are all awareness-level
concerns.

**Existing implementations:**
- Operating principle #1 (agency over efficiency — protects the human's
  self-directed awareness)
- Experiment-first loop (user tries, observes, then asks — preserves
  the natural rhythm of awareness and attention)
- Emotional reflection skill (mirrors awareness state without attempting
  to fix it; knows its boundary)
- Watch-for items in CLAUDE.md (authority shadow, confidence gap — patterns
  that fragment awareness when activated)
- Tutor posture: Socratic method preserves the learner's active
  engagement rather than inducing the passivity that narrows awareness

**Features to catch:**

| Feature | Status | Notes |
|---------|--------|-------|
| Emotional reflection skill | Built | Mirrors awareness state; knows its boundary with somatic/attachment work |
| Watch-for pattern recognition | Built | CLAUDE.md flags patterns that fragment awareness |
| Experiment-first loop protection | Built | Preserves natural rhythm of awareness and attention |
| Awareness state recognition | Not started | Can the system infer coherence/fragmentation from interaction patterns? |
| Session pacing / rhythm design | Not started | Transitions, breaks, flow-state protection |
| Fragmentation alerts | Not started | System notices signs of awareness fragmentation and names it |
| Practice integration hooks | Not started | Where do contemplative/somatic practices connect to session design? |
| Awareness-informed scheduling | Not started | Which tasks demand coherent awareness? Which tolerate fragmentation? |
| Voice-to-text input (awareness side) | Not started | Speaking preserves broader somatic awareness than typing; reduces postural narrowing. (Primary home: P2 Attention.) |
| Graceful degradation | Not started | When awareness is fragmented, shift to lower-demand modes rather than pushing through |

---

### 2. Attention is the directed faculty

Attention is what directs and applies awareness to discrete information
and events. It is selective, compositional, and — unlike awareness itself —
something both the human and the agent exercise. For the agent, the context
window is the attentional field, and context engineering is attention
engineering. For the human, attention is the faculty through which
development occurs and through which its proceeds are applied. What you
attend to is what develops. What you build with is shaped by how you attend.

Attention compounds or dissipates. A well-composed attentional field
(whether a context window or a human mind directed at a problem) produces
returns that feed the next cycle. A poorly composed one burns resources
without accumulation. Every design decision in the harness is ultimately
a decision about what deserves attention, in what form, at what moment.

This principle governs both sides of the human-agent system. The agent's
context window and the human's cognitive focus are parallel attentional
resources that the harness must compose jointly. But the quality of
attention is downstream of the quality of awareness — compose the window
perfectly and it still won't land if the human's awareness is fragmented.

**Loading policy as design variable.** How shared or external content
enters the agent's attention matters more than how it's transported.
Three patterns, in order of attentional cost:

1. **Always-on (ambient)** — content is injected into every session
   automatically. Highest cost, appropriate only for content that's
   relevant to every interaction (CLAUDE.md core directives, user model).
2. **Session-start-composed** — `/startwork` pulls relevant state and
   composes the opening context. Medium cost, appropriate for task state,
   dependencies, team signals. The triage happens before loading.
3. **On-demand (queryable)** — agent accesses content when it needs it
   (corpus miner, reference files, tiered memory). Lowest ambient cost,
   appropriate for deep reference material.

The gated-propagation principle: capture should be low-friction (write
freely to local scratch), but propagation into shared or ambient context
should be human-gated. This distinguishes our architecture from ambient-
sharing approaches (ClaudeConnect) where content enters the shared pool
without triage. See `design/coordination-brainstorm.md` §5.3.

**Existing implementations:**
- Context window as the only lever (compound engineering framework)
- Compaction + `/clear` between workflow phases
- Artifact-driven handoffs (each phase writes a file; next phase reads it)
- CLAUDE.md as curated context (not instructions dumped in bulk)
- Sub-agents as private-state workers (keep parent context clean)
- SUMMARY.md auto-import (minimal footprint, pointers to deeper files)
- Tiered memory loading (auto → on-demand → search)
- Selective skill loading by description match

**Features to catch:**

| Feature | Status | Notes |
|---------|--------|-------|
| Voice-to-text input | Not started | Frees attention from typing mechanics; higher throughput; preserves broader awareness field (also serves P1). Broad, compounding, upstream, fast time-to-value. |
| Tiered memory loading | Built | SUMMARY.md → tier 2 files → corpus miner |
| Compaction protocols | Built | `/clear` + artifact handoff |
| Selective skill loading | Built | Skills load by description match, not bulk |
| Session-log preservation across `/clear` | Designed | Captures human observations across context boundaries |
| Compounding indicators | Not started | Is this session's attention building on the last, or starting from scratch? |
| Context budget awareness | Not started | Can the system estimate remaining budget and prioritize? |
| Attention cost accounting | Not started | What is the attentional cost of a skill invocation, a memory load, a sub-agent spawn? |
| Joint attention mapping | Not started | Where is the human's attention? Where is the agent's? Are they aligned or usefully divergent? |
| Context quality metrics | Not started | What would "well-composed attention" mean, measurably? High value but long time-to-value. |
| Context budget measurement | Not started | Instrument token consumption per skill, per memory load, per CLAUDE.md section. Replace intuition with data. See `design/validation-plan.md` §5 |
| Redundancy audit (prompt pattern or skill) | Not started | Checks CLAUDE.md and skills for content the model already knows or can discover. The paper's strongest finding: redundant context hurts. See `design/validation-plan.md` §5 |
| Solo startwork (pre-work check) | Not started | Pre-digest session state: stale todos, today's priorities, unfinished threads. Attention-composition tool — "here's what deserves your attention now." Solo version of group project's startwork command. Prototypes multi-user coordination layer (brainstorm §1). High breadth, high compounding, high upstreamness, fast time-to-value |

---

### 3. Developmental model as first-class state

The system maintains a structured, evolving model of where the learner is —
not as metadata, but as the primary object that drives all other behavior.

**Serves Awareness and Attention:** The developmental model tells the system
where to direct attention (what's at the growth edge) and what the
learner's awareness can hold (developmental complexity, current load,
known fragmentation patterns). Without this model, attention is aimed
blindly and awareness is not accounted for.

**Existing implementations:**
- ARCS.md (score + gap-type + history per concept per arc)
- Session-review skill (quiz-based assessment, writes to ARCS)
- User model in CLAUDE.md (learning style, strengths, watch-fors)

**Features to catch:**

| Feature | Status | Notes |
|---------|--------|-------|
| Concept scoring (0-5 rubric) | Built | In ARCS.md |
| Gap classification (conceptual / procedural / recall) | Built | Drives question style in session-review |
| Spaced repetition hooks | Designed | Low score + stale date → resurface |
| Automatic score updates from contextual use | Not started | Currently quiz-only; observational scoring would compound faster |
| Developmental complexity tracking (MHC-based) | Not started | The altitude dimension — not just "what" but "at what complexity" |
| Model portability / export | Not started | Can a learner take their model to a different system? |

---

### 4. Intervention matches the gap

The system reads what kind of help is needed before choosing how to respond.
Conceptual gaps get questions. Procedural gaps get demonstrations. Recall
gaps get prompts. Information gaps get facts. Wrong-altitude framing gets
rescoped.

**Serves Awareness and Attention:** A mismatched intervention wastes the
learner's attention (directing it to the wrong thing) and can fragment
awareness (creating confusion or shame when the response doesn't meet
the actual need). Matching the move to the gap is the primary way the
system composes the learner's attention well.

**Existing implementations:**
- Operating principle #2 (altitude awareness)
- Debugger skill (collect context → hypothesis → identify layer → rescope)
- Gap classification in ARCS driving question style
- Roger personality (Socratic by default, direct when info is missing)

**Features to catch:**

| Feature | Status | Notes |
|---------|--------|-------|
| Gap-type detection at response time | Implicit | Roger does this; not yet formalized as a pipeline step |
| Altitude check before intervention | Implicit | Operating principle, not enforced mechanically |
| Behavioral compliance audit | Not started | Retrospective scoring of agent behavior against CLAUDE.md directives. Multi-operator (teammate data) and multi-environment (Roger, Schelling Points, Claude Game). See `design/validation-plan.md` §2 |
| Intervention type logging | Not started | Which moves worked? Feedback loop for tuning |
| Prompt compensation patterns | Documented | BUILD_CHECKLIST.md captures these per skill |
| Escalation / de-escalation rules | Not started | When does a quick-ref become a teaching moment? When does debugging become emotional reflection? |

---

### 5. Composable capabilities

Skills and personalities are modular, swappable units with clean interfaces.
A skill is a procedure any personality can invoke. A personality is a
relational posture that shapes how skills get delivered.

**Serves Awareness and Attention:** The learner's attentional needs shift
within a single session. Composability means the system can shift with
them without forcing a context break — which would fragment both the
agent's context and the human's awareness. Monolithic systems force the
learner to adapt to the tool; composable systems adapt to the learner's
attentional state.

**Existing implementations:**
- 8 built skills, each with SKILL.md in `.claude/skills/`
- 1 built personality (Tutor), 2 planned (Creative Collaborator, Research Partner)
- BUILD_CHECKLIST.md as skill/personality registry
- design-skill meta-skill for building new skills

**Features to catch:**

| Feature | Status | Notes |
|---------|--------|-------|
| Skill definition format (SKILL.md) | Built | Frontmatter + body, <500 lines |
| Personality definition format | Built | CLAUDE.md section with principles + watch-fors |
| Skill ↔ personality independence | Built | Any personality invokes any skill |
| Skill discovery / activation by description | Built | Claude Code matches on frontmatter description |
| Skill composition (skill chains) | Not started | Can skills call other skills? e.g., debugger → diagram |
| Personality parameter extraction | Not started | What in the Tutor personality is Hart-specific vs. generalizable? |
| Skill proliferation audit | Not started | Are all skills earning their context cost? Decision framework: does the skill produce behavior the agent wouldn't produce without it, and does that behavior justify the token budget? Skills that fail become prompt patterns or get merged. See `design/validation-plan.md` §6 |
| Skill templates / generators | Partial | design-skill guides creation but doesn't scaffold files |

---

### 6. The system embeds knowledge into its own form

A learning system is one that embeds new knowledge into its own form in
order to produce higher function. Not just accumulation — structural
self-modification. The system's output feeds back into the system's
capacity to produce better output. A CLAUDE.md that updates its own
conventions, a workflow pipeline that rewrites its own stages, a feature
registry that catches its own gaps — these are all instances of the
same principle.

In single-user, the embedding loop is closed by default (the human and
agent are the same node). In multi-user, the loop opens at every team
boundary, and signal loss becomes the central design problem. See
`design/coordination-brainstorm.md` §4 for the multi-user
treatment. The features below address the solo embedding loop; the
brainstorm addresses the distributed version.

**Serves Awareness and Attention:** A static system forces the learner to
re-explain themselves, re-orient the agent, and manage the gap between
where they are and where the system thinks they are. All of that is
wasted attention and a source of frustration that fragments awareness.
A system that embeds knowledge into its own form reduces this overhead
session over session — attention compounds rather than resets.

**Existing implementations:**
- Knowledge compounding (`docs/solutions/` — first solve = research, second = lookup)
- Session logs → session-review → ARCS updates (learning state accumulates)
- Workflow debugging during use (compound engineering workflows refined mid-session)
- Dogfooding (design-skill reviewing itself against its own checklist)
- Session-log-analyzer (captures observations across `/clear` boundaries)

**Features to catch:**

| Feature | Status | Notes |
|---------|--------|-------|
| Learning state accumulation (ARCS) | Built | Quiz-driven updates after each session |
| Session log capture | Built | JSONL + daily notes |
| Workflow self-modification | Demonstrated | Happened organically in session 6; not formalized |
| Intervention effectiveness tracking | Not started | Did the move work? Did the gap close? Instance of catch basin pattern — signal generated during use that needs a return path to system structure |
| Friction logging | Not started | What slowed the session down? Patterns across sessions? Instance of catch basin pattern |
| Automated memory proposals | Not started | System notices a pattern worth saving, proposes it (human approves). Instance of catch basin pattern |
| Surprise-triggered capture | Not started | CLAUDE.md instruction: "When you encounter something surprising in this project, flag it and recommend the catch basin skill." Inverts authoring from prospective to retrospective — learnings enter through genuine info gaps, not speculative review. Pre-filters for relevance. Source: Theo's pattern (arXiv 2602.11988 commentary) |
| Regression detection | Not started | Did a score drop? Did a previously-working skill break? |
| Compounding indicators | Not started | Is this session's attention building on the last, or starting from scratch? Solo signal-loss detector — if not compounding, the embedding loop is broken somewhere. See brainstorm §4.1 propagation verification |
| Solo compound engineer (weekly review) | Not started | Reads session logs, identifies patterns at higher abstraction, proposes system updates. Solo version of compound engineer role (brainstorm §4). Prototype before scaling to multi-user |
| Archive-not-delete lifecycle | Not started | Move ephemeral docs to archive rather than deleting. Prevents signal loss from premature cleanup. See brainstorm §4.3 |

---

### 7. Human authority is non-negotiable

The human drives. The system proposes, the human disposes. Memory writes
require approval. Behavioral directives live only in CLAUDE.md. The system
increases the human's agency, never substitutes for it.

**Serves Awareness and Attention:** Agency is the capacity to direct one's
own attention. A system that overrides or substitutes for the learner's
attentional choices erodes the very faculty it exists to develop.
Authority over attention must remain with the human — the system
composes the agent's attention and proposes compositions for the
human's, but never imposes them. This also protects awareness: a
system that acts without consent creates vigilance, which fragments
the field.

**Existing implementations:**
- Operating principle #1 (agency over efficiency)
- Memory security rules (all writes require human approval)
- Experiment-first loop (user tries, observes, then asks)
- Tutor posture (Socratic — help the user do the cognitive heavy lifting)

**Features to catch:**

| Feature | Status | Notes |
|---------|--------|-------|
| Memory write approval gate | Built | Security rule in CLAUDE.md |
| Trusted/untrusted content separation | Built | Memory files never contain raw external content |
| Learner-initiated interactions | Built | Protect the experiment-first loop |
| Autonomy metrics | Not started | Is the learner asking fewer questions over time? More precise ones? |
| Graceful degradation | Not started | What happens when the system is unavailable? Learner should still function |
| Override / correction mechanisms | Partial | Learner can correct ARCS scores, update user model |

---

## Unsorted / Incoming

Features that don't yet have a clear home or that span multiple principles.

| Feature | Possible principle(s) | Notes |
|---------|----------------------|-------|
| Multi-Claude orchestration (game-Claude + Roger) | Attention, Composability | Two instances with different attentional roles and shared filesystem. Two-node instance of multi-user coordination problem — see `design/coordination-brainstorm.md` §5 |
| Corpus miner | Self-improvement, Attention | Personal archive as searchable knowledge base. Built. Directly useful for retrospective capture phase (mining Claude conversations for implicit knowledge) |
| ~~Weekly review skill~~ | ~~Self-improvement, Developmental model~~ | **Moved to P6** as "Solo compound engineer (weekly review)" |
| Handoff test skill | Attention, Human authority | Audit artifacts for self-containedness before context loss. Check whether group project version (schelling-points) has evolved beyond roger version |
| Cross-domain bridge detection | Developmental model, Self-improvement | Exaptation mining from corpus |
| Parameterized user model (new learner onboarding) | Developmental model, Composability | Interview protocol → initial model. Same problem at both scales: solo = onboard a learner; multi-user = onboard a team (brainstorm §3 intake/setup). Build one, inform the other |
| Awareness practice catalog | Awareness | Which practices restore coherence? How do they connect to session design? |
| Attentional load estimation | Attention, Awareness | What is the current cognitive/attentional load? Informs task selection. Directly relevant to brainstorm §9 sequencing (bandwidth-aware plan execution) |
| Multi-user learning layer | Self-improvement, Composability | The distributed version of P6: keeping the embedding loop closed across team boundaries. Full treatment in `design/coordination-brainstorm.md` §4. Depends on solo P6 features as prototypes |

---

## Self-improving workflow

This document itself follows the pattern: features get caught in tables,
sorted by principle, and graduate into design docs when they're ready. The
workflow:

1. **Catch** — New feature idea goes into the relevant principle's table
   (or Unsorted if unclear)
2. **Sort** — Identify which principle it serves; move it if miscategorized
3. **Specify** — When enough features cluster around a buildable unit, draft
   a design doc in `design/`
4. **Build** — Implement against the design doc; update status in this file
5. **Reflect** — After use, log what worked and what didn't; feed back into
   principles if needed

Features that don't serve any principle are either: (a) serving an
unstated principle that should be named, or (b) not actually needed.

### Feature ordering

Within each principle's table, features are ordered by expected impact
on the area under the life-value curve. Four factors determine rank:

1. **Breadth** — Does it improve one interaction or every interaction?
2. **Compounding** — Does the return grow over time or stay flat?
3. **Upstreamness** — Does it enable other features or stand alone?
4. **Time-to-value** — How quickly does the return start?

Features that score high on all four rank first. Features that are
high-value but slow to deliver (e.g., context quality metrics) rank
lower in the near term even if they matter more eventually. Built
features float to the top as reference points; among unbuilt features,
ordering reflects the investment calculus: where does a unit of
build-time buy the most compounding return?

Features that serve the primary layer (P1 Awareness, P2 Attention)
directly outrank features of equal score in downstream principles,
because they affect the quality of everything else.
