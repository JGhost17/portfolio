---
name: Joshua Alcobia Gomes — Portfolio
description: A quiet, breadth-first engineering portfolio in a pastel "Sage & Sky" palette, built as a pinned scrolling deck.
colors:
  sage: "#A8C3A4"
  sage-deep: "#7FA07B"
  sky: "#B8D4E3"
  sky-deep: "#8FB8CE"
  sand: "#E8DCC4"
  sand-soft: "#F3ECDD"
  ink: "#2F4538"
  ink-soft: "#43574a"
  bg: "#FBFAF6"
  bg-alt: "#F4F1E8"
  surface: "#FFFFFFcc"
  text-muted: "#5c6b60"
  line: "#dfe4d8"
typography:
  display:
    fontFamily: "Space Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.4vw, 4.6rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Space Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3.6vw, 2.7rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.028em"
  body:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(16px, 1.05vw, 17px)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "-0.004em"
  label:
    fontFamily: "Space Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.16em"
rounded:
  sm: "12px"
  md: "20px"
  pill: "999px"
spacing:
  sm: "0.5rem"
  md: "1.4rem"
  lg: "clamp(3.5rem, 8vw, 6.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sand-soft}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.3rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "#ffffffbb"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.3rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "1.6rem"
  chip:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.8rem"
---

# Design System: Joshua Alcobia Gomes — Portfolio

## Overview

**Creative North Star: "The Quiet Portfolio"**

The design gets out of the way of real engineering work. Every screen leads with content — a project, a CFD render, a bullet of measurable outcome — and the interface exists only to present it clearly and let it be scanned quickly. Nothing decorative is added that doesn't earn its place: no illustration, no stock texture, no filler copy. The one indulgence the system allows itself is a soft, natural pastel atmosphere (sage, sky, sand) and a small set of fluid, spring-physics interactions (instant press feedback, an interruptible pinned "deck" that snaps between projects) — restraint in *content*, craft in *motion*.

This system currently serves both a student-placement portfolio and, longer-term, the seed of a professional consulting brand (see PRODUCT.md). That dual audience is why the palette stays warm and human rather than corporate-neutral, while typography and layout stay precise and legible enough to read as professional evidence, not a hobby page.

**⚠️ Noted discrepancy (not yet resolved):** when asked to describe the palette's character for future work, Joshua described a different world than what's implemented — *"clean, white and grey, the look of schematic drawings and sketches on paper... like an engineer."* That is a technical-drafting / blueprint-sketch aesthetic, not the current pastel Sage & Sky system. This file documents the palette as it is actually built today; it does not adopt the described direction, because `document` records the incumbent system rather than replacing it. If Joshua wants to pursue the schematic/sketch direction, that is a deliberate redesign decision that should go through `/impeccable new-work` (or an explicit rebrand request) — not something to half-adopt into this file's language.

**Key Characteristics:**
- Pastel, nature-derived palette (sage / sky / sand) against a warm off-white base, with deep forest-ink text for contrast and legibility.
- Large, tightly-tracked geometric display type (Space Grotesk) paired with a calm, near-zero-tracked body face (Inter).
- Pill-shaped interactive controls everywhere (buttons, chips, nav links) — soft, rounded, never sharp-cornered.
- A pinned, one-project-per-viewport "deck" for project pages, with a vertical progress rail and spring-physics section snapping.
- Translucent "glass" chrome (blurred, saturated backdrop) on the nav and floating surfaces; flat pastel gradients as ambient background, not photography.
- Real content only — every claim traces to actual project work; unfinished projects are explicitly marked, never disguised as complete.

## Colors

A soft, nature-derived pastel palette (sage green, sky blue, warm sand) set against a warm off-white base, anchored by a single deep, near-black-green ink for all text and structural contrast.

### Primary
- **Soft Sage** (`#A8C3A4`): the primary accent — ambient background blobs, gradient starts, default tint behind hovered cards.
- **Deep Sage** (`#7FA07B`): the actionable accent — eyebrow labels, links, focus/active states, the "01" project index numerals, the active progress-rail bar.

### Secondary
- **Misty Sky** (`#B8D4E3`): the secondary accent — paired with sage in gradients (hero portrait, project media placeholders, deck section media frames).
- **Deep Sky** (`#8FB8CE`): secondary accent hover/emphasis, and doubles as the "needs content" marker color (dashed placeholder borders/backgrounds).

### Tertiary
- **Warm Sand** (`#E8DCC4`): a third ambient tint — background gradient accents, alternate card hover tints.
- **Soft Sand** (`#F3ECDD`): warm off-white, used as text color on the dark primary button so it reads warm rather than stark white-on-black.

### Neutral
- **Forest Ink** (`#2F4538`): primary text and all headings — the system's only near-black. Never diluted into the color palette itself, so it stays legible everywhere.
- **Soft Ink** (`#43574a`): secondary/body prose color where full-contrast ink would feel heavy (paragraph copy, bullet lists).
- **Muted Moss** (`#5c6b60`): tertiary/meta text — captions, sub-labels, footer copy.
- **Paper Base** (`#FBFAF6`): the page background — warm, not clinical white.
- **Warm Paper** (`#F4F1E8`): alternate background for the footer and other structurally distinct regions.
- **Pale Line** (`#dfe4d8`): all hairline borders and dividers — always faint, never a hard black rule.
- **Glass Surface** (`#FFFFFFcc`): translucent card/panel background, used with `backdrop-filter` for the glass effect.

### Named Rules
**The One Ink Rule.** All text-on-light color comes from Forest Ink, Soft Ink, or Muted Moss — three steps of the same hue, never a separate gray scale. This is what keeps the palette feeling like one warm material rather than "pastel accents on a generic gray UI."

**The Accent-as-Tint Rule.** Sage, sky, and sand are never used as solid text-background pairs for body copy; they appear as gradients, ambient blobs, hover tints, and small pill-chip fills only. Ink-on-paper carries all reading contrast.

## Typography

**Display Font:** Space Grotesk (with Segoe UI, system-ui, sans-serif fallback)
**Body Font:** Inter (with Segoe UI, system-ui, -apple-system, sans-serif fallback)

**Character:** A geometric, slightly technical display face (Space Grotesk) for anything that announces a section or project, paired with a calm, highly legible grotesk (Inter) for everything meant to be read at length. Tracking tightens as size increases — display type is deliberately tight and confident; body text sits at a hair below zero for screen legibility.

### Hierarchy
- **Display** (600, `clamp(2.6rem, 6.4vw, 4.6rem)`, line-height 1.06, letter-spacing -0.035em): hero headline and each deck slide's project title.
- **Headline** (600, `clamp(1.8rem, 3.6vw, 2.7rem)`, line-height 1.06, letter-spacing -0.028em): section headers ("Curiosity, engineered.", "Five chapters.").
- **Title** (600, ~1.5rem, letter-spacing -0.022em): card and project-body headings.
- **Body** (400, `clamp(16px, 1.05vw, 17px)`, line-height 1.65, letter-spacing -0.004em, max ~65–75ch): all prose — about-me copy, project summaries, bullets.
- **Label** (600, 0.78rem, letter-spacing 0.16em, uppercase): eyebrows, section tags, project focus/detail labels — always uppercase, always widely tracked, the opposite treatment from display type.

### Named Rules
**The Optical Tightening Rule.** Letter-spacing is never one fixed value. It runs from −0.035em at display size down to −0.004em at body size, then *reverses* to +0.16em for all-caps labels. Every type role's tracking is chosen for its own size, never copy-pasted from another role.

## Layout

A centered content column (`max-width: 1120px`) with generous, responsive section padding (`clamp(3.5rem, 8vw, 6.5rem)` vertical rhythm) for the home page and standard sub-sections.

Project pages (McLaren, NING Research, Novartis, UCL, Side Projects) use a distinct spatial model — the **pinned deck**: each project is one full-viewport `.slide` laid out as title (bottom-left) / media (center) / detail column (right), navigated by mouse-wheel, keyboard, or a persistent vertical progress rail (top-left) rather than continuous free-scroll. This collapses to a single stacked column below 900px, where the deck's spring-snap disengages in favor of native scrolling.

Grid/card sections (home page work cards, galleries) use responsive CSS grid, typically 2 or 3 columns collapsing to 1 on mobile.

## Elevation & Depth

A hybrid of soft ambient shadow and true translucency — no hard-edged material layering. Depth is conveyed through blur and glow rather than sharp drop shadows or borders.

### Shadow Vocabulary
- **Ambient-sm** (`0 2px 10px rgba(47,69,56,.06)`): resting elevation for small surfaces (fact cards, chips).
- **Ambient** (`0 18px 50px -18px rgba(47,69,56,.28)`): default elevation for cards, buttons, the nav's bottom edge.
- **Ambient-lg** (`0 40px 90px -30px rgba(47,69,56,.35)`): hero portrait, hover-lifted cards, deck slide media — the system's heaviest, reserved for the single most prominent element on screen.

### Named Rules
**The Glass-Not-Glossy Rule.** Floating chrome (nav, translucent card surfaces) uses `backdrop-filter: blur() saturate()` over a semi-transparent background — never a flat opaque bar. It respects `prefers-reduced-transparency` by falling back to a solid background with the blur removed, never by leaving a broken half-state.

## Shapes

Universally soft and rounded — no sharp corners anywhere in the system. Cards and media frames use a large 20px radius; small chips/tags use 12px; every interactive pill (buttons, nav links, chips, progress-rail dashes) uses a full 999px pill radius. Borders, where present, are always a single pale hairline (`--line`, `#dfe4d8`) — never a heavier or darker rule.

## Components

### Buttons
- **Shape:** full pill (`border-radius: 999px`).
- **Primary:** solid Forest Ink background, Soft Sand text, ambient shadow; lifts 2px and deepens its shadow on hover.
- **Ghost:** translucent white background, ink text, pale border; brightens to solid white with a small shadow on hover.
- **Press feedback:** every button scales to 0.97 instantly on `:active` (pointer-down, not release) — the system's tactile signature.

### Chips
- **Style:** white background, pale border, pill radius, ink-soft text — used for skill tags and project focus labels.
- **State:** static (no selected/unselected variant currently implemented).

### Cards / Containers
- **Corner Style:** 20px radius.
- **Background:** translucent glass surface (`#FFFFFFcc`) with backdrop blur.
- **Shadow Strategy:** Ambient-sm at rest, Ambient-lg + an 8px lift on hover; a color-tinted gradient (`--tint`, per-card) fades in on hover to hint the destination's theme.
- **Border:** pale hairline at rest, transparent on hover (the shadow carries the separation instead).

### Deck Slide (signature component)
The core custom component: one project = one full-viewport section with a title (bottom-left, large display type, a lighter ghost-subtitle beneath it), a centered media carousel that sizes to each photo/video's own aspect ratio (never cropped, rounded corners, ambient-lg shadow), and a right-hand detail column (role, a `{01}`-style index, description, focus tags, impact bullets). A vertical rail of uniform pill-shaped bars at top-left tracks progress; the active bar is colored, not resized. Section transitions are a critically-damped spring (not a CSS transition) — interruptible, animates from the live scroll position, carries velocity through a re-target — so wheel/keyboard/dash-click navigation always feels continuous rather than locked.

### Navigation
- **Style:** sticky glass bar (blur 24px, saturate 180%, translucent paper background), pale bottom hairline, soft ambient shadow.
- **Typography:** label-weight links; the active page gets a small underline that grows from the center on hover/active.
- **States:** links scale down slightly on `:active` for instant tactile feedback; hover shifts color from muted to full ink.
- **Mobile:** collapses to a hamburger toggle revealing a floating glass menu card.

## Do's and Don'ts

### Do:
- **Do** keep all body/heading text on the Forest Ink → Soft Ink → Muted Moss scale; never introduce a separate gray.
- **Do** give every interactive element instant `:active` press feedback (scale, not a delayed transition).
- **Do** let project media keep its native aspect ratio, rounded corners, no cropping — the frame adapts to the photo, not the other way round.
- **Do** mark unfinished projects/pages explicitly (dashed border, `.placeholder`/`.is-placeholder` styling) rather than disguising them as complete, per the real-content-only product principle.
- **Do** respect `prefers-reduced-motion` (drop the spring/deck-snap for a plain fade) and `prefers-reduced-transparency` (solid backgrounds, no blur) as first-class states, not afterthoughts.

### Don't:
- **Don't** use a hard-edged drop shadow or a dark/heavy border anywhere — depth comes from soft ambient shadow and translucency only.
- **Don't** crop a project photo or video into a fixed box; size the frame to the media.
- **Don't** invent a white/grey "schematic sketch" palette under this file's authority — that direction was described by Joshua as an aspiration, not adopted; it requires a deliberate redesign pass (`new-work`), not a quiet blend into the current tokens.
- **Don't** add decorative illustration, stock photography, or filler copy — every element must earn its place per "The Quiet Portfolio" north star.
- **Don't** fabricate metrics, testimonials, or client claims — PRODUCT.md's real-content-only principle is binding on this visual system too.
