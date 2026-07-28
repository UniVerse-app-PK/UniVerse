'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createListing, updateListing, uploadListingPhotos } from '@/lib/listings';
import { getToken, getUser } from '@/lib/auth';

const categories = ['Books', 'Electronics', 'Furniture', 'Clothes', 'Cycles', 'Sports', 'Wearables', 'Instruments', 'Misc'];
const OTHER_VALUE = '__other__';
const conditions = ['New', 'Like new', 'Good condition', 'Fair condition'];
const MAX_PHOTOS = 5;

export default function SellForm({ editId, initialData }) {
  const router = useRouter();
  const isEditMode = !!editId;

  const startsWithKnownCategory = initialData ? categories.includes(initialData.category) : true;

  const [step, setStep] = useState(1);
  // Each photo entry is { url, file }. `file` is set for a newly picked
  // local image (not uploaded yet); `url` is either a local blob preview
  // or, for existing listing photos, the real Cloudinary URL already.
  const [photos, setPhotos] = useState(
    (initialData?.photos || []).map((url) => ({ url, file: null }))
  );
  const [form, setForm] = useState({
    title: initialData?.name || '',
    category: initialData ? (startsWithKnownCategory ? initialData.category : OTHER_VALUE) : '',
    description: initialData?.description || '',
    price: initialData?.rawPrice != null ? String(initialData.rawPrice) : '',
    condition: initialData?.condition || '',
    location: initialData?.location || '',
  });
  const [customCategory, setCustomCategory] = useState(
    initialData && !startsWithKnownCategory ? initialData.category : ''
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [urgent, setUrgent] = useState(initialData?.urgent || false);
  const isPremium = !!getUser()?.isPremium;
  const [error, setError] = useState('');
  const [stepError, setStepError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingMsg, setUploadingMsg] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handlePhotoSelect(e) {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remaining).map((file) => ({ url: URL.createObjectURL(file), file }));
    setPhotos((prev) => [...prev, ...toAdd]);
    e.target.value = '';
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  const finalCategory = form.category === OTHER_VALUE ? customCategory.trim() : form.category;

  function step1Valid() {
    return form.title.trim() && finalCategory;
  }

  function step2Valid() {
    const priceNum = Number(form.price);
    return form.description.trim() && form.price !== '' && priceNum > 0 && form.condition && form.location.trim();
  }

  function next() {
    if (step === 1 && !step1Valid()) {
      setStepError('Please fill in title and category before continuing.');
      return;
    }
    if (step === 2 && !step2Valid()) {
      setStepError('Please fill in all fields with a valid price before continuing.');
      return;
    }
    setStepError('');
    setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setStepError('');
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handlePost() {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    if (!step1Valid() || !step2Valid()) {
      setError('Please go back and fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Upload any newly picked local files to Cloudinary first, then
      // splice the returned URLs back in at the right positions so the
      // final photo order matches what's shown in the preview.
      const newFiles = photos.filter((p) => p.file).map((p) => p.file);
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        setUploadingMsg('Uploading photos...');
        uploadedUrls = await uploadListingPhotos(newFiles);
      }
      let uploadIndex = 0;
      const finalPhotos = photos.map((p) => (p.file ? uploadedUrls[uploadIndex++] : p.url));
      setUploadingMsg('');

      const payload = {
        title: form.title.trim(),
        category: finalCategory,
        description: form.description.trim(),
        price: form.price,
        condition: form.condition,
        location: form.location.trim(),
        photos: finalPhotos,
        featured,
        urgent,
      };

      if (isEditMode) {
        await updateListing(editId, payload);
        router.push(`/marketplace/${editId}`);
      } else {
        const listing = await createListing(payload);
        router.push(`/marketplace/${listing.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadingMsg('');
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-1">{isEditMode ? 'Edit item' : 'Sell an item'}</h1>
      <p className="text-sm text-[#8A86A3] mb-6">
        {isEditMode ? 'Update your listing details.' : 'List something for other students to find.'}
      </p>

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
              {photos.map((p, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#EEEDFB]">
                  <img src={p.url} alt={`photo ${i + 1}`} className="w-full h-full object-cover" />
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
            <p className="text-xs text-[#B3AFC9] mt-2">Photos upload automatically when you post the item.</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title <span className="text-red-500">*</span></label>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Enter title" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Category <span className="text-red-500">*</span></label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value={OTHER_VALUE}>+ Add your own category</option>
            </select>
            {form.category === OTHER_VALUE && (
              <input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type your category"
                className="w-full mt-2 px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]"
              />
            )}
          </div>
          {stepError && <p className="text-sm text-red-500">{stepError}</p>}
          <button onClick={next} className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Description <span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe your item..." rows={3} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Price (Rs.) <span className="text-red-500">*</span></label>
            <input type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="Enter price" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Condition <span className="text-red-500">*</span></label>
            <select value={form.condition} onChange={(e) => update('condition', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]">
              <option value="">Select condition</option>
              {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Location <span className="text-red-500">*</span></label>
            <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Select your location" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          </div>
          {stepError && <p className="text-sm text-red-500">{stepError}</p>}
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
              <img src={photos[0].url} alt="preview" className="w-full h-40 object-cover rounded-xl mb-4" />
            )}
            <p className="font-semibold">{form.title || 'Untitled item'}</p>
            <p className="text-[#6C5CE7] font-semibold mt-1">{form.price ? `Rs. ${form.price}` : 'Rs. --'}</p>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div><p className="text-[#B3AFC9]">Category</p><p className="font-medium mt-0.5">{finalCategory || '--'}</p></div>
              <div><p className="text-[#B3AFC9]">Condition</p><p className="font-medium mt-0.5">{form.condition || '--'}</p></div>
              <div><p className="text-[#B3AFC9]">Location</p><p className="font-medium mt-0.5">{form.location || '--'}</p></div>
            </div>
          </div>

          {isPremium ? (
            <>
              <label className="flex items-center gap-3 rounded-2xl border border-[#EEEDFB] p-4 cursor-pointer hover:bg-[#F4F3FE]">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-[#6C5CE7]" />
                <div>
                  <p className="text-sm font-medium">Feature this listing</p>
                  <p className="text-xs text-[#8A86A3]">Featured items appear in the Home page Featured section.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-[#EEEDFB] p-4 cursor-pointer hover:bg-[#F4F3FE]">
                <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} className="w-4 h-4 accent-[#6C5CE7]" />
                <div>
                  <p className="text-sm font-medium">Mark as urgent sale</p>
                  <p className="text-xs text-[#8A86A3]">Shows an urgent badge so buyers notice it first.</p>
                </div>
              </label>
            </>
          ) : (
            <Link
              href="/premium"
              className="flex items-center gap-3 rounded-2xl border border-dashed border-[#CECBF6] p-4 hover:bg-[#F4F3FE]"
            >
              <span className="text-lg">🔒</span>
              <div>
                <p className="text-sm font-medium text-[#6C5CE7]">Feature or mark as urgent — Premium only</p>
                <p className="text-xs text-[#8A86A3]">Upgrade to Premium to boost this listing.</p>
              </div>
            </Link>
          )}

          {uploadingMsg && <p className="text-sm text-[#6C5CE7]">{uploadingMsg}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={back} className="px-6 py-2.5 rounded-xl border border-[#EEEDFB] text-sm font-medium">Back</button>
            <button onClick={handlePost} disabled={loading} className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium disabled:opacity-60">
              {loading ? (isEditMode ? 'Saving...' : 'Posting...') : (isEditMode ? 'Save changes' : 'Post item')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
