'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  function handleLogout() {
    router.push('/login');
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-5">Settings</h1>

      <div className="border border-[#EEEDFB] rounded-2xl divide-y divide-[#EEEDFB] mb-6">

        <Link
          href="/profile/edit"
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]"
        >
          Edit profile
          <span className="text-[#B3AFC9]">&rsaquo;</span>
        </Link>

        <Link
          href="/settings/change-password"
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]"
        >
          Change password
          <span className="text-[#B3AFC9]">&rsaquo;</span>
        </Link>

        <Link
          href="/settings/privacy-security"
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]"
        >
          Privacy and security
          <span className="text-[#B3AFC9]">&rsaquo;</span>
        </Link>

        <Link
          href="/settings/premium"
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]"
        >
          Premium perks
          <span className="text-[#B3AFC9]">&rsaquo;</span>
        </Link>

        <Link
  href="/settings/language"
  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]"
>
  Language
  <span className="text-[#B3AFC9]">&rsaquo;</span>
</Link>
        <Link
          href="/about"
          className="flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]"
        >
          About UniVerse
          <span className="text-[#B3AFC9]">&rsaquo;</span>
        </Link>

      </div>

      <button
        onClick={handleLogout}
        className="text-sm font-medium text-[#D85A30]"
      >
        Log out
      </button>

    </div>
  );
}