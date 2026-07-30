'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function SearchInput({ isExpanded, setIsExpanded }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchVal)}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      /* Removed sm:max-w-md so it stretches fluidly */
      className="relative w-full transition-all duration-300"
    >
      {/* Back button on mobile when expanded */}
      {isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1B2E] hover:text-[#6C5CE7] sm:hidden z-10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Search Icon */}
      {!isExpanded && (
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#B3AFC9" 
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      )}

      {/* Search Input */}
      <input
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        placeholder={isExpanded ? "Search for electronics, clothes.." : "Search..."}
        className={`w-full py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7] transition-all ${
          isExpanded ? 'pl-10 pr-3' : 'pl-9 pr-3 cursor-pointer sm:cursor-text'
        }`}
      />
    </form>
  );
}

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <header className="flex items-center border-b border-[#EEEDFB] bg-white sticky top-0 z-50">
      
      {/* Logo Container - Exact same structure & fixed width */}
      <div 
        className={`px-4 sm:px-6 py-4 items-center gap-2 shrink-0 transition-all duration-300 ${
          isExpanded 
            ? 'hidden sm:flex sm:w-64 sm:border-r sm:border-[#EEEDFB]' 
            : 'flex sm:w-64 border-r-0 sm:border-r border-[#EEEDFB]'
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 10L12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
            </svg>
          </div>
          <span className="font-righteous text-xl text-[#6C5CE7]">
            Uni<span className="text-[#1E1B2E]">Verse</span>
          </span>
        </Link>
      </div>

      {/* Right Content Container: 
          - Maintains exact padding (`px-4 sm:px-8 py-3`) and gap from logo
          - Search area flexes to fill all space up to the right notification button
      */}
      <div className="flex-1 flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-8 py-3">
        <div className="flex-1">
          <Suspense fallback={<div className="relative w-full bg-[#FAFAFC] h-10 rounded-xl animate-pulse" />}>
            <SearchInput isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          </Suspense>
        </div>

        {/* Notification Icon - Now pinned to the far right corner */}
        <Link 
          href="/notifications" 
          className={`w-10 h-10 shrink-0 rounded-xl border border-[#EEEDFB] flex items-center justify-center hover:bg-[#F4F3FE] ml-auto ${
            isExpanded ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1B2E" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </Link>
      </div>
    </header>
  );
}