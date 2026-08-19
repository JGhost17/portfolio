# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS (no framework), deployed as-is. Content for the project pages is data-driven from `data/portfolio.json`, rendered client-side by `js/site.js`. A matching multi-page PDF is generated from the same JSON via a Python/Playwright build script (`pdf/build_pdf.py`) so the printable version stays pixel-matched to the site.

## Users

Three audiences, in priority order, all served by the same surface:

1. **Engineering recruiters / hiring managers** (automotive & aerospace) — evaluating Joshua for placements and graduate roles right now. Primary near-term job: decide to shortlist or contact him.
2. **Academic reviewers** — professors, scholarship/programme assessors evaluating his engineering work.
3. **Future consulting clients & professional network** — a longer-horizon audience. Joshua intends to start an engineering consulting/design business in the future, and wants this portfolio to be credible enough that peers, mentors and industry contacts remember his work and refer or hire him later.

The site therefore has to work simultaneously as a **student placement portfolio today** and the **seed of a professional/consulting personal brand later** — it should not read as purely "student project."

## Product Purpose

A personal engineering portfolio (website + matching printable PDF) that demonstrates Joshua Alcobia Gomes's real project work across automotive, aerospace, research/CFD simulation, and applied ML/AI tooling — well enough to win placements and graduate roles now, and to stand as credible professional evidence for consulting work later.

## Positioning

**Breadth with depth**, not a single specialism. The throughline is: a mechanical engineer who moves fluidly between performance automotive (McLaren), aerospace/rocketry (UCL competition teams), rigorous CFD/simulation consulting (NING Research), and applied ML/AI tooling in industry (Novartis) — the same rigor and hands-on craft applied across very different domains and tools. A neighboring "automotive-only" or "CS/ML-only" portfolio could not truthfully claim this range.

## Operating Context

- Site is organized as one page per chapter of experience: **McLaren** (automotive/motorsport — upcoming industrial placement, 2026–27), **NING Research** (CFD/engineering simulation, ~12 client projects), **Novartis** (scientific modelling internship — ML, simulation, LLM/agentic tooling), **UCL** (MEng Mechanical Engineering, 2nd year, predicted First; competition teams: Rocket, Formula Student, IMechE, Mechathon; includes a documents area for coursework/presentation attachments), and **Side Projects** (personal builds).
- Each project page uses a pinned "deck" layout: one project per full-viewport section, vertical progress rail, spring-based section snapping, image/video carousel per project.
- The PDF (`assets/portfolio.pdf`) is a separate, print-ready leave-behind for interviews, generated from the same content as the site.
- A separate 2-page résumé (`assets/resume.pdf`) is linked alongside the portfolio PDF, not merged into it.
- Hosted free on **GitHub Pages** from the `JGhost17/portfolio` repo; deploys automatically on push to `main`.
- Editing workflow: all page/project copy lives in one file, `data/portfolio.json` — edited directly on GitHub, in VS Code, or by asking Claude — so both the site and the regenerated PDF stay in sync from a single source of truth.

## Capabilities and Constraints

- No backend, no database, no paid infrastructure — must remain a static site deployable to free GitHub Pages.
- No CMS: content changes go through direct edits to `data/portfolio.json` (or the static HTML for the home page).
- Media (photos/videos) is supplied by Joshua per-project into `assets/img/` and `assets/video/`; nothing is stock or placeholder in the shipped version — see Evidence on Hand.
- The PDF must be regenerated (`python pdf/build_pdf.py`, via a project-local Python venv + Playwright) whenever `data/portfolio.json` changes; this does not happen automatically on push the way the website does.

## Evidence on Hand

- Real work history from Joshua's résumé (Novartis internship, UCL Racing/Rocket, IMechE Design Challenge, UCL Mechathon 2025) is already written into the site and PDF with real bullets/metrics.
- Real project media (CFD renders, simulation videos) has been supplied for most NING Research projects and wired into the site/PDF.
- **Explicitly not yet supplied, must not be fabricated:** McLaren placement projects (placement hasn't started — page currently marked "upcoming"), most Side Projects and UCL project media/descriptions, a portrait photo, and some NING project write-ups. These remain marked as placeholders until Joshua supplies real content.
- No testimonials, client logos, or case-study quotes exist yet; none should be invented even as the consulting-facing use case grows more prominent.

## Product Principles

1. **Real work only, always.** Every claim, metric, and bullet must trace to something Joshua actually did — no invented testimonials, clients, benchmarks, or placeholder content dressed up as real.
2. **One surface, two futures.** Design and content decisions must work for "hire me for a placement now" and "trust me with your consulting project later" at once — credible and professional, not just polished-student.
3. **Breadth is the differentiator, so keep it legible.** The automotive/aerospace/simulation/ML range is the positioning; navigation and structure should make that breadth easy to scan, not flatten it into a generic project list.
4. **Content and print stay one source of truth.** Whatever changes the website must be reflected in the PDF leave-behind; the two must never visibly diverge for a given piece of content.
5. **Free and static, by constraint.** Every future feature proposal must fit a static site on free GitHub Pages hosting — no backend dependency should be treated as a "yes, and" default.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond standard web accessibility practice (the current implementation already respects `prefers-reduced-motion` and `prefers-reduced-transparency`).
