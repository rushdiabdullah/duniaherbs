#!/usr/bin/env node
/**
 * Fetch Unsplash CDN URLs for photo IDs.
 * Run: UNSPLASH_ACCESS_KEY=xxx node scripts/fetch-unsplash-urls.mjs
 * Or add UNSPLASH_ACCESS_KEY to .env.local and run with: node --env-file=.env.local scripts/fetch-unsplash-urls.mjs
 */
const key = process.env.UNSPLASH_ACCESS_KEY;
if (!key) {
  console.error('Add UNSPLASH_ACCESS_KEY to .env.local (get free key at unsplash.com/developers)');
  process.exit(1);
}

// Unsplash API photo IDs (from unsplash.com/photos/ID)
const PHOTO_IDS = [
  ['LMVePyAn2o0', 'hot stone tungku'],
  ['Nvk_UmLTh70', 'massage oil hands'],
  ['hBLf2nvp-Yc', 'person massaging back'],
  ['xDxB-BnlMTM', 'Thai herbal compress'],
  ['kqDEH7M2tGk', 'woman blanket rest'],
  ['zs9KtytY3cU', 'back massage spa'],
  ['piaqB8clEsw', 'leg massage oil'],
];

async function fetchPhoto(id) {
  const url = `https://api.unsplash.com/photos/${id}?client_id=${key}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Photo ${id}: ${res.status} ${err}`);
  }
  const data = await res.json();
  const raw = data.urls?.raw || data.urls?.regular;
  if (!raw) throw new Error(`No URL for ${id}`);
  const cdn = raw.split('?')[0] + '?w=400&h=400&fit=crop';
  return { id, desc: data.description || data.alt_description || data.id, cdn };
}

async function main() {
  for (const [id, label] of PHOTO_IDS) {
    try {
      const { cdn } = await fetchPhoto(id);
      console.log(`-- ${label}\n  '${cdn}',`);
    } catch (e) {
      console.error(`${id} (${label}): ${e.message}`);
    }
  }
}

main();
