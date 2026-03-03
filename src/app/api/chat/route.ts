import { createOpenAI } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';
import { CHATBOT_SYSTEM_PROMPT } from '@/lib/product-context';
import { getKnowledgeBase, getBersalinContentForAI, getProductsForAI } from '@/lib/data';

export const maxDuration = 30;

// Anti-abuse: had mesej & panjang
const MAX_MESSAGES = 40; // max mesej dalam satu sesi (user + assistant)
const MAX_MESSAGE_LENGTH = 400; // max aksara per mesej

function validateMessages(messages: unknown): { ok: true; messages: { role: string; content: string }[] } | { ok: false; error: string } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: 'Tiada mesej' };
  }
  if (messages.length > MAX_MESSAGES) {
    return { ok: false, error: `Maksimum ${MAX_MESSAGES} mesej per sesi. Sila mulakan perbualan baru.` };
  }
  const valid: { role: string; content: string }[] = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object' || !['user', 'assistant', 'system'].includes(m.role)) continue;
    const content = String(m.content ?? '').trim();
    if (content.length > MAX_MESSAGE_LENGTH) {
      return { ok: false, error: `Mesej terlalu panjang. Maksimum ${MAX_MESSAGE_LENGTH} aksara.` };
    }
    if (m.role === 'user' && content.length === 0) continue; // skip empty user msg
    valid.push({ role: m.role, content: m.content ?? '' });
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
  let messages: unknown;
  try {
    const body = await req.json();
    messages = body.messages;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Request tidak sah' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const validated = validateMessages(messages);
  if (!validated.ok) {
    return new Response(
      JSON.stringify({ error: validated.error }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  messages = validated.messages;

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
