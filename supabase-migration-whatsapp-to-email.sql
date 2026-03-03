-- Ganti rujukan WhatsApp dengan email (HQ guna email: admin@duniaherbs.com.my)

-- 1. site_content
UPDATE site_content SET value = REPLACE(value, 'hubungi kami melalui WhatsApp', 'hubungi kami melalui email admin@duniaherbs.com.my') WHERE value LIKE '%hubungi kami melalui WhatsApp%';
UPDATE site_content SET value = REPLACE(value, 'Order sekarang melalui WhatsApp', 'Order sekarang melalui email') WHERE value LIKE '%Order sekarang melalui WhatsApp%';

-- 2. knowledge_base - "Bila nak bagi WhatsApp link" → email
UPDATE knowledge_base SET content = REPLACE(content, 'WhatsApp link', 'email') WHERE content LIKE '%WhatsApp link%';
UPDATE knowledge_base SET content = REPLACE(content, 'Bagi link WhatsApp', 'Bagi email') WHERE content LIKE '%Bagi link WhatsApp%';
