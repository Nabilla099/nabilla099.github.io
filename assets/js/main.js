// =========================================================
// KH — main.js
// 1) Efek ripple (gelombang) saat tombol diklik/disentuh
// 2) Pencegahan "copy link" saat tombol download ditekan lama
// 3) Katalog: pencarian + filter kategori + pagination (terpadu)
// 4) Hero stack: screenshot acak, geser manual, auto-cycle ke belakang
// 5) Tilt halus di hero-visual khusus desktop (mouse)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  initSplash();
  initRipple();
  initDownloadButtons();
  initMobileMenu();
  initCatalog();
  initCarousel();
  initHeroStack();
  initHeroTilt();
  initImageFallback();
  initImageProtection();
});

/* ---------- Splash screen loading ---------- */
function initSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;

  const hide = () => splash.classList.add("splash-hide");
  const minDelay = new Promise((resolve) => setTimeout(resolve, 550));

  Promise.all([
    minDelay,
    new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", resolve, { once: true });
    }),
  ]).then(hide);

  // Jaga-jaga kalau ada aset yang lambat banget, splash tetap hilang
  setTimeout(hide, 2500);
}

/* ---------- Menu mobile (hamburger) ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.classList.toggle("active");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("active");
    })
  );

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    nav.classList.remove("open");
    toggle.classList.remove("active");
  });
}

/* ---------- Blokir tekan-lama / klik-kanan di semua gambar (termasuk yang dibuat dinamis) ---------- */
function initImageProtection() {
  document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });
  document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });
}

/* ---------- Sembunyikan gambar yang gagal dimuat (404/link putus) ---------- */
function initImageFallback() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });
}

/* ======================================================
   KATALOG: search + filter kategori + pagination terpadu
   ====================================================== */
function initCatalog() {
  const cards = Array.from(document.querySelectorAll(".game-card[data-category]"));
  if (cards.length === 0) return;

  const searchInput = document.getElementById("game-search");
  const chips = Array.from(document.querySelectorAll(".chip-btn"));
  const empty = document.getElementById("empty-state");
  const paginationEl = document.getElementById("pagination");
  const PAGE_SIZE = 9;

  let currentPage = 1;

  function getFiltered() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const activeChip = chips.find((c) => c.classList.contains("active"));
    const filter = activeChip ? activeChip.getAttribute("data-filter") : "all";

    return cards.filter((card) => {
      const matchCategory = filter === "all" || card.getAttribute("data-category") === filter;
      const haystack = (card.getAttribute("data-search") || "").toLowerCase();
      const matchSearch = !q || haystack.includes(q);
      return matchCategory && matchSearch;
    });
  }

  function renderPagination(totalPages) {
    if (!paginationEl) return;
    paginationEl.innerHTML = "";
    if (totalPages <= 1) return;

    const prev = document.createElement("button");
    prev.className = "page-btn page-nav";
    prev.textContent = "‹ Sebelumnya";
    prev.disabled = currentPage === 1;
    prev.addEventListener("click", () => { currentPage--; update(); scrollToGrid(); });
    paginationEl.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = "page-btn" + (i === currentPage ? " active" : "");
      btn.textContent = i;
      btn.addEventListener("click", () => { currentPage = i; update(); scrollToGrid(); });
      paginationEl.appendChild(btn);
    }

    const next = document.createElement("button");
    next.className = "page-btn page-nav";
    next.textContent = "Berikutnya ›";
    next.disabled = currentPage === totalPages;
    next.addEventListener("click", () => { currentPage++; update(); scrollToGrid(); });
    paginationEl.appendChild(next);
  }

  function scrollToGrid() {
    document.getElementById("kategori")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function update() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = new Set(filtered.slice(start, end));

    cards.forEach((card) => {
      card.style.display = pageItems.has(card) ? "" : "none";
    });

    if (empty) empty.style.display = filtered.length === 0 ? "block" : "none";
    renderPagination(totalPages);
  }

  searchInput?.addEventListener("input", () => {
    if (searchInput.value.trim()) {
      chips.forEach((c) => c.classList.remove("active"));
      chips.find((c) => c.getAttribute("data-filter") === "all")?.classList.add("active");
    }
    currentPage = 1;
    update();
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      if (searchInput) searchInput.value = "";
      currentPage = 1;
      update();
    });
  });

  // Kalau datang dari menu hamburung (index.html?cat=Racing#kategori), langsung filter
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("cat");
  if (catParam && catParam !== "all") {
    const target = chips.find((c) => c.getAttribute("data-filter") === catParam);
    if (target) {
      chips.forEach((c) => c.classList.remove("active"));
      target.classList.add("active");
    }
  }

  update();
}

/* ---------- Stack screenshot di hero: acak, geser, klik ke game, auto-cycle ---------- */
function initHeroStack() {
  const dataEl = document.getElementById("hero-games-data");
  const wrap = document.getElementById("stack-wrap");
  if (!dataEl || !wrap) return;

  let games;
  try {
    games = JSON.parse(dataEl.textContent);
  } catch (e) {
    return; // biarkan fallback statis kalau data gagal dibaca
  }

  function toSafeHttpUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const u = new URL(value, window.location.origin);
      return (u.protocol === "http:" || u.protocol === "https:") ? u.href : null;
    } catch (e) {
      return null;
    }
  }

  games = games.filter((g) => toSafeHttpUrl(g?.screenshot) && toSafeHttpUrl(g?.url));
  if (games.length === 0) return;

  const posClasses = ["stack-phone phone-a", "stack-phone phone-b", "stack-phone phone-c"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pickRandom(n) {
    const pool = [...games];
    const picked = [];
    while (picked.length < n && pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(i, 1)[0]);
    }
    return picked;
  }

  function render() {
    const picks = pickRandom(Math.min(3, games.length));
    wrap.innerHTML = "";
    picks.forEach((g, i) => {
      const safeHref = toSafeHttpUrl(g.url);
      const safeScreenshot = toSafeHttpUrl(g.screenshot);
      if (!safeHref || !safeScreenshot) return;

      const a = document.createElement("a");
      a.href = safeHref;
      a.className = posClasses[i] || "stack-phone";
      a.setAttribute("aria-label", g.title);

      // escape double quotes for safe insertion into CSS url("...")
      const safeBg = safeScreenshot.replace(/"/g, '\\"');
      a.style.backgroundImage = `url("${safeBg}")`;

      // mark external links to open in new tab safely
      try {
        const hrefUrl = new URL(safeHref);
        if (hrefUrl.origin !== window.location.origin) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
      } catch (e) { /* no-op */ }

      if (!reduceMotion) {
        a.style.transition = "none";
        a.style.opacity = "0";
        a.style.transform = "scale(.8) translateY(26px)";
      }

      const img = document.createElement("img");
      img.src = safeScreenshot;
      img.alt = g.title;
      img.loading = "lazy";
      img.addEventListener("error", () => { a.style.display = "none"; });
      a.appendChild(img);
      wrap.appendChild(a);
    });

    if (!reduceMotion) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wrap.querySelectorAll(".stack-phone").forEach((el) => {
            el.style.transition = "transform .55s cubic-bezier(.2,.8,.2,1), opacity .55s ease";
            el.style.opacity = "";
            el.style.transform = "";
          });
        });
      });
    }
  }

  function cycleOut(callback) {
    const els = wrap.querySelectorAll(".stack-phone");
    if (reduceMotion || els.length === 0) { callback(); return; }
    els.forEach((el) => {
      el.style.transition = "transform .45s ease, opacity .45s ease";
      el.style.transform = "scale(.82) translateY(24px)";
      el.style.opacity = "0";
    });
    setTimeout(callback, 430);
  }

  render();

  // Auto-cycle: kartu depan "gulir ke belakang", diganti kartu baru
  let autoplay;
  function startAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => cycleOut(render), 4200);
  }
  if (!reduceMotion) startAutoplay();

  // Deteksi geser (swipe/drag) vs tap biasa
  let startX = 0, dragging = false, moved = false;

  wrap.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    dragging = true;
    moved = false;
  });

  wrap.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    if (Math.abs(e.clientX - startX) > 12) moved = true;
  });

  wrap.addEventListener("pointerup", () => {
    if (dragging && moved) {
      cycleOut(render);
      if (!reduceMotion) startAutoplay();
    }
    dragging = false;
  });

  // Kalau tergeser, batalkan navigasi klik (biar swipe gak ke-trigger buka game)
  wrap.addEventListener("click", (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

/* ---------- Tilt halus hero-visual, khusus desktop (mouse) ---------- */
function initHeroTilt() {
  const wrap = document.getElementById("stack-wrap");
  if (!wrap) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const visual = wrap.closest(".hero-visual");
  if (!visual) return;

  visual.addEventListener("mousemove", (e) => {
    const rect = visual.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    wrap.style.transform = `rotateY(${relX * 10}deg) rotateX(${relY * -10}deg)`;
  });

  visual.addEventListener("mouseleave", () => {
    wrap.style.transform = "";
  });
}

/* ---------- Carousel screenshot ala Instagram (dots sync) ---------- */
function initCarousel() {
  const track = document.querySelector(".ig-track");
  const dots = document.querySelectorAll(".ig-dot");
  if (!track || dots.length === 0) return;

  track.addEventListener("scroll", () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
    });
  });
}

/* ---------- Ripple effect untuk semua .btn ---------- */
function initRipple() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("pointerdown", (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const span = document.createElement("span");
      const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
      const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

      span.className = "ripple";
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;

      btn.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    });
  });
}

/* ---------- Tombol download: bukan <a>, jadi tidak bisa
   "copy link address" via tekan lama / klik kanan ---------- */
function initDownloadButtons() {
  document.querySelectorAll(".btn-download").forEach((btn) => {
    const url = btn.getAttribute("data-url");
    if (!url) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(url, "_blank", "noopener");
    });

    btn.addEventListener("contextmenu", (e) => e.preventDefault());

    let pressTimer = null;
    btn.addEventListener("touchstart", (e) => {
      pressTimer = setTimeout(() => {
        e.preventDefault();
      }, 400);
    }, { passive: false });

    btn.addEventListener("touchend", () => clearTimeout(pressTimer));
    btn.addEventListener("touchmove", () => clearTimeout(pressTimer));
    btn.addEventListener("dragstart", (e) => e.preventDefault());
  });
}
