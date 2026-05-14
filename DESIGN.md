<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

---
name: OptiTech
description: Bold, forward-moving brand site for a new consumer-facing product.
---

# Design System: OptiTech

## 1. Overview

**Creative North Star: "The Kinetic Editorial"**

OptiTech is designed to feel purpose-built by people with a strong point of view. The visual language draws from design-tool aesthetics (Figma, Framer, Arc) — not for their fame, but for a shared quality of self-referential precision: the product demonstrates its own values in how it presents itself. A brand site should feel like it was made by someone who thought carefully.

Color is committed, not decorative. One saturated tone carries 30–60% of the surface — not an accent but a presence, giving the viewer a stable anchor. Typography contrasts a high-contrast serif display with a clean sans body, producing editorial hierarchy that signals confidence without pretension. Motion is choreographed: entrances are orchestrated, scrolling has consequence. Nothing animates without purpose; the movement is the brand statement.

This system explicitly rejects: the generic startup-cream aesthetic (off-white cards, pastel blobs, rounded pill grids), the corporate blue playbook (navy, stock photos, formal bullet lists), and the crypto/Web3 launch site (neon on black, floating orbs, speculative urgency).

**Key Characteristics:**
- Committed single color anchor — a presence, not a detail
- Serif/sans typographic contrast with a dominant display voice
- Choreographed motion as deliberate brand expression
- Asymmetry and forward momentum in layout composition
- Every neutral tinted toward the primary hue; nothing truly neutral

## 2. Colors

One color commits. Everything else defers to it.

### Primary
- **[Anchor Color]** `[to be resolved during implementation]`: The committed color. It fills 30–60% of any given view — backgrounds, hero panels, entire sections. Its hue direction should read as bold but considered: not aggressive, not safe. Direction: look toward inky blue-purples (Framer's range) or a deep, saturated warm tone. Avoid anything that reads as navy, corporate, neon, or pastel.

### Neutral
- **[Deep Dark Neutral]** `[to be resolved during implementation]`: Near-black, tinted toward the primary hue (chroma 0.005–0.015). Used for text, dark surfaces, and backgrounds where the primary color yields.
- **[Tinted Light Surface]** `[to be resolved during implementation]`: Off-white with a hint of the primary hue (chroma 0.005–0.01). Used for light content surfaces when needed. Not cream; genuinely tinted.

**The Committed Rule.** The primary color fills large surface areas. It is not used sparingly; it is used boldly. Restraint is expressed in the neutrals, not in the anchor color.

**The Tint Rule.** No neutral is ever truly neutral. Every near-white and near-black is tinted toward the primary hue at low chroma. The visual system should feel unified, not collaged from unrelated values.

## 3. Typography

**Display Font:** `[high-contrast editorial serif — to be chosen at implementation]`
**Body Font:** `[humanist or geometric sans — to be chosen at implementation]`

**Character:** The serif leads as the dominant voice — large, high-contrast, expressive. The sans provides calm, professional counterpoint for running text, labels, and UI chrome. The pairing should feel like a magazine designed by an engineer: controlled yet alive.

### Hierarchy
- **Display** (heavy, `clamp(3rem, 8vw, 6rem)`, line-height ~0.9): Hero and section-opener headlines. The serif at its most expressive. Short, punchy, asymmetric where possible.
- **Headline** (medium-heavy, `clamp(1.75rem, 4vw, 2.75rem)`, line-height ~1.1): Sub-section openers, feature callouts.
- **Title** (sans, medium weight, `1.125–1.375rem`, line-height ~1.3): Card headers, navigation items, strong labels.
- **Body** (sans, regular weight, `1rem–1.125rem`, line-height ~1.65): Prose. Hard cap at 65–75ch.
- **Label** (sans, 0.75–0.875rem, tracked `+0.05em`, optionally uppercase): Metadata, timestamps, category tags.

**The Display Command Rule.** The serif display font is never used below 1.5rem. At small sizes it loses its identity. Use the sans for everything below that threshold.

## 4. Elevation

Flat at rest; depth appears in motion. This system does not use shadow to communicate static layering. Resting surfaces are flat. Depth is created by the committed color filling backgrounds and by animated entrances where elements arrive from an offset position. Shadows appear only as a state response: hover for interactive elements, or the momentary arrival of an animated component.

**The Flat Resting Rule.** No component carries a drop shadow in its default state. A resting shadow signals that the surface doesn't belong. Shadows resolve at arrival or appear at hover; they do not persist.

## 5. Components

`[Omitted in seed mode — no components built yet. Re-run /impeccable document once code exists.]`

## 6. Do's and Don'ts

### Do:
- **Do** let the committed color fill large surface areas: hero panels, full-bleed sections, entire backgrounds. It is a presence, not punctuation.
- **Do** set serif display type large and short. Three words at 6rem outperform a sentence at 3rem.
- **Do** choreograph entrances: elements arrive with vertical or opacity offset, resolving to rest. The entrance is the motion design.
- **Do** tint every neutral toward the primary hue (chroma 0.005–0.015). The palette is unified, not random.
- **Do** use asymmetry and tension in layout. Symmetric grids signal stasis; OptiTech is in motion.
- **Do** respect `prefers-reduced-motion`: all choreographed entrances and scroll-driven sequences must degrade to instant display.
- **Do** meet WCAG 2.1 AA contrast on all text and interactive states, including text over the committed color surface.

### Don't:
- **Don't** reproduce the generic SaaS cream aesthetic: off-white backgrounds, rounded pill cards, pastel gradient blobs, floating icon-feature grids. It is the category's first reflex and OptiTech's explicit rejection.
- **Don't** use the corporate enterprise blue playbook: navy/grey palettes, stock-photo hero images, feature bullet lists, formal "solutions for the modern enterprise" copy.
- **Don't** let the design read as a crypto or Web3 launch site: no neon on black, no floating particle effects or orbs, no speculative urgency, no hype-first hierarchy.
- **Don't** use gradient text (`background-clip: text`). Use a single committed solid color. Emphasis through weight or size, never gradient fill.
- **Don't** use side-stripe borders (a colored `border-left` or `border-right` greater than 1px as an accent on cards, callouts, or alerts). Rewrite with background tints, full borders, or nothing.
- **Don't** animate CSS layout properties (`width`, `height`, `top`, `left`). Use `transform` and `opacity` only.
- **Don't** let the primary color appear at less than 10% of the surface on any primary view. It should commit fully or yield fully; no half-measures.
