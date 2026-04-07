# DuniaHerb PWA

PWA bisnes herbs — kategori **Beauty & Health**. Dark mode, ToyyibPay.

## Setup

```bash
cd /Applications/projects/duniaherb
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Doc

- [Trend & scope + pembayaran](docs/TREND_DAN_SCOPE.md)

## PWA

- `public/manifest.json` — nama, theme dark, icons (tambah `icon-192.png` & `icon-512.png` dalam `public/`).
- Service worker / next-pwa boleh ditambah lepas ni untuk offline.

## Payment

ToyyibPay: create bill → redirect user → callback. Sandbox: [dev.toyyibpay.com](https://dev.toyyibpay.com/). Set `TOYYIBPAY_*` dalam `.env` (lihat `.env.example`).
