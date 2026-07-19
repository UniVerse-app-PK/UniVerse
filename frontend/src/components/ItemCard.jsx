'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleSavedListing } from '@/lib/listings';
import { getToken } from '@/lib/auth';

export default function ItemCard({ item }) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!getToken()) {
      router.push('/login');
      return;
    }

    if (busy) return;
    setBusy(true);
    try {
      const res = await toggleSavedListing(item.id);
      setIsSaved(res.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const displayPhoto = item.photos && item.photos[0] ? item.photos[0] : null;

  return (
    <Link
      href={`/marketplace/${item.id}`}
      className="group relative rounded-2xl border border-[#EEEDFB] bg-white overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(108,92,231,0.10)]"
    >
      <div className="relative h-36 bg-[#F4F3FE] flex items-center justify-center text-[#CECBF6] text-xs overflow-hidden">
        {item.urgent && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-semibold">Urgent</span>
        )}
        {displayPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayPhoto}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span>image</span>
        )}

        <button
          onClick={toggleSave}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#6C5CE7] hover:scale-110 active:scale-95 transition-all shadow-sm"
          title={isSaved ? 'Remove from saved' : 'Save item'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isSaved ? '#6C5CE7' : 'none'}
            stroke="#6C5CE7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-[#1E1B2E] truncate group-hover:text-[#6C5CE7] transition-colors">{item.name}</p>
        <p className="text-sm text-[#6C5CE7] font-semibold mt-0.5">{item.price}</p>
        <div className="flex items-center gap-1 text-xs text-[#B3AFC9] mt-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
            <circle cx="12" cy="10" r="2"/>
          </svg>
          <span className="truncate">{item.location}</span>
        </div>
      </div>
    </Link>
  );
}
