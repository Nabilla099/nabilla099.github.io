#!/data/data/com.termux/files/usr/bin/bash
# =========================================================
# add_game.sh — Tambah game J2ME baru ke J2ME Vault
# Pakai di Termux, jalankan dari dalam folder repo:
#   bash add_game.sh
# =========================================================

set -e

echo "=== Tambah Game Baru ke J2ME Vault ==="
read -p "Judul game        : " TITLE
read -p "Kategori (mis. RPG, Racing, Action) : " CATEGORY
read -p "Resolusi (mis. 240x320)   : " RESOLUTION
read -p "Ukuran file (mis. 1.2 MB) : " SIZE
read -p "Versi (mis. 1.0)   : " VERSION
read -p "Link screenshot (URL gambar) : " SCREENSHOT
read -p "Link download (URL pihak ketiga) : " DOWNLOAD
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
version: "${VERSION}"
screenshot: "${SCREENSHOT}"
download: "${DOWNLOAD}"
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
