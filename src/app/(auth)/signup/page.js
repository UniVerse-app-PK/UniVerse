'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/AuthCard';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', agree: false });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    router.push('/verify');
  }

  return (
    <AuthCard>
      <h1 className="text-xl font-semibold text-center mb-1">Sign up</h1>
      <p className="text-sm text-[#8A86A3] text-center mb-6">
        Already have an account? <Link href="/login" className="text-[#6C5CE7] font-medium">Log in</Link>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Name</label>
          <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter your name" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">University email</label>
          <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@university.edu.pk" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Phone number</label>
          <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="03xx-xxxxxxx" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Password</label>
          <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Create a strong password" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <label className="flex items-start gap-2 text-xs text-[#8A86A3]">
          <input type="checkbox" required checked={form.agree} onChange={(e) => update('agree', e.target.checked)} className="mt-0.5" />
          By checking the box you agree to our Terms and Conditions.
        </label>
        <button type="submit" className="w-full py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">Create account</button>
      </form>
    </AuthCard>
  );
}
