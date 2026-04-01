# Panduan: Tukar Billplz ke Production API

Projek ini sudah sedia untuk Billplz. Untuk guna **production** (pembayaran benar), ikut langkah berikut.

---

## 1. Daftar Akaun Billplz Production

1. Pergi ke [billplz.com](https://www.billplz.com)
2. Daftar / log masuk
3. Lengkapkan pendaftaran syarikat (SSM, bank account, dll.) — diperlukan untuk production
4. Billplz akan verify akaun anda (biasanya 1–2 hari bekerja)

---

## 2. Dapatkan API Keys (Production)

1. Log masuk ke [billplz.com](https://www.billplz.com)
2. Pergi ke **Settings** → **API**
3. Salin nilai berikut:

| Key | Keterangan |
|-----|------------|
| **API Secret Key** | Untuk autentikasi API (create bill) |
| **Collection ID** | Untuk collection yang akan terima bayaran |
| **X Signature Key** | Untuk verify callback dari Billplz (penting untuk keselamatan) |

---

## 3. Buat Collection (jika belum ada)

1. Di Billplz dashboard → **Collections** → **Create Collection**
2. Namakan collection (cth: "Dunia Herbs - Online Store")
3. Set logo, description jika perlu
4. Salin **Collection ID** yang dijana

---

## 4. Set Callback URL di Billplz

1. Di Billplz dashboard → **Settings** → **Webhook / Callback**
2. Set **Callback URL** ke:
   ```
   https://DOMAIN_ANDA.com/api/payment/callback
   ```
   Contoh: `https://duniaherbs.com.my/api/payment/callback`

3. Pastikan **X Signature** diaktifkan untuk verify callback

---

## 5. Update `.env.local`

Tukar nilai berikut dalam `.env.local`:

```env
# Billplz — PRODUCTION
BILLPLZ_BASE_URL=https://www.billplz.com
BILLPLZ_API_KEY=your_production_api_secret_key
BILLPLZ_COLLECTION_ID=your_production_collection_id
BILLPLZ_X_SIGNATURE_KEY=your_production_x_signature_key

# App URL — domain production
NEXT_PUBLIC_APP_URL=https://duniaherbs.com.my
```

**Penting:**
- Jangan guna API key sandbox untuk production
- `NEXT_PUBLIC_APP_URL` mesti domain production (untuk callback & redirect URL)

---

## 6. Perbandingan Sandbox vs Production

| Item | Sandbox | Production |
|------|---------|------------|
| Base URL | `https://www.billplz-sandbox.com` | `https://www.billplz.com` |
| API Key | Dari billplz-sandbox.com | Dari billplz.com |
| Collection ID | Sandbox collection | Production collection |
| Bayaran | Simulasi sahaja | Bayaran benar |
| Pendaftaran | Percuma, tiada SSM | Perlu SSM & bank account |

---

## 7. Aliran Pembayaran

1. User checkout → app create bill via API → redirect ke Billplz
2. User bayar di Billplz (FPX / kad / e-wallet)
3. Billplz hantar callback ke `/api/payment/callback` → app update order status
4. User redirect ke `/payment/status` — papar status berjaya/gagal

---

## 8. Checklist Sebelum Go Live

- [ ] Akaun Billplz production sudah verified
- [ ] Collection production sudah dibuat
- [ ] Callback URL di Billplz dashboard = `https://DOMAIN/api/payment/callback`
- [ ] X Signature Key diisi dan verify callback berfungsi
- [ ] `.env.local` sudah tukar ke production values
- [ ] Test bayaran kecil (RM 10) untuk pastikan flow berjalan

---

## 9. Troubleshooting

**Callback tidak berfungsi**
- Pastikan domain boleh diakses dari internet (bukan localhost)
- Callback URL mesti HTTPS
- Semak X Signature Key betul — callback akan gagal jika signature salah

**Bill tidak tercipta**
- Semak API Key dan Collection ID valid
- Base URL betul: `https://www.billplz.com` (tanpa trailing slash)

**Redirect ke URL salah**
- Pastikan `NEXT_PUBLIC_APP_URL` betul domain production
