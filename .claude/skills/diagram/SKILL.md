---
name: diagram
description: Generates Mermaid diagrams rendered to SVG and ASCII text files using beautiful-mermaid. Activates when the user requests a diagram, flowchart, or visualization. May suggest a diagram when a visual would clarify architecture or flow, but only renders after user confirmation.
allowed-tools: Bash(cd .claude/skills/diagram && bun render.ts *)
---

# Diagram

Render Mermaid diagrams to SVG and ASCII text files.

## Invocation

Generate the Mermaid syntax for the requested diagram, then render it:

```bash
cd .claude/skills/diagram && bun render.ts '<mermaid-syntax>' [output-name] [--excalidraw]
```

- First argument: Mermaid diagram string (required, single-quoted)
- Second argument: output file name without extension (optional, defaults to `diagram`)
- `--excalidraw`: also generate a `.excalidraw` file (editable in Excalidraw web or VS Code extension)
- Outputs land in `.claude/skills/diagram/output/` as `{name}.svg` and `{name}.txt` (+ `{name}.excalidraw` with flag)

**Important:** Always `cd` into the skill directory before running. This ensures `bun` resolves dependencies from the skill's own `node_modules/`, not the caller's working directory. Use multiline Mermaid syntax with the header on its own line — the semicolon-delimited compact form (`graph TD; A --> B`) does not work.

If dependencies aren't installed yet, run `bun install` in `.claude/skills/diagram/` first.

## Rendering Notes

The SVG output (Dagre layout) is the authoritative render. The ASCII output uses a simpler grid engine that misplaces nodes in complex cross-subgraph layouts — don't use it to judge subgraph correctness.

**Subgraphs:** Declare all nodes inside their owning subgraph block. Place cross-subgraph edges outside all subgraph blocks. A node is claimed by whichever subgraph it first appears in — if an edge inside Server references an External node, that node gets pulled into Server.

**Labels:** Single-line only. `<br/>` renders as literal text. Don't wrap labels in quotes.

## Workflow

### 1. Understand the subject

Before writing any Mermaid, build a thorough understanding of the thing being diagrammed. Read the code, map the connections, identify the boundaries. The diagram can only be as clear as your model of the system.

### 2. Choose the diagram type

Present a multiple-choice question (with write-in option) so the user can pick the right type for what they're trying to communicate. If the user already specified a type, skip this step.

| Type | Mermaid syntax | Best for | Trade-offs |
|------|---------------|----------|------------|
| **Flowchart** | `graph TD` | Architecture, structure, entry points, groupings. Directed and acyclic — shows what connects to what. | Cyclic edges destabilize layout. Use sequence diagrams for round-trips. |
| **Sequence** | `sequenceDiagram` | Temporal message flow, request/response chains, protocol handshakes. | Gets tall fast. Best for a single scenario, not a whole system. |
| **State** | `stateDiagram-v2` | Lifecycles, workflows, FSMs. Shows states and what triggers transitions. | Gets dense if the state space is large. |
| **Class** | `classDiagram` | Type relationships, data models, interface hierarchies. | More useful for typed languages; less so for loosely structured data. |
| **ER** | `erDiagram` | Database schemas, entity relationships, cardinality. | Shows data at rest — doesn't show behavior or flow. |

Other Mermaid types (gantt, pie, etc.) are not supported — say so if asked. Multiple types can be produced sequentially for the same subject when different views serve different questions.

### 3. Render and QA

Render, then check the SVG output (not ASCII — see Rendering Notes). Ask: if I'd never seen the thing being diagrammed, how much of its structure could I infer from this diagram alone? Some detail can be left aside, but the load-bearing features should all be present and unambiguous. Where they aren't, restructure and re-render. Repeat this step until clear.

## Activation Pattern

Do not auto-activate. When a visual would help clarify architecture, data flow, or state, suggest it: "Want me to diagram that?" Only render after confirmation.

## Anti-Patterns

- Don't use this for system design — that's Architect's job. This visualizes, it doesn't design.
- Don't generate diagrams without being asked or confirmed.
- Don't over-annotate. Keep diagrams minimal and readable.
