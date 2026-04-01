import { createOpenAI } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText, type CoreMessage } from 'ai';
import { CHATBOT_SYSTEM_PROMPT } from '@/lib/product-context';
import { getKnowledgeBase, getBersalinContentForAI, getProductsForAI, getActivePromotions, getProducts } from '@/lib/data';

export const maxDuration = 30;

// Anti-abuse: had mesej & panjang
const MAX_MESSAGES = 40; // max mesej dalam satu sesi (user + assistant)
const MAX_MESSAGE_LENGTH = 1000; // max aksara per mesej

function validateMessages(messages: unknown): { ok: true; messages: { role: string; content: string }[] } | { ok: false; error: string } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: 'Tiada mesej' };
  }
  if (messages.length > MAX_MESSAGES) {
    return { ok: false, error: `Maksimum ${MAX_MESSAGES} mesej per sesi. Sila mulakan perbualan baru.` };
  }
  const valid: { role: string; content: string }[] = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object') continue;
    const mo = m as { role?: string; content?: unknown };
    if (!['user', 'assistant', 'system'].includes(mo.role ?? '')) continue;
    const content = String(mo.content ?? '').trim();
    if (content.length > MAX_MESSAGE_LENGTH) {
      return { ok: false, error: `Mesej terlalu panjang. Maksimum ${MAX_MESSAGE_LENGTH} aksara.` };
    }
    if (mo.role === 'user' && content.length === 0) continue; // skip empty user msg
    valid.push({ role: mo.role as string, content: String(mo.content ?? '') });
  }
  if (valid.filter((m) => m.role === 'user').length === 0) {
    return { ok: false, error: 'Tiada mesej pengguna' };
  }
  return { ok: true, messages: valid };
}

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
  baseURL: 'https://api.deepseek.com',
});

export async function POST(req: Request) {
  let rawMessages: unknown;
  try {
    const body = await req.json();
    rawMessages = body.messages;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Request tidak sah' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const validated = validateMessages(rawMessages);
  if (!validated.ok) {
    return new Response(
      JSON.stringify({ error: validated.error }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const messages = validated.messages as CoreMessage[];

  if (!process.env.DEEPSEEK_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'DEEPSEEK_API_KEY tidak diset. Sila tambah dalam .env' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const knowledgeParts: string[] = [];

  try {
    const kbItems = await getKnowledgeBase();
    if (kbItems.length > 0) {
      const grouped: Record<string, string[]> = {};
      for (const item of kbItems) {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(`${item.title}: ${item.content}`);
      }
      const sections = Object.entries(grouped)
        .map(([cat, entries]) => `[${cat}]\n${entries.join('\n')}`)
        .join('\n\n');
      knowledgeParts.push(`## KNOWLEDGE BASE / ARTIKEL (rujukan dari admin)\n\n${sections}`);
    }
  } catch {
    // fallback
  }

  try {
    const bersalin = await getBersalinContentForAI();
    if (bersalin) {
      knowledgeParts.push(`\n\n## HALAMAN SELEPAS BERSALIN (kandungan dari /bersalin)\n\n${bersalin}`);
    }
  } catch {
    // fallback
  }

  try {
    const products = await getProductsForAI();
    const withColor = products.filter((p) => p.packaging_color?.trim());
    if (withColor.length > 0) {
      const lines = withColor.map((p) => `- ${p.name} (${p.price}): ${p.packaging_color}`).join('\n');
      knowledgeParts.push(`\n\n## WARNA TIUB/BOTOL SETIAP PRODUK (FAKTA — jangan reka)\n\n${lines}`);
    }
  } catch {
    // fallback
  }

  try {
    const promotions = await getActivePromotions();
    if (promotions.length > 0) {
      const allProducts = await getProducts();
      const idToName = new Map(allProducts.map((p) => [p.id, p.name]));
      const groupLabels: Record<string, string> = {
        haruman: 'Koleksi Haruman',
        legend: 'Koleksi Legend',
        bersalin: 'Selepas Bersalin',
        bentuk_badan: 'Bentuk Badan Ideal',
        minuman: 'Produk Minuman',
        seisi_keluarga: 'Seisi Keluarga',
      };
      const lines = promotions.map((p) => {
        const discount = p.discount_type === 'percentage'
          ? `${p.discount_value}% off`
          : `RM ${p.discount_value} off`;
        let scope = 'Semua produk';
        if (p.applies_to === 'group' && p.group_key) {
          scope = groupLabels[p.group_key] || p.group_key;
        } else if (p.applies_to === 'single' && p.product_ids) {
          const names = p.product_ids.split(',').map((id) => idToName.get(id.trim())).filter(Boolean);
          scope = names.length > 0 ? names.join(', ') : 'Produk terpilih';
        }
        const until = p.end_date ? ` (sehingga ${p.end_date})` : '';
        return `- ${p.name}: ${discount} — ${scope}${until}`;
      });
      knowledgeParts.push(`\n\n## PROMOSI / DISKAUN AKTIF (FAKTA — rujuk laman web untuk harga terkini)\n\n${lines.join('\n')}\n\nBeritahu pelanggan tentang promosi ini dan arahkan ke laman web / halaman produk untuk harga diskaun.`);
    }
  } catch {
    // fallback
  }

  const knowledgeContext = knowledgeParts.length > 0
    ? `\n\n${knowledgeParts.join('\n')}`
    : '';

  const result = await streamText({
    model: deepseek('deepseek-chat'),
    system: CHATBOT_SYSTEM_PROMPT + knowledgeContext,
    messages,
  });

  return new StreamingTextResponse(result.toAIStream());
}
