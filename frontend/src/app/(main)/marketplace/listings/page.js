'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchMyListings } from '@/lib/listings';
import { useRequireAuth } from '@/lib/auth';

export default function MyListingsPage() {
  const ready = useRequireAuth();
  const [tab, setTab] = useState('active');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    fetchMyListings()
      .then(setListings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [ready]);

  const filtered = listings.filter((l) => l.status === tab);

  if (!ready || loading) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading your listings...</div>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-5">My listings</h1>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('active')} className={`px-4 py-1.5 rounded-full text-sm font-medium ${tab === 'active' ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB]'}`}>
          Active ({listings.filter((l) => l.status === 'active').length})
        </button>
        <button onClick={() => setTab('sold')} className={`px-4 py-1.5 rounded-full text-sm font-medium ${tab === 'sold' ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB]'}`}>
          Sold ({listings.filter((l) => l.status === 'sold').length})
        </button>
      </div>
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-4 rounded-xl border border-[#EEEDFB] p-3 transition hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(108,92,231,0.10)] bg-white"
          >
            <div className="w-16 h-16 rounded-lg bg-[#F4F3FE] shrink-0 flex items-center justify-center text-xs text-[#6C5CE7] text-center px-2 overflow-hidden">
              {item.photos[0] ? (
                <img src={item.photos[0]} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                item.name
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-sm text-[#6C5CE7] font-semibold">{item.price}</p>
              <p className="text-xs text-[#B3AFC9]">Views: {item.views}</p>
            </div>
            <div className="text-right text-xs text-[#8A86A3] flex flex-col justify-between items-end h-full py-1">
              <p>{item.status === 'active' ? 'Active' : 'Sold'}</p>
              <div className="flex gap-3 mt-3">
                <Link href={`/marketplace/${item.id}`} className="font-medium text-[#6C5CE7] hover:underline">
                  View
                </Link>
                <Link href={`/marketplace/${item.id}/edit`} className="font-medium text-[#6C5CE7] hover:underline">
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-[#8A86A3]">Nothing here yet.</p>}
      </div>
    </div>
  );
}
