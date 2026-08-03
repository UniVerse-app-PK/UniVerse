'use client';

import { useEffect, useState } from 'react';
import { getUser, useRequireAuth } from '@/lib/auth';
import { updateProfile, uploadAvatar } from '@/lib/account';

export default function EditProfilePage() {
  const ready = useRequireAuth();
  const [form, setForm] = useState({ name: '', university: '', phone: '' });
  const [avatar, setAvatar] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const user = getUser();
    setForm({
      name: user?.name || '',
      university: user?.university || '',
      phone: user?.phone || '',
    });
    setAvatar(user?.avatar || '');
  }, [ready]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setError('');
    try {
      const url = await uploadAvatar(file);
      setAvatar(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.university.trim()) {
      setError('Name and university are required.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await updateProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const initials = (form.name || 'U').slice(0, 2).toUpperCase();

  if (!ready) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-5">Edit profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] font-semibold text-lg overflow-hidden shrink-0">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Name</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">University</label>
          <input value={form.university} onChange={(e) => update('university', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Phone</label>
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+92 3XX XXXXXXX" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Profile updated.</p>}

        <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium disabled:opacity-60">
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
