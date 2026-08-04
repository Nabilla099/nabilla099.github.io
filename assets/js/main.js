// =========================================================
// J2ME VAULT — main.js
// 1) Efek ripple (gelombang) saat tombol diklik/disentuh
// 2) Pencegahan "copy link" saat tombol download ditekan lama
// 3) Pencarian game sederhana di halaman utama (jika ada)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  initRipple();
  initDownloadButtons();
  initSearch();
  initMobileMenu();
  initCategoryFilter();
  initCarousel();
  initHeroStack();
});

/* ---------- Stack screenshot di hero: acak, geser, klik ke game ---------- */
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
  games = games.filter((g) => g.screenshot && g.url);
  if (games.length === 0) return;

  const posClasses = ["stack-phone phone-a", "stack-phone phone-b", "stack-phone phone-c"];

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
      const a = document.createElement("a");
      a.href = g.url;
      a.className = posClasses[i] || "stack-phone";
      a.setAttribute("aria-label", g.title);

      const img = document.createElement("img");
      img.src = g.screenshot;
      img.alt = g.title;
      img.loading = "lazy";
      a.appendChild(img);
      wrap.appendChild(a);
    });
  }

  render();

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
      // beri jeda dikit biar klik (yang dibatalkan) sempat diproses dulu
      setTimeout(render, 60);
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

/* ---------- Menu mobile (hamburger) ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

/* ---------- Filter kategori (chip) di beranda ---------- */
function initCategoryFilter() {
  const chips = document.querySelectorAll(".chip-btn");
  const cards = document.querySelectorAll(".game-card[data-category]");
  const empty = document.getElementById("empty-state");
  if (chips.length === 0) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.getAttribute("data-filter");
      let visible = 0;

      cards.forEach((card) => {
        const match = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = match ? "" : "none";
        if (match) visible++;
      });

      if (empty) empty.style.display = visible === 0 ? "block" : "none";

      const search = document.getElementById("game-search");
      if (search) search.value = "";
    });
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

/* ---------- 1) Ripple effect untuk semua .btn ---------- */
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

/* ---------- 2) Tombol download: bukan <a>, jadi tidak bisa
   "copy link address" via tekan lama / klik kanan ---------- */
function initDownloadButtons() {
  document.querySelectorAll(".btn-download").forEach((btn) => {
    const url = btn.getAttribute("data-url");
    if (!url) return;

    // Klik biasa / tap singkat -> buka link download di tab baru
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(url, "_blank", "noopener");
    });

    // Blokir menu klik-kanan (desktop)
    btn.addEventListener("contextmenu", (e) => e.preventDefault());

    // Blokir long-press callout di iOS/Android (share/copy link menu)
    let pressTimer = null;
    btn.addEventListener("touchstart", (e) => {
      pressTimer = setTimeout(() => {
        // Jika tetap tertekan lebih dari 400ms, batalkan aksi apapun selain klik biasa
        e.preventDefault();
      }, 400);
    }, { passive: false });

    btn.addEventListener("touchend", () => clearTimeout(pressTimer));
    btn.addEventListener("touchmove", () => clearTimeout(pressTimer));

    // Cegah drag (beberapa browser mengizinkan drag teks/link)
    btn.addEventListener("dragstart", (e) => e.preventDefault());
  });
}

/* ---------- 3) Pencarian game di index (opsional, jika elemen ada) ---------- */
function initSearch() {
  const input = document.getElementById("game-search");
  const cards = document.querySelectorAll(".game-card");
  const empty = document.getElementById("empty-state");
  if (!input || cards.length === 0) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    let visibleCount = 0;

    if (q) {
      document.querySelectorAll(".chip-btn").forEach((c) => c.classList.remove("active"));
      const allChip = document.querySelector('.chip-btn[data-filter="all"]');
      if (allChip) allChip.classList.add("active");
    }

    cards.forEach((card) => {
      const haystack = (card.getAttribute("data-search") || "").toLowerCase();
      const match = haystack.includes(q);
      card.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    if (empty) empty.style.display = visibleCount === 0 ? "block" : "none";
  });
}
