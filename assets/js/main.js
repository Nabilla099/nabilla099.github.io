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
});

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

    cards.forEach((card) => {
      const haystack = (card.getAttribute("data-search") || "").toLowerCase();
      const match = haystack.includes(q);
      card.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    if (empty) empty.style.display = visibleCount === 0 ? "block" : "none";
  });
}
