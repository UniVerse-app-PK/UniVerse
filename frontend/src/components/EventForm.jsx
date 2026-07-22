'use client';

import { useState } from 'react';
import { createEvent, updateEvent } from '@/lib/events';
import { uploadListingPhotos } from '@/lib/listings';

const formCategories = ['Internships', 'Research', 'Courses', 'Societies', 'Other'];

export default function EventForm({ initialData, onSuccess, onCancel }) {
  const isEditMode = !!initialData;
  const [form, setForm] = useState({
    title: initialData?.title || '',
    meta: initialData?.meta || '',
    description: initialData?.description || '',
    url: initialData?.url || '',
    applicationUrl: initialData?.applicationUrl || '',
    whatsapp: initialData?.whatsapp || '',
    org: initialData?.org || '',
    category: initialData?.category || 'Other',
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(initialData?.photo || null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.org.trim()) {
      setError('Title and organization are required.');
      return;
    }
    setPosting(true);
    setError('');
    try {
      let photoUrl = initialData?.photo || '';
      if (photoFile) {
        const urls = await uploadListingPhotos([photoFile]);
        if (urls && urls.length > 0) {
          photoUrl = urls[0];
        }
      } else if (!photoPreview) {
        // photo was removed
        photoUrl = '';
      }
      
      const payload = { ...form, photo: photoUrl };
      
      if (isEditMode) {
        await updateEvent(initialData.id, payload);
      } else {
        await createEvent(payload);
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl border border-[#EEEDFB] space-y-4 w-full bg-white">
      <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Event title" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
      <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Event description" rows={3} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
      <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="Event URL (optional)" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
      <input value={form.applicationUrl} onChange={(e) => setForm((f) => ({ ...f, applicationUrl: e.target.value }))} placeholder="Application Link (optional)" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
      <input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} placeholder="WhatsApp Contact Number or Link (optional)" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
      <input value={form.org} onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))} placeholder="Organization / society" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
      <input value={form.meta} onChange={(e) => setForm((f) => ({ ...f, meta: e.target.value }))} placeholder="Date / deadline info" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
      <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]">
        {formCategories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <div>
        <label className="text-sm font-medium mb-2 block">Event Poster (Optional)</label>
        {photoPreview ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#EEEDFB]">
            <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <label className="w-32 h-32 rounded-xl border border-dashed border-[#CECBF6] flex items-center justify-center text-[#6C5CE7] text-2xl cursor-pointer hover:bg-[#F4F3FE] transition-colors">
            +
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPhotoFile(file);
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />
          </label>
        )}
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <div className="flex gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-[#EEEDFB] text-sm font-medium hover:bg-[#FAFAFC] transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" disabled={posting} className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium disabled:opacity-60 hover:bg-[#5b4cc4] transition-colors">
          {posting ? (isEditMode ? 'Saving...' : 'Posting...') : (isEditMode ? 'Save Changes' : 'Post Event')}
        </button>
      </div>
    </form>
  );
}
