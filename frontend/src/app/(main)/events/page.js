'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/EventCard';
import { getToken, getUser } from '@/lib/auth';
import { fetchEvents, createEvent, deleteEvent } from '@/lib/events';

const tabs = ['All', 'Internships', 'Research', 'Courses', 'Societies'];
const formCategories = ['Internships', 'Research', 'Courses', 'Societies', 'Other'];

export default function EventsPage() {
  const router = useRouter();
  const [active, setActive] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', meta: '', org: '', category: 'Other' });
  const [posting, setPosting] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    setMe(getUser());
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchEvents(active)
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [active]);

  function handleAddEventClick() {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    setShowForm((v) => !v);
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.org.trim()) {
      setError('Title and organization are required.');
      return;
    }
    setPosting(true);
    setError('');
    try {
      await createEvent(form);
      setForm({ title: '', meta: '', org: '', category: 'Other' });
      setShowForm(false);
      const data = await fetchEvents(active);
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">Events</h1>
        <button onClick={handleAddEventClick} className="px-4 py-2 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">
          {showForm ? 'Cancel' : '+ Add event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddEvent} className="mb-6 p-5 rounded-2xl border border-[#EEEDFB] space-y-3 max-w-lg">
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Event title" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          <input value={form.org} onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))} placeholder="Organization / society" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          <input value={form.meta} onChange={(e) => setForm((f) => ({ ...f, meta: e.target.value }))} placeholder="Date / deadline info" className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]">
            {formCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" disabled={posting} className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium disabled:opacity-60">
            {posting ? 'Posting...' : 'Post event'}
          </button>
        </form>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              active === t ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB] hover:bg-[#F4F3FE]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-sm text-[#8A86A3]">Loading events...</p>}

      {!loading && (
        <div className="space-y-3 max-w-2xl">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} onDelete={ev.createdBy === me?.id ? () => handleDelete(ev.id) : null} />
          ))}
          {events.length === 0 && <p className="text-sm text-[#8A86A3]">No events in this category yet.</p>}
        </div>
      )}
    </div>
  );
}
