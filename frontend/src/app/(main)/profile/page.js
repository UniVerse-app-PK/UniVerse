'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUser, useRequireAuth } from '@/lib/auth';
import { fetchMyListings } from '@/lib/listings';

export default function ProfilePage() {
  const ready = useRequireAuth();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    setUser(getUser());
    fetchMyListings()
      .then(setListings)
      .finally(() => setLoading(false));
  }, [ready]);

  const displayName = user?.name || 'Guest';
  const initials = displayName.slice(0, 2).toUpperCase();

  const allReviews = listings.flatMap((l) => l.reviews || []);
  const reviewCount = allReviews.length;
  const avgRating = reviewCount > 0
    ? (allReviews.reduce((sum, r) => sum + r.score, 0) / reviewCount).toFixed(1)
    : null;

  if (!ready) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] font-semibold text-lg overflow-hidden shrink-0">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-1.5">
            {displayName}
            {user?.verifiedSeller && (
              <span title="Verified seller" className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#6C5CE7] text-white text-[10px]">✓</span>
            )}
          </h1>
          <p className="text-sm text-[#8A86A3]">{user?.university || ''}</p>
          {avgRating && (
            <p className="text-sm text-[#0F6E56] font-medium mt-0.5">★ {avgRating} ({reviewCount} reviews)</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl bg-[#F4F3FE] p-4 text-center">
          <p className="text-2xl font-semibold text-[#6C5CE7]">{loading ? '--' : listings.length}</p>
          <p className="text-sm text-[#8A86A3]">Listings</p>
        </div>
        <div className="rounded-xl bg-[#F4F3FE] p-4 text-center">
          <p className="text-2xl font-semibold text-[#6C5CE7]">{loading ? '--' : reviewCount}</p>
          <p className="text-sm text-[#8A86A3]">Reviews</p>
        </div>
      </div>
      <div className="border border-[#EEEDFB] rounded-2xl divide-y divide-[#EEEDFB]">
        <Link href="/marketplace/listings" className="flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]">My listings <span className="text-[#B3AFC9]">&rsaquo;</span></Link>
        <Link href="/marketplace/saved" className="flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]">Saved items <span className="text-[#B3AFC9]">&rsaquo;</span></Link>
        <Link href="/profile/reviews" className="flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]">My reviews <span className="text-[#B3AFC9]">&rsaquo;</span></Link>
      </div>
    </div>
  );
}
