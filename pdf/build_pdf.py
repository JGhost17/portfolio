#!/usr/bin/env python3
"""
Build the printable portfolio PDF from data/portfolio.json.

Generated from the SAME data that drives the website (so content + "Sage & Sky"
colours match), rendered with headless Chromium (Playwright). Content flows
across pages with proper page breaks, each project shows its first image, and a
running footer carries the name and page numbers.

Usage (from the project root, with the venv active):
    python pdf/build_pdf.py
Outputs:
    pdf/portfolio.generated.html   (intermediate, for inspection)
    assets/portfolio.pdf
"""
import json
import re
from html import escape
from urllib.parse import quote
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "portfolio.json"
GEN = ROOT / "pdf" / "portfolio.generated.html"
OUT = ROOT / "assets" / "portfolio.pdf"

VIDEO_RE = re.compile(r"\.(mp4|webm|mov|m4v)$", re.I)

CSS = """
:root{
  --ink:#17181A; --ink-soft:#40434A; --muted:#6A6D70; --paper:#FAFAF8; --paper-alt:#EFEFEB;
  --line:#D9D9D4; --line-strong:#B9BAB5; --accent:#1D4FD1;
  --font-head:"Archivo",sans-serif; --font-mono:"JetBrains Mono",monospace; --font-body:"Inter",sans-serif;
}
@page { size: A4; }
*{ box-sizing:border-box; margin:0; }
html,body{ font-family:var(--font-body); color:var(--ink); line-height:1.5; font-size:10pt;
  -webkit-print-color-adjust:exact; print-color-adjust:exact; background:var(--paper); }
h1,h2,h3,h4{ font-family:var(--font-head); font-weight:700; line-height:1.1; letter-spacing:-.01em; }

.label{ display:inline-block; font-family:var(--font-mono); font-size:7.5pt; font-weight:600;
  letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }
h2.title{ font-size:24pt; margin:4mm 0 2mm; }
.lead{ color:var(--muted); font-size:10.5pt; max-width:165mm; }
.rule{ height:1px; background:var(--line-strong); margin:5mm 0; }

/* Cover */
.cover{ break-after:page; min-height:250mm; display:flex; flex-direction:column; justify-content:center; }
.cover .mark{ width:18mm; height:18mm; border-radius:1.5mm; display:grid; place-items:center;
  background:var(--ink); color:var(--paper);
  font-family:var(--font-mono); font-weight:700; font-size:12pt; margin-bottom:9mm; }
.cover h1{ font-size:40pt; letter-spacing:-.02em; }
.cover .role{ font-family:var(--font-mono); font-size:9pt; font-weight:600; letter-spacing:.04em; color:var(--accent); margin-top:4mm; }
.cover .sub{ font-size:12pt; color:var(--muted); margin-top:3mm; max-width:150mm; }
.cover .meta{ margin-top:12mm; display:flex; gap:10mm; flex-wrap:wrap; }
.cover .meta .k{ font-family:var(--font-mono); font-size:7.5pt; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); font-weight:600; }
.cover .meta .v{ font-weight:600; font-size:10pt; }

/* About */
.chips{ display:flex; flex-wrap:wrap; gap:2mm; margin-top:4mm; }
.chip{ font-family:var(--font-mono); font-size:8pt; padding:1.2mm 3mm; border:1px solid var(--line); border-radius:1mm; background:#fff; color:var(--ink-soft); }
.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:8mm; }
.card{ border:1px solid var(--line); border-radius:1mm; padding:5mm; background:#fff; }
.card h4{ font-family:var(--font-mono); font-size:7.5pt; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin-bottom:2.5mm; font-weight:600; }

/* Section */
.section{ break-before:page; }
.sech2{ font-family:var(--font-mono); font-size:9pt; font-weight:600; letter-spacing:.04em; color:var(--accent); margin-top:2mm; }
.metarow{ display:flex; flex-wrap:wrap; gap:7mm; margin:4mm 0 5mm; }
.metarow .k{ font-family:var(--font-mono); font-size:7.5pt; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); font-weight:600; }
.metarow .v{ font-weight:600; }
.overview{ color:var(--ink-soft); font-size:10.5pt; max-width:172mm; }
.approach{ margin:4mm 0 2mm; }
.approach .k{ font-family:var(--font-mono); font-size:7.5pt; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); font-weight:600; margin-bottom:2mm; }
.approach ol{ margin:0; padding-left:5mm; color:var(--ink-soft); } .approach li{ margin-bottom:1.2mm; }
.sech{ display:flex; align-items:baseline; justify-content:space-between; margin:6mm 0 3mm; }
.sech .n{ color:var(--muted); font-family:var(--font-mono); font-size:9pt; }

.proj{ border:1px solid var(--line); border-radius:1mm; padding:4.5mm 5mm 5mm; background:#fff;
  margin-bottom:4mm; break-inside:avoid; }
.proj.ph{ border-style:dashed; border-color:var(--line-strong); background:var(--paper-alt); }
.proj__img{ display:block; max-width:100%; width:auto; height:auto; max-height:70mm; object-fit:contain;
  border-radius:1mm; margin-bottom:3.5mm; border:1px solid var(--line); background:var(--paper-alt); }
.proj .tag{ font-family:var(--font-mono); font-size:7.5pt; font-weight:600; letter-spacing:.03em; text-transform:uppercase; color:var(--muted); margin-top:.5mm; display:block; }
.proj h3{ font-size:12.5pt; margin:1mm 0 0; }
.proj p{ color:var(--muted); font-size:9.5pt; margin-top:1.5mm; }
.proj ul{ margin:2mm 0 0; padding-left:5mm; } .proj li{ margin-bottom:1mm; color:var(--ink-soft); font-size:9.5pt; }
.ph-txt{ color:var(--muted); font-style:italic; }
/* Printed pages can't be clicked: spell the URL out in full so a reader
   holding paper can still reach the material. */
.proj__lnk{ margin-top:2.5mm; font-size:8.5pt; color:var(--muted); }
.proj__lnk b{ color:var(--ink-soft); font-weight:600; }
.proj__lnk span{ font-family:var(--font-mono); word-break:break-all; }
.attach{ border:1px solid var(--line); border-radius:1mm; padding:5mm; background:#fff; margin-top:3mm; break-inside:avoid; }
.attach .item{ padding:2.5mm 0; border-top:1px solid var(--line); color:var(--ink-soft); font-size:9.5pt; }
.attach .item:first-of-type{ border-top:0; }
"""


def first_image(p):
    for m in (p.get("media") or []):
        if not VIDEO_RE.search(m):
            return "../" + quote(m)   # relative to pdf/portfolio.generated.html
    return None


def project_block(p):
    ph = " ph" if p.get("placeholder") else ""
    img = first_image(p)
    img_html = f'<img class="proj__img" src="{img}">' if img else ""
    summ = (f'<p class="ph-txt">{escape(p.get("summary",""))}</p>' if p.get("placeholder")
            else f'<p>{escape(p.get("summary",""))}</p>')
    bullets = ("<ul>" + "".join(f"<li>{escape(b)}</li>" for b in p["bullets"]) + "</ul>") if p.get("bullets") else ""
    links = "".join(
        f'<div class="proj__lnk"><b>{escape(l["label"])}:</b> <span>{escape(l["href"])}</span></div>'
        for l in p.get("links", []))
    return (f'<div class="proj{ph}">{img_html}'
            f'<h3>{escape(p.get("title",""))}</h3><span class="tag">{escape(p.get("tag",""))}</span>{summ}{bullets}{links}</div>')


def meta_row(meta):
    return '<div class="metarow">' + "".join(
        f'<div><div class="k">{escape(m["k"])}</div><div class="v">{escape(m["v"])}</div></div>'
        for m in meta) + "</div>"


def approach_block(page):
    steps = "".join(f"<li>{escape(s)}</li>" for s in page.get("approach", []))
    return f'<div class="approach"><div class="k">Approach</div><ol>{steps}</ol></div>'


def build_html(data):
    p = data["profile"]; about = data["about"]; pages = data["pages"]
    order = [n["slug"] for n in data["nav"]]
    parts = ['<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
             '<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">',
             f"<style>{CSS}</style></head><body>"]

    # Cover
    parts.append(f'''
    <section class="cover">
      <div class="mark">JA</div>
      <h1>Joshua Alcobia&nbsp;Gomes<br>Mechanical Engineer</h1>
      <div class="role">MECHANICAL ENGINEER · AUTOMOTIVE &amp; AEROSPACE</div>
      <p class="sub">{escape(p["tagline"])}</p>
      <div class="meta">
        <div><div class="k">Discipline</div><div class="v">Mechanical Engineering</div></div>
        <div><div class="k">University</div><div class="v">UCL · MEng</div></div>
        <div><div class="k">Email</div><div class="v">{escape(p["email"])}</div></div>
        <div><div class="k">LinkedIn</div><div class="v">josh-alcobia-gomes</div></div>
      </div>
    </section>''')

    # About
    about_ps = "".join(f"<p style='margin-top:3mm'>{escape(t)}</p>" for t in about["paragraphs"])
    chips = "".join(f'<span class="chip">{escape(c)}</span>' for c in about["chips"])
    facts = "".join(f'<p><strong>{escape(f["k"])}:</strong> {escape(f["v"])}</p>' for f in about["facts"])
    contents = "".join(
        f'<p>{i+1} &nbsp;·&nbsp; {escape(next(c["title"] for c in data["cards"] if c["slug"]==s))} '
        f'— {escape(next(c["tag"] for c in data["cards"] if c["slug"]==s))}</p>'
        for i, s in enumerate(order))
    parts.append(f'''
    <section class="about">
      <h2 class="title">Curiosity, engineered.</h2>
      <div class="overview">{about_ps}</div>
      <div class="chips">{chips}</div>
      <div class="rule"></div>
      <div class="grid2">
        <div class="card"><h4>At a glance</h4>{facts}</div>
        <div class="card"><h4>Contents</h4>{contents}
          <p style="margin-top:3mm; color:var(--muted); font-size:8.5pt">A separate 2-page résumé accompanies this portfolio.</p>
        </div>
      </div>
    </section>''')

    # Sections
    for slug in order:
        page = pages[slug]
        projects = "".join(project_block(pr) for pr in page.get("projects", []))
        attach = ""
        if page.get("attachments"):
            a = page["attachments"]
            items = "".join(f'<div class="item">{escape(it["label"])}</div>' for it in a.get("items", []))
            attach = ('<div class="attach"><h4 style="font-family:var(--font-mono);font-size:8pt;letter-spacing:.08em;text-transform:uppercase;'
                      'color:var(--muted);margin-bottom:2mm;font-weight:600">Presentations &amp; coursework</h4>'
                      f'<p style="color:var(--muted);font-size:9pt">{escape(a.get("note",""))}</p>{items}</div>')
        parts.append(f'''
        <section class="section">
          <h2 class="title">{escape(page["title"])}</h2>
          <div class="sech2">{escape(page.get("tag",""))}</div>
          <p class="lead">{escape(page.get("subtitle",""))}</p>
          {meta_row(page.get("meta", []))}
          <div class="overview">{escape(page.get("overview",""))}</div>
          {approach_block(page)}
          <div class="sech"><span class="label">Projects</span><span class="n">{len(page.get("projects", []))} projects</span></div>
          {projects}
          {attach}
        </section>''')

    parts.append("</body></html>")
    return "\n".join(parts)


FOOTER = ('<div style="font-size:8px; width:100%; margin:0 14mm; color:#6A6D70; '
          'font-family:monospace; display:flex; justify-content:space-between;">'
          '<span>Joshua Alcobia Gomes — Portfolio</span>'
          '<span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    GEN.write_text(build_html(data), encoding="utf-8")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page()
        page.goto(GEN.as_uri(), wait_until="networkidle")
        page.emulate_media(media="print")
        page.pdf(path=str(OUT), format="A4", print_background=True,
                 display_header_footer=True, header_template="<div></div>", footer_template=FOOTER,
                 margin={"top": "14mm", "bottom": "16mm", "left": "14mm", "right": "14mm"})
        browser.close()
    print(f"[ok] PDF written to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
