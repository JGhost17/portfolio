/* =========================================================================
   Portfolio — site script
   1) Renders sub-pages (McLaren / NING / Novartis / UCL / Side Projects)
      from data/portfolio.json into <main id="app" data-page="...">.
   2) Wires interactions: scroll progress, scroll-reveal, mobile nav,
      hero parallax, animated counters.
   The home page is static HTML; this script just runs the interactions there.
   ========================================================================= */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ---------------------------------------------------------------- render */
  function mediaHint(slug, i) {
    return `assets/video/${slug}-${i}.mp4 &nbsp;·&nbsp; assets/img/${slug}-${i}.jpg`;
  }

  function projectHTML(slug, p, i) {
    const n = String(i + 1).padStart(2, "0");
    const ph = p.placeholder ? " is-placeholder" : "";
    const bullets = Array.isArray(p.bullets) && p.bullets.length
      ? `<ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : "";
    const summary = p.placeholder
      ? `<p class="placeholder">${esc(p.summary)}</p>`
      : `<p>${esc(p.summary)}</p>`;
    const mediaInner = p.placeholder
      ? `<span class="slot">Add media<br>${mediaHint(slug, i + 1)}</span>`
      : `<span class="slot">${mediaHint(slug, i + 1)}</span>`;
    return `
      <article class="project${ph}" data-reveal>
        <div class="project__index">${n}</div>
        <div class="project__body">
          <span class="card__tag">${esc(p.tag || "")}</span>
          <h3>${esc(p.title)}</h3>
          ${summary}
          ${bullets}
        </div>
        <div class="project__media">${mediaInner}</div>
      </article>`;
  }

  function attachmentsHTML(a) {
    if (!a) return "";
    const items = (a.items || []).map((it) => {
      if (it.placeholder) {
        return `<li><span class="doc is-placeholder"><span class="fileicon">📄</span>${esc(it.label)} — drop file at ${esc(it.file)}</span></li>`;
      }
      const icon = /\.pptx?$/i.test(it.file) ? "📊" : "📄";
      return `<li><a href="${esc(it.file)}"><span class="fileicon">${icon}</span>${esc(it.label)}<span style="margin-left:auto">↓</span></a></li>`;
    }).join("");
    return `
      <section class="section wrap" style="padding-top:0">
        <div class="attachments" data-reveal>
          <span class="eyebrow">Documents</span>
          <h3 style="margin-top:.8rem">Presentations &amp; coursework</h3>
          <p class="muted">${esc(a.note || "")}</p>
          <ul class="attach-list">${items}</ul>
        </div>
      </section>`;
  }

  function metaHTML(meta) {
    return (meta || []).map((m) =>
      `<div><span class="k">${esc(m.k)}</span><span class="v${m.placeholder ? " placeholder" : ""}">${esc(m.v)}</span></div>`
    ).join("");
  }

  function pageHTML(slug, page, nav) {
    const upcoming = slug === "mclaren"
      ? `<div class="upcoming">🗓️ Upcoming — Industrial Placement, 2026–27</div>` : "";
    const overview = (page.overview || "")
      + (page.overviewPlaceholder ? ' <span class="placeholder">confirm / expand this overview</span>' : "");
    const approach = `
      <div class="approach">
        <h4>Approach</h4>
        <ol>${(page.approach || []).map((a) => `<li>${esc(a)}</li>`).join("")}</ol>
        ${page.approachPlaceholder ? '<p class="placeholder" style="margin-top:1rem">Confirm these steps.</p>' : ""}
      </div>`;
    const projects = (page.projects || []).map((p, i) => projectHTML(slug, p, i)).join("");

    // next-page link (wraps around the nav order)
    const idx = nav.findIndex((n) => n.slug === slug);
    const next = nav[(idx + 1) % nav.length];

    return `
      <header class="phead wrap">
        <div class="breadcrumb"><a href="index.html">Home</a> <span>/</span> <span>${esc(page.title)}</span></div>
        <span class="eyebrow">${esc(page.tag || "")}</span>
        <h1 style="margin-top:1rem">${esc(page.title)}</h1>
        <p class="lead">${esc(page.subtitle || "")}</p>
        ${upcoming}
        <div class="metabar">${metaHTML(page.meta)}</div>
      </header>

      <section class="section wrap" style="padding-bottom:0">
        <div class="pageintro">
          <div class="overview" data-reveal>
            <span class="eyebrow">Overview</span>
            <p style="margin-top:1rem">${overview}</p>
          </div>
          <div data-reveal data-delay="1">${approach}</div>
        </div>
        <div class="projects__head">
          <div><span class="eyebrow">Projects</span></div>
          <span class="muted">${(page.projects || []).length} projects</span>
        </div>
        <div class="projects">${projects}</div>
      </section>

      ${attachmentsHTML(page.attachments)}

      <section class="section wrap" style="padding-top:1rem">
        <a class="card" href="${esc(next.slug)}.html" style="--tint:var(--sage)" data-reveal>
          <div class="card__tag">Next</div><h3>${esc(next.label)} →</h3>
        </a>
      </section>

      <footer class="footer">
        <div class="wrap footer__bottom">
          <span>© <span class="year"></span> Joshua Alcobia Gomes</span>
          <span><a class="link" href="index.html">← Back to home</a></span>
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
      app.innerHTML = pageHTML(slug, page, data.nav);
      document.title = `${page.title} — ${data.profile.name}`;
      app.querySelectorAll(".year").forEach((e) => (e.textContent = new Date().getFullYear()));
    } catch (err) {
      app.innerHTML = `<div class="wrap section"><div class="callout">
        <strong>Content couldn't load.</strong> This page reads <code>data/portfolio.json</code> and
        needs to be served over http (not opened as a file). Run <code>python -m http.server</code> in
        the project folder, then open <code>http://localhost:8000</code>.
        <br><span class="muted" style="font-size:.85rem">(${esc(err.message)})</span></div></div>`;
    }
  }

  /* ---------------------------------------------------------- interactions */
  function initInteractions() {
    // Scroll progress
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

    // Scroll reveal
    const reveals = document.querySelectorAll("[data-reveal]:not(.in)");
    if (reveals.length && "IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    // Mobile nav
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

    // Hero parallax
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

    // Counters
    const counters = document.querySelectorAll("[data-count]");
    if (counters.length && !reduce && "IntersectionObserver" in window) {
      const co = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target, target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
          const dur = 1200, start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick); co.unobserve(el);
        });
      }, { threshold: 0.6 });
      counters.forEach((c) => co.observe(c));
    }
  }

  /* ---------------------------------------------------------------- boot */
  document.addEventListener("DOMContentLoaded", async () => {
    const app = document.querySelector("main#app[data-page]");
    if (app && app.dataset.page !== "home") {
      await renderPage(app);
    }
    initInteractions();
    document.querySelectorAll(".year").forEach((e) => (e.textContent = new Date().getFullYear()));
  });
})();
