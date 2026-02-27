import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { StarRating } from './StarRating';

interface ProductRatingProps {
  productId: string;
  size?: 'sm' | 'md';
  showCount?: boolean;
}

export function ProductRating({ productId, size = 'sm', showCount = true }: ProductRatingProps) {
  const [avgRating, setAvgRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      const [avgResult, countResult] = await Promise.all([
        supabase.rpc('get_product_avg_rating', { p_product_id: productId }),
        supabase
          .from('reviews')
          .select('id', { count: 'exact', head: true })
          .eq('product_id', productId),
      ]);

      if (cancelled) return;

      setAvgRating(typeof avgResult.data === 'number' ? avgResult.data : 0);
      setReviewCount(countResult.count ?? 0);
      setLoaded(true);
    };

    fetch();
    return () => { cancelled = true; };
  }, [productId]);

  if (!loaded || reviewCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={Math.round(avgRating)} size={size} />
      {showCount && (
        <span className="text-xs text-slate-400">
          {avgRating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
}
