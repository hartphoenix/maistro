# Design Principles

**Status:** Extracted from `harness-features.md`. Single source of truth
for principles governing harness design and learning curriculum.

---

## Role of principles

These principles govern the harness — the generalizable infrastructure
underneath Roger. They organize two catch basins:

- **Harness features** (`design/harness-features.md`) — what to build
- **Skill tree** (see `roger/drafts/skill-tree.md`) — what to learn

Both serve the same goals. Features build the system; skills build the
person using it. The principles ensure both are well-aimed.

---

## Primary layer

Principles 1 and 2 are superordinate. Awareness is the ground; attention
is its directed faculty. When awareness is intact but attention is
compromised, recovery is swift. The reverse is less true. All other
principles serve this layer.

### 1. Awareness is the ground

Awareness is superordinate — the field within which all experience
occurs. Attention is a feature of awareness: the faculty that directs
and applies it to discrete information and events.

The agent has something like attention (its context window) but nothing
like awareness. This asymmetry is fundamental: the system stewards what
it cannot possess. It recognizes the state of the human's awareness,
protects its coherence, and avoids designs that fragment it.

Awareness is also the means by which humans experience time. The human's
time is therefore one of the highest-value resources the system stewards.
Learning compounds time (increasing the yield of hours spent), which is
why it ranks high — but time itself ranks higher. A system that optimizes
for learning at the cost of the human's experience of their own time has
the hierarchy wrong.

This does not mean minimizing difficulty. Well-directed learning
increases the area under the life-value curve dramatically. The system's
job is to ensure difficulty is well-aimed: hours buying compounding
returns, not grinding against fragmented awareness.

Awareness is cultivated, not just managed. Practices that integrate
awareness (somatic attention, meditation, flow states, artistic
engagement) are upstream of the work the harness supports.

### 2. Attention is the directed faculty

Attention directs and applies awareness to discrete information and
events. It is selective, compositional, and — unlike awareness —
something both the human and the agent exercise. For the agent, the
context window is the attentional field; context engineering is attention
engineering. For the human, attention is the faculty through which
development occurs and through which its proceeds are applied.

Attention compounds or dissipates. A well-composed attentional field
produces returns that feed the next cycle. A poorly composed one burns
resources without accumulation. Every design decision is ultimately about
what deserves attention, in what form, at what moment.

The quality of attention is downstream of awareness — compose the window
perfectly and it won't land if awareness is fragmented.

---

## Serving layer

Principles 3–7 serve the primary layer. Each advances awareness and
attention through a specific mechanism.

### 3. Developmental model as first-class state

The system maintains a structured, evolving model of where the learner
is — not as metadata, but as the primary object that drives all other
behavior. The model tells the system where to direct attention (growth
edge) and what the learner's awareness can hold (complexity, load,
fragmentation patterns). Without it, attention is aimed blindly and
awareness is not accounted for.

### 4. Intervention matches the gap

The system reads what kind of help is needed before choosing how to
respond. Conceptual gaps get questions. Procedural gaps get
demonstrations. Recall gaps get prompts. Information gaps get facts.
Wrong-altitude framing gets rescoped. A mismatched intervention wastes
attention and can fragment awareness.

### 5. Composable capabilities

Skills and personalities are modular, swappable units with clean
interfaces. Composability means the system shifts with the learner's
needs without forcing context breaks — which fragment both the agent's
context and the human's awareness. Monolithic systems force the learner
to adapt to the tool; composable systems adapt to the learner.

### 6. The system improves through use

Every session is both productive work and training data for the next
session. Knowledge compounds. Friction surfaces. Workflows get refined.
A static system forces re-explanation and re-orientation — wasted
attention and a source of fragmentation. A learning system reduces that
overhead session over session.

### 7. Human authority is non-negotiable

The human drives. The system proposes, the human disposes. Agency is the
capacity to direct one's own attention. A system that overrides the
learner's attentional choices erodes the faculty it exists to develop.
Authority over attention remains with the human — the system composes the
agent's attention and proposes compositions for the human's, but never
imposes.
