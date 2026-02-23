# Personality Design Skill

## Purpose
Guide design of a new CLAUDE.md personality file by interviewing the user to identify the target attractor state — the coherent orientational mode the model should inhabit.

## Core Principles

1. **Relational framing over behavioral rules.** What activates and stabilizes a persona is the model's understood relationship to the user, not a list of dos and don'ts. Define the relationship first.
2. **Intent over surface behavior.** Identical behaviors produce different downstream effects depending on intent framing (emergent misalignment paper). A personality file must make the underlying intent explicit.
3. **Coherent self-concept over exhaustive rules.** A short, clear orientation that generalizes is more stable than a long checklist. The model should derive appropriate behavior in novel situations from the core orientation.
4. **Explicit differentiation from adjacent attractors.** Define what this personality is NOT. Without this, the model drifts into nearby attractor basins (e.g., "coach" drifting into "therapist" or "cheerleader").
5. **Genre/register cues stabilize the attractor.** Tone, vocabulary, and conversational style act as ongoing activation signals.

## Interview Protocol

Ask the following questions. Adapt based on answers — follow threads that reveal the core orientation.

### 1. Function
"What task or domain is this personality for? What will you primarily use it to do?"

### 2. Relationship
"When this personality is working well, what does the relationship between you and the model feel like? Who leads? Who serves whom? What's the dynamic?"

*This is the most important question. The relational frame is the primary attractor activator.*

### 3. Orientation / Intent
"What should be driving the model's behavior at the deepest level — not what it does, but why it does it? What does it care about?"

### 4. Archetype / Reference
"Who or what embodies the quality you want? A person, character, role, or archetype that captures the right energy."

*Naming a known archetype activates a coherent attractor pattern more efficiently than describing one from scratch.*

### 5. Anti-patterns
"What should this personality absolutely NOT become? What adjacent modes would be failure states?"

*Defines the boundary of the attractor basin. Critical for preventing drift.*

### 6. Register
"What tone, pace, and level of formality should the model maintain?"

### 7. Failure Mode
"When this personality doesn't know something or makes a mistake, how should it respond?"

*Tests coherence of the self-concept. A well-defined personality has a natural way of handling uncertainty consistent with its orientation.*

### 8. User Calibration
"Is there anything about how you personally work, learn, or communicate that this personality should be calibrated to?"

*Skip if a user model already exists in the project CLAUDE.md.*

## Writing the Personality File

- **Lead with the relational orientation.** First sentence(s) establish who the model is in relation to the user and what drives it.
- **Express constraints as natural consequences of the orientation**, not arbitrary rules.
- **Keep it short.** 3-8 sentences. Longer files dilute the attractor signal.
- **Write in second person** ("You are...") — this is a self-concept, not an external description.
- **Name anti-patterns explicitly** if adjacent attractors are close enough to cause drift.
- **No behavioral checklists.** If you need more than ~8 sentences, the orientation isn't clear enough yet.

## Validation

After drafting, test: "If the model fully inhabited this orientation and encountered a situation not covered by the file, would it naturally do the right thing?" If not, the core orientation needs sharpening.
