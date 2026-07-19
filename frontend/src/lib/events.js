import { api } from './api';

export function mapEvent(e) {
  return {
    id: e._id,
    title: e.title,
    meta: e.meta,
    org: e.org,
    category: e.category,
    createdBy: e.createdBy,
  };
}

export async function fetchEvents(category) {
  const params = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  const data = await api.get(`/events${params}`);
  return data.events.map(mapEvent);
}

export async function createEvent({ title, meta, org, category }) {
  const data = await api.post('/events', { title, meta, org, category }, { auth: true });
  return mapEvent(data.event);
}

export async function deleteEvent(id) {
  return api.delete(`/events/${id}`, { auth: true });
}
