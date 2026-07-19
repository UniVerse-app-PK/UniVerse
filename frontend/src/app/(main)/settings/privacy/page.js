'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, useRequireAuth } from '@/lib/auth';
import { deleteAccount } from '@/lib/account';

export default function PrivacyPage() {
  const router = useRouter();
  const ready = useRequireAuth();
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      'Delete your account permanently? This removes your profile, listings, and chats. This cannot be undone.'
    );
    if (!confirmed) return;

    setDeleting(true);
    setError('');
    try {
      await deleteAccount();
      clearSession();
      router.push('/login');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (!ready) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-5">Privacy and security</h1>

      <div className="rounded-2xl border border-[#EEEDFB] p-5 space-y-3 text-sm text-[#8A86A3] mb-6">
        <p>Your name, university, and photos are visible to other students when you post a listing or leave a review.</p>
        <p>Your phone number is only shared with someone you choose to chat with about a listing.</p>
        <p>Passwords are stored securely (hashed) and are never visible to anyone, including us.</p>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h2 className="text-sm font-semibold text-red-600 mb-1">Danger zone</h2>
        <p className="text-sm text-red-500 mb-4">
          Deleting your account permanently removes your profile, listings, chats, and notifications. This cannot be undone.
        </p>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-60"
        >
          {deleting ? 'Deleting...' : 'Delete my account'}
        </button>
      </div>
    </div>
  );
}
