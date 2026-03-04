/**
 * Promotion utilities — apply discounts to prices
 */

export type Promotion = {
  id: string;
  name: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  applies_to: 'all' | 'single' | 'group';
  product_ids: string | null;
  group_key: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

/** Check if promotion applies to a product (by date and product scope) */
function promotionAppliesTo(promo: Promotion, productId: string, now: Date): boolean {
  if (!promo.is_active) return false;
  if (promo.start_date && new Date(promo.start_date) > now) return false;
  if (promo.end_date && new Date(promo.end_date) < now) return false;
  if (promo.applies_to === 'all') return true;
  if ((promo.applies_to === 'single' || promo.applies_to === 'group' || promo.applies_to === 'products') && promo.product_ids) {
    const ids = promo.product_ids.split(',').map((s) => s.trim()).filter(Boolean);
    return ids.includes(productId);
  }
  return false;
}

/** Calculate discounted price for a single product. Returns best (lowest) price. */
export function applyPromotion(
  originalPriceNum: number,
  productId: string,
  promotions: Promotion[]
): { finalPrice: number; discount: number; appliedPromo: Promotion | null } {
  const now = new Date();
  let bestPrice = originalPriceNum;
  let bestPromo: Promotion | null = null;

  for (const promo of promotions) {
    if (!promotionAppliesTo(promo, productId, now)) continue;

    let discounted: number;
    if (promo.discount_type === 'percentage') {
      discounted = originalPriceNum * (1 - promo.discount_value / 100);
    } else {
      discounted = Math.max(0, originalPriceNum - promo.discount_value);
    }

    if (discounted < bestPrice) {
      bestPrice = discounted;
      bestPromo = promo;
    }
  }

  return {
    finalPrice: Math.round(bestPrice * 100) / 100,
    discount: Math.round((originalPriceNum - bestPrice) * 100) / 100,
    appliedPromo: bestPromo,
  };
}

/** Format price for display (RM X.XX) */
export function formatPrice(num: number): string {
  return `RM ${num.toFixed(2)}`;
}
