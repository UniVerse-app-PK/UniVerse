'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';
import { fetchNotifications } from '@/lib/notifications';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setChecked(true);
    if (!currentUser) return;

    let cancelled = false;
    function loadCount() {
      fetchNotifications()
        .then((list) => {
          if (!cancelled) setUnreadCount(list.filter((n) => !n.read).length);
        })
        .catch(() => {});
    }
    loadCount();
    const interval = setInterval(loadCount, 20000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 px-8 py-4 border-b border-[#EEEDFB] bg-white sticky top-0 z-10">
      <div className="relative w-full max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B3AFC9" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" />
        </svg>
        <input placeholder="Search for electronics, clothes.." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
      </div>

      {checked && (
        user ? (
          <Link href="/notifications" className="relative w-10 h-10 shrink-0 rounded-xl border border-[#EEEDFB] flex items-center justify-center hover:bg-[#F4F3FE]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1B2E" strokeWidth="2">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/login" className="px-4 py-2 rounded-xl border border-[#EEEDFB] text-sm font-medium hover:bg-[#F4F3FE]">Sign in</Link>
            <Link href="/signup" className="px-4 py-2 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium hover:bg-[#5b4cc4]">Sign up</Link>
          </div>
        )
      )}
    </header>
  );
}
