'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = ['Books', 'Electronics', 'Furniture', 'Clothes', 'Cycles', 'Sports', 'Wearables', 'Instruments', 'Misc'];
const conditions = ['New', 'Like new', 'Good condition', 'Fair condition'];
const MAX_PHOTOS = 5;

export default function SellForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ title: '', category: '', description: '', price: '', condition: '', location: '' });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handlePhotoSelect(e) {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remaining).map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...toAdd]);
    e.target.value = '';
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function next() { setStep((s) => Math.min(s + 1, 3)); }
  function back() { setStep((s) => Math.max(s - 1, 1)); }
  function handlePost() { router.push('/marketplace/listings'); }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-1">Sell an item</h1>
      <p className="text-sm text-[#8A86A3] mb-6">List something for other students to find.</p>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center ${step >= s ? 'bg-[#6C5CE7] text-white' : 'bg-[#EEEDFB] text-[#B3AFC9]'}`}>{s}</div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-[#6C5CE7]' : 'bg-[#EEEDFB]'}`}></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Photos ({photos.length}/{MAX_PHOTOS})</label>
            <div className="flex gap-3 flex-wrap">
              {photos.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#EEEDFB]">
                  <img src={src} alt={`photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <label className="w-20 h-20 rounded-xl border border-dashed border-[#CECBF6] flex items-center justify-center text-[#6C5CE7] text-xl cursor-pointer hover:bg-[#F4F3FE]">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title</label>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Enter title" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={next} className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe your item..." rows={3} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Price</label>
            <input value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="Enter price" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Condition</label>
            <select value={form.condition} onChange={(e) => update('condition', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]">
              <option value="">Select condition</option>
              {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Location</label>
            <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Select your location" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="px-6 py-2.5 rounded-xl border border-[#EEEDFB] text-sm font-medium">Back</button>
            <button onClick={next} className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EEEDFB] p-5">
            {photos[0] && (
              <img src={photos[0]} alt="preview" className="w-full h-40 object-cover rounded-xl mb-4" />
            )}
            <p className="font-semibold">{form.title || 'Untitled item'}</p>
            <p className="text-[#6C5CE7] font-semibold mt-1">{form.price ? `Rs. ${form.price}` : 'Rs. --'}</p>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div><p className="text-[#B3AFC9]">Category</p><p className="font-medium mt-0.5">{form.category || '--'}</p></div>
              <div><p className="text-[#B3AFC9]">Condition</p><p className="font-medium mt-0.5">{form.condition || '--'}</p></div>
              <div><p className="text-[#B3AFC9]">Location</p><p className="font-medium mt-0.5">{form.location || '--'}</p></div>
            </div>
          </div>
          <div className="rounded-2xl bg-[#F4F3FE] p-4 space-y-2 text-sm">
            <p className="font-medium mb-1">Make your item sell faster with</p>
            <label className="flex items-center gap-2"><input type="checkbox" /> Featured listing (1 day)</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Urgent sale badge</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Verified seller badge</label>
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="px-6 py-2.5 rounded-xl border border-[#EEEDFB] text-sm font-medium">Back</button>
            <button onClick={handlePost} className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">Post item</button>
          </div>
        </div>
      )}
    </div>
  );
}