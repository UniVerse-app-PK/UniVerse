'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/AuthCard';
import { api } from '@/lib/api';
import { savePendingEmail } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', university: '', phone: '', password: '', agree: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        university: form.university,
        phone: form.phone,
        password: form.password,
      });
      savePendingEmail(form.email);
      router.push('/verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          <label className="text-sm font-medium mb-1.5 block">University</label>
          <input required value={form.university} onChange={(e) => update('university', e.target.value)} placeholder="e.g. UET Taxila" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
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
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium disabled:opacity-60">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthCard>
  );
}
