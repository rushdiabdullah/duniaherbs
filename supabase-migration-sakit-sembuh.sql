-- Ganti perkataan: sakit → ketidakselesaan/tidak selesa, sembuh → membantu melegakan
-- (Keperluan KKM — elak claim perubatan)

-- 1. site_content
UPDATE site_content SET value = REPLACE(value, 'Sakit sendi & otot', 'Ketidakselesaan sendi & otot') WHERE value LIKE '%Sakit sendi & otot%';
UPDATE site_content SET value = REPLACE(value, 'Legakan kesakitan', 'Membantu melegakan ketidakselesaan') WHERE value LIKE '%Legakan kesakitan%';
UPDATE site_content SET value = REPLACE(value, 'Legakan sakit sendi', 'Membantu melegakan ketidakselesaan sendi') WHERE value LIKE '%Legakan sakit sendi%';

-- 2. products (benefits array)
UPDATE products SET benefits = (
  SELECT array_agg(
    CASE WHEN x = 'Legakan sakit sendi & otot' THEN 'Membantu melegakan ketidakselesaan sendi & otot' ELSE x END
  )
  FROM unnest(benefits) x
)
WHERE benefits @> ARRAY['Legakan sakit sendi & otot']::text[];

-- 3. testimonials
UPDATE testimonials SET quote = REPLACE(quote, 'sakit lutut', 'ketidakselesaan lutut') WHERE quote LIKE '%sakit lutut%';
UPDATE testimonials SET quote = REPLACE(quote, 'Sakit pinggang', 'Ketidakselesaan pinggang') WHERE quote LIKE '%Sakit pinggang%';
UPDATE testimonials SET quote = REPLACE(quote, 'sakit sendi', 'ketidakselesaan sendi') WHERE quote LIKE '%sakit sendi%';

-- 4. knowledge_base
UPDATE knowledge_base SET content = REPLACE(content, 'sakit sendi', 'ketidakselesaan sendi') WHERE content LIKE '%sakit sendi%';
UPDATE knowledge_base SET content = REPLACE(content, 'sakit pinggang', 'ketidakselesaan pinggang') WHERE content LIKE '%sakit pinggang%';
UPDATE knowledge_base SET content = REPLACE(content, 'kawasan yang sakit', 'kawasan yang tidak selesa') WHERE content LIKE '%kawasan yang sakit%';
UPDATE knowledge_base SET content = REPLACE(content, 'sembuh penyakit', 'membantu melegakan penyakit') WHERE content LIKE '%sembuh penyakit%';
UPDATE knowledge_base SET content = REPLACE(content, 'legakan sakit sendi', 'membantu melegakan ketidakselesaan sendi') WHERE content LIKE '%legakan sakit sendi%';
UPDATE knowledge_base SET content = REPLACE(content, 'Warga emas sakit sendi', 'Warga emas ketidakselesaan sendi') WHERE content LIKE '%Warga emas sakit sendi%';
