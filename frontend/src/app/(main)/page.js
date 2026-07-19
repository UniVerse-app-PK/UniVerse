'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ItemCard from '@/components/ItemCard';
import { getUser } from '@/lib/auth';
import { fetchListings } from '@/lib/listings';

const categories = ['Books', 'Electronics', 'Furniture', 'Clothes', 'Cycles', 'Sports', 'Wearables', 'Instruments', 'Misc'];

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setUser(getUser());

    let cancelled = false;
    fetchListings({})
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredItems = listings.filter((item) => item.featured).slice(0, 4);
  const featuredIds = new Set(featuredItems.map((item) => item.id));
  const recentItems = listings.filter((item) => !featuredIds.has(item.id)).slice(0, 4);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Hello, {user?.name || 'there'} 👋</h1>
        <p className="text-[#8A86A3] text-sm mt-1">Have a nice day</p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {categories.map((cat, i) => (
          <Link
            key={cat}
            href={`/marketplace?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              i === 0 ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB] hover:bg-[#F4F3FE]'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {loading && <p className="text-sm text-[#8A86A3]">Loading listings...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Featured</h2>
            <Link href="/marketplace" className="text-sm text-[#6C5CE7] font-medium">See all</Link>
          </div>
          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {featuredItems.map((item) => <ItemCard key={item.id} item={item} />)}
            </div>
          ) : (
            <p className="text-sm text-[#8A86A3] mb-8">No featured items right now.</p>
          )}

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recently added</h2>
            <Link href="/marketplace" className="text-sm text-[#6C5CE7] font-medium">See all</Link>
          </div>
          {recentItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentItems.map((item) => <ItemCard key={item.id} item={item} />)}
            </div>
          ) : (
            <p className="text-sm text-[#8A86A3]">No listings yet — be the first to post!</p>
          )}
        </>
      )}
    </div>
  );
}
