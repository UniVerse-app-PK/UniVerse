'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ItemCard from '@/components/ItemCard';
import BannerAd from '@/components/BannerAd';
import { categories } from '@/data/marketplaceData';
import { fetchListings } from '@/lib/listings';

/**
 * Inserts urgent items at random positions within the non-urgent items array,
 * preserving the order of non-urgent items (sorted by time from the API).
 */
function interleaveUrgent(items) {
  const urgent = items.filter((item) => item.urgent);
  const normal = items.filter((item) => !item.urgent);

  // Clone so we don't mutate
  const result = [...normal];

  urgent.forEach((item) => {
    const insertAt = Math.floor(Math.random() * (result.length + 1));
    result.splice(insertAt, 0, item);
  });

  return result;
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const [active, setActive] = useState(initialCategory);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');

    // Pass search query to the API so the backend does the filtering
    fetchListings({ search: searchQuery || undefined })
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
  }, [searchQuery]);

  // Sync category filter when URL param changes
  useEffect(() => {
    setActive(searchParams.get('category') || 'All');
  }, [searchParams]);

  // Derive featured & recently-added sections (memoised to avoid recalc on re-renders)
  const { featuredItems, recentItems } = useMemo(() => {
    // Apply category filter
    const filtered =
      active === 'All'
        ? listings
        : listings.filter((item) => item.category === active);

    const featured = filtered.filter((item) => item.featured);
    const featuredIds = new Set(featured.map((item) => item.id));

    // Non-featured items, with urgent ones randomly scattered
    const nonFeatured = filtered.filter((item) => !featuredIds.has(item.id));
    const recent = interleaveUrgent(nonFeatured);

    return { featuredItems: featured, recentItems: recent };
  }, [listings, active]);

  // Split recently-added into rows of 4 for the BannerAd insertion
  const recentRows = [];
  for (let i = 0; i < recentItems.length; i += 4) {
    recentRows.push(recentItems.slice(i, i + 4));
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-5">Market</h1>

      {/* Search results banner */}
      {searchQuery && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-[#8A86A3]">
            Showing results for{' '}
          </span>
          <span className="text-sm font-semibold text-[#6C5CE7]">&ldquo;{searchQuery}&rdquo;</span>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              active === cat
                ? 'bg-[#6C5CE7] text-white'
                : 'border border-[#EEEDFB] hover:bg-[#F4F3FE]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-sm text-[#8A86A3]">Loading listings...</p>
      )}


      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <>
          {/* ── Featured section ── */}
          {featuredItems.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Featured</h2>
                <span className="text-xs text-[#6C5CE7] font-medium bg-[#F4F3FE] px-2 py-0.5 rounded-full">
                  ✦ Premium picks
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* ── Recently Added section ── */}
          {recentItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Recently Added</h2>
              </div>

              <div className="space-y-6">
                {recentRows.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {row.map((item) => (
                        <ItemCard key={item.id} item={item} />
                      ))}
                    </div>

                    {/* Insert BannerAd after the first row */}
                    {rowIndex === 0 && recentRows.length > 1 && (
                      <div className="mt-6">
                        <BannerAd />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {featuredItems.length === 0 && recentItems.length === 0 && (
            <p className="text-sm text-[#8A86A3]">
              No items in this category yet.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-[#8A86A3]">
          Loading marketplace...
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}