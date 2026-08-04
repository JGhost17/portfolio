#!/usr/bin/env python3
"""
Build the printable portfolio PDF from data/portfolio.json.

The PDF is generated from the SAME data that drives the website, then rendered
with headless Chromium (Playwright) so its "Sage & Sky" colours and fonts match
the site exactly.

Usage (from the project root, with the venv active):
    python pdf/build_pdf.py

Outputs:
    pdf/portfolio.generated.html   (intermediate, for inspection)
    assets/portfolio.pdf           (served by the website's "PDF" links)
"""
import json
from html import escape
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "portfolio.json"
GEN = ROOT / "pdf" / "portfolio.generated.html"
OUT = ROOT / "assets" / "portfolio.pdf"

CSS = """
:root{
  --sage:#A8C3A4; --sage-deep:#7FA07B; --sky:#B8D4E3; --sky-deep:#8FB8CE;
  --sand:#E8DCC4; --ink:#2F4538; --ink-soft:#43574a; --bg:#FBFAF6;
  --line:#dfe4d8; --muted:#5c6b60;
  --font-head:"Space Grotesk",sans-serif; --font-body:"Inter",sans-serif;
}
@page { size: A4; margin: 0; }
*{ box-sizing:border-box; margin:0; }
html,body{ font-family:var(--font-body); color:var(--ink); line-height:1.5; font-size:10pt;
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }
h1,h2,h3,h4{ font-family:var(--font-head); line-height:1.1; letter-spacing:-.01em; }
.page{ width:210mm; min-height:297mm; padding:18mm 16mm 20mm; position:relative; overflow:hidden;
  page-break-after:always; background:var(--bg); }
.page:last-child{ page-break-after:auto; }
.page::before{ content:""; position:absolute; top:0; left:0; right:0; height:7mm;
  background:linear-gradient(90deg,var(--sage),var(--sky)); }
.foot{ position:absolute; bottom:10mm; left:16mm; right:16mm; display:flex; justify-content:space-between;
  font-size:7.5pt; color:var(--muted); border-top:1px solid var(--line); padding-top:2.5mm; }
.eyebrow{ display:inline-block; font-family:var(--font-head); font-size:7.5pt; font-weight:600;
  letter-spacing:.16em; text-transform:uppercase; color:var(--sage-deep);
  border:1px solid var(--line); border-radius:20px; padding:1.5mm 3.5mm; background:#fff; }
h2.title{ font-size:24pt; margin:4mm 0 2mm; }
.lead{ color:var(--muted); font-size:10.5pt; max-width:150mm; }
.rule{ height:1px; background:var(--line); margin:5mm 0; }
.cover{ display:flex; flex-direction:column; justify-content:center; min-height:257mm; }
.cover .mark{ width:20mm; height:20mm; border-radius:5.5mm; display:grid; place-items:center;
  background:linear-gradient(135deg,var(--sage),var(--sky)); color:var(--ink);
  font-family:var(--font-head); font-weight:700; font-size:14pt; margin-bottom:9mm; }
.cover h1{ font-size:40pt; letter-spacing:-.02em; }
.cover .grad{ background:linear-gradient(120deg,var(--sage-deep),var(--sky-deep));
  -webkit-background-clip:text; background-clip:text; color:transparent; }
.cover .sub{ font-size:12pt; color:var(--muted); margin-top:5mm; max-width:150mm; }
.cover .meta{ margin-top:12mm; display:flex; gap:10mm; flex-wrap:wrap; }
.cover .meta .k{ font-size:7.5pt; letter-spacing:.12em; text-transform:uppercase; color:var(--sage-deep); font-weight:600; }
.cover .meta .v{ font-weight:600; font-size:10pt; }
.chips{ display:flex; flex-wrap:wrap; gap:2mm; margin-top:4mm; }
.chip{ font-size:8pt; padding:1.2mm 3mm; border:1px solid var(--line); border-radius:20px; background:#fff; color:var(--ink-soft); }
.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:8mm; }
.card{ border:1px solid var(--line); border-radius:4mm; padding:5mm; background:#fff; }
.card h4{ font-size:7.5pt; letter-spacing:.1em; text-transform:uppercase; color:var(--sage-deep); margin-bottom:2.5mm; }
.metarow{ display:flex; flex-wrap:wrap; gap:7mm; margin:4mm 0 5mm; }
.metarow .k{ font-size:7.5pt; letter-spacing:.12em; text-transform:uppercase; color:var(--sage-deep); font-weight:600; }
.metarow .v{ font-weight:600; }
.overview{ color:var(--ink-soft); font-size:10.5pt; max-width:172mm; }
.approach{ margin:4mm 0 2mm; }
.approach .k{ font-size:7.5pt; letter-spacing:.12em; text-transform:uppercase; color:var(--sage-deep); font-weight:600; margin-bottom:2mm; }
.approach ol{ margin:0; padding-left:5mm; color:var(--ink-soft); }
.approach li{ margin-bottom:1.2mm; }
.proj{ border:1px solid var(--line); border-radius:4mm; padding:4.5mm 5mm; background:#fff; margin-bottom:4mm;
  break-inside:avoid; }
.proj.ph{ border-style:dashed; border-color:var(--sky-deep); background:#b8d4e314; }
.proj .tag{ font-size:7.5pt; font-weight:600; letter-spacing:.03em; text-transform:uppercase; color:var(--sage-deep); }
.proj h3{ font-size:12.5pt; margin:1mm 0 1.5mm; }
.proj p{ color:var(--muted); font-size:9.5pt; }
.proj ul{ margin:2mm 0 0; padding-left:5mm; }
.proj li{ margin-bottom:1mm; color:var(--ink-soft); font-size:9.5pt; }
.sech{ display:flex; align-items:baseline; justify-content:space-between; margin:5mm 0 3mm; }
.sech .n{ color:var(--muted); font-size:9pt; }
.ph-txt{ color:var(--sky-deep); font-style:italic; }
.attach{ border:1px solid var(--line); border-radius:4mm; padding:5mm; background:#fff; margin-top:3mm; }
.attach .item{ padding:2.5mm 0; border-top:1px solid var(--line); color:var(--ink-soft); font-size:9.5pt; }
.attach .item:first-of-type{ border-top:0; }
"""


def foot(label, page_no):
    right = f"{label} · {page_no:02d}" if page_no is not None else label
    return f'<div class="foot"><span>Joshua Alcobia Gomes — Portfolio</span><span>{escape(right)}</span></div>'


def project_block(p):
    ph = " ph" if p.get("placeholder") else ""
    summ = f'<p class="ph-txt">{escape(p.get("summary",""))}</p>' if p.get("placeholder") \
        else f'<p>{escape(p.get("summary",""))}</p>'
    bullets = ""
    if p.get("bullets"):
        bullets = "<ul>" + "".join(f"<li>{escape(b)}</li>" for b in p["bullets"]) + "</ul>"
    return (f'<div class="proj{ph}"><span class="tag">{escape(p.get("tag",""))}</span>'
            f'<h3>{escape(p.get("title",""))}</h3>{summ}{bullets}</div>')


def meta_row(meta):
    return '<div class="metarow">' + "".join(
        f'<div><div class="k">{escape(m["k"])}</div><div class="v">{escape(m["v"])}</div></div>'
        for m in meta) + "</div>"


def approach_block(page):
    steps = "".join(f"<li>{escape(s)}</li>" for s in page.get("approach", []))
    return f'<div class="approach"><div class="k">Approach</div><ol>{steps}</ol></div>'


def build_html(data):
    p = data["profile"]
    about = data["about"]
    pages = data["pages"]
    order = [n["slug"] for n in data["nav"]]

    parts = ['<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
             '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">',
             f'<style>{CSS}</style></head><body>']

    # Cover
    parts.append(f'''
    <section class="page cover">
      <div class="mark">JA</div>
      <h1>Joshua Alcobia&nbsp;Gomes<br><span class="grad">Mechanical Engineer</span></h1>
      <p class="sub">{escape(p["tagline"])}</p>
      <div class="meta">
        <div><div class="k">Discipline</div><div class="v">Mechanical Engineering</div></div>
        <div><div class="k">University</div><div class="v">UCL · MEng</div></div>
        <div><div class="k">Email</div><div class="v">{escape(p["email"])}</div></div>
        <div><div class="k">LinkedIn</div><div class="v">josh-alcobia-gomes</div></div>
      </div>
      {foot("Cover", None)}
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
    <section class="page">
      <span class="eyebrow">About me</span>
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
      {foot("About", 1)}
    </section>''')

    # One section per page
    for i, slug in enumerate(order):
        page = pages[slug]
        projects = "".join(project_block(pr) for pr in page.get("projects", []))
        attach = ""
        if page.get("attachments"):
            a = page["attachments"]
            items = "".join(f'<div class="item">{escape(it["label"])}</div>' for it in a.get("items", []))
            attach = (f'<div class="attach"><h4 style="font-size:8pt;letter-spacing:.1em;text-transform:uppercase;'
                      f'color:var(--sage-deep);margin-bottom:2mm">Presentations &amp; coursework</h4>'
                      f'<p style="color:var(--muted);font-size:9pt">{escape(a.get("note",""))}</p>{items}</div>')
        parts.append(f'''
        <section class="page">
          <span class="eyebrow">{escape(page.get("tag",""))}</span>
          <h2 class="title">{escape(page["title"])}</h2>
          <p class="lead">{escape(page.get("subtitle",""))}</p>
          {meta_row(page.get("meta", []))}
          <div class="overview">{escape(page.get("overview",""))}</div>
          {approach_block(page)}
          <div class="sech"><span class="eyebrow">Projects</span><span class="n">{len(page.get("projects", []))} projects</span></div>
          {projects}
          {attach}
          {foot(page["title"], i + 2)}
        </section>''')

    parts.append("</body></html>")
    return "\n".join(parts)


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
                 prefer_css_page_size=True,
                 margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
        browser.close()
    print(f"[ok] PDF written to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
