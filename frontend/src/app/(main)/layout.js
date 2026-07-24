'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { getUser, refreshUserSession } from '@/lib/auth';

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false); // Controls the mobile sidebar state

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const prevUser = getUser();
        if (!prevUser) return;
        const freshUser = await refreshUserSession();
        if (prevUser.isPremium !== freshUser.isPremium) {
          window.location.reload();
        }
      } catch (err) {
        console.error('Failed to sync user premium status', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    /* 1. Lock screen height and hide overflow on the root container */
    <div className="h-screen max-w-[1440px] mx-auto flex flex-col overflow-hidden relative bg-[#FAFAFC]">
      
      {/* 2. Navbar stays anchored at the top */}
      <Navbar />

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-5 right-5 z-50 bg-[#6C5CE7] text-white p-3 rounded-full shadow-lg hover:bg-[#5A4CD4] transition-colors"
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>

      {/* 3. Main area fills remaining height and enables inner scrolling */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Dimming Backdrop Overlay */}
        {isOpen && (
          <div 
            onClick={() => setIsOpen(false)} 
            className="md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-200"
          />
        )}

        {/* Fixed/Sticky Sidebar */}
        <Sidebar isOpen={isOpen} />

        {/* 4. Page content scroll container */}
        <main className="flex-1 overflow-y-auto md:pl-64">
          {children}
        </main>
      </div>
    </div>
  );
}