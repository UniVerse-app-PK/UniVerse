import { api } from './api';

export function mapEvent(e) {
  return {
    id: e._id,
    title: e.title,
    meta: e.meta,
    description: e.description,
    photo: e.photo,
    url: e.url,
    applicationUrl: e.applicationUrl,
    whatsapp: e.whatsapp,
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

export async function fetchEventById(id) {
  const data = await api.get(`/events/${id}`);
  return mapEvent(data.event);
}

export async function createEvent({ title, meta, description, photo, url, applicationUrl, whatsapp, org, category }) {
  const data = await api.post('/events', { title, meta, description, photo, url, applicationUrl, whatsapp, org, category }, { auth: true });
  return mapEvent(data.event);
}

export async function updateEvent(id, { title, meta, description, photo, url, applicationUrl, whatsapp, org, category }) {
  const body = {};
  if (title !== undefined) body.title = title;
  if (meta !== undefined) body.meta = meta;
  if (description !== undefined) body.description = description;
  if (photo !== undefined) body.photo = photo;
  if (url !== undefined) body.url = url;
  if (applicationUrl !== undefined) body.applicationUrl = applicationUrl;
  if (whatsapp !== undefined) body.whatsapp = whatsapp;
  if (org !== undefined) body.org = org;
  if (category !== undefined) body.category = category;

  const data = await api.put(`/events/${id}`, body, { auth: true });
  return mapEvent(data.event);
}

export async function deleteEvent(id) {
  return api.delete(`/events/${id}`, { auth: true });
}
