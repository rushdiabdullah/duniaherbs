-- Seksyen produk di homepage — Haruman (atas) & Legend (bawah)

INSERT INTO site_content (id, value) VALUES
  ('produk_ids', ''),
  ('produk_legend_label', 'Koleksi'),
  ('produk_legend_title', 'KOLEKSI LEGEND'),
  ('produk_legend_subtitle', 'Produk ikonik yang menjadi pilihan sejak 2005'),
  ('produk_legend_ids', '')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;
