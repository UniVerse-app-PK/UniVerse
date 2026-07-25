'use client';

import Link from 'next/link';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchListingById, toggleSavedListing, addListingReview, deleteListing } from '@/lib/listings';
import { getToken, getUser } from '@/lib/auth';
import ReportModal from '@/components/ReportModal';

export default function ItemDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [activePhoto, setActivePhoto] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callingState, setCallingState] = useState('idle'); // idle | calling | connected
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Review form states
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchListingById(resolvedParams.id)
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resolvedParams.id]);

  useEffect(() => {
    if (item) {
      const user = getUser();
      if (user && user.savedListings) {
        const savedIds = user.savedListings.map(id => typeof id === 'object' ? (id._id || id.id) : id);
        setIsSaved(savedIds.includes(item.id));
      }
    }
  }, [item]);

  const toggleSave = async () => {
    if (!getToken()) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await toggleSavedListing(item.id);
      setIsSaved(res.saved);

      const user = getUser();
      if (user) {
        if (!user.savedListings) user.savedListings = [];
        const savedIds = user.savedListings.map(id => typeof id === 'object' ? (id._id || id.id) : id);
        if (res.saved) {
          if (!savedIds.includes(item.id)) {
            user.savedListings.push(item.id);
          }
        } else {
          user.savedListings = user.savedListings.filter(id => {
            const idStr = typeof id === 'object' ? (id._id || id.id) : id;
            return idStr !== item.id;
          });
        }
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!getToken()) {
      window.location.href = '/login';
      return;
    }
    setFormError('');
    try {
      const reviews = await addListingReview(item.id, { score: formRating, comment: formComment });
      setItem((prev) => ({
        ...prev,
        reviews: reviews.map((r) => ({
          id: r._id,
          user: getUser()?.name || 'You',
          score: r.score,
          comment: r.comment,
          date: 'Just now',
        })),
      }));
      setFormRating(5);
      setFormComment('');
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteListing(item.id);
      router.push('/marketplace/listings');
    } catch (err) {
      setFormError(err.message);
      setDeleting(false);
    }
  };

  const handleCall = () => {
    setShowCallModal(true);
    setCallingState('calling');
    setTimeout(() => setCallingState('connected'), 1500);
  };

  const endCall = () => {
    setCallingState('idle');
    setShowCallModal(false);
  };

  if (loading) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading item...</div>;
  }

  if (error || !item) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-500">{error || 'Item not found.'}</p>
        <Link href="/marketplace" className="text-sm text-[#6C5CE7] font-medium">Back to market</Link>
      </div>
    );
  }

  const hasPhotos = item.photos && item.photos.length > 0;
  const sellerRating = item.sellerRating || { score: 0, count: 0 };
  const reviews = item.reviews || [];
  const currentUser = getUser();
  const currentUserId = currentUser?.id || currentUser?._id;
  const isOwner = !!(item.sellerId && currentUserId && String(item.sellerId) === String(currentUserId));

  return (
    <div className="p-6 max-w-6xl mx-auto pb-16">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-[#8A86A3] font-medium mb-6 hover:text-[#6C5CE7] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to market
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl bg-[#F4F3FE] overflow-hidden border border-[#EEEDFB] shadow-sm">
            {hasPhotos ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.photos[activePhoto]}
                alt={`${item.name} image ${activePhoto + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#CECBF6] font-semibold text-lg">
                No Photo Available
              </div>
            )}

            {hasPhotos && item.photos.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhoto((prev) => (prev === 0 ? item.photos.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#6C5CE7] hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => setActivePhoto((prev) => (prev === item.photos.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#6C5CE7] hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </>
            )}
          </div>

          {hasPhotos && item.photos.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {item.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setActivePhoto(index)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activePhoto === index ? 'border-[#6C5CE7] scale-102 shadow-sm' : 'border-[#EEEDFB] opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-xs font-semibold text-[#6C5CE7] uppercase tracking-wider">{item.category}</span>
              {item.urgent && (
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white uppercase tracking-wider">Urgent</span>
              )}
              <h1 className="text-3xl font-bold text-[#1E1B2E] mt-1">{item.name}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={toggleSave}
                className="w-12 h-12 rounded-2xl border border-[#EEEDFB] bg-white flex items-center justify-center text-[#6C5CE7] hover:bg-[#F4F3FE] active:scale-95 transition-all shadow-sm"
                title={isSaved ? 'Remove from saved' : 'Save item'}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill={isSaved ? '#6C5CE7' : 'none'}
                  stroke="#6C5CE7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-12 h-12 rounded-2xl border border-[#EEEDFB] bg-white flex items-center justify-center text-[#8A86A3] hover:bg-[#F4F3FE] active:scale-95 transition-all shadow-sm"
                  title="Listing options"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EEEDFB] rounded-xl shadow-lg py-1.5 z-50">
                    <button
                      onClick={() => { setReportModalOpen(true); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-orange-500 hover:bg-orange-50"
                    >
                      Report Listing
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#F4F3FE] p-4 rounded-2xl">
            <span className="text-3xl font-extrabold text-[#6C5CE7]">{item.price}</span>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#E1F5EE] text-[#0F6E56]">
              {item.condition}
            </span>
          </div>

          <div className="border-t border-[#EEEDFB] pt-5">
            <h3 className="text-sm font-semibold text-[#1E1B2E] mb-2">Description</h3>
            <p className="text-sm text-[#8A86A3] leading-relaxed">{item.description}</p>
          </div>

          <div className="border-t border-[#EEEDFB] pt-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#1E1B2E]">Seller Information</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] font-semibold text-lg shrink-0">
                {item.seller.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-[#1E1B2E] flex items-center gap-1.5">
                  {item.seller}
                  {item.sellerVerified && (
                    <span title="Verified seller" className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#6C5CE7] text-white text-[10px]">✓</span>
                  )}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#8A86A3]">
                  <span className="font-medium text-[#6C5CE7] flex items-center gap-0.5">
                    ★ {sellerRating.score.toFixed(1)}
                  </span>
                  <span>({sellerRating.count} {sellerRating.count === 1 ? 'rating' : 'ratings'})</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                    </svg>
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-[#EEEDFB]">
            {isOwner ? (
              <>
                <Link
                  href={`/marketplace/${item.id}/edit`}
                  className="flex-1 py-3 px-6 rounded-2xl border-2 border-[#6C5CE7] text-[#6C5CE7] font-semibold text-center hover:bg-[#F4F3FE] active:scale-[0.98] transition-all text-sm"
                >
                  Edit listing
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 px-6 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-[0.98] transition-all text-sm shadow-md shadow-red-500/20 disabled:opacity-60"
                >
                  {deleting ? 'Deleting...' : 'Delete listing'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={item.sellerId ? `/chats?with=${item.sellerId}&listing=${item.id}` : '/chats'}
                  className="flex-1 py-3 px-6 rounded-2xl border-2 border-[#6C5CE7] text-[#6C5CE7] font-semibold text-center hover:bg-[#F4F3FE] active:scale-[0.98] transition-all text-sm"
                >
                  Chat with Seller
                </Link>
                <button
                  onClick={handleCall}
                  className="flex-1 py-3 px-6 rounded-2xl bg-[#6C5CE7] text-white font-semibold hover:bg-[#5b4cc4] active:scale-[0.98] transition-all text-sm shadow-md shadow-[#6C5CE7]/20"
                >
                  Call Seller
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-[#EEEDFB] mt-12 pt-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1E1B2E]">Previous Reviews on Seller Listings</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F4F3FE] text-[#6C5CE7]">
              ★ {sellerRating.score.toFixed(1)} / 5.0
            </span>
          </div>

          {reviews.length === 0 ? (
            <p className="text-sm text-[#8A86A3] italic py-4">No reviews yet for this seller. Be the first to leave one!</p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-2xl border border-[#EEEDFB] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#1E1B2E]">{review.user}</span>
                      <span className="text-[#CECBF6] text-xs">•</span>
                      <span className="text-xs text-[#8A86A3]">{review.date}</span>
                    </div>
                    <span className="text-xs font-medium text-[#6C5CE7] flex items-center gap-0.5">
                      ★ {review.score}
                    </span>
                  </div>
                  <p className="text-sm text-[#8A86A3]">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-[#F8F7FD] p-6 rounded-3xl border border-[#EEEDFB]">
          <h3 className="text-md font-bold text-[#1E1B2E] mb-1">Rate the Seller</h3>
          <p className="text-xs text-[#8A86A3] mb-4">Share your transaction experience with other campus users.</p>

          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8A86A3] uppercase tracking-wider mb-1.5">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    className="text-2xl transition-transform hover:scale-110"
                  >
                    <span className={star <= formRating ? 'text-[#6C5CE7]' : 'text-[#CECBF6]'}>★</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8A86A3] uppercase tracking-wider mb-1.5">Review Comment</label>
              <textarea
                rows="3"
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EEEDFB] bg-white text-sm focus:outline-none focus:border-[#6C5CE7] resize-none"
                placeholder="Describe your experience..."
              />
            </div>

            {formError && <p className="text-xs text-red-500 font-semibold">{formError}</p>}
            {formSuccess && <p className="text-xs text-green-600 font-semibold">Thank you! Your review has been added.</p>}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#6C5CE7] text-white font-semibold hover:bg-[#5b4cc4] active:scale-[0.98] transition-all text-sm"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>

      {showCallModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1B2E] text-white w-full max-w-sm rounded-3xl p-8 text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <div className="w-20 h-20 bg-[#6C5CE7] rounded-full mx-auto flex items-center justify-center font-bold text-2xl animate-pulse">
                {item.seller.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold">{item.seller}</h2>
              <p className="text-sm text-[#8A86A3]">{item.sellerPhone}</p>
            </div>

            <div className="py-4">
              {callingState === 'calling' && (
                <div className="space-y-2">
                  <p className="text-sm text-[#8A86A3] animate-bounce">Calling...</p>
                </div>
              )}
              {callingState === 'connected' && (
                <div className="space-y-2">
                  <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-ping mr-2" />
                  <p className="text-sm text-green-400 font-semibold inline">Connected</p>
                </div>
              )}
            </div>

            <button
              onClick={endCall}
              className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mx-auto hover:bg-red-600 active:scale-95 transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                <line x1="23" y1="1" x2="1" y2="23" stroke="white" strokeWidth="2.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {reportModalOpen && (
        <ReportModal
          targetType="listing"
          targetId={item.id}
          targetName={item.name}
          onClose={() => setReportModalOpen(false)}
        />
      )}
    </div>
  );
}
