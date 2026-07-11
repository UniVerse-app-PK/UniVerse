'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/AuthCard';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    router.push('/');
  }

  return (
    <AuthCard>
      <h1 className="text-xl font-semibold text-center mb-1">Sign in to your account</h1>
      <p className="text-sm text-[#8A86A3] text-center mb-6">Enter your email and password</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[#8A86A3]">
            <input type="checkbox" /> Remember me
          </label>
          <Link href="/forgot-password" className="text-[#6C5CE7] font-medium">Forgot password?</Link>
        </div>
        <button type="submit" className="w-full py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">Sign in</button>
      </form>
      <p className="text-sm text-center text-[#8A86A3] mt-6">
        New member? <Link href="/signup" className="text-[#6C5CE7] font-medium">Sign up</Link>
      </p>
    </AuthCard>
  );
}
