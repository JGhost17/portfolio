# Jonathan Gomes — Portfolio

A modern, animated portfolio website for a mechanical engineer working across
**automotive and aerospace**, plus a matching **multi-page PDF** to print or bring
to interviews. Website and PDF share one palette — **“Sage & Sky”** (pastel · nature).

🎨 **Palette**

| Token | Hex | Use |
|-------|-----|-----|
| Sage | `#A8C3A4` | primary accent |
| Sky | `#B8D4E3` | secondary accent |
| Sand | `#E8DCC4` | warm neutral |
| Forest ink | `#2F4538` | text / dark |

## Structure

```
index.html            Home + About Me + links to the four work pages
mclaren.html          McLaren        (Automotive / Motorsport)
ning.html             NING Research  (R&D)
ucl.html              UCL            (Education)
side-projects.html    Side Projects  (Personal builds)
css/style.css         Design system, animations, view transitions
js/main.js            Scroll reveal, progress bar, nav, parallax, counters
assets/img/           Your photos      (drop files here)
assets/video/         Your web-ready clips (drop files here)
pdf/portfolio.html    Print-optimised source for the PDF (same palette)
pdf/build_pdf.py      Renders pdf/portfolio.html → assets/portfolio.pdf
requirements.txt      Python deps (Playwright)
```

## Running the site locally

It's a static site — just open `index.html`, or serve it:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

> Advanced page-to-page morph transitions use the **View Transitions API**
> (Chrome/Edge); everything else (scroll reveal, parallax, animated nav) works
> everywhere and degrades gracefully.

## Building the PDF

```bash
python -m venv .venv
source .venv/Scripts/activate      # Windows Git Bash / macOS: source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
python pdf/build_pdf.py            # → assets/portfolio.pdf
```

Re-run `python pdf/build_pdf.py` whenever you edit `pdf/portfolio.html`.

## Adding your content

Search the pages for the dashed **`placeholder`** markers (site) and the italic
**`[bracketed]`** text (PDF) — those are the spots to fill. Drop images into
`assets/img/`, web-ready videos into `assets/video/`, and replace the `▶`
video placeholders with real `<video>` tags (a commented example sits in each).

Add your résumé as `assets/resume.pdf` and it will be linked automatically.

## Deploying (GitHub Pages)

Push to GitHub, then **Settings → Pages → Deploy from branch → `main` / root**.
The site will be live at `https://JGhost17.github.io/<repo>/`.

---
Built with a Sage & Sky palette 🌿
