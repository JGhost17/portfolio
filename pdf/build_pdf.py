#!/usr/bin/env python3
"""
Build the printable portfolio PDF from pdf/portfolio.html using headless Chromium
(Playwright). Because it renders in Chromium, the PDF matches the website's
"Sage & Sky" colours and fonts exactly.

Usage (from the project root, with the venv active):
    python pdf/build_pdf.py

Output:
    assets/portfolio.pdf   (served by the website's "PDF" links)
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "pdf" / "portfolio.html"
OUT_DIR = ROOT / "assets"
OUT = OUT_DIR / "portfolio.pdf"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not SRC.exists():
        raise SystemExit(f"Source not found: {SRC}")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        # file:// so relative assets resolve; wait for webfonts to settle.
        page.goto(SRC.as_uri(), wait_until="networkidle")
        page.emulate_media(media="print")
        page.pdf(
            path=str(OUT),
            format="A4",
            print_background=True,
            prefer_css_page_size=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        )
        browser.close()

    print(f"[ok] PDF written to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
