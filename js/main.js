/* =========================================================================
   Portfolio — interactions
   - scroll progress bar
   - scroll-reveal (IntersectionObserver, staggered)
   - mobile nav toggle
   - subtle pointer parallax on hero portrait
   ========================================================================= */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Scroll progress ---- */
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

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- Mobile nav ---- */
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* ---- Hero pointer parallax ---- */
  const portrait = document.querySelector("[data-parallax]");
  if (portrait && !reduce && window.matchMedia("(pointer:fine)").matches) {
    const strength = 10;
    portrait.addEventListener("mousemove", (e) => {
      const r = portrait.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      portrait.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
    });
    portrait.addEventListener("mouseleave", () => {
      portrait.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
    });
  }

  /* ---- Animated stat counters ---- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && !reduce && "IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const dur = 1200;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }
})();
