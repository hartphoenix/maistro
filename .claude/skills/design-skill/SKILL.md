---
name: design-skill
description: Guides creation of new Claude Code skills. Walks through scoping, SKILL.md authoring with proper frontmatter and body, and project checklist updates. Use when building a new skill, refactoring an existing one, or reviewing a skill draft for quality.
---

# Design Skill

Build skills that earn their token cost. Every line in a SKILL.md competes with conversation history for context — include only what Claude doesn't already know.

## Workflow

### 1. Scope the skill

Before writing anything, answer:

- **What does it do?** One sentence.
- **When should Claude activate it?** What triggers distinguish this from other skills?
- **What degree of freedom?**
  - **High** (text instructions): multiple valid approaches, context-dependent decisions. Most skills here.
  - **Medium** (pseudocode/templates): preferred pattern exists but variation is acceptable.
  - **Low** (exact scripts): fragile operations, specific sequence required.
- **What is it NOT?** Name the adjacent skill or mode it could drift into. This is how you prevent attractor bleed between skills.

If the skill is already spec'd in ``design/build-registry.md`` (project root), read that entry — it contains scoping decisions already made.

### 2. Write the frontmatter

```yaml
---
name: skill-name
description: Third-person description of what the skill does and when to use it.
---
```

**`name` constraints:**
- Lowercase letters, numbers, and hyphens only
- Maximum 64 characters
- No reserved words: "anthropic", "claude"
- Be specific: `design-skill` not `helper`

**`description` constraints:**
- Maximum 1024 characters
- Third person always ("Processes..." not "I process..." or "Use this to process...")
- Must include BOTH what the skill does AND when to activate it
- Include key terms Claude will match against when selecting skills

The description is how Claude decides whether to load this skill. It's the most important line in the file.

**Optional fields** — only add these when the default doesn't fit:

| Field | Default | Use when |
|---|---|---|
| `compatibility` | none | Specify compatibility constraints (e.g., minimum Claude Code version). |
| `license` | none | License identifier for shared/published skills. |
| `metadata` | none | Arbitrary key-value pairs for tooling or organizational use. |

Most skills need only `name` and `description`. Add optional fields deliberately — each one is a design decision.

**Note:** Behavioral controls (manual-only activation, tool restrictions, subagent routing) are handled in the skill body text, not frontmatter. The frontmatter is for identity and metadata only.

### 3. Write the body

For every paragraph ask: "Does Claude already know this?" If yes, delete it.

**Structure guidelines:**
- Body under 500 lines. If approaching that, split into reference files linked one level deep from SKILL.md.
- Use consistent terminology throughout (pick one term, not synonyms).
- No time-sensitive information.
- Examples are concrete, not abstract. Input/output pairs when the output format matters.
- Anti-patterns section if the skill has a close neighbor it could drift into.

**Two common skill shapes:** Procedural skills (workflows — step-by-step processes like this one) and response-mode skills (shaping how Claude answers — like `quick-ref`). Recognize which you're building; the structure follows naturally.

**If bundling additional files:**
- Reference files link directly from SKILL.md (one level deep, never nested)
- Name files descriptively: `form_validation_rules.md` not `doc2.md`
- Forward slashes in all paths
- Make clear whether Claude should execute scripts or read them as reference

### 4. Review

Read the finished SKILL.md and check:

- [ ] Every line earns its token cost (nothing Claude already knows)
- [ ] Description clearly signals when to activate vs. other skills
- [ ] Degree of freedom matches the task's fragility
- [ ] Anti-patterns defined if adjacent modes exist
- [ ] Body under 500 lines
- [ ] Consistent terminology
- [ ] Examples are concrete
- [ ] File references one level deep (if any)
- [ ] Mentally tested against 3+ real inputs that should trigger this skill

### 5. Register voice shortcut

Add a SuperWhisper replacement rule so the new skill can be triggered
by voice. Edit `~/Documents/superwhisper/settings/settings.json`:

1. Check whether a replacement already exists (search `replacements`
   for a matching `with` value). Skip if present.
2. Generate a UUID via `uuidgen`.
3. Derive the spoken form from the command name:
   - Strip leading `/` and any namespace prefix (`workflows:`, etc.)
   - Replace hyphens with spaces: `design-skill` → `design skill`
   - Compound words split at boundaries: `startwork` → `start work`
   - Prefix with `slash`: → `slash design skill`
4. Append to the `replacements` array:
   ```json
   {
     "id": "<UUID>",
     "original": "<spoken form>",
     "with": "/<full command including namespace if any>"
   }
   ```
5. Tell the user to restart SuperWhisper if it doesn't hot-reload.

### 6. Update project checklists

If the skill appears in the build checklist, check it off:
- ``design/build-registry.md`` (project root)

## Skill vs. Personality

Skills define what Claude does (procedures any personality can invoke). Personalities define who Claude is (relational orientation). If you're writing "be warm" or "be direct" in a skill, that content belongs in a personality file instead.

## Reference: Existing skills

When building a new skill, read the existing ones for pattern and tone:
- `quick-ref/SKILL.md` — response-mode skill (high freedom, shapes how Claude answers)
- `debugger/SKILL.md` — response-mode skill (high freedom, visibility-first debugging workflow)
- This file — procedural skill (medium freedom, workflow-driven)
