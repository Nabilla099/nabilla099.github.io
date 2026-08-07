# Kh 🎮

Landing page GitHub Pages buat sharing koleksi game Java J2ME. Setiap game disimpan sebagai file `.md`, tinggal tambah file baru dan otomatis muncul di halaman utama + punya halaman detail sendiri.

## Fitur

- Tema pink gradient soft white, **tanpa warna biru sama sekali** (termasuk saat klik/focus tombol).
- Animasi masuk yang halus saat pertama kali situs dibuka (hero muncul bertahap).
- Nav profesional dengan menu (Beranda, Kategori) + menu mobile (hamburger).
- Hero dengan statistik, search bar terintegrasi, dan filter kategori (chip).
- Visual di hero menampilkan **screenshot asli dari daftar game secara acak** — bisa digeser buat ganti gambar, otomatis berganti sendiri (kartu depan gulir ke belakang), dan kalau diklik langsung buka halaman game itu. Ada efek tilt halus kalau digerakkan mouse di desktop.
- Setiap game = 1 file markdown di folder `_games/`. Tambah file baru → otomatis muncul di grid.
- **Pagination otomatis** kalau game sudah banyak (9 game per halaman), tetap sinkron dengan pencarian & filter kategori.
- Halaman detail per game: **galeri screenshot model carousel (geser) ala Instagram**, deskripsi, resolusi, tombol download, dan rekomendasi game lain.
- Tombol dengan animasi gelombang otomatis + efek ripple saat diklik.
- Tombol download bukan link biasa → tidak bisa disalin lewat tekan lama (long-press) di HP.
- Responsif penuh dan dipoles khusus buat layar desktop besar (mobile, tablet, desktop).
- Pencarian + filter kategori di halaman utama.

## 1. Setup awal (sekali saja)

1. Buat repo baru di GitHub, namakan `username.github.io` (ganti `username` sesuai akun kamu) kalau mau di root domain, atau bebas namanya kalau mau di subfolder (`username.github.io/nama-repo`).
2. Kalau pakai subfolder, buka `_config.yml` dan isi `baseurl: "/nama-repo"`.
3. Upload semua isi folder ini ke repo tersebut.
4. Di GitHub: **Settings → Pages → Source: Deploy from branch → branch `main` / folder `/ (root)`**.
5. Tunggu 1-2 menit, situs bisa diakses di `https://username.github.io/`.

## 2. Install Git di Termux (sekali saja)

```bash
pkg update && pkg upgrade -y
pkg install git -y
git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"
```

Lalu clone repo kamu:

```bash
git clone https://github.com/username/username.github.io.git
cd username.github.io
```

## 3. Cara nambah game baru (via Termux)

Paling gampang, pakai script otomatis yang sudah disediakan:

```bash
bash add_game.sh
```

Script akan menanyakan:
- Judul game
- Kategori
- Resolusi (mis. `240x320`)
- Ukuran file
- Vendor / studio pembuat
- Nama translator
- **Sumber screenshot** — pilih salah satu:
  - **File di HP**: kasih path file screenshot dari galeri/DCIM kamu (boleh lebih dari satu, pisah koma). File otomatis disalin ke `assets/img/games/nama-slug/` di dalam repo, jadi tidak perlu upload ke situs lain.
  - **Link URL**: kalau screenshot-nya sudah diupload ke Imgur/Postimg/dll, tinggal tempel link-nya.
- Link download (link pihak ketiga)
- Deskripsi game

Setelah itu file `_games/nama-slug.md` otomatis dibuat, dan script akan tanya apakah mau langsung `git push`. Kalau ya, situs langsung ter-update otomatis dalam 1-2 menit — termasuk file screenshot yang disalin dari HP tadi.

### Cara manual (tanpa script)

Bikin file baru di `_games/judul-game.md`. Screenshot bisa pakai **link eksternal** ATAU **file lokal di repo** (taruh gambarnya di `assets/img/games/judul-game/` lalu tulis path-nya diawali `/`):

```markdown
---
title: "Judul Game"
slug: "judul-game"
date: 2026-08-03
category: "Action"
resolution: "240x320"
size: "1.5 MB"
vendor: "Nama Studio/Vendor"
translator: "Nama Kamu"
screenshot: "/assets/img/games/judul-game/1.jpg"
screenshots:
  - "/assets/img/games/judul-game/1.jpg"
  - "/assets/img/games/judul-game/2.jpg"
  - "/assets/img/games/judul-game/3.jpg"
download: "https://link-download-pihak-ketiga.com/file.jar"
description: >
  Deskripsi singkat tentang game ini, ceritanya apa, gameplay-nya seperti apa.
---
```

`screenshots` boleh diisi lebih dari satu gambar — di halaman detail game, semua gambar itu tampil sebagai galeri geser (carousel) seperti postingan Instagram. Kalau cuma punya 1 screenshot, isi `screenshot` saja, `screenshots` boleh dihapus.

Lalu:

```bash
git add _games/judul-game.md
git commit -m "Tambah game: Judul Game"
git push
```

## 4. Struktur folder

```
kh-store/
├── _config.yml          # konfigurasi situs
├── _layouts/
│   ├── default.html     # layout dasar (header, footer)
│   └── game.html        # layout halaman detail game
├── _games/               # SEMUA game ada di sini (1 file = 1 game)
│   ├── racing-fever-2.md
│   ├── ninja-school-3.md
│   └── gta-china-town.md
├── assets/
│   ├── css/style.css     # tema pink gradient + animasi tombol
│   └── js/main.js        # ripple effect + anti-copy-link
├── index.html             # halaman utama (grid otomatis)
├── add_game.sh            # script bantu nambah game via Termux
└── README.md
```

## 5. Ganti nama/branding

Buka `_config.yml`, ganti `title` dan `description` sesuai selera kamu. Nama "Kh" di header ada di `_layouts/default.html`, bagian `<a class="brand">`.

## 6. Catatan penting

- Semua link download & screenshot adalah **link pihak ketiga** — situs ini cuma menampilkan daftar dan deskripsi, tidak menghosting file game.
- Gambar screenshot sebaiknya rasio landscape (4:3) biar pas dengan bingkai "layar HP" di desain.
- File contoh (`racing-fever-2.md`, dll) boleh dihapus/diganti, itu cuma contoh format.
