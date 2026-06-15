# Batam Bites 🍜

Direktori kuliner Batam yang dikurasi tangan untuk **turis mancanegara** (SG/MY/中文-ready). Peta + daftar + filter Halal, dibikin buat turis yang baru turun dari ferry.

> "Your pocket food map for Batam — curated, free, ad-free."

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens via `@theme`)
- **Leaflet + react-leaflet v5** di atas tiles **OpenStreetMap / CARTO Voyager** (gratis, no API key)
- **Data statis JSON** (no database) — favorit via `localStorage`
- **PWA** (manifest + service worker, installable / add-to-home-screen)

## Fitur

- 🗺️ Peta interaktif 118 tempat (pin per-kategori) ⟷ 📋 Daftar — **filter tersinkron** lewat satu context
- 🔍 Search + filter **Halal**, kategori (17), area, harga ($/$$/$$$), terminal ferry, label, "buka sekarang"
- ⛴ Jarak ke terminal ferry dihitung otomatis (haversine), shortcut "Dekat Terminal Ferry"
- 🏷️ Label kurasi: Legendaris / Hits / Wajib Coba / Hidden Gem
- 📄 Halaman detail: menu andalan, jam buka + "buka sekarang", harga IDR + ~SGD, pembayaran (Cash/QRIS), mini-map, tombol **Navigasi** (deep-link Google Maps)
- ❤️ Favorit/bookmark · 🌐 Bilingual **ID/EN** (struktur siap 中文) · 📱 mobile-first PWA

## Data

`data/places.json` (118 tempat) digabung dari riset: direktori luas (120+) + deep-research terverifikasi (18 tempat: alamat, telp, jam, rating, review).
Pendukung: `categories.json` (17), `areas.json` (15), `ferries.json` (4 terminal).

- `featured`: 13 ikon wajib coba · `verified`: 18 tempat data lengkap
- Koordinat pin = centroid area + jitter (`coord_approx: true`) — tombol Navigasi tetap akurat (query Google Maps)
- Regenerasi ikon PWA: `node scripts/gen-icons.mjs`

## Jalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Catatan

- Status halal = hasil kurasi best-effort (lihat halaman About) — verifikasi langsung bila ragu.
- Ganti placeholder foto: tambah field `photo` ke item di `places.json` lalu render di `components/Thumb.tsx`.
- Target deploy: Vercel (gratis, non-komersial) → subdomain `batambites.masbash.id` (rencana).
