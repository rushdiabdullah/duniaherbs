# DuniaHerbs — Roadmap

## Status: MVP Siap ✦

---

## Dah Siap

- [x] Homepage (luxury dark theme, gold accents, Playfair + Outfit fonts)
- [x] Animasi (fade-in, stagger, counter, shimmer button, marquee)
- [x] 8 produk cards dengan heat indicator
- [x] Halaman: Homepage, Produk Detail, Tentang, Stockist, FAQ, Contact, Polisi
- [x] ChatBot (AI customer service)
- [x] Admin Dashboard (/admin) — login, CRUD produk/FAQ/testimonial/stockist/content/media/users
- [x] Supabase (database + storage + auth)
- [x] PWA manifest + safe area + reduced motion
- [x] Responsive (mobile + desktop)

---

## Next Steps

### Phase 1 — Sambung & Deploy (Prioriti Tinggi)

- [ ] **Sambung frontend ke Supabase** — tukar hardcoded data supaya baca dari DB. Bila staf edit dalam admin, website auto update.
- [ ] **Upload gambar sebenar** — logo, produk, og-image. Ganti placeholder Unsplash.
- [ ] **Deploy ke Vercel** — sambung repo GitHub, set env variables, link domain duniaherbs.com.my.
- [ ] **DNS setup** — point domain ke Vercel, update NEXT_PUBLIC_APP_URL.

### Phase 2 — Content & Social (Prioriti Sederhana)

- [ ] **Video embed** — masukkan YouTube/TikTok sebenar di section Demo Produk.
- [ ] **Social media links** — Instagram, TikTok, Facebook di footer & contact page. Edit dari admin Content.
- [ ] **PWA icons** — tambah icon-192.png & icon-512.png dalam public/.
- [ ] **Favicon** — tambah favicon.ico.
- [ ] **OG image** — buat og-image.png (1200x630) untuk social sharing.

### Phase 3 — PWA & Offline (Prioriti Sederhana)

- [ ] **Service worker** — guna next-pwa untuk cache & offline support.
- [ ] **Install prompt** — banner "Add to Home Screen" untuk mobile.
- [ ] **Splash screen** — logo animasi ringkas bila pertama kali buka (PWA).

### Phase 4 — E-Commerce (Bila Perlu)

- [ ] **Cart** — tambah ke cart, quantity, subtotal.
- [ ] **Checkout** — halaman checkout dengan alamat.
- [x] **ToyyibPay integration** — create bill → redirect → callback.
- [ ] **Order tracking** — simpan order dalam Supabase, status update.
- [ ] **Customer database** — simpan data pelanggan & sejarah pembelian.

### Phase 5 — Tambahan (Optional)

- [ ] **Blog / artikel** — tips kesihatan, cara guna produk.
- [ ] **Newsletter** — kumpul email pelanggan.
- [ ] **Analytics** — Google Analytics atau Plausible.
- [ ] **Multi-language** — BM + English.
- [ ] **Dark/light mode toggle**.

---

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Auth | Supabase Auth |
| ChatBot | OpenAI + Vercel AI SDK |
| Payment | ToyyibPay |
| Deploy | Vercel (Phase 1) |
| Domain | duniaherbs.com.my |

---

## Nota

- Admin dashboard: `/admin/login`
- Supabase schema: `supabase-schema.sql`
- Env template: `.env.example`
