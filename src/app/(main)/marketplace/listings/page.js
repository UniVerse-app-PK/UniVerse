'use client';

import { useState } from 'react';
import { listings } from '@/data/marketplaceData';

export default function MyListingsPage() {
  const [tab, setTab] = useState('active');
  const mine = listings.filter((l) => l.seller === 'Foundry_4');
  const filtered = mine.filter((l) => l.status === tab);

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-5">My listings</h1>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('active')} className={`px-4 py-1.5 rounded-full text-sm font-medium ${tab === 'active' ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB]'}`}>
          Active ({mine.filter((l) => l.status === 'active').length})
        </button>
        <button onClick={() => setTab('sold')} className={`px-4 py-1.5 rounded-full text-sm font-medium ${tab === 'sold' ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB]'}`}>
          Sold ({mine.filter((l) => l.status === 'sold').length})
        </button>
      </div>
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-xl border border-[#EEEDFB] p-3">
            <div className="w-16 h-16 rounded-lg bg-[#F4F3FE] shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-sm text-[#6C5CE7] font-semibold">{item.price}</p>
              <p className="text-xs text-[#B3AFC9]">Views: {item.views}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-[#8A86A3]">Nothing here yet.</p>}
      </div>
    </div>
  );
}
