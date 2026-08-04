# Joshua Alcobia Gomes — Portfolio

A modern, animated portfolio website for a mechanical engineer working across
**automotive and aerospace**, plus a matching **multi-page PDF** to print or bring
to interviews. Website and PDF are generated from **one data file** and share one
palette — **“Sage & Sky”** (pastel · nature).

🎨 **Palette**

| Token | Hex | Use |
|-------|-----|-----|
| Sage | `#A8C3A4` | primary accent |
| Sky | `#B8D4E3` | secondary accent |
| Sand | `#E8DCC4` | warm neutral |
| Forest ink | `#2F4538` | text / dark |

## Structure

```
index.html            Home + About Me + links to the work pages (static)
mclaren.html          McLaren        (Automotive / Motorsport)
ning.html             NING Research  (CFD / Simulation)
novartis.html         Novartis       (Pharma / ML)
ucl.html              UCL            (Education) + documents area
side-projects.html    Side Projects  (Personal builds)
data/portfolio.json   ⭐ SINGLE SOURCE OF TRUTH — all page & project content
css/style.css         Design system, animations, view transitions
js/site.js            Renders sub-pages from the JSON + all interactions
assets/img/           Your photos            (drop files here)
assets/video/         Your web-ready clips   (drop files here)
assets/docs/          UCL PPT / PDF documents (drop files here)
assets/resume.pdf     Your 2-page CV
pdf/build_pdf.py      Renders the PDF from data/portfolio.json → assets/portfolio.pdf
requirements.txt      Python deps (Playwright)
```

## ✏️ Editing content — do it in one place

All page text and every project live in **`data/portfolio.json`**. Each sub-page
has an `overview`, an `approach` list, and a `projects` array. To fill in a project,
edit its entry and **remove `"placeholder": true`**:

```json
{ "title": "Spacelogic Coughing Simulation",
  "tag": "CFD · Ventilation",
  "summary": "One-line description of the project and its result.",
  "bullets": ["What you did", "The method/tools", "The measurable outcome"] }
```

Both the website **and** the PDF read this file, so a single edit updates both.

- **Images:** drop into `assets/img/` (e.g. `ning-1.jpg`). Each project card shows the
  filename it expects.
- **Videos:** drop web-ready clips into `assets/video/` (e.g. `ucl-1.mp4`).
- **UCL documents:** drop PowerPoints/PDFs into `assets/docs/` and list them under
  the UCL page's `attachments.items` in the JSON.

## Running the site locally

The sub-pages fetch `data/portfolio.json`, so the site must be **served over http**
(not opened as a `file://`). From the project folder:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

> Page-to-page morph transitions use the **View Transitions API** (Chrome/Edge);
> scroll-reveal, animated nav and parallax work everywhere and degrade gracefully.

## Rebuilding the PDF

```bash
python -m venv .venv
source .venv/Scripts/activate      # Windows Git Bash · macOS: source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
python pdf/build_pdf.py            # → assets/portfolio.pdf
```

Re-run `python pdf/build_pdf.py` after editing `data/portfolio.json`.

## Deploying (GitHub Pages)

Push to GitHub, then **Settings → Pages → Deploy from branch → `main` / root**.
Live at `https://JGhost17.github.io/<repo>/`.

---
Built with a Sage & Sky palette 🌿
