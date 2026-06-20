# NabillaKH - J2ME Editor

<div align="center">
  <img src="https://img.shields.io/badge/versi-8.0-ff69b4?style=flat-square&logo=github" alt="versi"/>
  <img src="https://img.shields.io/badge/platform-web-ff1493?style=flat-square&logo=html5" alt="platform"/>
  <img src="https://img.shields.io/badge/j2me-editor-c2185b?style=flat-square&logo=java" alt="j2me"/>
</div>

<br>

<p align="center">
  <img src="https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" alt="Coding Animation" width="600"/>
</p>

<br>

<p align="center">
  <b>Editor untuk File J2ME dengan Ekstraktor JAR/ZIP</b>
</p>

<p align="center">
  <i>Dibangun dengan kerja keras</i>
</p>

---

## Daftar Isi
- [Fitur Unggulan](#fitur-unggulan)
- [Panduan Cepat](#panduan-cepat)
- [Pintasan Keyboard](#pintasan-keyboard)
- [Teknologi](#teknologi)
- [Dukungan Platform](#dukungan-platform)
- [Persyaratan](#persyaratan)
- [Kredit](#kredit)
- [Kontak](#kontak)

---

## Fitur Unggulan

### Manajemen File
| Fitur | Keterangan |
|-------|------------|
| Buka File |  |
| Ekstrak JAR/ZIP | Ekstrak arsip dengan tampilan folder tree |
| Unduh JAR | Simpan kembali sebagai file JAR yang sudah dimodifikasi |
| Pratinjau Gambar | Tampilkan file PNG, JPG, JPEG, GIF, BMP, WEBP |

### Editor String
| Fitur | Keterangan |
|-------|------------|
| Edit Langsung | Edit string langsung di card dengan textarea |
| Split Otomatis | Pisah string berdasarkan delimiter umum (;, ., !, ?) |
| Split Manual | Pisah string dengan delimiter kustom |
| Update Real-time | Perubahan langsung terlihat |
| Penghitung Byte | Tampilkan ukuran string dalam byte |

### Pencarian & Penggantian
| Fitur | Keterangan |
|-------|------------|
| Pencarian Lokal | Cari teks dalam file yang sedang dibuka |
| Pencarian Global | Cari teks di SEMUA file dalam arsip |
| Cari & Ganti | Cari dan ganti teks (satu per satu atau semua) |
| Sorot Hasil | Sorot hasil pencarian |

### Undo / Redo
| Fitur | Keterangan |
|-------|------------|
| Undo | Batalkan perubahan (Ctrl+Z) |
| Redo | Ulangi perubahan (Ctrl+Y) |
| Riwayat | Simpan hingga 20 langkah perubahan |
| Indikator | Tampilkan jumlah undo yang tersedia |

### Tema
| Tema | Keterangan |
|------|------------|
| Default | Tema pink elegan |
| Mode Gelap | Mode malam untuk kenyamanan |
| Sakura | Pink lembut dengan sentuhan Jepang |
| Pastel | Biru pastel lembut |
| Simpan Otomatis | Tema tersimpan di localStorage |

### Statistik
| Fitur | Keterangan |
|-------|------------|
| Bilah Statistik | Tampilkan jumlah file, string, ukuran, edit, undo |
| Statistik Lengkap | Detail termasuk file .class, gambar, dll |
| Real-time | Update otomatis setiap perubahan |

### Pratinjau Gambar
- Mendukung PNG, JPG, JPEG, GIF, BMP, WEBP
- Tampilkan dimensi gambar
- Pratinjau langsung di halaman

### Navigasi
| Fitur | Keterangan |
|-------|------------|
| File Sebelumnya/Berikutnya | Navigasi antar file dalam arsip |
| Dapat Digeser | Bisa dipindahkan ke mana saja |
| Sembunyikan/Tampilkan | Sembunyikan atau tampilkan navigasi |
| Konfirmasi Popup | Konfirmasi sebelum menampilkan |

### Fitur Tambahan
- Responsif — Mendukung desktop dan mobile
- Mode Gelap Siap — Menyesuaikan dengan tema browser
- Dukungan PWA — Bisa di-install sebagai aplikasi
- Pintasan Keyboard — Ctrl+F, Ctrl+S, Ctrl+H, Ctrl+Z, Ctrl+Y, ESC, Alt+←/→
- Notifikasi Toast — Notifikasi elegan untuk setiap aksi
- Animasi Loading — Loading modern dengan progress bar
- 4 Tema — Pilihan tema yang cantik

---

## Panduan Cepat

### Membuka File
1. Klik tombol "Pilih File" di header
2. Pilih file .class, .jar, .zip, atau file lainnya
3. File akan otomatis terbuka dan ditampilkan

### Mengedit String
1. Klik pada card string yang ingin diedit
2. Edit teks di textarea yang muncul
3. Klik "Simpan" untuk menyimpan perubahan
4. Klik "Batal" untuk membatalkan

### Mengekstrak JAR/ZIP
1. Klik "Ekstrak JAR/ZIP" di header
2. Pilih file .jar atau .zip
3. File akan diekstrak dan ditampilkan di sidebar
4. Klik file di sidebar untuk membukanya

### Mencari Teks
- Gunakan "Cari String" untuk mencari dalam file saat ini
- Gunakan "Finder Global" untuk mencari di semua file
- Ketik kata kunci dan hasil akan langsung muncul

### Mengganti Tema
- Klik tombol 🎨 di topbar
- Tema akan berganti secara otomatis
- Pilihan: Default, Dark, Sakura, Pastel

---

## Pintasan Keyboard

| Pintasan | Fungsi |
|----------|--------|
| Ctrl+F | Buka Pencarian Global |
| Ctrl+S | Simpan File |
| Ctrl+H | Buka Cari & Ganti |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Alt+← | File Sebelumnya |
| Alt+→ | File Berikutnya |
| ESC | Tutup Menu / Popup |

---

## Teknologi

| Teknologi | Fungsi |
|-----------|--------|
| HTML5 | Struktur halaman |
| CSS3 | Styling dengan 4 tema + Mode Gelap |
| JavaScript | Logika aplikasi |
| JSZip | Ekstrak dan buat file JAR/ZIP |
| PWA | Dukungan Progressive Web App |
| LocalStorage | Simpan preferensi tema |

---

## Dukungan Platform

| Platform | Status |
|----------|--------|
| Windows | Dukungan Penuh |
| macOS | Dukungan Penuh |
| Linux | Dukungan Penuh |
| Android | Dukungan Penuh (optimasi low-end) |
| iOS | Dukungan Penuh |

---

## Persyaratan

- Browser modern (Chrome, Firefox, Safari, Edge, Opera)
- Koneksi internet (untuk load JSZip CDN)
- JavaScript diaktifkan
- Dukungan Mode Gelap (otomatis)

---

## Kredit

<div align="center">
  <br>
  <b>Dikembangkan dengan cinta oleh NabillaKH & Hyne</b>
  <br><br>
  <sub>
    <b>NabillaKH - J2ME Editor</b><br>
    <i>Dibangun dengan cinta untuk komunitas J2ME</i>
  </sub>
  <br><br>
</div>

---

## Kontak

<div align="center">
  <a href="https://www.facebook.com/nabillaa.kh">
    <img src="https://img.shields.io/badge/Facebook-NabillaKH-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook"/>
  </a>
  <a href="https://www.facebook.com/profile.php?id=61582519081872">
    <img src="https://img.shields.io/badge/Facebook-Hyne-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook"/>
  </a>
</div>

<br>

<div align="center">
  <sub>Berikan bintang di GitHub jika anda merasa aplikasi ini bermanfaat</sub>
  <br><br>
  <sub>© 2026 NabillaKH</sub>
  <br>
  <sub>Mode Gelap Siap • Responsif • Desain Profesional</sub>
  <br><br>
</div>
