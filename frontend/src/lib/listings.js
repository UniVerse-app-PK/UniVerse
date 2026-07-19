import { api } from './api';

// Converts a backend Listing document into the shape the existing
// frontend components (ItemCard, detail page, etc.) already expect.
export function mapListing(l) {
  return {
    id: l._id,
    name: l.title,
    price: `Rs. ${l.price}`,
    rawPrice: l.price,
    category: l.category,
    condition: l.condition,
    location: l.location,
    seller: l.seller?.name || 'Unknown',
    sellerId: l.seller?._id,
    sellerPhone: l.seller?.phone || '',
    sellerIsPremium: !!l.seller?.isPremium,
    sellerVerified: !!l.seller?.verifiedSeller,
    sellerRating: l.sellerRating || { score: 0, count: 0 },
    sellerDescription: '',
    description: l.description,
    status: l.status,
    views: l.views,
    featured: !!l.featured,
    urgent: !!l.urgent,
    createdAt: l.createdAt,
    photos: l.photos || [],
    reviews: (l.reviews || []).map((r) => ({
      id: r._id,
      user: r.user?.name || 'Anonymous',
      score: r.score,
      comment: r.comment,
      date: new Date(r.createdAt).toLocaleDateString(),
    })),
  };
}

export async function fetchListings({ category, search } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (search) params.set('search', search);
  const query = params.toString() ? `?${params.toString()}` : '';
  const data = await api.get(`/listings${query}`);
  return data.listings.map(mapListing);
}

export async function fetchListingById(id) {
  const data = await api.get(`/listings/${id}`);
  return mapListing(data.listing);
}

export async function fetchMyListings() {
  const data = await api.get('/listings/mine', { auth: true });
  return data.listings.map(mapListing);
}

export async function fetchSavedListings() {
  const data = await api.get('/users/saved', { auth: true });
  return data.listings.map(mapListing);
}

export async function uploadListingPhotos(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));
  const data = await api.uploadFormData('/listings/upload', formData);
  return data.urls;
}

export async function createListing({ title, category, description, price, condition, location, photos, featured, urgent }) {
  const data = await api.post(
    '/listings',
    { title, category, description, price: Number(price), condition, location, photos: photos || [], featured: !!featured, urgent: !!urgent },
    { auth: true }
  );
  return mapListing(data.listing);
}

export async function updateListing(id, { title, category, description, price, condition, location, photos, featured, urgent, status }) {
  const body = {};
  if (title !== undefined) body.title = title;
  if (category !== undefined) body.category = category;
  if (description !== undefined) body.description = description;
  if (price !== undefined) body.price = Number(price);
  if (condition !== undefined) body.condition = condition;
  if (location !== undefined) body.location = location;
  if (photos !== undefined) body.photos = photos;
  if (featured !== undefined) body.featured = !!featured;
  if (urgent !== undefined) body.urgent = !!urgent;
  if (status !== undefined) body.status = status;

  const data = await api.put(`/listings/${id}`, body, { auth: true });
  return mapListing(data.listing);
}

export async function deleteListing(id) {
  return api.delete(`/listings/${id}`, { auth: true });
}

export async function toggleSavedListing(listingId) {
  return api.post(`/users/saved/${listingId}`, {}, { auth: true });
}

export async function addListingReview(listingId, { score, comment }) {
  const data = await api.post(`/listings/${listingId}/reviews`, { score, comment }, { auth: true });
  return data.reviews;
}
