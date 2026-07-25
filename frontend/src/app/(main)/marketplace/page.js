'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ItemCard from '@/components/ItemCard';
import { categories } from '@/data/marketplaceData';
import { fetchListings } from '@/lib/listings';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [active, setActive] = useState(initialCategory);
  const searchQuery = searchParams.get('search') || '';
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchListings({ category: active, search: searchQuery })
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
  }, [active, searchQuery]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-5">Market</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              active === cat ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB] hover:bg-[#F4F3FE]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-[#8A86A3]">Loading listings...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {listings.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
      {!loading && !error && listings.length === 0 && (
        <p className="text-sm text-[#8A86A3]">No items in this category yet.</p>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#8A86A3]">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
