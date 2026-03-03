-- Billplz Orders Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_no TEXT NOT NULL UNIQUE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  amount_cents INT NOT NULL,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_email TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  shipping_address TEXT NOT NULL DEFAULT '',
  items JSONB,
  bill_code TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_ref TEXT,
  payment_channel TEXT,
  payment_time TIMESTAMPTZ,
  callback_raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public boleh insert order (customer buat pesanan)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Public boleh baca order (untuk check status)
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);

-- Admin boleh buat semua (update status, delete, etc)
CREATE POLICY "Auth full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- Service role boleh update (untuk callback dari Billplz)
CREATE POLICY "Service update orders" ON orders FOR UPDATE USING (true);
