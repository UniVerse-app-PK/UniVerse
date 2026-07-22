'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/AuthCard';
import { api } from '@/lib/api';
import { savePendingEmail } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', university: '', phone: '', password: '', agree: false });
  const [emailType, setEmailType] = useState('nust');
  const [emailUsername, setEmailUsername] = useState('');
  const [emailSubdomain, setEmailSubdomain] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    let finalEmail = '';
    if (emailType === 'nust') {
      if (!emailUsername.trim() || !emailSubdomain.trim()) {
        setError('Please enter your full university email');
        return;
      }
      finalEmail = `${emailUsername.trim()}@${emailSubdomain.trim()}.nust.edu.pk`;
    } else {
      if (!emailUsername.trim()) {
        setError('Please enter your username');
        return;
      }
      finalEmail = `${emailUsername.trim()}@seecs.edu.pk`;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: finalEmail,
        university: form.university,
        phone: form.phone,
        password: form.password,
      });
      savePendingEmail(finalEmail);
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
          <label className="text-sm font-medium mb-2 block">University email</label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="emailType" value="nust" checked={emailType === 'nust'} onChange={() => setEmailType('nust')} className="accent-[#6C5CE7]" />
              Students & Faculty
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="emailType" value="seecs" checked={emailType === 'seecs'} onChange={() => setEmailType('seecs')} className="accent-[#6C5CE7]" />
              SEECS Faculty
            </label>
          </div>
          
          {emailType === 'nust' ? (
            <div className="flex items-center w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] focus-within:border-[#6C5CE7]">
              <input type="text" required value={emailUsername} onChange={(e) => setEmailUsername(e.target.value)} placeholder="username" className="w-2/5 bg-transparent text-sm focus:outline-none" />
              <span className="text-sm text-gray-500 px-1 font-medium">@</span>
              <input type="text" required value={emailSubdomain} onChange={(e) => setEmailSubdomain(e.target.value)} placeholder="domain" className="w-1/4 bg-transparent text-sm focus:outline-none text-center" />
              <span className="text-sm text-gray-500 whitespace-nowrap pl-1">.nust.edu.pk</span>
            </div>
          ) : (
            <div className="flex items-center w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] focus-within:border-[#6C5CE7]">
              <input type="text" required value={emailUsername} onChange={(e) => setEmailUsername(e.target.value)} placeholder="username" className="flex-1 bg-transparent text-sm focus:outline-none" />
              <span className="text-sm text-gray-500 whitespace-nowrap pl-2 border-l border-gray-200">@seecs.edu.pk</span>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">University</label>
          <input required value={form.university} onChange={(e) => update('university', e.target.value)} placeholder="e.g. NUST Islamabad" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
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
