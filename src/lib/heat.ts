/** Paparkan heat level dengan teks penuh termasuk tahap kepanasan */
export const HEAT_LABELS: Record<string, string> = {
  None: 'None',
  Mild: 'Mild (Tahap 1)',
  Hot: 'Hot (Tahap 2)',
  'Extra Hot': 'Extra Hot (Tahap 3)',
  'Super Hot': 'Super Hot (Tahap 4)',
  Extreme: 'Extreme Hot (Tahap 5)',
  Mix: 'Mix (Set campur tahap kepanasan)',
  'Produk minuman/makanan': 'Produk minuman/makanan',
};

export function getHeatLabel(heat?: string | null): string {
  if (!heat) return '';
  return HEAT_LABELS[heat] ?? heat;
}
