/* =========================================================================
   Portfolio — site script
   1) Renders sub-pages as a pinned "deck": persistent name + progress dashes
      (top-left), big title (bottom-left), media (centre), details (right).
      One project per screen; the active dash tracks scroll progress.
   2) Interactions: scroll progress bar, mobile nav, hero parallax, counters.
   The home page is static HTML; this script just runs the interactions there.
   ========================================================================= */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const stripNo = (t) => String(t || "").replace(/^\s*\d+\s*·\s*/, "");

  /* ---------------------------------------------------------- media panel */
  const isVideo = (src) => /\.(mp4|webm|mov|m4v)$/i.test(src);
  function cleanName(src) {
    return src.split("/").pop().replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ").replace(/\b(jpg|jpeg|png|mp4)\b/gi, "").trim();
  }
  function mediaItemEl(src, altOverride) {
    const url = encodeURI(src);
    return isVideo(src)
      ? `<video src="${url}" controls preload="metadata" playsinline></video>`
      : `<img src="${url}" loading="lazy" alt="${esc(altOverride || cleanName(src))}">`;
  }
  // `captions[i]` overrides the filename-derived caption for media[i] — needed
  // wherever a real filename would leak information the title has been
  // written to omit (e.g. an anonymized client name still sitting on disk).
  function captionFor(items, captions, i) {
    return (Array.isArray(captions) && captions[i]) ? captions[i] : cleanName(items[i]);
  }
  // Drawn chevrons, not "‹"/"›" glyphs — one consistent stroke weight with
  // round caps and joins, so the tips read as filleted rather than cut off.
  const chevron = (d) =>
    `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">` +
    `<path d="${d}" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function mediaPanel(items, captions) {
    if (!Array.isArray(items) || !items.length) return null;
    const multi = items.length > 1;
    // Controls sit outside the frame: nothing overlays the render itself.
    const prev = multi
      ? `<button class="media__arm prev" aria-label="Previous">${chevron("M15 5 8 12 15 19")}</button>` : "";
    const next = multi
      ? `<button class="media__arm next" aria-label="Next">${chevron("M9 5 16 12 9 19")}</button>` : "";
    const dots = multi
      ? `<div class="media__dots">${items.map((_, i) => `<button class="mdot" data-i="${i}" aria-label="Media ${i + 1}"></button>`).join("")}</div>` : "";
    const capsAttr = Array.isArray(captions) ? ` data-captions="${captions.map(esc).join("|")}"` : "";
    return `<div class="media" data-media="${items.map(esc).join("|")}"${capsAttr}>
      <div class="media__row">
        ${prev}
        <div class="media__frame">
          <div class="media__stage">${mediaItemEl(items[0], captionFor(items, captions, 0))}</div>
        </div>
        ${next}
      </div>
      <div class="media__bar">
        <div class="media__cap">${esc(captionFor(items, captions, 0))}</div>
        ${dots}
      </div>
    </div>`;
  }

  /* --------------------------------------------------------------- slides */
  function introSlide(page) {
    // Meta fields carry their own `placeholder` flag (e.g. an unconfirmed
    // "Period"). Honor it — an unmarked placeholder rendered as fact is a
    // false credential, not an honest unknown.
    const meta = (page.meta || [])
      .map((m) => `<div class="${m.placeholder ? "placeholder" : ""}"><strong>${esc(m.k)}:</strong> ${esc(m.v)}</div>`).join("");
    const approach = (page.approach || []).map((a) => `<li>${esc(a)}</li>`).join("");
    const overview = (page.overview || "")
      + (page.overviewPlaceholder ? ' <span class="placeholder">confirm / expand</span>' : "");
    const approachNote = page.approachPlaceholder ? '<p class="placeholder" style="margin-top:.5rem">confirm these steps</p>' : "";
    return `
      <section class="slide slide--intro" data-slide tabindex="-1">
        <div class="slide__title">
          <h2>${esc(page.title)}</h2>
          <div class="sub">Overview</div>
        </div>
        <div class="slide__media"><span class="slot">${esc(page.title)}</span></div>
        <aside class="slide__detail">
          <div class="d-role">${esc(page.subtitle || "")}</div>
          <div class="d-block"><h5>Overview</h5><p>${overview}</p></div>
          <div class="d-block"><h5>Approach</h5><ol>${approach}</ol>${approachNote}</div>
          <div class="d-block"><h5>Details</h5><div class="d-list">${meta}</div></div>
        </aside>
      </section>`;
  }

  function moreComingSlide(text) {
    return `
      <section class="slide" data-slide tabindex="-1">
        <div class="slide__title">
          <h2>More soon</h2>
          <div class="sub">In progress</div>
        </div>
        <div class="slide__media"><span class="slot">✎</span></div>
        <aside class="slide__detail">
          <div class="d-block"><p>${esc(text)}</p></div>
        </aside>
      </section>`;
  }

  function projectSlide(page, p, i) {
    const n = String(i + 1).padStart(2, "0");
    const focus = (p.tag || "").split("·").map((s) => s.trim()).filter(Boolean)
      .map((f) => `<div>${esc(f)}</div>`).join("");
    const desc = p.summary
      ? `<div class="d-block"><h5>Description</h5><p class="${p.placeholder ? "placeholder" : ""}">${esc(p.summary)}</p></div>`
      : "";
    const impact = (Array.isArray(p.bullets) && p.bullets.length)
      ? `<div class="d-block"><h5>Impact</h5><ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>`
      : "";
    const date = p.date ? `<div class="d-date">${esc(p.date)}</div>` : "";
    // A project with no media yet shows a plain visitor-facing note — never the
    // asset paths, which are a build instruction and not something to publish.
    const mediaInner = mediaPanel(p.media, p.captions)
      || `<span class="slot">${esc(p.mediaNote || "Imagery to follow")}</span>`;
    const sub = p.subtitle || (p.tag || "").split("·")[0].trim();
    return `
      <section class="slide" data-slide tabindex="-1" data-title="${esc(p.title)}">
        <div class="slide__title">
          <h2>${esc(p.title)}</h2>
          <div class="sub">${esc(sub)}</div>
        </div>
        <div class="slide__media">${mediaInner}</div>
        <aside class="slide__detail">
          <div class="d-role">${esc(p.tag || "")}</div>
          <div class="d-index">{${n}}</div>
          <div class="d-ctx">${esc(page.title)} · ${esc(p.title)}</div>
          ${date}
          ${desc}
          <div class="d-block"><h5>Focus</h5><div class="d-list">${focus}</div></div>
          ${impact}
        </aside>
      </section>`;
  }

  function attachSlide(a) {
    const items = (a.items || []).map((it) => it.placeholder
      ? `<div>${esc(it.label)} — drop at ${esc(it.file)}</div>`
      : `<div><a href="${esc(it.file)}">${esc(it.label)} ↓</a></div>`).join("");
    return `
      <section class="slide" data-slide tabindex="-1" data-title="Documents">
        <div class="slide__title"><h2>Documents</h2><div class="sub">Coursework</div></div>
        <div class="slide__media"><span class="slot">📊 Presentations &amp; PDFs<br>assets/docs/</span></div>
        <aside class="slide__detail">
          <div class="d-role">Presentations &amp; coursework</div>
          <div class="d-index">{＋}</div>
          <div class="d-block"><h5>Files</h5><div class="d-list">${items}</div></div>
          <div class="d-block"><p class="muted">${esc(a.note || "")}</p></div>
        </aside>
      </section>`;
  }

  function pageHTML(page, profile) {
    const slides = [introSlide(page)];
    (page.projects || []).forEach((p, i) => slides.push(projectSlide(page, p, i)));
    if (page.moreComing) slides.push(moreComingSlide(page.moreComing));
    if (page.attachments) slides.push(attachSlide(page.attachments));
    const total = slides.length;
    // Rail buttons carry a real title where the slide has one (recognition,
    // not pure recall) — "Overview", each project's name, "More soon", "Documents".
    const titles = ["Overview", ...(page.projects || []).map((p) => p.title),
      ...(page.moreComing ? ["More soon"] : []), ...(page.attachments ? ["Documents"] : [])];
    const dots = slides.map((_, i) =>
      `<button class="dot" data-i="${i}" aria-label="${esc(titles[i] || `Section ${i + 1}`)}" title="${esc(titles[i] || "")}"></button>`).join("");
    return `
      <div class="deck">
        <div class="deck__rail">
          <h1 class="co">${esc(page.title)}</h1>
          <div class="tag">${esc(stripNo(page.tag))}</div>
          <div class="deck__dots" role="tablist" aria-label="${esc(page.title)} sections">${dots}</div>
          <div class="deck__count" aria-live="polite"><span data-current>1</span> / ${total}</div>
        </div>
        ${slides.join("")}
      </div>
      <footer class="footer">
        <div class="wrap titleblock">
          <div class="tb-row tb-row--lead">
            <div>
              <h4>Let's build something together.</h4>
              <p class="muted" style="max-width:34ch">Open to opportunities across automotive, aerospace, motorsport and robotics.</p>
              <a class="btn btn--primary" href="mailto:${esc(profile.email)}" style="margin-top:1rem">Get in touch <span class="arrow">→</span></a>
            </div>
            <div class="footer__cols">
              <div>
                <h5>Pages</h5>
                <a class="link" href="index.html">Home</a><br />
                <a class="link" href="mclaren.html">McLaren</a><br />
                <a class="link" href="ning.html">NING Research</a><br />
                <a class="link" href="novartis.html">Novartis</a><br />
                <a class="link" href="ucl.html">UCL</a><br />
                <a class="link" href="side-projects.html">Side Projects</a>
              </div>
              <div>
                <h5>Elsewhere</h5>
                <a class="link" href="${esc(profile.linkedin)}">LinkedIn</a><br />
                <a class="link" href="${esc(profile.github)}">GitHub</a><br />
                <a class="link" href="assets/portfolio.pdf">PDF portfolio</a><br />
                <a class="link" href="${esc(profile.resume)}">Résumé (CV)</a>
              </div>
            </div>
          </div>
          <div class="tb-row tb-row--strip">
            <span class="tb-field"><b>Drawn by</b> ${esc(profile.name)}</span>
            <span class="tb-field"><b>Sheet</b> ${esc(page.title)} · Rev. 2026</span>
            <span class="tb-field"><b>©</b> <span class="year"></span></span>
            <span class="tb-field"><a class="link" href="index.html">← Back to home</a></span>
          </div>
        </div>
      </footer>`;
  }

  async function renderPage(app) {
    const slug = app.dataset.page;
    try {
      const res = await fetch("data/portfolio.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const page = data.pages[slug];
      if (!page) throw new Error("Unknown page: " + slug);
      app.innerHTML = pageHTML(page, data.profile);
      document.title = `${page.title} — ${data.profile.name}`;
    } catch (err) {
      app.innerHTML = `<div class="wrap section" style="padding-top:6rem"><div class="callout">
        <strong>Content couldn't load.</strong> This page reads <code>data/portfolio.json</code> and must be
        served over http (not opened as a file). Run <code>python -m http.server</code> in the project folder,
        then open <code>http://localhost:8000</code>.
        <br><span class="muted" style="font-size:.85rem">(${esc(err.message)})</span></div></div>`;
    }
  }

  /* ------------------------------------------------------ deck navigation
     Section snapping driven by a critically-damped SPRING that animates from
     the live scroll position. It is interruptible and velocity-carrying: a new
     gesture just re-targets and keeps moving — input is never locked (§3–§6). */
  function initDeck() {
    const dotsWrap = document.querySelector(".deck__dots");
    const slides = [...document.querySelectorAll("[data-slide]")];
    if (!dotsWrap || !slides.length) return;
    const dots = [...dotsWrap.querySelectorAll(".dot")];
    const NAV_H = 64;
    const deckMode = () => window.matchMedia("(min-width: 901px)").matches && !reduce;
    const clamp = (i) => Math.max(0, Math.min(slides.length - 1, i));
    const slideTop = (s) => s.getBoundingClientRect().top + window.scrollY - NAV_H;

    let index = 0;
    const countEl = document.querySelector("[data-current]");
    const setDots = (i) => {
      dots.forEach((d, k) => {
        d.classList.toggle("active", k === i);
        if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
      if (countEl) countEl.textContent = i + 1;
    };
    const nearestIndex = () => {
      const mid = window.innerHeight / 2; let best = 0, bd = Infinity;
      slides.forEach((s, i) => {
        const r = s.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    };

    slides[0].classList.add("active");
    setDots(0);
    if (deckMode()) document.documentElement.classList.add("snap-mode");

    // ---- Spring integrator (damping 1.0, response ~0.08s) ----
    const RESPONSE = 0.08, DAMP = 1.0;
    const omega = 2 * Math.PI / RESPONSE, K = omega * omega, C = 2 * DAMP * omega;
    let target = window.scrollY, y = window.scrollY, vel = 0, running = false, last = 0;

    function frame(t) {
      if (!last) last = t;
      let dt = (t - last) / 1000; last = t;
      if (dt > 0.05) dt = 0.05;
      const steps = Math.max(1, Math.ceil(dt / 0.008)), h = dt / steps;
      for (let s = 0; s < steps; s++) {
        vel += (-K * (y - target) - C * vel) * h;
        y += vel * h;
      }
      window.scrollTo(0, y);
      setDots(nearestIndex());                  // dashes track the motion continuously
      if (Math.abs(y - target) < 0.4 && Math.abs(vel) < 8) {
        y = target; window.scrollTo(0, y); vel = 0; running = false; last = 0; return;
      }
      requestAnimationFrame(frame);
    }
    const run = () => { if (!running) { running = true; last = 0; requestAnimationFrame(frame); } };

    function goToIndex(i, animate = true) {
      index = clamp(i);
      const s = slides[index];
      slides.forEach((el, k) => el.classList.toggle("active", k === index));
      if (deckMode() && animate) { s.classList.remove("enter"); void s.offsetWidth; s.classList.add("enter"); }
      target = slideTop(s);
      if (reduce || !animate) { y = target; vel = 0; window.scrollTo(0, y); setDots(index); return; }
      y = window.scrollY;              // seed from the presentation (live) value
      run();                          // vel is *kept* → velocity carries through the re-target
    }

    // ---- Wheel: retargetable one-section steps, no input lock ----
    // At the last slide, scrolling further down must fall through to native
    // scroll so the page footer (contact info) below the deck stays reachable
    // — the deck must never trap the visitor past its own last section.
    let lastStep = 0;
    window.addEventListener("wheel", (e) => {
      if (!deckMode()) return;
      const down = e.deltaY > 0;
      if (down && index === slides.length - 1 && !running) return;   // let native scroll reach the footer
      const cur = slides[index], r = cur.getBoundingClientRect();
      const tall = cur.offsetHeight > window.innerHeight + 24;
      if (tall && !running) {                    // let a tall section reveal itself before snapping
        if (down && Math.ceil(r.bottom) > window.innerHeight + 1) return;
        if (!down && Math.floor(r.top) < NAV_H - 1) return;
      }
      if (Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastStep < 90) return;           // throttle — but never a hard lock
      lastStep = now;
      goToIndex((running ? nearestIndex() : index) + (down ? 1 : -1));
    }, { passive: false });

    window.addEventListener("keydown", (e) => {
      if (!deckMode()) return;
      const wantsDown = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const wantsUp = e.key === "ArrowUp" || e.key === "PageUp";
      if (wantsDown && index === slides.length - 1) return;   // let native scroll reach the footer
      if (wantsDown) { e.preventDefault(); goToIndex(index + 1); }
      else if (wantsUp) { e.preventDefault(); goToIndex(index - 1); }
    });

    // Native scroll (mobile, or tall sections) keeps the dashes + index synced.
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (running) return;
      if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; index = nearestIndex(); setDots(index); }); }
    }, { passive: true });

    // Move focus to the target slide once it settles, so keyboard/screen-reader
    // users landing via a rail click don't stay stranded back on the rail
    // button while the page scrolls elsewhere (reading order == focus order).
    dots.forEach((d, i) => d.addEventListener("click", () => {
      goToIndex(i);
      const target = slides[i];
      const focusWhenSettled = () => {
        if (running) { requestAnimationFrame(focusWhenSettled); return; }
        target.focus({ preventScroll: true });
      };
      requestAnimationFrame(focusWhenSettled);
    }));
  }

  /* --------------------------------------------------- media carousels */
  function initMedia() {
    document.querySelectorAll("[data-media]").forEach((box) => {
      const items = box.getAttribute("data-media").split("|");
      const captions = box.hasAttribute("data-captions") ? box.getAttribute("data-captions").split("|") : null;
      if (items.length < 2) return;
      const stage = box.querySelector(".media__stage");
      const cap = box.querySelector(".media__cap");
      const dots = [...box.querySelectorAll(".mdot")];
      let cur = 0;
      const show = (i) => {
        cur = (i + items.length) % items.length;
        stage.innerHTML = mediaItemEl(items[cur], captionFor(items, captions, cur));
        if (cap) cap.textContent = captionFor(items, captions, cur);
        dots.forEach((d, k) => d.classList.toggle("active", k === cur));
      };
      dots.forEach((d, k) => d.addEventListener("click", (e) => { e.stopPropagation(); show(k); }));
      const prev = box.querySelector(".prev"), next = box.querySelector(".next");
      if (prev) prev.addEventListener("click", (e) => { e.stopPropagation(); show(cur - 1); });
      if (next) next.addEventListener("click", (e) => { e.stopPropagation(); show(cur + 1); });
      show(0);
    });
  }

  /* ---------------------------------------------------------- interactions */
  function initInteractions() {
    const bar = document.querySelector(".progress");
    if (bar) {
      const onScroll = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
      };
      document.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // Content is always visible; just mark any home-page reveals done.
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("in"));

    const toggle = document.querySelector(".nav__toggle");
    const links = document.querySelector(".nav__links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => links.classList.remove("open")));
    }

    const portrait = document.querySelector("[data-parallax]");
    if (portrait && !reduce && window.matchMedia("(pointer:fine)").matches) {
      const s = 10;
      portrait.addEventListener("mousemove", (e) => {
        const r = portrait.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        portrait.style.transform = `perspective(900px) rotateY(${x * s}deg) rotateX(${-y * s}deg)`;
      });
      portrait.addEventListener("mouseleave", () => {
        portrait.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
      });
    }

    const counters = document.querySelectorAll("[data-count]");
    counters.forEach((el) => {
      const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
      if (reduce) { el.textContent = target + suffix; return; }
      const dur = 1200, start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------------------------------------------------------------- boot */
  document.addEventListener("DOMContentLoaded", async () => {
    const app = document.querySelector("main#app[data-page]");
    if (app && app.dataset.page !== "home") {
      await renderPage(app);
      initDeck();
      initMedia();
    }
    initInteractions();
    document.querySelectorAll(".year").forEach((e) => (e.textContent = new Date().getFullYear()));
  });
})();
