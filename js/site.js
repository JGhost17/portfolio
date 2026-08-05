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

  const mediaHint = (slug, i) =>
    `assets/video/${slug}-${i}.mp4 &nbsp;·&nbsp; assets/img/${slug}-${i}.jpg`;

  /* ---------------------------------------------------------- media panel */
  const isVideo = (src) => /\.(mp4|webm|mov|m4v)$/i.test(src);
  function cleanName(src) {
    return src.split("/").pop().replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ").replace(/\b(jpg|jpeg|png|mp4)\b/gi, "").trim();
  }
  function mediaItemEl(src) {
    const url = encodeURI(src);
    return isVideo(src)
      ? `<video src="${url}" controls preload="metadata" playsinline></video>`
      : `<img src="${url}" loading="lazy" alt="${esc(cleanName(src))}">`;
  }
  function mediaPanel(items) {
    if (!Array.isArray(items) || !items.length) return null;
    const multi = items.length > 1;
    const dots = multi
      ? `<div class="media__dots">${items.map((_, i) => `<button class="mdot" data-i="${i}" aria-label="Media ${i + 1}"></button>`).join("")}</div>` : "";
    const arms = multi
      ? `<button class="media__arm prev" aria-label="Previous">‹</button><button class="media__arm next" aria-label="Next">›</button>` : "";
    return `<div class="media" data-media="${items.map(esc).join("|")}">
      <div class="media__stage">${mediaItemEl(items[0])}</div>
      <div class="media__cap">${esc(cleanName(items[0]))}</div>
      ${arms}${dots}
    </div>`;
  }

  /* --------------------------------------------------------------- slides */
  function introSlide(page) {
    const meta = (page.meta || [])
      .map((m) => `<div><strong>${esc(m.k)}:</strong> ${esc(m.v)}</div>`).join("");
    const approach = (page.approach || []).map((a) => `<li>${esc(a)}</li>`).join("");
    const overview = (page.overview || "")
      + (page.overviewPlaceholder ? ' <span class="placeholder">confirm / expand</span>' : "");
    return `
      <section class="slide slide--intro" data-slide>
        <div class="slide__title">
          <span class="eyebrow">${esc(page.tag || "")}</span>
          <h2>${esc(page.title)}</h2>
          <div class="sub">Overview</div>
        </div>
        <div class="slide__media"><span class="slot">${esc(page.title)}</span></div>
        <aside class="slide__detail">
          <div class="d-role">${esc(page.subtitle || "")}</div>
          <div class="d-block"><h5>Overview</h5><p>${overview}</p></div>
          <div class="d-block"><h5>Approach</h5><ol>${approach}</ol></div>
          <div class="d-block"><h5>Details</h5><div class="d-list">${meta}</div></div>
        </aside>
      </section>`;
  }

  function projectSlide(slug, page, p, i) {
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
    const mediaInner = mediaPanel(p.media)
      || `<span class="slot">${p.placeholder ? "Add media<br>" : ""}${mediaHint(slug, i + 1)}</span>`;
    const sub = p.subtitle || (p.tag || "").split("·")[0].trim();
    return `
      <section class="slide" data-slide>
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
      <section class="slide" data-slide>
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

  function pageHTML(slug, page, profile) {
    const slides = [introSlide(page)];
    (page.projects || []).forEach((p, i) => slides.push(projectSlide(slug, page, p, i)));
    if (page.attachments) slides.push(attachSlide(page.attachments));
    const dots = slides.map((_, i) =>
      `<button class="dot" data-i="${i}" aria-label="Go to section ${i + 1}"></button>`).join("");
    return `
      <div class="deck">
        <div class="deck__rail">
          <div class="co">${esc(page.title)}</div>
          <div class="tag">${esc(stripNo(page.tag))}</div>
          <div class="deck__dots">${dots}</div>
        </div>
        ${slides.join("")}
        <div class="deck__footer">${esc(profile.name)} · <a href="index.html">Home ↑</a></div>
      </div>`;
  }

  async function renderPage(app) {
    const slug = app.dataset.page;
    try {
      const res = await fetch("data/portfolio.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const page = data.pages[slug];
      if (!page) throw new Error("Unknown page: " + slug);
      app.innerHTML = pageHTML(slug, page, data.profile);
      document.title = `${page.title} — ${data.profile.name}`;
    } catch (err) {
      app.innerHTML = `<div class="wrap section" style="padding-top:6rem"><div class="callout">
        <strong>Content couldn't load.</strong> This page reads <code>data/portfolio.json</code> and must be
        served over http (not opened as a file). Run <code>python -m http.server</code> in the project folder,
        then open <code>http://localhost:8000</code>.
        <br><span class="muted" style="font-size:.85rem">(${esc(err.message)})</span></div></div>`;
    }
  }

  /* ------------------------------------------------------ deck navigation */
  function initDeck() {
    const dotsWrap = document.querySelector(".deck__dots");
    const slides = [...document.querySelectorAll("[data-slide]")];
    if (!dotsWrap || !slides.length) return;
    const dots = [...dotsWrap.querySelectorAll(".dot")];
    const NAV_H = 64;
    // "Deck mode": one-section-per-scroll snap, desktop + motion allowed only.
    const deckMode = () => window.matchMedia("(min-width: 901px)").matches && !reduce;

    let index = 0, locked = false;
    const setDots = (i) => dots.forEach((d, k) => d.classList.toggle("active", k === i));

    function goTo(i, smooth = true) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      const s = slides[index];
      slides.forEach((el, k) => el.classList.toggle("active", k === index));
      if (deckMode()) { s.classList.remove("enter"); void s.offsetWidth; s.classList.add("enter"); }
      s.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto", block: "start" });
      setDots(index);
    }

    if (deckMode()) document.documentElement.classList.add("snap-mode");
    slides[0].classList.add("active");
    setDots(0);

    const step = (dir) => {
      const target = index + dir;
      if (target < 0 || target >= slides.length || locked) return;
      locked = true;
      goTo(target);
      setTimeout(() => { locked = false; }, 900);
    };

    // Wheel: hijack to advance one section per gesture. Tall sections (content
    // taller than the viewport) scroll natively until their edge, then snap.
    window.addEventListener("wheel", (e) => {
      if (!deckMode()) return;
      if (locked) { e.preventDefault(); return; }
      const down = e.deltaY > 0;
      const r = slides[index].getBoundingClientRect();
      const tall = slides[index].offsetHeight > window.innerHeight + 4;
      if (tall) {
        if (down && Math.ceil(r.bottom) > window.innerHeight + 1) return;   // reveal rest
        if (!down && Math.floor(r.top) < NAV_H - 1) return;                 // reveal rest (up)
      }
      if (Math.abs(e.deltaY) < 8) return;
      e.preventDefault();
      step(down ? 1 : -1);
    }, { passive: false });

    // Keyboard
    window.addEventListener("keydown", (e) => {
      if (!deckMode()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) { e.preventDefault(); step(1); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); step(-1); }
    });

    // Scroll spy keeps the active dash + index in sync (mobile native scroll,
    // momentum, and after programmatic snaps).
    let ticking = false;
    const spy = () => {
      ticking = false;
      if (locked) return;   // don't fight a programmatic snap — this was the flicker
      const mid = window.innerHeight / 2;
      let best = 0, bd = Infinity;
      slides.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bd) { bd = d; best = i; }
      });
      index = best;
      setDots(best);
    };
    document.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(spy); }
    }, { passive: true });
    spy();

    dots.forEach((d, i) => d.addEventListener("click", () => { if (!locked) step(i - index); }));
  }

  /* --------------------------------------------------- media carousels */
  function initMedia() {
    document.querySelectorAll("[data-media]").forEach((box) => {
      const items = box.getAttribute("data-media").split("|");
      if (items.length < 2) return;
      const stage = box.querySelector(".media__stage");
      const cap = box.querySelector(".media__cap");
      const dots = [...box.querySelectorAll(".mdot")];
      let cur = 0;
      const show = (i) => {
        cur = (i + items.length) % items.length;
        stage.innerHTML = mediaItemEl(items[cur]);
        if (cap) cap.textContent = cleanName(items[cur]);
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
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
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
