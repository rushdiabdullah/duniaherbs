import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSiteContent } from '@/lib/data';
import type { Promotion } from '@/lib/promotions';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const GROUP_CONTENT_KEYS: Record<string, string[]> = {
  haruman: ['produk_ids'],
  legend: ['produk_legend_ids'],
  bersalin: ['bersalin_produk_ids', 'bersalin_produk_legend_ids'],
  bentuk_badan: ['bentuk_badan_product_ids', 'bentuk_badan_produk_legend_ids'],
  minuman: ['minuman_product_ids', 'minuman_produk_legend_ids'],
  seisi_keluarga: ['seisi_keluarga_product_ids', 'seisi_keluarga_produk_legend_ids'],
};

function resolveGroupProductIds(content: Record<string, string>, groupKey: string): string {
  const keys = GROUP_CONTENT_KEYS[groupKey];
  if (!keys) return '';
  const ids = new Set<string>();
  for (const k of keys) {
    const val = content[k] || '';
    val.split(',').map((s) => s.trim()).filter(Boolean).forEach((id) => ids.add(id));
  }
  return [...ids].join(',');
}

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json([]);
  }
  try {
    const { data: rows, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Promotions API error:', error);
      return NextResponse.json([], { status: 200 });
    }

    const content = await getSiteContent();
    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    const promotions: Promotion[] = (rows ?? [])
      .filter((p) => {
        if (p.start_date && p.start_date > today) return false;
        if (p.end_date && p.end_date < today) return false;
        return true;
      })
      .map((p) => {
        const promo = { ...p, discount_value: Number(p.discount_value) } as Promotion;
        if (promo.applies_to === 'group' && promo.group_key) {
          promo.product_ids = resolveGroupProductIds(content, promo.group_key) || null;
        }
        return promo;
      });

    return NextResponse.json(promotions);
  } catch (err) {
    console.error('Promotions API error:', err);
    return NextResponse.json([], { status: 200 });
  }
}
