-- Add delivery flow columns to orders
-- Flow: paid → pending → shipped (staf masuk tracking)

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivery_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;

-- delivery_status: 'pending' | 'shipped'
-- pending = belum hantar, shipped = sudah hantar (staf dah masuk tracking)

COMMENT ON COLUMN orders.delivery_status IS 'pending = belum hantar, shipped = sudah hantar dengan tracking';
COMMENT ON COLUMN orders.tracking_number IS 'No. tracking kurier (Pos Laju, J&T, etc)';
COMMENT ON COLUMN orders.shipped_at IS 'Tarikh masa staf mark sebagai shipped';
