-- Galeri Kegunaan & Cara Pakai — 3 imej sahaja

INSERT INTO site_content (id, value) VALUES
  ('bersalin_gallery_1', 'https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?w=400&h=400&fit=crop'),
  ('bersalin_gallery_2', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'),
  ('bersalin_gallery_3', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;

-- Buang galeri 4–6 (jika ada)
DELETE FROM site_content WHERE id IN ('bersalin_gallery_4', 'bersalin_gallery_5', 'bersalin_gallery_6');
