#!/data/data/com.termux/files/usr/bin/bash
# =========================================================
# add_game.sh — Tambah game J2ME baru ke Kh-Store
# Pakai di Termux, jalankan dari dalam folder repo:
#   bash add_game.sh
# =========================================================

set -e

echo "=== Tambah Game Baru ke Kh-Store ==="
read -p "Judul game        : " TITLE
read -p "Kategori (mis. RPG, Racing, Action) : " CATEGORY
read -p "Resolusi (mis. 240x320)   : " RESOLUTION
read -p "Ukuran file (mis. 1.2 MB) : " SIZE
read -p "Vendor / studio pembuat (mis. Gameloft) : " VENDOR
read -p "Nama translator : " TRANSLATOR
read -p "Link screenshot (boleh lebih dari 1, pisahkan pakai koma) : " SCREENSHOTS_RAW
read -p "Link download (URL pihak ketiga) : " DOWNLOAD

# Screenshot pertama dipakai sebagai thumbnail utama
SCREENSHOT=$(echo "$SCREENSHOTS_RAW" | cut -d',' -f1 | xargs)

# Susun daftar screenshot (YAML list) untuk carousel ala Instagram
SCREENSHOTS_YAML=""
IFS=',' read -ra SHOT_ARR <<< "$SCREENSHOTS_RAW"
for shot in "${SHOT_ARR[@]}"; do
  shot_trimmed=$(echo "$shot" | xargs)
  [ -z "$shot_trimmed" ] && continue
  SCREENSHOTS_YAML="${SCREENSHOTS_YAML}  - \"${shot_trimmed}\"\n"
done
echo "Deskripsi game (tekan Enter 2x kalau sudah selesai):"
DESCRIPTION=""
while IFS= read -r line; do
  [ -z "$line" ] && break
  DESCRIPTION="$DESCRIPTION$line "
done

# Bikin slug otomatis dari judul (huruf kecil, spasi jadi strip)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-//;s/-$//')
TODAY=$(date +%F)
FILE="_games/${SLUG}.md"

if [ -f "$FILE" ]; then
  echo "❌ Game dengan slug '$SLUG' sudah ada. Ganti judulnya sedikit lalu coba lagi."
  exit 1
fi

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
  git commit -m "Tambah game: ${TITLE}"
  git push
  echo "🚀 Berhasil di-push! Tunggu 1-2 menit lalu cek GitHub Pages kamu."
else
  echo "Oke, file sudah dibuat tapi belum di-push. Jalankan manual:"
  echo "  git add $FILE && git commit -m 'Tambah game: ${TITLE}' && git push"
fi
