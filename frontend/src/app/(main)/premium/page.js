'use client';

import { useEffect, useState } from 'react';
import { getUser, useRequireAuth } from '@/lib/auth';
import { subscribePremium, unsubscribePremium } from '@/lib/account';

const activePerks = [
  { title: 'Featured Listing', desc: 'Pin your items to the Home page Featured section.' },
  { title: 'Urgent Sale Badge', desc: 'Mark an item as an urgent sale so buyers notice it first.' },
  { title: 'Verified Seller Badge', desc: 'A checkmark next to your name across the app.' },
  { title: 'More Listings Per Month', desc: 'Free accounts are capped at 5 listings/month — Premium is unlimited.' },
];

const comingSoonPerks = [
  { title: 'Profile Page for Business', desc: 'A dedicated storefront-style profile layout.' },
  { title: 'Custom Themes', desc: 'Pick an accent color for your own view of the app.' },
];

export default function PremiumPage() {
  const ready = useRequireAuth();
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    setUser(getUser());
  }, [ready]);

  async function handleSubscribe() {
    setBusy(true);
    setError('');
    try {
      const updated = await subscribePremium();
      setUser(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUnsubscribe() {
    if (!window.confirm('Cancel Premium? You will lose featured/urgent listings, your verified badge, and drop back to the 5 listings/month limit.')) return;
    setBusy(true);
    setError('');
    try {
      const updated = await unsubscribePremium();
      setUser(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="rounded-3xl bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] text-white p-6 mb-6">
        <h1 className="text-xl font-bold mb-1">UniVerse Premium</h1>
        <p className="text-sm text-white/80 mb-4">Unlock unlimited listings, featured/urgent boosts, and a verified badge.</p>
        {user?.isPremium ? (
          <div className="flex items-center gap-2 text-sm font-medium bg-white/15 rounded-xl px-4 py-2.5 w-fit">
            ✓ You are on Premium
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={busy}
            className="px-5 py-2.5 rounded-xl bg-white text-[#6C5CE7] text-sm font-semibold hover:bg-white/90 disabled:opacity-60"
          >
            {busy ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <h2 className="text-sm font-semibold text-[#8A86A3] uppercase tracking-wide mb-3">Included with Premium</h2>
      <div className="space-y-2 mb-6">
        {activePerks.map((perk) => (
          <div key={perk.title} className="rounded-xl border border-[#EEEDFB] p-4 flex items-start gap-3">
            <span className={`mt-0.5 text-sm ${user?.isPremium ? 'text-[#0F6E56]' : 'text-[#CECBF6]'}`}>{user?.isPremium ? '✓' : '○'}</span>
            <div>
              <p className="text-sm font-medium">{perk.title}</p>
              <p className="text-xs text-[#8A86A3] mt-0.5">{perk.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-[#8A86A3] uppercase tracking-wide mb-3">Coming soon</h2>
      <div className="space-y-2 mb-6">
        {comingSoonPerks.map((perk) => (
          <div key={perk.title} className="rounded-xl border border-[#EEEDFB] p-4 opacity-60">
            <p className="text-sm font-medium">{perk.title}</p>
            <p className="text-xs text-[#8A86A3] mt-0.5">{perk.desc}</p>
          </div>
        ))}
      </div>

      {user?.isPremium && (
        <button onClick={handleUnsubscribe} disabled={busy} className="text-sm text-red-500 font-medium disabled:opacity-60">
          {busy ? 'Cancelling...' : 'Cancel Premium'}
        </button>
      )}
    </div>
  );
}
