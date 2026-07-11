'use client';

import Link from 'next/link';
import AuthCard from '@/components/AuthCard';

export default function VerifyPage() {
  return (
    <AuthCard>
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-1">Verify your email</h1>
        <p className="text-sm text-[#8A86A3] mb-6">We've sent a verification link to your inbox.</p>
        <a href="mailto:" className="block w-full py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium mb-3">Open email app</a>
        <button className="text-sm text-[#6C5CE7] font-medium">Resend email</button>
        <p className="text-sm text-[#8A86A3] mt-6">
          <Link href="/login" className="text-[#6C5CE7] font-medium">Back to sign in</Link>
        </p>
      </div>
    </AuthCard>
  );
}
