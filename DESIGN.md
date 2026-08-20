---
name: Joshua Alcobia Gomes — Portfolio
description: An engineer's drawing sheet, not a lifestyle brand — graphite ink on paper, one blueprint-blue accent, hairline rules, a ruler-tick deck rail and a real title-block footer.
colors:
  ink: "#17181A"
  ink-soft: "#40434A"
  text-muted: "#6A6D70"
  paper: "#FAFAF8"
  paper-alt: "#EFEFEB"
  surface: "#FFFFFF"
  line: "#D9D9D4"
  line-strong: "#B9BAB5"
  accent: "#1D4FD1"
  accent-soft: "#E8EDFB"
typography:
  scale:
    step-70: ".7rem"
    step-72: ".72rem"
    step-74: ".74rem"
    step-76: ".76rem"
    step-78: ".78rem"
    step-80: ".8rem"
    step-82: ".82rem"
    step-84: ".84rem"
    step-85: ".85rem"
    step-86: ".86rem"
    step-88: ".88rem"
    step-92: ".92rem"
    step-93: ".93rem"
    step-95: ".95rem"
    step-100: "1rem"
    step-108: "1.08rem"
    step-110: "1.1rem"
    step-130: "1.3rem"
    step-140: "1.4rem"
    step-170: "1.7rem"
    step-105: "1.05rem"
    step-125: "1.25rem"
    step-160: "1.6rem"
    step-180: "1.8rem"
    step-200: "2rem"
    step-220: "2.2rem"
    step-260: "2.6rem"
    step-340: "3.4rem"
  display:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.4vw, 4.6rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3.6vw, 2.7rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.024em"
  body:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(16px, 1.05vw, 17px)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "-0.004em"
  label:
    fontFamily: "JetBrains Mono, Consolas, SFMono-Regular, monospace"
    fontSize: "0.74rem"
    fontWeight: 600
    letterSpacing: "0.06em"
rounded:
  sm: "2px"
  md: "3px"
spacing:
  sm: "0.5rem"
  md: "1.4rem"
  lg: "clamp(3.5rem, 8vw, 6.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0.78rem 1.2rem"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.78rem 1.2rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "1.5rem"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.sm}"
    padding: "0.35rem 0.7rem"
---

# Design System: Joshua Alcobia Gomes — Portfolio

## Overview

**Creative North Star: "The Drawing Sheet"**

The portfolio reads as an engineer's drawing sheet, not a lifestyle brand. Precision and hairline clarity replace pastel decoration as the source of warmth: graphite ink on paper, one blueprint-blue accent used exactly where it earns attention, a real title-block footer, a ruler-tick progress rail, and crosshair registration marks borrowed from print/plate conventions. Nothing is added that a drawing sheet wouldn't already have.

This is a **redesign**, not the system this project launched with. The previous version ("Sage & Sky") was a pastel, nature-derived palette with soft glass chrome and pill-shaped controls. Joshua described wanting something different — *"clean, white and grey, the look of schematic drawings and sketches on paper... like an engineer"* — in a 2026-08-19 design interview, and confirmed wanting to pursue it the same day. This file documents the replacement world as built, superseding the pastel system entirely; nothing from "Sage & Sky" survives except the spring-physics deck navigation and instant press feedback, which are motion decisions independent of palette and were kept deliberately.

This system serves both a student-placement portfolio today and, longer-term, the seed of a professional consulting brand (see PRODUCT.md). A drafting-sheet aesthetic serves both at once: legible and credible to a recruiter now, and distinctive enough to be remembered by future consulting contacts — the same rigor the projects themselves demonstrate, applied to how they're presented.

**Key Characteristics:**
- Restrained palette: near-black graphite ink on off-white paper and paper-grey, with exactly one accent (blueprint ink-blue) — never a second competing hue.
- Hairline rules everywhere; near-zero corner radius; no soft glow, no glass blur, no gradients (text or fill).
- Archivo (a confident, technical grotesk) for display type; JetBrains Mono for every label, index number, date, and field — real technical/measurement data, not a costume; Inter for body prose.
- A pinned, one-project-per-viewport "deck" for project pages, with a ruler-tick progress rail (a scale bar, not a pill list) and the same spring-physics section snapping the previous system used.
- A title block in the footer, in the direct tradition of an engineering drawing sheet's own closing strip (Drawn by / Sheet / date fields).
- Real content only — every claim traces to actual project work; unfinished projects are explicitly marked, never disguised as complete.
- No kicker/eyebrow ever sits above a heading — classification labels (a project's category, a card's field) follow their heading, or live in a corner reference tag, never precede it as a restatement.

## Colors

A restrained, near-monochrome palette — graphite ink and paper neutrals — carrying exactly one accent.

### Neutrals
- **Ink** (`#17181A`): primary text and all headings — the system's only near-black.
- **Soft Ink** (`#40434A`): body prose (≈9.9:1 on Paper).
- **Muted** (`#6A6D70`): meta text, field labels, captions, timestamps (≈5.2:1 on Paper — passes AA for small text).
- **Paper** (`#FAFAF8`): the page ground.
- **Paper Alt** (`#EFEFEB`): footer / title-block / sticky-rail ground — one step darker than Paper.
- **Surface** (`#FFFFFF`): card and panel ground, a clean step up from Paper.
- **Line** (`#D9D9D4`): default hairline divider.
- **Line Strong** (`#B9BAB5`): structural rule — rail ticks, title-block dividers, registration marks, card/media borders.

### Accent
- **Blueprint** (`#1D4FD1`): the system's one accent (≈6.8:1 on Paper — safe for text). Used for links, the active rail tick, the scroll-progress line, the project index numeral, hover states, and nothing else. It never appears as a second decorative hue alongside another color.
- **Accent Soft** (`#E8EDFB`): a flat tint (never a gradient) for `::selection` and sparing hover fills.

### Named Rules
**The One-Accent Rule.** Blueprint blue is the system's only color beyond the ink/paper neutral scale. It is restrained-strategy by design: color commits through hairline precision and mono labeling, not through hue variety.

**No Gradients, Ever.** Not on text, not on fills, not on buttons. The previous system's gradient headline text and gradient card-hover tints are gone; emphasis comes from weight, color, or a hairline rule instead.

## Typography

**Display Font:** Archivo (with Segoe UI, system-ui, sans-serif fallback)
**Label/Data Font:** JetBrains Mono (with Consolas, SFMono-Regular, monospace fallback)
**Body Font:** Inter (with Segoe UI, system-ui, -apple-system, sans-serif fallback)

**Character:** Archivo is a confident, no-nonsense grotesk for anything that announces a project or section — technical without being a drafting-lettering costume. JetBrains Mono is used only where the content is genuinely technical or data-like: index numbers (`{01}`), dates, field labels, nav links, footer fields, button labels — the earned use the craft floor allows, never applied as a "hacker" affectation on prose. Inter carries everything meant to be read at length.

### Hierarchy
- **Display** (700, `clamp(2.6rem, 6.4vw, 4.6rem)`, line-height 1.06, letter-spacing -0.03em): hero headline and each deck slide's project title.
- **Headline** (700, `clamp(1.8rem, 3.6vw, 2.7rem)`, line-height 1.06, letter-spacing -0.024em): section headers.
- **Title** (700, ~1.4–1.5rem, letter-spacing -0.02em): card and project-body headings.
- **Body** (400, `clamp(16px, 1.05vw, 17px)`, line-height 1.65, letter-spacing -0.004em, max ~65–75ch): all prose.
- **Label/Mono** (JetBrains Mono, 600, 0.7–0.88rem, letter-spacing 0–0.08em): field labels, nav, buttons, index numbers, dates, footer fields — always this font family whenever the content is a label or datum rather than prose.

The four named roles above are the ones worth memorizing; the frontmatter's `typography.scale` enumerates the full realistic ramp underneath them (`.7rem` through `1.7rem`, plus two ad hoc fluid clamps) — the actual continuous scale small UI text needs (meta labels, nav, captions, lead paragraphs), not a constraint to flatten everything into four sizes.

### Named Rules
**Labels Follow Headings, Never Precede Them.** A kicker sitting above a heading and restating it is refused categorically (per the craft floor). Where a heading needs a classification (a project's category, a card's field), that label is placed *after* the heading as a subtitle line, or displaced entirely into a corner reference tag (see Components) — never stacked above it.

## Layout

A centered content column (`max-width: 1120px`) with generous, responsive section padding (`clamp(3.5rem, 8vw, 6.5rem)` vertical rhythm) for the home page and standard sub-sections.

Project pages (McLaren, NING Research, Novartis, UCL, Side Projects) use the **pinned deck**: each project is one full-viewport `.slide` laid out as title (bottom-left) / media (center) / detail column (right), navigated by mouse-wheel, keyboard, or a persistent ruler-tick rail (top-left) rather than continuous free-scroll. Collapses to a single stacked column below 900px, where the deck's spring-snap disengages in favor of native scrolling.

Grid/card sections (home page work cards) use responsive CSS grid, 2 columns collapsing to 1 on mobile.

A faint graph-paper grid (`rgba(23,24,26,.05)`, 32px cells) sits behind every page as a fixed background layer, and four small crosshair registration marks anchor the viewport's corners on desktop — both borrowed directly from print/drafting-sheet conventions, not decorative filler.

## Elevation & Depth

Depth comes from hairline borders first, shadow second — the opposite emphasis from the previous glass/glow system. Shadows are tight and real (offset + blur, never a zero-offset colored halo), reserved for genuinely elevated surfaces (media, floating badges, open mobile nav).

### Shadow Vocabulary
- **Ambient-sm** (`0 1px 3px rgba(23,24,26,.08)`): resting elevation for small surfaces.
- **Ambient** (`0 6px 20px -8px rgba(23,24,26,.18)`): cards on hover, floating badges.
- **Ambient-lg** (`0 14px 38px -12px rgba(23,24,26,.24)`): deck slide media — the system's heaviest, reserved for the single most prominent element on screen.

### Named Rules
**Hairline Before Shadow.** Every panel gets a 1px border first (`--line` at rest, `--line-strong` on hover/emphasis); shadow is additive, never the sole separator. No backdrop blur or glass translucency anywhere in this system — the nav and rail are solid paper.

## Shapes

Near-zero radius throughout (`--radius: 3px`, `--radius-sm: 2px`) — no pill shapes anywhere. This is a deliberate reversal of the previous system's universal pill/rounded language: a technical drawing has square sheets, square title-block cells, and straight rules.

## Components

### Buttons
- **Shape:** near-square (`3px` radius), always a solid 1px border.
- **Primary:** ink fill, paper text; hover shifts the fill to the accent blue (not a lift/shadow trick).
- **Ghost:** transparent, line-strong border, ink text; hover darkens the border to ink.
- **Press feedback:** every button scales to 0.97 instantly on `:active` — kept from the previous system, a motion decision independent of palette.
- **Font:** always JetBrains Mono.

### Corner Reference Tags
The replacement for the previous "eyebrow" kicker on home-page work cards: a small mono code (`M · 01`, `N · 02`, `PDF`) in the card's top-right corner, echoing a drawing sheet's own reference-number convention. It never sits inline above the card's heading — displaced by both position and content (an index code, not a category restatement).

### Chips
- **Style:** white background, hairline border, near-zero radius, mono text — used for skill tags.

### Cards / Containers
- **Corner Style:** 3px radius, 1px hairline border.
- **Background:** solid Surface (`#FFFFFF`) — no translucency.
- **Hover:** a 2px accent-blue rule draws in from the left across the card's top edge (`scaleX` transform, not a `width` transition); border strengthens to Line Strong; no color-tinted gradient wash.

### Deck Slide (signature component)
Unchanged in structure from the previous system, restyled in material: one project = one full-viewport section with a title (bottom-left, Archivo display type, a mono all-caps subtitle beneath it — not a kicker, since nothing bigger follows it), a centered media carousel sized to each photo/video's own aspect ratio (hairline border, `Ambient-lg` shadow), and a right-hand mono detail column (role, a `{01}`-style index in accent blue, description, focus tags, impact bullets). A **ruler-tick rail** — hairline ticks that grow via `transform: scaleX()` and take the accent color when active, not a pill list — tracks progress at top-left. Section transitions remain the critically-damped spring from the previous system (interruptible, velocity-carrying) — a motion decision this redesign kept deliberately, since it is independent of palette and was praised in the prior design critique.

### Title-Block Footer (signature component)
A direct borrow from an engineering drawing sheet's own title block: the footer's closing strip (`.tb-row--strip`) is a row of small mono fields separated by hairline vertical dividers — *Drawn by*, *Sheet* (page name · revision), *©*, and a page-specific closer (Built with Claude on home, ← Back to home on sub-pages). This replaced a plain copyright line with something that is actually load-bearing to the concept, not decoration.

### Navigation
- **Style:** solid paper background, 1px hairline bottom border — no blur, no translucency (a deliberate reversal of the previous glass-chrome nav).
- **Typography:** JetBrains Mono links; the active/hovered link gets a 1px accent underline that draws in via `scaleX`.
- **Mobile:** collapses to a hamburger toggle revealing a solid-paper menu card (hairline border, no blur).

## Do's and Don'ts

### Do:
- **Do** keep all body/heading text on the Ink → Soft Ink → Muted scale; never introduce a separate gray family.
- **Do** use JetBrains Mono only for genuinely technical/data content (labels, numbers, dates) — never as a "hacker" costume on prose.
- **Do** give every interactive element instant `:active` press feedback (scale, not a delayed transition).
- **Do** let project media keep its native aspect ratio, hairline border, no cropping.
- **Do** animate width/height-affecting states (the deck rail ticks, the scroll progress bar, nav underlines) via `transform: scaleX()`, never `width`/`height` directly.
- **Do** mark unfinished projects/pages explicitly (dashed hairline border, `.placeholder` styling) rather than disguising them as complete.
- **Do** place a category/classification label *after* its heading, or displace it into a corner reference tag — never as a kicker above it.
- **Do** respect `prefers-reduced-motion` as a first-class state.

### Don't:
- **Don't** use a pill/fully-rounded shape anywhere — the previous system's universal pill language is retired.
- **Don't** use a gradient on text or on any fill — solid color and weight carry all emphasis now.
- **Don't** add backdrop blur or glass translucency — every surface in this system is solid.
- **Don't** put a kicker/eyebrow label directly above a heading, under any circumstance.
- **Don't** use an emoji as an icon — the previous system's card emoji (🏎️🌀🧪) are gone, replaced by mono corner reference codes.
- **Don't** crop a project photo or video into a fixed box; size the frame to the media.
- **Don't** fabricate metrics, testimonials, or client claims — PRODUCT.md's real-content-only principle is binding on this visual system too.
