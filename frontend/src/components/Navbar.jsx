'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/marketplace?search=${encodeURIComponent(searchVal)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B3AFC9" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        placeholder="Search for electronics, clothes.."
        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]"
      />
    </form>
  );
}

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-[#EEEDFB] bg-white sticky top-0 z-50">
      <div className="w-64 shrink-0 px-6 py-4 flex items-center gap-2 border-r border-[#EEEDFB]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 10L12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
            </svg>
          </div>
          <span className="font-righteous text-xl text-[#6C5CE7]">Uni<span className="text-[#1E1B2E]">Verse</span></span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-between gap-4 px-8 py-4">
        <Suspense fallback={<div className="relative w-full max-w-md bg-[#FAFAFC] h-10 rounded-xl animate-pulse" />}>
          <SearchInput />
        </Suspense>
        <Link href="/notifications" className="w-10 h-10 shrink-0 rounded-xl border border-[#EEEDFB] flex items-center justify-center hover:bg-[#F4F3FE]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1B2E" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </Link>
      </div>
    </header>
  );
}