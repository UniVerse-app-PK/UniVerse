'use client';

import { useEffect, useState } from 'react';
import { getUser, useRequireAuth, refreshUserSession } from '@/lib/auth';
import { unsubscribePremium } from '@/lib/account';

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
  const [showQR, setShowQR] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (!ready) return;
    setUser(getUser());
  }, [ready]);

  async function handleSubscribe() {
    setShowQR(true);
  }

  async function handleCheckStatus() {
    setBusy(true);
    setError('');
    setStatusMsg('');
    try {
      const updated = await refreshUserSession();
      setUser(updated);
      if (updated.isPremium) {
        setStatusMsg('Success! Your account has been upgraded to Premium.');
        setShowQR(false);
      } else {
        setError('Premium is not active yet. Please complete the payment and wait for admin approval.');
      }
    } catch (err) {
      setError(err.message || 'Failed to check status');
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

  if (showQR) {
    return (
      <div className="p-8 max-w-xl">
        <button
          onClick={() => {
            setShowQR(false);
            setError('');
            setStatusMsg('');
          }}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8A86A3] hover:text-[#6C5CE7] transition-colors"
        >
          ← Back to Premium Perks
        </button>

        <div className="rounded-3xl bg-white border border-[#EEEDFB] shadow-sm p-6 text-center">
          <h2 className="text-xl font-bold text-[#1E1B4B] mb-2">Scan to Pay</h2>
          <p className="text-sm text-[#8A86A3] mb-6">
            Scan the QR code below using your banking app to make the payment. Once done, send the payment receipt to the administrator via WhatsApp for verification.
          </p>

          <div className="relative mx-auto w-64 h-64 mb-6 rounded-2xl overflow-hidden border border-[#EEEDFB] p-2 bg-[#FAFAFC] flex items-center justify-center">
            <img
              src="/payment_qr_code.jpg"
              alt="Payment QR Code"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="bg-[#FAFAFC] rounded-2xl p-4 text-left mb-6 space-y-2 border border-[#F4F3FE]">
            <div className="flex justify-between text-xs">
              <span className="text-[#8A86A3]">Amount</span>
              <span className="font-bold text-[#1E1B4B]">Rs. 500.00 / month</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8A86A3]">Method</span>
              <span className="font-semibold text-[#1E1B4B]">Bank Transfer / Scan to Pay</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8A86A3]">Reference</span>
              <span className="font-semibold text-[#6C5CE7]">{user?.email}</span>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
          {statusMsg && <p className="text-xs text-green-600 mb-4">{statusMsg}</p>}

          <div className="space-y-3">
            <a
              href={`https://wa.me/923331567940?text=${encodeURIComponent(
                `Hello Admin, I have made the payment for UniVerse Premium.\n\nUser: ${user?.name}\nEmail: ${user?.email}\n\nAttached is my payment receipt.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20ba5a] transition-colors shadow-sm cursor-pointer"
            >
              Send receipt via WhatsApp
            </a>

            <button
              onClick={handleCheckStatus}
              disabled={busy}
              className="w-full py-3 rounded-xl bg-[#6C5CE7] text-white text-sm font-semibold hover:bg-[#5b4cd8] disabled:opacity-60 transition-colors shadow-sm cursor-pointer"
            >
              {busy ? 'Checking Status...' : 'Check Activation Status'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="rounded-3xl bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] text-white p-6 mb-6">
        <h1 className="text-xl font-bold mb-1">UniVerse Premium</h1>
        <p className="text-sm text-white/80 mb-4">Unlock unlimited listings, featured/urgent boosts, and a verified badge.</p>
        {user?.isPremium ? (
          <div className="flex items-center gap-2 text-sm font-medium bg-white/15 rounded-xl px-4 py-2.5 w-fit">
            ✓ Subscribed
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={busy}
            className="px-5 py-2.5 rounded-xl bg-white text-[#6C5CE7] text-sm font-semibold hover:bg-white/90 disabled:opacity-60 cursor-pointer"
          >
            Subscribe Now
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
        <button onClick={handleUnsubscribe} disabled={busy} className="text-sm text-red-500 font-medium disabled:opacity-60 cursor-pointer">
          Cancel Premium
        </button>
      )}
    </div>
  );
}
