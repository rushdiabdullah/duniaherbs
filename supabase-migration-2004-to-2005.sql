-- Tukar tahun 2004 ke 2005 (Dunia Herbs bermula 2005)

-- 1. site_content
UPDATE site_content SET value = REPLACE(value, '2004', '2005') WHERE value LIKE '%2004%';

-- 2. milestones (year column)
UPDATE milestones SET year = '2005' WHERE year = '2004';

-- 3. knowledge_base (content & title)
UPDATE knowledge_base SET content = REPLACE(content, '2004', '2005') WHERE content LIKE '%2004%';
