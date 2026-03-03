-- Migration: Add polisi content keys to site_content
-- Run this in Supabase SQL Editor if you already have the database set up

INSERT INTO site_content (id, value) VALUES
  ('polisi_privacy', 'Dunia Herbs menghormati privasi pelanggan kami. Maklumat peribadi yang dikumpul (nama, telefon, alamat) hanya digunakan untuk tujuan penghantaran dan komunikasi berkaitan pesanan.

Kami tidak akan menjual, menyewa atau berkongsi maklumat peribadi anda kepada pihak ketiga tanpa kebenaran.

Data pembayaran diproses melalui gateway pembayaran yang selamat dan tidak disimpan oleh kami.'),
  ('polisi_shipping', 'Semenanjung Malaysia: 2–5 hari bekerja.
Sabah & Sarawak: 5–10 hari bekerja.
Singapura: 3–7 hari bekerja (melalui stockist).

Kos penghantaran bergantung kepada lokasi dan berat bungkusan. Penghantaran percuma mungkin ditawarkan untuk pesanan melebihi jumlah tertentu.'),
  ('polisi_return', 'Pemulangan diterima dalam tempoh 7 hari dari tarikh penerimaan, tertakluk kepada syarat berikut:
• Produk belum dibuka dan dalam keadaan asal.
• Bungkusan tidak rosak.
• Resit atau bukti pembelian disertakan.

Untuk memulakan pemulangan, hubungi kami melalui WhatsApp.'),
  ('polisi_usage', 'Semua produk Dunia Herbs adalah untuk kegunaan luaran sahaja.

Tidak sesuai untuk bayi dan kanak-kanak kecil.

Sila rujuk doktor jika anda mengandung atau mempunyai keadaan kulit yang sensitif sebelum menggunakan produk ini.

Hentikan penggunaan jika berlaku kerengsaan kulit.')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;
