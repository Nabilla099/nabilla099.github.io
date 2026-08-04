#!/data/data/com.termux/files/usr/bin/bash
# =========================================================
# add_game.sh — Tambah game J2ME baru ke Kh-Store
# Pakai di Termux, jalankan dari dalam folder repo:
#   bash add_game.sh
# =========================================================

set -e

echo "=== Tambah Game Baru ke Kh-Store ==="
read -p "Judul game        : " TITLE

# Bikin slug lebih awal karena dipakai buat nama folder screenshot
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-//;s/-$//')
TODAY=$(date +%F)
FILE="_games/${SLUG}.md"

if [ -f "$FILE" ]; then
  echo "❌ Game dengan slug '$SLUG' sudah ada. Ganti judulnya sedikit lalu coba lagi."
  exit 1
fi

read -p "Kategori (mis. RPG, Racing, Action) : " CATEGORY
read -p "Resolusi (mis. 240x320)   : " RESOLUTION
read -p "Ukuran file (mis. 1.2 MB) : " SIZE
read -p "Vendor / studio pembuat (mis. Gameloft) : " VENDOR
read -p "Nama translator : " TRANSLATOR

echo ""
echo "Screenshot mau diambil dari mana?"
echo "  1) File di HP (misalnya dari galeri/DCIM)"
echo "  2) Link URL (sudah diupload ke Imgur/Postimg/dll)"
read -p "Pilih (1/2) : " SRC_CHOICE

SCREENSHOTS_YAML=""
SCREENSHOT=""

if [ "$SRC_CHOICE" = "1" ]; then
  IMG_DIR="assets/img/games/${SLUG}"
  mkdir -p "$IMG_DIR"
  echo "Tips: kalau belum jalanin 'termux-setup-storage', path biasanya ada di:"
  echo "  ~/storage/dcim/Screenshots/nama-file.jpg"
  echo "  ~/storage/pictures/nama-file.jpg"
  echo "  ~/storage/downloads/nama-file.jpg"
  read -p "Path file screenshot (boleh lebih dari 1, pisahkan pakai koma) : " PATHS_RAW

  i=1
  IFS=',' read -ra PATH_ARR <<< "$PATHS_RAW"
  for p in "${PATH_ARR[@]}"; do
    src_path=$(echo "$p" | xargs)
    src_path="${src_path/#\~/$HOME}"
    [ -z "$src_path" ] && continue

    if [ ! -f "$src_path" ]; then
      echo "⚠️  File tidak ditemukan, dilewati: $src_path"
      continue
    fi

    ext="${src_path##*.}"
    dest_name="${i}.${ext}"
    cp "$src_path" "${IMG_DIR}/${dest_name}"

    rel_path="/${IMG_DIR}/${dest_name}"
    [ -z "$SCREENSHOT" ] && SCREENSHOT="$rel_path"
    SCREENSHOTS_YAML="${SCREENSHOTS_YAML}  - \"${rel_path}\"\n"
    i=$((i+1))
  done

  if [ -z "$SCREENSHOT" ]; then
    echo "❌ Tidak ada file screenshot yang berhasil disalin. Batal."
    rm -rf "$IMG_DIR"
    exit 1
  fi
  echo "✅ Screenshot disalin ke $IMG_DIR"
else
  read -p "Link screenshot (boleh lebih dari 1, pisahkan pakai koma) : " SCREENSHOTS_RAW
  SCREENSHOT=$(echo "$SCREENSHOTS_RAW" | cut -d',' -f1 | xargs)
  IFS=',' read -ra SHOT_ARR <<< "$SCREENSHOTS_RAW"
  for shot in "${SHOT_ARR[@]}"; do
    shot_trimmed=$(echo "$shot" | xargs)
    [ -z "$shot_trimmed" ] && continue
    SCREENSHOTS_YAML="${SCREENSHOTS_YAML}  - \"${shot_trimmed}\"\n"
  done
fi

read -p "Link download (URL pihak ketiga) : " DOWNLOAD

echo "Deskripsi game (tekan Enter 2x kalau sudah selesai):"
DESCRIPTION=""
while IFS= read -r line; do
  [ -z "$line" ] && break
  DESCRIPTION="$DESCRIPTION$line "
done

cat > "$FILE" <<EOF
---
title: "${TITLE}"
slug: "${SLUG}"
date: ${TODAY}
category: "${CATEGORY}"
resolution: "${RESOLUTION}"
size: "${SIZE}"
vendor: "${VENDOR}"
translator: "${TRANSLATOR}"
screenshot: "${SCREENSHOT}"
screenshots:
$(echo -e "$SCREENSHOTS_YAML")download: "${DOWNLOAD}"
description: >
  ${DESCRIPTION}
---
EOF

echo "✅ File dibuat: $FILE"

read -p "Langsung commit & push ke GitHub sekarang? (y/n) " CONFIRM
if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
  git add "$FILE"
  [ -d "assets/img/games/${SLUG}" ] && git add "assets/img/games/${SLUG}"
  git commit -m "Tambah game: ${TITLE}"
  git push
  echo "🚀 Berhasil di-push! Tunggu 1-2 menit lalu cek GitHub Pages kamu."
else
  echo "Oke, file sudah dibuat tapi belum di-push. Jalankan manual:"
  echo "  git add -A && git commit -m 'Tambah game: ${TITLE}' && git push"
fi
