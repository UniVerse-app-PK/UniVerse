'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false); // Controls the mobile sidebar state
  return (
    <div className="min-h-screen max-w-[1440px] mx-auto flex flex-col relative">
      <Navbar />
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden fixed bottom-5 right-5 z-50 bg-[#6C5CE7] text-white p-3 rounded-full shadow-lg hover:bg-[#5A4CD4] transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
          /* Close X Icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
          /* Menu Hamburger Icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>

      <div className="flex flex-1 min-h-0">
        {/* Dimming Backdrop Overlay - Only active on mobile when isOpen is true */}
          {isOpen && (
      <div 
        onClick={() => setIsOpen(false)} 
        className="md:hidden fixed inset-0 bg-black/0 z-30 transition-opacity duration-200"
      />
      )}
      <Sidebar isOpen={isOpen} />
      <main className="flex-1 md:pl-64">{children}</main>
      </div>
    </div>
  );
}
