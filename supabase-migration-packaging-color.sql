-- Tambah kolum packaging_color untuk warna tiub/botol setiap produk
-- Emma (chatbot) akan guna maklumat ini untuk jawab soalan pelanggan

ALTER TABLE products ADD COLUMN IF NOT EXISTS packaging_color TEXT DEFAULT '';

COMMENT ON COLUMN products.packaging_color IS 'Warna tiub/botol & label — cth: Botol putih, label hijau & kuning. Untuk AI chatbot.';
