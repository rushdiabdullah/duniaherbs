-- Promotions table for campaigns & discounts
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value NUMERIC(10,2) NOT NULL,
  applies_to TEXT NOT NULL DEFAULT 'all' CHECK (applies_to IN ('all', 'products')),
  product_ids TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- percentage: discount_value = 10 means 10% off
-- fixed_amount: discount_value = 5 means RM 5 off
-- applies_to = 'all': semua produk
-- applies_to = 'products': hanya produk dalam product_ids (comma-separated UUIDs)

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Public boleh baca promotions aktif (untuk papar harga diskaun)
CREATE POLICY "Public read promotions" ON promotions FOR SELECT USING (is_active = true);

-- Admin sahaja boleh insert/update/delete
CREATE POLICY "Auth full access promotions" ON promotions FOR ALL USING (auth.role() = 'authenticated');
