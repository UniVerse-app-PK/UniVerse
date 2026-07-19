'use client';

import { useState, useEffect } from 'react';
import ItemCard from '@/components/ItemCard';
import { fetchSavedListings } from '@/lib/listings';
import { useRequireAuth } from '@/lib/auth';

export default function SavedItemsPage() {
  const ready = useRequireAuth();
  const [savedItems, setSavedItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    fetchSavedListings()
      .then(setSavedItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoaded(true));
  }, [ready]);

  if (!ready || !loaded) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-5">Saved items</h1>
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-48 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-5">Saved items</h1>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {savedItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[#EEEDFB] rounded-2xl max-w-md">
          <svg className="mx-auto h-12 w-12 text-[#B3AFC9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-[#1E1B2E]">No saved items</h3>
          <p className="mt-1 text-xs text-[#8A86A3]">Tap the heart icon on any listing to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {savedItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
