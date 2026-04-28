-- Fix RLS policies untuk orders table
-- Jalankan di Supabase → SQL Editor

-- Padam polisi lama yang terlalu longgar
DROP POLICY IF EXISTS "Service update orders" ON orders;
DROP POLICY IF EXISTS "Public read orders" ON orders;
DROP POLICY IF EXISTS "Public read own order" ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Auth full access orders" ON orders;
DROP POLICY IF EXISTS "Auth full access" ON orders;

-- INSERT: pelanggan boleh buat order baru (public)
CREATE POLICY "Public insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- SELECT: hanya authenticated (admin) boleh baca semua orders
-- Pelanggan cek status guna service role melalui API /api/payment/sync sahaja
CREATE POLICY "Auth read orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- UPDATE: hanya authenticated (admin) atau service role
-- callback & sync routes guna SUPABASE_SERVICE_ROLE_KEY yang langkau RLS
CREATE POLICY "Auth update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- DELETE: hanya authenticated (admin)
CREATE POLICY "Auth delete orders"
  ON orders FOR DELETE
  USING (auth.role() = 'authenticated');
