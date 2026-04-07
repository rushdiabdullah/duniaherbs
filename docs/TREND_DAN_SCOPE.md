# DuniaHerb PWA — Trend & Scope

## Brand
- **Nama:** DuniaHerb  
- **Kategori:** Beauty & Health (herbs)  
- **Tema:** Dark mode (utama)

---

## Idea trend sekarang (dark mode + herbs)

### 1. Warna
- **Background:** Dark — `#0c0f0a`, `#111811` (hampir hitam hijau)
- **Surface/card:** `#1a1f1a`, `#232b23`
- **Aksen:** Sage / mint / herbal — `#9cb59d`, `#7d9f7e`, `#5c7c5d`
- **Aksen panas (CTA):** Terracotta `#c17f59` atau gold honey `#d4a853` — untuk button & link
- **Teks:** `#e8ebe8`, `#b8c4b8` (muted)

### 2. Visual trend
- **Glassmorphism ringan** — card dengan backdrop-blur + border halus
- **Gradient subtle** — dark green → charcoal, bukan flat
- **Rounded generous** — border-radius 16px–24px untuk card
- **Organic shape** — ilustrasi daun/herbs, line art botanical (boleh SVG)
- **Typography:** Sans moden (e.g. Plus Jakarta Sans, Outfit) + serif untuk heading (e.g. Fraunces, Playfair) — “organic premium”

### 3. Layout
- **Bento grid** — section produk/kategori dalam grid tak seragam (trend 2024)
- **Sticky bottom bar** — cart + CTA pada mobile (PWA)
- **Hero:** Full-bleed image/gradient + headline + CTA
- **Product card:** Gambar atas, nama, harga, badge (e.g. “Bestseller”, “Organic”)

### 4. Interaction
- **Micro-animation** — hover lift card, transition smooth
- **Skeleton loading** — bila fetch produk
- **Pull-to-refresh** (PWA)
- **Add to cart** — feedback segera (toast atau badge)

### 5. PWA
- **Install prompt** — “Add to Home Screen” untuk mobile
- **Offline** — cache halaman utama + senarai produk
- **Theme:** dark, status bar hitam/dark

---

## Scope fitur (untuk bincang lepas ni)

| Fitur | Nota |
|-------|-----|
| Landing | Hero, kategori, featured products, testimonial, CTA |
| Kategori | Beauty, Health (sub-kategori ikut produk) |
| Senarai produk | Grid, filter, sort, search |
| Detail produk | Gambar, deskripsi, harga, add to cart, related |
| Cart | Item, quantity, subtotal, link ke checkout |
| Checkout | Alamat, pilih payment → payment gateway |
| Payment gateway | **ToyyibPay** (create bill → redirect → callback) |
| Admin (optional) | Login, CRUD produk, order list |
| Auth (optional) | Login/register untuk simpan alamat & order history |

---

## Stack (bincang lepas ni)

- **Frontend:** Next.js (App Router) — sama macam iHRAM, senang deploy
- **Styling:** Tailwind CSS (cepat + dark mode built-in)
- **State:** React context / Zustand untuk cart
- **Backend/DB:** Supabase (auth, products, orders) atau Firebase
- **Payment:** ToyyibPay (API: create bill → redirect user → callback; sandbox: dev.toyyibpay.com)
- **PWA:** next-pwa atau @ducanh2912/next-pwa (workbox)

---

Lepas kita sepakat stack & payment, kita boleh mula scaffold (landing + theme dark + PWA config).
