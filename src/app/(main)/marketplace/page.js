'use client';

import { useState } from 'react';
import ItemCard from '@/components/ItemCard';
import { categories, listings } from '@/data/marketplaceData';

export default function MarketplacePage() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? listings : listings.filter((l) => l.category === active);

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
      {filtered.length === 0 && <p className="text-sm text-[#8A86A3]">No items in this category yet.</p>}
    </div>
  );
}
