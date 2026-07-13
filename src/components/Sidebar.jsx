'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/', icon: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M3 12l9-9 9 9" /><path d="M5 10v10h14V10" />
    </svg>
  )},
  { label: 'Market', href: '/marketplace', icon: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M3 9l1-5h16l1 5" /><path d="M4 9h16v10H4z" /><path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  )},
  { label: 'Sell an item', href: '/marketplace/sell', icon: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
    </svg>
  )},
  { label: 'Events', href: '/events', icon: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )},
  { label: 'Chats', href: '/chats', icon: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )},
];

const accountItems = [
  { label: 'Profile', href: '/profile', icon: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  )},
  { label: 'Settings', href: '/settings', icon: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.2.6.7 1.1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  )},
  { label: 'About UniVerse', href: '/about', icon: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" />
    </svg>
  )},
];

const allItems = [...navItems, ...accountItems];

function getActiveHref(pathname) {
  if (pathname === '/') return '/';
  const matches = allItems.filter((i) => i.href !== '/' && pathname.startsWith(i.href));
  if (matches.length === 0) return null;
  return matches.reduce((a, b) => (b.href.length > a.href.length ? b : a)).href;
}

function NavLink({ item, activeHref }) {
  const isActive = item.href === activeHref;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive ? 'bg-[#6C5CE7] text-white [&_svg]:stroke-white' : 'text-[#1E1B2E] hover:bg-[#F4F3FE] [&_svg]:stroke-[#6C5CE7]'
      }`}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <aside className="w-64 shrink-0 border-r border-[#EEEDFB] bg-white flex flex-col h-[calc(100vh-69px)] sticky top-[69px]">

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-[#B3AFC9] uppercase tracking-wide mb-2">Menu</p>
        {navItems.map((item) => <NavLink key={item.href} item={item} activeHref={activeHref} />)}

        <p className="px-3 text-xs font-semibold text-[#B3AFC9] uppercase tracking-wide mt-5 mb-2">Account</p>
        {accountItems.map((item) => <NavLink key={item.href} item={item} activeHref={activeHref} />)}
      </nav>

      <div className="p-4 border-t border-[#EEEDFB]">
        <Link href="/profile" className="flex items-center gap-3 px-2 hover:opacity-80">
          <div className="w-9 h-9 rounded-full bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] font-semibold text-sm">F4</div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">Foundry_4</p>
            <p className="text-xs text-[#8A86A3] truncate">NUST, Islamabad</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}