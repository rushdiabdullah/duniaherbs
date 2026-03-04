import { supabase } from './supabase';

export async function getSiteContent() {
  try {
    const { data } = await supabase
      .from('site_content')
      .select('id, value');
    const map: Record<string, string> = {};
    data?.forEach((row) => { map[row.id] = row.value; });
    return map;
  } catch {
    return {};
  }
}

export async function getFashaLandingContent() {
  try {
  const content = await getSiteContent();
  const pickIds = (content.fasha_picks || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  let picks: Awaited<ReturnType<typeof getProducts>> = [];
  if (pickIds.length > 0) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .in('id', pickIds)
      .eq('visible', true);
    const byId = new Map((data ?? []).map((p) => [p.id, p]));
    picks = pickIds.map((id) => byId.get(id)).filter(Boolean) as typeof picks;
  }
  if (picks.length === 0) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true })
      .limit(3);
    picks = data ?? [];
  }
  return {
    visible: content.fasha_visible !== '0',
    heroImage: content.fasha_hero_image || 'https://upload.wikimedia.org/wikipedia/commons/0/04/Fasha_Sandha_on_MeleTOP.jpg',
    heroBadge: content.fasha_hero_badge || 'Duta Rasmi Dunia Herbs',
    heroTitle: content.fasha_hero_title || 'Fasha Sandha',
    heroSubtitle: content.fasha_hero_subtitle || '× Dunia Herbs',
    heroDescription: content.fasha_hero_description || 'Pelakon & selebriti terkenal Malaysia. Fasha sendiri pilih dan percayai Lotion Mustajab — produk pati halia #1 di Malaysia sejak 2005.',
    quote: content.fasha_quote || 'Saya pilih Dunia Herbs sebab produk ni memang proven — 20 tahun di pasaran, halal, dan berkesan. Sesuai untuk urutan berpantang dan rutin harian.',
    ctaTitle: content.fasha_cta_title || 'Ikut Pilihan Fasha',
    ctaSubtitle: content.fasha_cta_subtitle || 'Order sekarang melalui email atau platform pilihan anda.',
    picks,
  };
  } catch {
    return {
      visible: true,
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Fasha_Sandha_on_MeleTOP.jpg',
      heroBadge: 'Duta Rasmi Dunia Herbs',
      heroTitle: 'Fasha Sandha',
      heroSubtitle: '× Dunia Herbs',
      heroDescription: 'Pelakon & selebriti terkenal Malaysia. Fasha sendiri pilih dan percayai Lotion Mustajab.',
      quote: 'Saya pilih Dunia Herbs sebab produk ni memang proven — 20 tahun di pasaran, halal, dan berkesan.',
      ctaTitle: 'Ikut Pilihan Fasha',
      ctaSubtitle: 'Order sekarang melalui email atau platform pilihan anda.',
      picks: [],
    };
  }
}

export async function getProducts() {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getProduct(id: string) {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  } catch {
    return null;
  }
}

/** Senarai produk dengan warna packaging untuk AI/chatbot. */
export async function getProductsForAI(): Promise<Array<{ name: string; price: string; packaging_color: string }>> {
  try {
    const { data } = await supabase
      .from('products')
      .select('name, price, packaging_color')
      .eq('visible', true)
      .order('sort_order', { ascending: true });
    return (data ?? []).map((p) => ({
      name: p.name ?? '',
      price: p.price ?? '',
      packaging_color: (p as { packaging_color?: string }).packaging_color ?? '',
    }));
  } catch {
    return [];
  }
}

export async function getTestimonials() {
  try {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getFaqs() {
  try {
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getStockists() {
  try {
    const { data } = await supabase
      .from('stockists')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getMilestones() {
  try {
    const { data } = await supabase
      .from('milestones')
      .select('*')
      .order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getKnowledgeBase() {
  try {
    const { data } = await supabase
      .from('knowledge_base')
      .select('id, category, title, content')
      .eq('visible', true)
      .order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

const BERSALIN_DEFAULTS: Record<string, string> = {
  hero_title: 'Penjagaan Wanita',
  hero_title_highlight: 'Selepas Bersalin',
  hero_desc: 'Petua tradisional Melayu dalam sentuhan moden — losyen pati halia semula jadi untuk ibu-ibu yang baru melahirkan dan sedang berpantang.',
  intro_p1: 'Losyen Mustajab Pati Halia Limau Nipis yang menggunakan ramuan utama pati limau nipis dan pati halia mempunyai pelbagai kegunaan hanya di dalam satu produk sahaja.',
  intro_p2: 'Bauan aroma limau nipis dan halia yang sangat menyegarkan, ditambah pula dengan sedikit bauan \'mint\' dapat membantu menceriakan emosi ibu-ibu selepas bersalin yang biasanya lesu dan tidak bermaya.',
  tip_1_title: 'Menggantikan Param & Pilis', tip_1_desc: 'Losyen Mustajab Pati Halia Limau Nipis memudahkan ibu-ibu berpantang tanpa perlu sediakan param dan pilis secara tradisional.',
  tip_2_title: 'Urutan Lembut', tip_2_desc: 'Lakukan sedikit urutan menggunakan losyen untuk membantu pengaliran darah yang lebih lancar dan menghilangkan rasa kebas.',
  tip_3_title: 'Membuang Angin', tip_3_desc: 'Pati halia dan limau nipis membantu membuang angin dalam badan — masalah utama wanita selepas bersalin.',
  tip_4_title: 'Mengempiskan Perut', tip_4_desc: 'Sesuai digunakan bersama bengkung untuk mendapatkan kesan optimum mengempiskan perut selepas bersalin.',
  tip_5_title: 'Menyegarkan Badan', tip_5_desc: 'Aroma limau nipis dan halia yang menyegarkan membantu menceriakan emosi ibu-ibu yang lesu selepas bersalin.',
  tip_6_title: 'Jimat Masa', tip_6_desc: 'Tidak berminyak dan mudah menyerap — memudahkan ibu yang berpantang sendiri tanpa tukang urut.',
  article_1_title: 'Petua Turun-Temurun, Kemudahan Moden', article_1_content: 'Sejak zaman nenek moyang, wanita Melayu mengamalkan petua berpantang menggunakan halia, limau nipis, dan rempah ratus semula jadi. Dunia Herbs menggabungkan kebijaksanaan tradisional ini dalam bentuk losyen moden yang mudah digunakan — tanpa perlu menumbuk param atau menyediakan pilis.',
  article_2_title: 'Kenapa Pati Halia?', article_2_content: 'Halia dikenali sebagai "ratu herba" dalam perubatan tradisional Melayu. Ia membantu melancarkan peredaran darah, mengurangkan bengkak, membuang angin, dan memberikan kehangatan semula jadi pada badan. Losyen Mustajab menggunakan pati halia tulen 100% — bukan perisa atau bahan sintetik.',
  article_3_title: 'Sesuai Untuk Semua Ibu', article_3_content: 'Sama ada bersalin normal atau pembedahan, losyen ini sesuai untuk semua ibu. Sapuan lembut pada perut, pinggang, dan anggota badan sudah memadai. Ditambah dengan pemakaian bengkung, hasilnya lebih berkesan. Sesuai juga untuk ibu yang berpantang sendiri tanpa bantuan tukang urut.',
  quote: 'Limau nipis biasa digunakan oleh wanita selepas bersalin semasa dalam pantang sebagai salah satu bahan untuk mengempiskan perut dan menyegarkan badan yang lesu.',
  quote_author: '— Petua Tradisional Melayu',
  produk_title: 'Sesuai Untuk Ibu Berpantang',
  produk_desc: 'Pilihan losyen yang lembut dan sesuai untuk kegunaan wanita selepas bersalin',
};

/** Content dari halaman Selepas Bersalin untuk AI/chatbot. Guna default jika admin belum simpan. */
export async function getBersalinContentForAI(): Promise<string> {
  try {
    const content = await getSiteContent();
    const c = (key: string) => content[`bersalin_${key}`]?.trim() || BERSALIN_DEFAULTS[key] || '';

    const parts: string[] = [];

    parts.push(`## HALAMAN SELEPAS BERSALIN (/bersalin) — RUJUK INI BILA PELANGGAN TANYA PASAL IBU BERPANTANG, LEPAS BERSALIN, URUTAN POSTPARTUM\n\n${c('hero_title')} ${c('hero_title_highlight')}\n${c('hero_desc')}`);

    if (c('intro_p1')) parts.push(`\n### Pengenalan\n${c('intro_p1')}`);
    if (c('intro_p2')) parts.push(`\n${c('intro_p2')}`);

    const tips: string[] = [];
    for (let i = 1; i <= 6; i++) {
      const t = c(`tip_${i}_title`);
      const d = c(`tip_${i}_desc`);
      if (t || d) tips.push(`- ${t}: ${d}`);
    }
    if (tips.length) parts.push(`\n### Kebaikan Untuk Ibu Berpantang\n${tips.join('\n')}`);

    for (let i = 1; i <= 3; i++) {
      const title = c(`article_${i}_title`);
      const body = c(`article_${i}_content`);
      if (title || body) parts.push(`\n### ${title}\n${body}`);
    }

    if (c('quote')) parts.push(`\n### Petua Tradisional\n"${c('quote')}" ${c('quote_author')}`);
    if (c('produk_title')) parts.push(`\n### Produk Disyorkan\n${c('produk_title')}: ${c('produk_desc')}`);

    parts.push(`\n\n[Emma: Rujuk halaman /bersalin untuk soalan ibu berpantang. Cadangkan Lotion Mustajab Pati Halia Limau Nipis atau Pati Halia (Mild).]`);

    return parts.filter(Boolean).join('\n').trim();
  } catch {
    return '';
  }
}

export async function getKnowledgeArticles() {
  try {
    const { data } = await supabase
      .from('knowledge_base')
      .select('id, category, title, content, updated_at')
      .eq('visible', true)
      .order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

/** Artikel untuk halaman awam Info AM — exclude Sales (admin only). */
export async function getInfoAmArticles() {
  try {
    const { data } = await supabase
      .from('knowledge_base')
      .select('id, category, title, content, updated_at')
      .eq('visible', true)
      .neq('category', 'Sales')
      .order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getInfoAmArticle(id: string) {
  try {
    const { data } = await supabase
      .from('knowledge_base')
      .select('id, category, title, content, updated_at')
      .eq('id', id)
      .eq('visible', true)
      .neq('category', 'Sales')
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function getKnowledgeArticle(id: string) {
  try {
    const { data } = await supabase
      .from('knowledge_base')
      .select('id, category, title, content, updated_at')
      .eq('id', id)
      .eq('visible', true)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function getVideos() {
  try {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}
