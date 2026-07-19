'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/lib/auth';
import { changePassword } from '@/lib/account';

export default function ChangePasswordPage() {
  const ready = useRequireAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.currentPassword || !form.newPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-5">Change password</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Current password</label>
          <input type="password" value={form.currentPassword} onChange={(e) => update('currentPassword', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">New password</label>
          <input type="password" value={form.newPassword} onChange={(e) => update('newPassword', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Confirm new password</label>
          <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Password changed successfully.</p>}

        <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium disabled:opacity-60">
          {saving ? 'Saving...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
