'use client';

import { useEffect, useState } from 'react';
import type { Promotion } from '@/lib/promotions';

export function usePromotions(): { promotions: Promotion[]; loading: boolean } {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/promotions')
      .then((r) => r.json())
      .then((data) => {
        setPromotions(Array.isArray(data) ? data : []);
      })
      .catch(() => setPromotions([]))
      .finally(() => setLoading(false));
  }, []);

  return { promotions, loading };
}
