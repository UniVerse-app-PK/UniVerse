'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between gap-4 px-8 py-4 border-b border-[#EEEDFB] bg-white sticky top-0 z-10">
      <div className="relative w-full max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B3AFC9" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" />
        </svg>
        <input placeholder="Search for electronics, clothes.." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
      </div>
      <Link href="/notifications" className="w-10 h-10 shrink-0 rounded-xl border border-[#EEEDFB] flex items-center justify-center hover:bg-[#F4F3FE]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1B2E" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
      </Link>
    </header>
  );
}
