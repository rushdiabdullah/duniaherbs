-- Add group support to promotions (single vs group product selection)
-- Run this in Supabase SQL Editor AFTER supabase-migration-promotions.sql

-- Add group_key column for predefined groups
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS group_key TEXT;

-- Update check constraint to allow 'single' and 'group' (keep 'products' for backward compat)
ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_applies_to_check;
ALTER TABLE promotions ADD CONSTRAINT promotions_applies_to_check
  CHECK (applies_to IN ('all', 'single', 'group', 'products'));

-- Migrate existing 'products' to 'single'
UPDATE promotions SET applies_to = 'single' WHERE applies_to = 'products';
