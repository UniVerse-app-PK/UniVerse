'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/AuthCard';
import { api } from '@/lib/api';
import { saveSession, getPendingEmail } from '@/lib/auth';

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const email = typeof window !== 'undefined' ? getPendingEmail() : '';

  async function handleVerify(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/verify', { email, otp });
      saveSession(data.token, data.user);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-1">Verify your email</h1>
        <p className="text-sm text-[#8A86A3] mb-6">
          A 6-digit code has been sent to <span className="font-medium">{email || 'your email'}</span>.
          Check your inbox (and spam folder).
        </p>
        <form onSubmit={handleVerify} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Verification code</label>
            <input
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm text-center tracking-widest focus:outline-none focus:border-[#6C5CE7]"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {info && <p className="text-sm text-[#0F6E56] text-center">{info}</p>}
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium disabled:opacity-60">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <p className="text-sm text-[#8A86A3] mt-6">
          <Link href="/login" className="text-[#6C5CE7] font-medium">Back to sign in</Link>
        </p>
      </div>
    </AuthCard>
  );
}
