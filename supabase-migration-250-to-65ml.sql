-- Tukar produk 250ml ke 65ml (Dunia Herbs tiada 250ml — ada 130ml & 65ml sahaja, 65ml limited)

UPDATE products SET
  name = 'Lotion Mustajab Pati Halia 65ml',
  tagline = 'Saiz mini • Travel size',
  price = 'RM 14.90',
  size = '65ml',
  description = 'Produk Pati Halia saiz mini 65ml. Limited — bukan semua jenis ada. Senang bawa, sesuai try dulu atau travel.',
  benefits = ARRAY['Saiz mini 65ml','Limited','Formula sama dengan Pati Halia 130ml','Senang bawa'],
  updated_at = NOW()
WHERE size = '250ml' AND name ILIKE '%pati halia%';

UPDATE products SET
  name = 'Lotion Mustajab Super Hot 65ml',
  tagline = 'Saiz mini • Capsicum workout',
  price = 'RM 15.90',
  size = '65ml',
  description = 'Versi Super Hot saiz mini 65ml. Limited. Capsicum untuk kehangatan maksimum, senang bawa.',
  benefits = ARRAY['Saiz mini 65ml','Limited','Capsicum untuk haba kuat','Travel size'],
  updated_at = NOW()
WHERE size = '250ml' AND name ILIKE '%super hot%';
