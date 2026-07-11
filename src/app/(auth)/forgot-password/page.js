'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthCard from '@/components/AuthCard';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <AuthCard>
      <h1 className="text-xl font-semibold text-center mb-1">Forgot password</h1>
      <p className="text-sm text-[#8A86A3] text-center mb-6">Enter your email and we'll send a reset link.</p>
      {sent ? (
        <p className="text-sm text-center text-[#0F6E56] bg-[#E1F5EE] rounded-xl p-4">
          Reset link sent to {email}. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">Send reset link</button>
        </form>
      )}
      <p className="text-sm text-center text-[#8A86A3] mt-6">
        <Link href="/login" className="text-[#6C5CE7] font-medium">Back to sign in</Link>
      </p>
    </AuthCard>
  );
}
