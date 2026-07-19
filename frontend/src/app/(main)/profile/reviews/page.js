'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/auth';
import { fetchMyListings } from '@/lib/listings';

export default function ReviewsPage() {
  const ready = useRequireAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    fetchMyListings()
      .then((listings) => {
        const all = listings.flatMap((l) =>
          (l.reviews || []).map((r) => ({ ...r, listingName: l.name }))
        );
        setReviews(all);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [ready]);

  if (!ready || loading) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading reviews...</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-5">My reviews</h1>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-[#EEEDFB] p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">{r.user}</p>
              <span className="text-xs text-[#0F6E56] font-medium">{'★'.repeat(Math.round(r.score))}</span>
            </div>
            <p className="text-xs text-[#B3AFC9] mb-1">on {r.listingName}</p>
            <p className="text-sm text-[#8A86A3]">{r.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-[#8A86A3]">No reviews yet on your listings.</p>}
      </div>
    </div>
  );
}
